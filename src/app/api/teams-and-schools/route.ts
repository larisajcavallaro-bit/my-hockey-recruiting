import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const AGE_BRACKETS = ["U6", "U8", "U10", "U12", "U14", "U16", "U18", "U20"] as const;

export type SchoolGridItem = {
  slug: string;
  name: string;
  type: "team" | "school";
  rinkName?: string | null;
  location: string;
  lat: number | null;
  lng: number | null;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  hasBoys: boolean;
  hasGirls: boolean;
  ageBrackets: string[];
  leagues: string[];
};

/** GET - list all approved schools for grid display. ?type=team|school filters by type. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const typeFilter = searchParams.get("type") as "team" | "school" | null;

    const [approved, reviewAgg] = await Promise.all([
      prisma.schoolSubmission.findMany({
        where: {
          status: "approved",
          slug: { not: null },
        },
        orderBy: { name: "asc" },
      }),
      prisma.schoolReview.groupBy({
        by: ["schoolSlug"],
        _avg: { rating: true },
        _count: { id: true },
      }),
    ]);

    const reviewMap = new Map(
      reviewAgg.map((r) => [
        r.schoolSlug,
        {
          rating: r._avg.rating ?? 0,
          count: r._count.id,
        },
      ])
    );

    const defaultImage = "/newasset/facilities/card/arctic-arena-1.png";
    let mapped = approved.map((s) => {
      const rev = reviewMap.get(s.slug!);
      const base = s.imageUrl ?? defaultImage;
      const imageUrl =
        base.startsWith("/") && s.updatedAt
          ? `${base}?v=${new Date(s.updatedAt).getTime()}`
          : base;
      const type = (s.type === "school" ? "school" : "team") as "team" | "school"; // fallback "team" for rows without type
      const hasBoys =
        (s.boysWebsite != null && s.boysWebsite.trim() !== "") ||
        (s.boysLeague?.length ?? 0) > 0 ||
        (s.gender?.includes("Male") ?? false) ||
        (s.gender?.includes("Co-ed") ?? false);
      const hasGirls =
        (s.girlsWebsite != null && s.girlsWebsite.trim() !== "") ||
        (s.girlsLeague?.length ?? 0) > 0 ||
        (s.gender?.includes("Female") ?? false) ||
        (s.gender?.includes("Co-ed") ?? false);
      const ageBrackets: string[] = [];
      const from = s.ageBracketFrom?.trim();
      const to = s.ageBracketTo?.trim();
      if (from && to) {
        const fromIdx = AGE_BRACKETS.indexOf(from as (typeof AGE_BRACKETS)[number]);
        const toIdx = AGE_BRACKETS.indexOf(to as (typeof AGE_BRACKETS)[number]);
        if (fromIdx >= 0 && toIdx >= 0 && fromIdx <= toIdx) {
          for (let i = fromIdx; i <= toIdx; i++) {
            ageBrackets.push(AGE_BRACKETS[i]);
          }
        }
      }
      const leagues = [
        ...(s.league ?? []),
        ...(s.boysLeague ?? []),
        ...(s.girlsLeague ?? []),
      ]
        .filter((l) => l?.trim())
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort();
      return {
        slug: s.slug!,
        name: s.name,
        rinkName: s.rinkName?.trim() || null,
        type,
        location: `${s.address}, ${s.city} ${s.zipCode}`,
        lat: s.lat ?? null,
        lng: s.lng ?? null,
        rating: rev?.rating ?? 0,
        reviewCount: rev?.count ?? 0,
        imageUrl,
        hasBoys,
        hasGirls,
        ageBrackets,
        leagues,
      };
    });

    const schools: SchoolGridItem[] =
      typeFilter === "team" || typeFilter === "school"
        ? mapped.filter((s) => s.type === typeFilter)
        : mapped;

    return NextResponse.json(
      { schools },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("Teams and schools fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch" },
      { status: 500 }
    );
  }
}

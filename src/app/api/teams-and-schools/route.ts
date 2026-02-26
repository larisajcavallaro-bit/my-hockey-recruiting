import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export type SchoolGridItem = {
  slug: string;
  name: string;
  location: string;
  lat: number | null;
  lng: number | null;
  rating: number;
  reviewCount: number;
  imageUrl: string;
};

/** GET - list all approved schools for grid display */
export async function GET() {
  try {
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
    const schools: SchoolGridItem[] = approved.map((s) => {
      const rev = reviewMap.get(s.slug!);
      const base = s.imageUrl ?? defaultImage;
      const imageUrl =
        base.startsWith("/") && s.updatedAt
          ? `${base}?v=${new Date(s.updatedAt).getTime()}`
          : base;
      return {
        slug: s.slug!,
        name: s.name,
        location: `${s.address}, ${s.city} ${s.zipCode}`,
        lat: s.lat ?? null,
        lng: s.lng ?? null,
        rating: rev?.rating ?? 0,
        reviewCount: rev?.count ?? 0,
        imageUrl,
      };
    });

    return NextResponse.json({ schools });
  } catch (error) {
    console.error("Teams and schools fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch" },
      { status: 500 }
    );
  }
}

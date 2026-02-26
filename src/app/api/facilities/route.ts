import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export type FacilityGridItem = {
  slug: string;
  name: string;
  location: string;
  lat: number | null;
  lng: number | null;
  rating: number;
  reviewCount: number;
  amenities: string[];
  imageUrl: string;
  type?: "in-person" | "app" | "at-home-trainer" | "tournament-teams";
};

/** GET - list all live facilities (approved only, excludes removed) for grid display */
export async function GET() {
  try {
    const [approved, reviewAgg] = await Promise.all([
      prisma.facilitySubmission.findMany({
        where: {
          status: "approved",
          slug: { not: null },
        },
        orderBy: { facilityName: "asc" },
      }),
      prisma.facilityReview.groupBy({
        by: ["facilitySlug"],
        _avg: { rating: true },
        _count: { id: true },
      }),
    ]);

    const reviewMap = new Map(
      reviewAgg.map((r) => [
        r.facilitySlug,
        {
          rating: r._avg.rating ?? 0,
          count: r._count.id,
        },
      ])
    );

    const validTypes = ["in-person", "app", "at-home-trainer", "tournament-teams"] as const;
    const facilities: FacilityGridItem[] = approved.map((s) => {
      const rev = reviewMap.get(s.slug!);
      const rawType = s.facilityType as string | null;
      const type: FacilityGridItem["type"] =
        rawType && validTypes.includes(rawType as (typeof validTypes)[number])
          ? (rawType as FacilityGridItem["type"])
          : "in-person";
      const base = s.imageUrl ?? "/newasset/facilities/card/arctic-arena-1.png";
      const imageUrl =
        base.startsWith("/") && s.createdAt
          ? `${base}?v=${new Date(s.createdAt).getTime()}`
          : base;
      return {
        slug: s.slug!,
        name: s.facilityName,
        location: `${s.address}, ${s.city} ${s.zipCode}`,
        lat: s.lat ?? null,
        lng: s.lng ?? null,
        rating: rev?.rating ?? 0,
        reviewCount: rev?.count ?? 0,
        amenities: s.amenities,
        imageUrl,
        type,
      };
    });

    return NextResponse.json({ facilities });
  } catch (error) {
    console.error("Facilities fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch facilities" },
      { status: 500 }
    );
  }
}

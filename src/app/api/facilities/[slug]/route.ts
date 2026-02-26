import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export type FacilityDetail = {
  slug: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
  description: string;
  amenities: string[];
  website: string | null;
};

/** GET - fetch a single facility by slug (approved only, excludes removed) */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const sub = await prisma.facilitySubmission.findFirst({
      where: { slug, status: "approved" },
    });

    if (!sub) {
      return NextResponse.json({ facility: null }, { status: 404 });
    }

    const facility: FacilityDetail = {
      slug: sub.slug!,
      name: sub.facilityName,
      address: `${sub.address}, ${sub.city} ${sub.zipCode}`,
      phone: sub.phone ?? "Contact for info",
      hours: sub.hours ?? "Contact for hours",
      image: (() => {
        const b = sub.imageUrl ?? "/newasset/facilities/card/arctic-arena-1.png";
        return b.startsWith("/") && sub.createdAt ? `${b}?v=${new Date(sub.createdAt).getTime()}` : b;
      })(),
      description: sub.description,
      amenities: sub.amenities,
      website: sub.website,
    };

    return NextResponse.json({ facility });
  } catch (error) {
    console.error("Facility fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch facility" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export type SchoolDetail = {
  slug: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
  description: string;
  website: string | null;
};

/** GET - fetch a single school by slug */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const sub = await prisma.schoolSubmission.findFirst({
      where: { slug, status: "approved" },
    });

    if (!sub) {
      return NextResponse.json({ school: null }, { status: 404 });
    }

    const defaultImage = "/newasset/facilities/card/arctic-arena-1.png";
    const base = sub.imageUrl ?? defaultImage;
    const image =
      base.startsWith("/") && sub.updatedAt
        ? `${base}?v=${new Date(sub.updatedAt).getTime()}`
        : base;

    const school: SchoolDetail = {
      slug: sub.slug!,
      name: sub.name,
      address: `${sub.address}, ${sub.city} ${sub.zipCode}`,
      phone: sub.phone ?? "Contact for info",
      hours: "Contact for hours",
      image,
      description: sub.description,
      website: sub.website,
    };

    return NextResponse.json({ school });
  } catch (error) {
    console.error("School fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export type SchoolDetail = {
  slug: string;
  name: string;
  rinkName?: string | null;
  address: string;
  phone: string;
  hours: string;
  image: string;
  description: string;
  website: string | null;
  boysWebsite: string | null;
  girlsWebsite: string | null;
  boysLeague: string[];
  girlsLeague: string[];
  noGirlsProgram?: boolean;
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

    const cleanLeague = (arr: string[] | null | undefined) =>
      (arr ?? []).filter((s) => typeof s === "string" && s.trim().length > 0);

    const school: SchoolDetail = {
      slug: sub.slug!,
      name: sub.name,
      rinkName: sub.rinkName?.trim() || null,
      address: `${sub.address}, ${sub.city} ${sub.zipCode}`,
      phone: sub.phone ?? "Contact for info",
      hours: "Contact for hours",
      image,
      description: sub.description,
      website: sub.website,
      boysWebsite: sub.boysWebsite?.trim() || null,
      girlsWebsite: sub.girlsWebsite?.trim() || null,
      boysLeague: cleanLeague(sub.boysLeague),
      girlsLeague: cleanLeague(sub.girlsLeague),
      noGirlsProgram: sub.noGirlsProgram ?? false,
    };

    return NextResponse.json(
      { school },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("School fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch" },
      { status: 500 }
    );
  }
}

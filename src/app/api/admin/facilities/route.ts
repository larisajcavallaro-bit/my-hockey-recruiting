import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { FACILITY_CATEGORIES } from "@/constants/facilities";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  facilityName: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  zipCode: z.string().min(5),
  phone: z.string().optional(),
  website: z.string().url().or(z.literal("")),
  description: z.string().min(10),
  amenities: z.array(z.string()).min(1),
  hours: z.string().optional(),
  facilityType: z.enum(["in-person", "app", "at-home-trainer", "tournament-teams"]).optional(),
  imageUrl: z.string().optional(), // base64 data URL from client upload
  lat: z.number().optional(),
  lng: z.number().optional(),
});

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** POST - create facility directly as approved (admin only) */
export async function POST(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    const userId = session?.user?.id;
    if (role !== "ADMIN" || !userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = createSchema.parse(body);

    const invalid = data.amenities.filter(
      (a) => !FACILITY_CATEGORIES.includes(a as (typeof FACILITY_CATEGORIES)[number])
    );
    if (invalid.length > 0) {
      return NextResponse.json(
        { error: `Invalid amenities: ${invalid.join(", ")}` },
        { status: 400 }
      );
    }

    let base = toSlug(data.facilityName);
    if (!base) base = "facility";
    let slug = base;
    let n = 1;
    while (true) {
      const existing = await prisma.facilitySubmission.findFirst({
        where: { slug, status: "approved" },
      });
      if (!existing) break;
      slug = `${base}-${n}`;
      n++;
    }

    const sub = await prisma.facilitySubmission.create({
      data: {
        facilityName: data.facilityName.trim(),
        address: data.address.trim(),
        city: data.city.trim(),
        zipCode: data.zipCode.trim(),
        phone: data.phone?.trim() || null,
        website: data.website?.trim() || null,
        description: data.description.trim(),
        amenities: data.amenities,
        hours: data.hours ?? null,
        facilityType: data.facilityType ?? null,
        imageUrl: data.imageUrl?.trim() || null,
        lat: data.lat ?? null,
        lng: data.lng ?? null,
        status: "approved",
        slug,
        reviewedAt: new Date(),
        reviewedBy: userId,
      },
    });

    return NextResponse.json({ success: true, id: sub.id, slug: sub.slug }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    console.error("Admin create facility error:", error);
    return NextResponse.json(
      { error: "Failed to create facility" },
      { status: 500 }
    );
  }
}

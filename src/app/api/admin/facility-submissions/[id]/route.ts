import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  status: z.enum(["approved", "rejected", "removed"]),
});

const editSchema = z.object({
  facilityName: z.string().min(2).optional(),
  address: z.string().min(5).optional(),
  city: z.string().min(2).optional(),
  zipCode: z.string().min(5).optional(),
  phone: z.string().nullable().optional(),
  website: z.union([z.string().url(), z.literal("")]).optional(),
  description: z.string().min(10).optional(),
  hours: z.string().nullable().optional(),
  facilityType: z.enum(["in-person", "app", "at-home-trainer", "tournament-teams"]).nullable().optional(),
  amenities: z.array(z.string()).optional(),
  imageUrl: z.string().nullable().optional(), // base64 data URL or null to clear
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

/** PATCH - approve or reject facility submission (admin only) */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    const userId = session?.user?.id;
    if (role !== "ADMIN" || !userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = updateSchema.parse(body);

    let slug: string | null = null;
    if (data.status === "approved") {
      const sub = await prisma.facilitySubmission.findUnique({
        where: { id },
        select: { facilityName: true },
      });
      if (sub) {
        let base = toSlug(sub.facilityName);
        if (!base) base = "facility";
        slug = base;
        let n = 1;
        while (true) {
          const existing = await prisma.facilitySubmission.findFirst({
            where: { slug, status: "approved" },
          });
          if (!existing) break;
          slug = `${base}-${n}`;
          n++;
        }
      }
    }

    await prisma.facilitySubmission.update({
      where: { id },
      data: {
        status: data.status,
        slug: data.status === "approved" ? slug : data.status === "removed" ? null : undefined,
        reviewedAt: new Date(),
        reviewedBy: userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid status", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Admin facility submission update error:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}

/** PUT - edit facility data (admin only) */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const raw = editSchema.parse(body);
    const data: Record<string, unknown> = {};

    if (raw.facilityName != null) data.facilityName = raw.facilityName;
    if (raw.address != null) data.address = raw.address;
    if (raw.city != null) data.city = raw.city;
    if (raw.zipCode != null) data.zipCode = raw.zipCode;
    if (raw.phone !== undefined) data.phone = raw.phone === "" ? null : raw.phone;
    if (raw.website !== undefined) data.website = raw.website === "" ? null : raw.website;
    if (raw.description != null) data.description = raw.description;
    if (raw.hours !== undefined) data.hours = raw.hours === "" ? null : raw.hours;
    if (raw.facilityType !== undefined) data.facilityType = raw.facilityType;
    if (raw.amenities != null) data.amenities = raw.amenities;
    if (raw.imageUrl !== undefined) data.imageUrl = raw.imageUrl === "" ? null : raw.imageUrl;

    await prisma.facilitySubmission.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Admin facility edit error:", error);
    return NextResponse.json(
      { error: "Failed to update facility" },
      { status: 500 }
    );
  }
}

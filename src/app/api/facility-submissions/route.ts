import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { FACILITY_CATEGORIES } from "@/constants/facilities";
import { notifyZapier } from "@/lib/zapier";

export const dynamic = "force-dynamic";

const submitSchema = z.object({
  facilityName: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  zipCode: z.string().min(5),
  phone: z.string().optional(),
  website: z.string().url().or(z.literal("")),
  description: z.string().min(10),
  amenities: z.array(z.string()).min(1),
});

/** POST - submit new facility request (anyone) */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = submitSchema.parse(body);

    // Validate amenities are from allowed list
    const invalid = data.amenities.filter((a) => !FACILITY_CATEGORIES.includes(a as (typeof FACILITY_CATEGORIES)[number]));
    if (invalid.length > 0) {
      return NextResponse.json(
        { error: `Invalid amenities: ${invalid.join(", ")}` },
        { status: 400 }
      );
    }

    const session = await auth();
    const submittedBy = session?.user?.id ?? null;

    const submission = await prisma.facilitySubmission.create({
      data: {
        facilityName: data.facilityName.trim(),
        address: data.address.trim(),
        city: data.city.trim(),
        zipCode: data.zipCode.trim(),
        phone: data.phone?.trim() || null,
        website: data.website?.trim() || null,
        description: data.description.trim(),
        amenities: data.amenities,
        submittedBy,
      },
    });

    notifyZapier("facility_submission", {
      id: submission.id,
      facilityName: submission.facilityName,
      address: submission.address,
      city: submission.city,
      status: submission.status,
      createdAt: submission.createdAt.toISOString(),
    });

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    console.error("Facility submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit facility request" },
      { status: 500 }
    );
  }
}

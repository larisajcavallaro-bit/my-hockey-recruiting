import { NextResponse } from "next/server";
import { verifyZapierAuth } from "@/lib/zapier";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/zapier/facility-submissions
 * Zapier-compatible: use Authorization: Bearer <ADMIN_API_KEY>
 * Returns facility submissions (default: pending) for Zapier workflows.
 */
export async function GET(request: Request) {
  if (!verifyZapierAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? "pending";
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);

    const submissions = await prisma.facilitySubmission.findMany({
      where:
        status === "all"
          ? {}
          : ["pending", "approved", "rejected"].includes(status)
            ? { status }
            : { status: "pending" },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      submissions: submissions.map((s) => ({
        id: s.id,
        facilityName: s.facilityName,
        address: s.address,
        city: s.city,
        zipCode: s.zipCode,
        phone: s.phone,
        website: s.website,
        description: s.description,
        amenities: s.amenities,
        status: s.status,
        createdAt: s.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Zapier facility-submissions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch facility submissions" },
      { status: 500 }
    );
  }
}

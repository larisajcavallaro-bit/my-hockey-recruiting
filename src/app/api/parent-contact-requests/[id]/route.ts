import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const patchSchema = z.object({ status: z.enum(["approved", "rejected"]) });

// PATCH /api/parent-contact-requests/[id] - approve or reject (target parent only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const targetParentId = (session.user as { parentProfileId?: string | null })?.parentProfileId;
    if (!targetParentId) {
      return NextResponse.json({ error: "Parent profile required" }, { status: 400 });
    }

    const { id } = await params;
    const req = await prisma.parentContactRequest.findUnique({
      where: { id },
    });

    if (!req || req.targetParentId !== targetParentId) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.parentContactRequest.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    return NextResponse.json({ request: updated });
  } catch (err) {
    console.error("[parent-contact-requests] PATCH", err);
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 });
  }
}

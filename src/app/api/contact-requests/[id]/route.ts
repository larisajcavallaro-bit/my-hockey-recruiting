import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const patchSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});

// PATCH /api/contact-requests/[id] - approve or reject (recipient only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const parentProfileId = (session.user as { parentProfileId?: string | null })?.parentProfileId;
    const coachProfileId = (session.user as { coachProfileId?: string | null })?.coachProfileId;

    const raw = await request.json();
    const parsed = patchSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const req = await prisma.contactRequest.findUnique({
      where: { id },
    });
    if (!req) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const isRecipient =
      (req.requestedBy === "coach" && req.parentProfileId === parentProfileId) ||
      (req.requestedBy === "parent" && req.coachProfileId === coachProfileId);

    if (!isRecipient) {
      return NextResponse.json({ error: "Only the recipient can approve or reject" }, { status: 403 });
    }

    if (req.status !== "pending") {
      return NextResponse.json({ error: "Request already processed" }, { status: 400 });
    }

    const updated = await prisma.contactRequest.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    return NextResponse.json({ request: { id: updated.id, status: updated.status } });
  } catch (err) {
    console.error("[contact-requests] PATCH", err);
    return NextResponse.json(
      { error: "Failed to update contact request" },
      { status: 500 }
    );
  }
}

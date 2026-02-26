import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const actionSchema = z.enum(["approve", "decline"]);

/** POST: Coach approves or declines a pending player verification */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ coachId: string; playerId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coachProfileId = (session.user as { coachProfileId?: string | null })
      .coachProfileId;
    if (!coachProfileId) {
      return NextResponse.json(
        { error: "Only coaches can verify players" },
        { status: 403 }
      );
    }

    const { coachId, playerId } = await params;
    if (coachId !== coachProfileId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const parsed = actionSchema.safeParse(body?.action ?? body);
    const action = parsed.success ? parsed.data : "approve";

    const verification = await prisma.coachPlayerVerification.findUnique({
      where: {
        coachId_playerId: { coachId, playerId },
      },
    });
    if (!verification) {
      return NextResponse.json(
        { error: "Verification request not found" },
        { status: 404 }
      );
    }
    if (verification.status !== "PENDING") {
      return NextResponse.json(
        { error: `Already ${verification.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    const newStatus = action === "approve" ? "APPROVED" : "REJECTED";
    const playerStatus = action === "approve" ? "Verified" : "Rejected";

    await prisma.$transaction([
      prisma.coachPlayerVerification.update({
        where: { id: verification.id },
        data: { status: newStatus },
      }),
      prisma.player.update({
        where: { id: playerId },
        data: { status: playerStatus },
      }),
    ]);

    return NextResponse.json({ success: true, status: newStatus });
  } catch (error) {
    console.error("Verification action error:", error);
    return NextResponse.json(
      { error: "Failed to update verification" },
      { status: 500 }
    );
  }
}

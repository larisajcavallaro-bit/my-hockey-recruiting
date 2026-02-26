import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

/** DELETE: Coach removes a verified player from their roster (head coach only) */
export async function DELETE(
  _request: Request,
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
        { error: "Only coaches can remove players" },
        { status: 403 }
      );
    }

    const { coachId, playerId } = await params;
    if (coachId !== coachProfileId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const coach = await prisma.coachProfile.findUnique({
      where: { id: coachId },
      select: { coachRole: true },
    });
    if (!coach || coach.coachRole !== "HEAD_COACH") {
      return NextResponse.json(
        { error: "Only head coaches can remove players from the roster" },
        { status: 403 }
      );
    }

    const verification = await prisma.coachPlayerVerification.findUnique({
      where: {
        coachId_playerId: { coachId, playerId },
      },
    });
    if (!verification) {
      return NextResponse.json(
        { error: "Player is not on your roster" },
        { status: 404 }
      );
    }
    if (verification.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Can only remove verified players" },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.coachPlayerVerification.delete({
        where: { id: verification.id },
      }),
      prisma.player.update({
        where: { id: playerId },
        data: { status: "Pending" },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove player error:", error);
    return NextResponse.json(
      { error: "Failed to remove player" },
      { status: 500 }
    );
  }
}

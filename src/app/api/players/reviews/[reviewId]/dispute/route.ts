import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { notifyZapier } from "@/lib/zapier";

/** POST /api/players/reviews/[reviewId]/dispute — parent disputes a coach review, hides it, creates admin notice */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parentProfileId = (session.user as { parentProfileId?: string | null })
      ?.parentProfileId;
    if (!parentProfileId) {
      return NextResponse.json(
        { error: "Only parents can dispute player reviews" },
        { status: 403 }
      );
    }

    const { reviewId } = await params;

    const review = await prisma.playerReview.findUnique({
      where: { id: reviewId },
      include: { player: { select: { parentId: true } } },
    });
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    if (review.player.parentId !== parentProfileId) {
      return NextResponse.json(
        { error: "You can only dispute reviews on your own players" },
        { status: 403 }
      );
    }
    if (review.status === "disputed") {
      return NextResponse.json(
        { error: "This review has already been disputed" },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const reason = (body.reason as string)?.trim() || null;

    const [_, dispute] = await prisma.$transaction([
      prisma.playerReview.update({
        where: { id: reviewId },
        data: { status: "disputed" },
      }),
      prisma.playerReviewDispute.create({
        data: {
          reviewId,
          parentProfileId,
          reason,
        },
      }),
    ]);

    notifyZapier("player_review_dispute", {
      id: dispute.id,
      reviewId,
      parentProfileId,
      reason,
      status: dispute.status,
      createdAt: dispute.createdAt.toISOString(),
    });

    return NextResponse.json(
      { message: "Review disputed. It has been hidden and sent for admin review." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dispute player review error:", error);
    return NextResponse.json(
      { error: "Failed to dispute review" },
      { status: 500 }
    );
  }
}

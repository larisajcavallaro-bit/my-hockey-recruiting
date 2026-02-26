import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { notifyZapier } from "@/lib/zapier";

/** POST /api/coaches/reviews/[reviewId]/dispute — coach disputes a review, hides it, creates admin notice */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coachProfileId = (session.user as { coachProfileId?: string | null })
      ?.coachProfileId;
    if (!coachProfileId) {
      return NextResponse.json(
        { error: "Only coaches can dispute reviews" },
        { status: 403 }
      );
    }

    const { reviewId } = await params;

    const review = await prisma.coachReview.findUnique({
      where: { id: reviewId },
    });
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    if (review.coachId !== coachProfileId) {
      return NextResponse.json(
        { error: "You can only dispute reviews on your own profile" },
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
      prisma.coachReview.update({
        where: { id: reviewId },
        data: { status: "disputed" },
      }),
      prisma.coachReviewDispute.create({
        data: {
          reviewId,
          coachProfileId,
          reason,
        },
      }),
    ]);

    notifyZapier("coach_review_dispute", {
      id: dispute.id,
      reviewId,
      coachProfileId,
      reason,
      status: dispute.status,
      createdAt: dispute.createdAt.toISOString(),
    });

    return NextResponse.json(
      { message: "Review disputed. It has been hidden and sent for admin review." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dispute review error:", error);
    return NextResponse.json(
      { error: "Failed to dispute review" },
      { status: 500 }
    );
  }
}

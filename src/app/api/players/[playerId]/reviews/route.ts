import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z.string().min(10, "Review must be at least 10 characters"),
  criteriaRatings: z
    .record(z.string(), z.number().int().min(1).max(5))
    .optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { playerId } = await params;

    const player = await prisma.player.findUnique({
      where: { id: playerId },
    });
    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    const body = await request.json();
    const data = createReviewSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true },
    });

    const review = await prisma.playerReview.create({
      data: {
        playerId,
        author: user?.name ?? "Anonymous",
        authorId: session.user.id,
        rating: data.rating,
        text: data.text,
        criteriaRatings: data.criteriaRatings
          ? (data.criteriaRatings as object)
          : undefined,
      },
    });

    // If submitter is a coach, mark any pending RatingRequest for this player as completed
    const coachProfileId = (session.user as { coachProfileId?: string | null })?.coachProfileId;
    if (coachProfileId) {
      await prisma.ratingRequest.updateMany({
        where: {
          playerId,
          coachProfileId,
          status: "pending",
        },
        data: {
          status: "completed",
          playerReviewId: review.id,
        },
      });
    }

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Create player review error:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

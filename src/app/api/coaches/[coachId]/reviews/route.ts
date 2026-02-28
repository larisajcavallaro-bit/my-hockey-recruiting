import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { hasFeature } from "@/constants/plan-features";

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z.string().optional().transform((v) => v?.trim() || "No additional comments."),
  criteriaRatings: z
    .record(z.string(), z.number())
    .transform((obj) =>
      obj
        ? Object.fromEntries(
            Object.entries(obj).filter(
              ([, v]) => typeof v === "number" && v >= 1 && v <= 5
            )
          )
        : undefined
    )
    .optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ coachId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parentProfileId = (session.user as { parentProfileId?: string | null })
      .parentProfileId;
    if (!parentProfileId) {
      return NextResponse.json(
        { error: "Only parents can leave coach reviews" },
        { status: 403 }
      );
    }

    const role = (session.user as { role?: string })?.role;
    const parentProfile = await prisma.parentProfile.findUnique({
      where: { id: parentProfileId },
      select: { planId: true },
    });
    if (!hasFeature(parentProfile?.planId, "coach_ratings", { asAdmin: role === "ADMIN" })) {
      return NextResponse.json(
        { error: "Coach ratings require an Elite plan or higher. Upgrade to rate coaches." },
        { status: 403 }
      );
    }

    const { coachId } = await params;

    const coach = await prisma.coachProfile.findUnique({
      where: { id: coachId },
    });
    if (!coach) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    const existingReview = await prisma.coachReview.findFirst({
      where: { coachId, authorId: session.user.id },
    });
    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this coach." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = createReviewSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true },
    });

    const baseData = {
      coachId,
      author: user?.name ?? "Anonymous",
      authorId: session.user.id,
      rating: data.rating,
      text: data.text,
    };

    let review;
    try {
      review = await prisma.coachReview.create({
        data: {
          ...baseData,
          criteriaRatings: data.criteriaRatings
            ? (data.criteriaRatings as object)
            : undefined,
        },
      });
    } catch (createError) {
      // Fallback: if criteria_ratings column doesn't exist or Prisma doesn't know it, save without it
      const errMsg =
        createError instanceof Error ? createError.message : String(createError);
      const isCriteriaRelated =
        errMsg.includes("criteria_ratings") ||
        errMsg.includes("Unknown argument") ||
        errMsg.includes("criteriaRatings");
      if (isCriteriaRelated) {
        review = await prisma.coachReview.create({
          data: baseData,
        });
      } else {
        throw createError;
      }
    }

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten() },
        { status: 400 }
      );
    }
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Create coach review error:", error);
    return NextResponse.json(
      {
        error: process.env.NODE_ENV === "development" ? errMsg : "Failed to submit review",
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { hasFeature } from "@/constants/plan-features";

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z.string().max(2000).optional(),
});

/** Format "John Smith" -> "John S.", "Sarah" -> "Sarah" */
function formatAuthorName(name: string | null | undefined): string {
  if (!name?.trim()) return "Anonymous";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const lastInitial = parts[parts.length - 1]?.[0] ?? "";
  return `${first} ${lastInitial}.`;
}

/** GET /api/facilities/[slug]/reviews - list reviews, newest first */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const reviews = await prisma.facilityReview.findMany({
      where: { facilitySlug: slug },
      orderBy: { createdAt: "desc" },
    });

    const formatted = reviews.map((r) => ({
      id: r.id,
      name: r.author,
      rating: r.rating,
      comment: r.text ?? "",
      date: r.createdAt,
    }));

    return NextResponse.json({ reviews: formatted });
  } catch (error) {
    console.error("Get facility reviews error:", error);
    return NextResponse.json(
      { error: "Failed to load reviews" },
      { status: 500 }
    );
  }
}

/** POST /api/facilities/[slug]/reviews - create review (Gold+ parents or coaches) */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parentProfileId = (session.user as { parentProfileId?: string | null })
      .parentProfileId;
    const coachProfileId = (session.user as { coachProfileId?: string | null })
      .coachProfileId;

    const role = (session.user as { role?: string })?.role;
    if (!parentProfileId && !coachProfileId && role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only parents and coaches can leave facility reviews" },
        { status: 403 }
      );
    }

    // Check Gold+ for parents; coaches allowed (Gold+); admins get Elite visibility
    let planId: string | null = null;
    if (parentProfileId) {
      const p = await prisma.parentProfile.findUnique({
        where: { id: parentProfileId },
        select: { planId: true },
      });
      planId = p?.planId ?? null;
    }
    if (coachProfileId && !parentProfileId) {
      planId = "gold"; // coaches allowed to submit facility reviews
    }
    if (role === "ADMIN") planId = "elite"; // admins get Elite visibility
    if (!hasFeature(planId ?? undefined, "facility_reviews", { asAdmin: role === "ADMIN" })) {
      return NextResponse.json(
        {
          error:
            "Training reviews require a Gold plan or higher. Upgrade to submit reviews.",
        },
        { status: 403 }
      );
    }

    const { slug } = await params;

    const body = await request.json();
    const data = createReviewSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true },
    });

    const author = formatAuthorName(user?.name ?? undefined);

    const review = await prisma.facilityReview.create({
      data: {
        facilitySlug: slug,
        author,
        authorId: session.user.id,
        rating: data.rating,
        text: data.text || null,
      },
    });

    return NextResponse.json(
      {
        review: {
          id: review.id,
          name: review.author,
          rating: review.rating,
          comment: review.text,
          date: review.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Create facility review error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to submit review";
    return NextResponse.json(
      {
        error: "Failed to submit review",
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 }
    );
  }
}

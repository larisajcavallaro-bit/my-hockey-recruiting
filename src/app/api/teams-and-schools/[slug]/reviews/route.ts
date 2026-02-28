import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { hasFeature } from "@/constants/plan-features";

const AGE_BRACKETS = ["U6", "U8", "U10", "U12", "U14", "U16", "U18", "U20"] as const;

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z.string().max(2000).optional(),
  ageBracket: z.array(z.enum(AGE_BRACKETS)).min(1, "Select at least one age your kid played"),
  gender: z.enum(["Boys", "Girls"]),
  league: z.string().min(1, "Select the league"),
});

function formatAuthorName(name: string | null | undefined): string {
  if (!name?.trim()) return "Anonymous";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const lastInitial = parts[parts.length - 1]?.[0] ?? "";
  return `${first} ${lastInitial}.`;
}

/** GET - list reviews, newest first. Optional filters: ageBracket, gender, league */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const ageBracket = searchParams.get("ageBracket")?.trim();
    const gender = searchParams.get("gender")?.trim();
    const league = searchParams.get("league")?.trim();

    const where: { schoolSlug: string; ageBracket?: { has: string }; gender?: string; league?: string } = { schoolSlug: slug };
    if (ageBracket) where.ageBracket = { has: ageBracket };
    if (gender) where.gender = gender;
    if (league) where.league = league;

    const reviews = await prisma.schoolReview.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const formatted = reviews.map((r) => ({
      id: r.id,
      name: r.author,
      rating: r.rating,
      comment: r.text ?? "",
      date: r.createdAt,
      ageBracket: r.ageBracket,
      gender: r.gender,
      league: r.league,
    }));

    return NextResponse.json(
      { reviews: formatted },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("Get school reviews error:", error);
    return NextResponse.json(
      { error: "Failed to load reviews" },
      { status: 500 }
    );
  }
}

/** POST - create review (Gold+ parents/coaches, same as facility_reviews) */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parentProfileId = (session.user as { parentProfileId?: string | null }).parentProfileId;
    const coachProfileId = (session.user as { coachProfileId?: string | null }).coachProfileId;

    if (!parentProfileId && !coachProfileId) {
      return NextResponse.json(
        { error: "Only parents and coaches can leave reviews" },
        { status: 403 }
      );
    }

    let planId: string | null = null;
    if (parentProfileId) {
      const p = await prisma.parentProfile.findUnique({
        where: { id: parentProfileId },
        select: { planId: true },
      });
      planId = p?.planId ?? null;
    }
    if (coachProfileId && !parentProfileId) planId = "gold";
    if (!hasFeature(planId ?? undefined, "facility_reviews")) {
      return NextResponse.json(
        { error: "Reviews require a Gold plan or higher. Upgrade to submit reviews." },
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

    const review = await prisma.schoolReview.create({
      data: {
        schoolSlug: slug,
        author,
        authorId: session.user.id,
        rating: data.rating,
        text: data.text || null,
        ageBracket: data.ageBracket,
        gender: data.gender,
        league: data.league,
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
          ageBracket: review.ageBracket,
          gender: review.gender,
          league: review.league,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json(
        { error: msg, details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Create school review error:", error);
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to submit review", details: errMsg },
      { status: 500 }
    );
  }
}

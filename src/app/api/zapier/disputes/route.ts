import { NextResponse } from "next/server";
import { verifyZapierAuth } from "@/lib/zapier";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/zapier/disputes
 * Zapier-compatible: use Authorization: Bearer <ADMIN_API_KEY>
 * Returns pending disputes for Zapier workflows.
 */
export async function GET(request: Request) {
  if (!verifyZapierAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? "pending";
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);

    const [coachDisputes, playerDisputes] = await Promise.all([
      prisma.coachReviewDispute.findMany({
        where: { status },
        include: {
          review: {
            select: {
              id: true,
              text: true,
              rating: true,
              author: true,
              coachProfile: { select: { team: true, level: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      prisma.playerReviewDispute.findMany({
        where: { status },
        include: {
          review: {
            select: {
              id: true,
              text: true,
              rating: true,
              author: true,
              player: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    ]);

    const disputes = [
      ...coachDisputes.map((d) => ({
        type: "coach" as const,
        id: d.id,
        reviewId: d.reviewId,
        reason: d.reason,
        status: d.status,
        createdAt: d.createdAt.toISOString(),
        review: d.review,
      })),
      ...playerDisputes.map((d) => ({
        type: "player" as const,
        id: d.id,
        reviewId: d.reviewId,
        reason: d.reason,
        status: d.status,
        createdAt: d.createdAt.toISOString(),
        review: d.review,
      })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ disputes });
  } catch (error) {
    console.error("Zapier disputes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch disputes" },
      { status: 500 }
    );
  }
}

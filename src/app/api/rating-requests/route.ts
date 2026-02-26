import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { hasFeature } from "@/constants/plan-features";
import { z } from "zod";

const createSchema = z.object({
  playerId: z.string().min(1),
  coachProfileId: z.string().min(1),
  message: z.string().optional(),
});

// GET /api/rating-requests - list rating requests
// Parent: their sent requests. ?status=pending for dashboard count.
// Coach: their received (pending) requests to rate players.
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parentProfileId = (session.user as { parentProfileId?: string | null })
      ?.parentProfileId;
    const coachProfileId = (session.user as { coachProfileId?: string | null })
      ?.coachProfileId;

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    if (coachProfileId) {
      // Coach view: requests sent TO this coach (to rate players)
      const where: { coachProfileId: string; status?: string } = {
        coachProfileId,
      };
      if (statusFilter === "pending" || statusFilter === "completed") {
        where.status = statusFilter;
      }
      const requests = await prisma.ratingRequest.findMany({
        where,
        include: {
          player: { select: { id: true, name: true } },
          parent: { include: { user: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
      });
      const formatted = requests.map((r) => ({
        id: r.id,
        playerId: r.playerId,
        playerName: r.player?.name ?? null,
        requesterName: r.parent.user?.name ?? "Parent",
        status: r.status,
        message: r.message,
        createdAt: r.createdAt,
      }));
      const pendingCount = requests.filter((r) => r.status === "pending").length;
      return NextResponse.json({ requests: formatted, pendingCount });
    }

    if (!parentProfileId) {
      return NextResponse.json({ requests: [], pendingCount: 0 });
    }

    // Parent view: their sent requests
    const where: { parentProfileId: string; status?: string } = {
      parentProfileId,
    };
    if (statusFilter === "pending" || statusFilter === "completed") {
      where.status = statusFilter;
    }

    const requests = await prisma.ratingRequest.findMany({
      where,
      include: {
        player: { select: { id: true, name: true } },
        coach: {
          include: {
            user: { select: { name: true, image: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const pendingCount = await prisma.ratingRequest.count({
      where: { parentProfileId, status: "pending" },
    });

    const formatted = requests.map((r) => ({
      id: r.id,
      playerId: r.playerId,
      playerName: r.player?.name ?? null,
      coachProfileId: r.coachProfileId,
      coachName: r.coach.user?.name ?? "Coach",
      coachImage: r.coach.image ?? r.coach.user?.image ?? null,
      status: r.status,
      message: r.message,
      playerReviewId: r.playerReviewId,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({
      requests: formatted,
      pendingCount,
    });
  } catch (err) {
    console.error("[rating-requests] GET", err);
    return NextResponse.json(
      { error: "Failed to fetch rating requests" },
      { status: 500 }
    );
  }
}

// POST /api/rating-requests - parent creates a rating request
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parentProfileId = (session.user as { parentProfileId?: string | null })
      ?.parentProfileId;
    if (!parentProfileId) {
      return NextResponse.json(
        { error: "Only parents can send rating requests" },
        { status: 403 }
      );
    }

    const raw = await request.json();
    const parsed = createSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { playerId, coachProfileId, message } = parsed.data;

    const parentProfile = await prisma.parentProfile.findUnique({
      where: { id: parentProfileId },
      select: { planId: true },
    });
    if (!hasFeature(parentProfile?.planId, "coach_evaluations")) {
      return NextResponse.json(
        { error: "Coach evaluations require an Elite plan or higher. Upgrade to request player evaluations." },
        { status: 403 }
      );
    }

    const player = await prisma.player.findFirst({
      where: { id: playerId, parentId: parentProfileId },
    });
    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    const coach = await prisma.coachProfile.findUnique({
      where: { id: coachProfileId },
    });
    if (!coach) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    const existing = await prisma.ratingRequest.findFirst({
      where: {
        parentProfileId,
        playerId,
        coachProfileId,
        status: "pending",
      },
    });
    if (existing) {
      return NextResponse.json({
        request: { id: existing.id, status: existing.status },
        message: "You already have a pending rating request with this coach for this player.",
      }, { status: 409 });
    }

    const created = await prisma.ratingRequest.create({
      data: {
        parentProfileId,
        playerId,
        coachProfileId,
        message: message ?? null,
        status: "pending",
      },
    });

    return NextResponse.json({
      request: { id: created.id, status: created.status },
    });
  } catch (err) {
    console.error("[rating-requests] POST", err);
    return NextResponse.json(
      { error: "Failed to create rating request" },
      { status: 500 }
    );
  }
}

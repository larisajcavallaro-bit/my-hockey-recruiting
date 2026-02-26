import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { hasFeature } from "@/constants/plan-features";
import { z } from "zod";

const createSchema = z.object({
  coachProfileId: z.string().min(1),
  parentProfileId: z.string().min(1),
  playerId: z.string().optional(),
  requestedBy: z.enum(["coach", "parent"]),
});

// GET /api/contact-requests - list requests (incoming/outgoing for current user)
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = (session.user as { role?: string })?.role;
    const parentProfileId = (session.user as { parentProfileId?: string | null })?.parentProfileId;
    const coachProfileId = (session.user as { coachProfileId?: string | null })?.coachProfileId;
    const filter = searchParams.get("filter"); // "incoming" | "outgoing" | "all"

    if (!parentProfileId && !coachProfileId) {
      return NextResponse.json({ requests: [] });
    }

    const isParent = !!parentProfileId;
    const isCoach = !!coachProfileId;

    const where: Record<string, unknown> = {};

    if (isParent && parentProfileId) {
      where.parentProfileId = parentProfileId;
      if (filter === "incoming") where.requestedBy = "coach";
      else if (filter === "outgoing") where.requestedBy = "parent";
    } else if (isCoach && coachProfileId) {
      where.coachProfileId = coachProfileId;
      if (filter === "incoming") where.requestedBy = "parent";
      else if (filter === "outgoing") where.requestedBy = "coach";
    } else {
      return NextResponse.json({ requests: [] });
    }

    const requests = await prisma.contactRequest.findMany({
      where,
      include: {
        coach: { include: { user: { select: { name: true, email: true } } } },
        parent: { include: { user: { select: { name: true, email: true } } } },
        player: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = requests.map((r) => ({
      id: r.id,
      coachProfileId: r.coachProfileId,
      parentProfileId: r.parentProfileId,
      playerId: r.playerId,
      playerName: r.player?.name ?? null,
      requestedBy: r.requestedBy,
      status: r.status,
      createdAt: r.createdAt,
      coachName: r.coach.user?.name ?? "Coach",
      parentName: r.parent.user?.name ?? "Parent",
    }));

    return NextResponse.json({ requests: formatted });
  } catch (err) {
    console.error("[contact-requests] GET", err);
    return NextResponse.json(
      { error: "Failed to fetch contact requests" },
      { status: 500 }
    );
  }
}

// POST /api/contact-requests - create a request
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parentProfileId = (session.user as { parentProfileId?: string | null })?.parentProfileId;
    const coachProfileId = (session.user as { coachProfileId?: string | null })?.coachProfileId;

    const raw = await request.json();
    const parsed = createSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { coachProfileId: targetCoachId, parentProfileId: targetParentId, playerId, requestedBy } = parsed.data;

    // Validate requester matches session
    if (requestedBy === "coach") {
      if (coachProfileId !== targetCoachId || !targetParentId) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
      }
      if (!playerId) {
        return NextResponse.json(
          { error: "playerId required when coach requests parent contact" },
          { status: 400 }
        );
      }
      const player = await prisma.player.findFirst({
        where: { id: playerId, parentId: targetParentId },
      });
      if (!player) {
        return NextResponse.json({ error: "Player not found" }, { status: 404 });
      }
    } else {
      if (parentProfileId !== targetParentId || !targetCoachId) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
      }
      // Parent requesting: require Gold+ for contact_requests
      const parentProfile = await prisma.parentProfile.findUnique({
        where: { id: parentProfileId },
        select: { planId: true },
      });
      if (!hasFeature(parentProfile?.planId, "contact_requests")) {
        return NextResponse.json(
          { error: "Contact requests require a Gold plan or higher. Upgrade to connect with coaches." },
          { status: 403 }
        );
      }
    }

    // Check for existing request
    const existing = await prisma.contactRequest.findFirst({
      where: {
        coachProfileId: targetCoachId,
        parentProfileId: targetParentId,
        playerId: requestedBy === "coach" ? playerId : null,
      },
    });
    if (existing) {
      return NextResponse.json({
        request: { id: existing.id, status: existing.status },
        message: existing.status === "pending" ? "Request already pending" : undefined,
      });
    }

    const created = await prisma.contactRequest.create({
      data: {
        coachProfileId: targetCoachId,
        parentProfileId: targetParentId,
        playerId: requestedBy === "coach" ? playerId : null,
        requestedBy,
        status: "pending",
      },
    });

    return NextResponse.json({ request: { id: created.id, status: created.status } });
  } catch (err) {
    console.error("[contact-requests] POST", err);
    return NextResponse.json(
      { error: "Failed to create contact request" },
      { status: 500 }
    );
  }
}

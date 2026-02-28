import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { hasFeature } from "@/constants/plan-features";
import { createNotification } from "@/lib/notifications";
import { z } from "zod";

// GET /api/parent-contact-requests - list incoming requests (for target parent to approve/reject)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ requests: [] });
    }

    const targetParentId = (session.user as { parentProfileId?: string | null })?.parentProfileId;
    if (!targetParentId) return NextResponse.json({ requests: [] });

    const requests = await prisma.parentContactRequest.findMany({
      where: { targetParentId, status: "pending" },
      include: {
        requestingParent: { include: { user: { select: { name: true } } } },
        player: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = requests.map((r) => ({
      id: r.id,
      requestingParentId: r.requestingParentId,
      requestingParentName: r.requestingParent.user?.name ?? "Parent",
      playerId: r.playerId,
      playerName: r.player?.name ?? null,
      status: r.status,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({ requests: formatted });
  } catch (err) {
    console.error("[parent-contact-requests] GET", err);
    return NextResponse.json({ requests: [] });
  }
}

const createSchema = z.object({
  targetParentId: z.string().min(1),
  playerId: z.string().min(1),
});

// POST /api/parent-contact-requests - parent requests another parent's contact (for their player)
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestingParentId = (session.user as { parentProfileId?: string | null })?.parentProfileId;
    if (!requestingParentId) {
      return NextResponse.json({ error: "Parent profile required" }, { status: 400 });
    }

    const raw = await request.json();
    const parsed = createSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { targetParentId, playerId } = parsed.data;

    if (requestingParentId === targetParentId) {
      return NextResponse.json({ error: "Cannot request your own contact" }, { status: 400 });
    }

    const parentProfile = await prisma.parentProfile.findUnique({
      where: { id: requestingParentId },
      select: { planId: true },
    });
    if (!hasFeature(parentProfile?.planId, "parent_contact_requests")) {
      return NextResponse.json(
        { error: "Contact requests require a Gold plan or higher. Upgrade to connect with other parents." },
        { status: 403 }
      );
    }

    const player = await prisma.player.findFirst({
      where: { id: playerId, parentId: targetParentId },
    });
    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    const existing = await prisma.parentContactRequest.findUnique({
      where: {
        requestingParentId_targetParentId_playerId: {
          requestingParentId,
          targetParentId,
          playerId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({
        request: { id: existing.id, status: existing.status },
        message: existing.status === "pending" ? "Request already pending" : undefined,
      });
    }

    const created = await prisma.parentContactRequest.create({
      data: {
        requestingParentId,
        targetParentId,
        playerId,
        status: "pending",
      },
    });

    // Notify target parent
    const targetParent = await prisma.parentProfile.findUnique({
      where: { id: targetParentId },
      select: { userId: true },
    });
    const requesterName = (session.user as { name?: string })?.name ?? "Another parent";
    if (targetParent?.userId) {
      await createNotification({
        userId: targetParent.userId,
        type: "request",
        title: "Parent Contact Request",
        body: `${requesterName} would like to connect about ${player.name}.`,
        linkUrl: "/parent-dashboard/overview",
      }).catch(() => {});
    }

    return NextResponse.json({ request: { id: created.id, status: created.status } });
  } catch (err) {
    console.error("[parent-contact-requests] POST", err);
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 });
  }
}

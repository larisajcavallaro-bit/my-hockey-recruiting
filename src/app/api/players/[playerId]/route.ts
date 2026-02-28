import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { maskPlayerByPlan } from "@/lib/plan-features";
import { isTestAccount } from "@/constants/test-accounts";

const updatePlayerSchema = z.object({
  name: z.string().min(1).optional(),
  birthYear: z.number().int().min(2000).max(2025).optional(),
  position: z.string().optional(),
  level: z.string().optional(),
  gender: z.string().optional(),
  location: z.string().optional(),
  team: z.string().optional(),
  league: z.string().optional(),
  bio: z.string().optional(),
  image: z.string().optional(),
  socialLink: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
  goals: z.number().optional(),
  assists: z.number().optional(),
  plusMinus: z.number().optional(),
  gaa: z.number().optional(),
  savePct: z.string().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const { playerId } = await params;
    const session = await auth();

    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        parent: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
        experience: true,
        reviews: { orderBy: { createdAt: "desc" }, take: 50 },
        subscription: { select: { id: true, subscriptionStatus: true } },
      },
    });

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    const parentProfileId = (session?.user as { parentProfileId?: string | null })?.parentProfileId;
    const isOwnPlayer = parentProfileId && player.parentId === parentProfileId;

    // Hide test/demo players from other users (test parents can still see their own kids)
    if (!isOwnPlayer && isTestAccount((player.parent as { user?: { email?: string } })?.user?.email)) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }
    const coachProfileId = (session?.user as { coachProfileId?: string | null })?.coachProfileId;

    // Block check: coach cannot see player if parent has blocked the coach
    if (session?.user?.id && coachProfileId && player.parent) {
      const parentUserId = (player.parent as { userId?: string })?.userId;
      if (parentUserId) {
        const blockExists = await prisma.block.findUnique({
          where: {
            blockerUserId_blockedUserId: {
              blockerUserId: parentUserId,
              blockedUserId: session.user.id,
            },
          },
        });
        if (blockExists) {
          return NextResponse.json({ error: "Player not found" }, { status: 404 });
        }
      }
    }

    let hasContactAccess = isOwnPlayer;
    if (!hasContactAccess && parentProfileId && player.parentId !== parentProfileId) {
      const req = await prisma.parentContactRequest.findUnique({
        where: {
          requestingParentId_targetParentId_playerId: {
            requestingParentId: parentProfileId,
            targetParentId: player.parentId,
            playerId: player.id,
          },
        },
      });
      hasContactAccess = req?.status === "approved";
    }
    if (!hasContactAccess && coachProfileId) {
      const req = await prisma.contactRequest.findFirst({
        where: {
          coachProfileId,
          parentProfileId: player.parentId,
          playerId: player.id,
          status: "approved",
        },
      });
      hasContactAccess = !!req;
    }

    const parentForResponse = hasContactAccess
      ? player.parent
      : player.parent
        ? {
            ...player.parent,
            phone: null,
            user: player.parent.user
              ? { name: player.parent.user.name, email: null }
              : null,
          }
        : null;

    const visibleReviews = (player.reviews ?? []).filter(
      (r: { status?: string }) => !r.status || r.status === "visible"
    );
    const avgRating =
      visibleReviews.length > 0
        ? visibleReviews.reduce((s, r) => s + r.rating, 0) / visibleReviews.length
        : null;

    const parentUserId = !isOwnPlayer ? (player.parent as { userId?: string })?.userId : undefined;
    const effectivePlanId = player.planId ?? (player.parent as { planId?: string | null })?.planId ?? "free";

    const sub = player.subscription as { subscriptionStatus?: string | null } | null;
    const hasPaidSubscription =
      isOwnPlayer &&
      !!sub &&
      ["active", "trialing"].includes(sub.subscriptionStatus ?? "");

    const baseResponse = {
      ...player,
      reviews: visibleReviews,
      parent: parentForResponse,
      parentUserId,
      age: new Date().getFullYear() - player.birthYear,
      rating: avgRating,
      reviewCount: visibleReviews.length,
      ...(isOwnPlayer && { hasPaidSubscription }),
    };

    const masked = maskPlayerByPlan(baseResponse, effectivePlanId, !!hasContactAccess);
    return NextResponse.json(masked);
  } catch (error) {
    console.error("Player detail error:", error);
    return NextResponse.json(
      { error: "Failed to fetch player" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let parentProfileId = (session.user as { parentProfileId?: string | null }).parentProfileId;
    if (!parentProfileId) {
      const role = (session.user as { role?: string })?.role;
      if (role === "PARENT") {
        const profile = await prisma.parentProfile.findUnique({
          where: { userId: session.user.id },
        });
        parentProfileId = profile?.id ?? null;
      }
    }
    if (!parentProfileId) {
      return NextResponse.json(
        { error: "Parent profile required" },
        { status: 403 }
      );
    }

    const { playerId } = await params;
    const existing = await prisma.player.findUnique({
      where: { id: playerId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }
    if (existing.parentId !== parentProfileId) {
      return NextResponse.json(
        { error: "You can only edit your own players" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = updatePlayerSchema.parse(body);

    await prisma.player.update({
      where: { id: playerId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.birthYear !== undefined && { birthYear: data.birthYear }),
        ...(data.position !== undefined && { position: data.position || null }),
        ...(data.level !== undefined && { level: data.level || null }),
        ...(data.gender !== undefined && { gender: data.gender || null }),
        ...(data.location !== undefined && { location: data.location || null }),
        ...(data.team !== undefined && { team: data.team || null }),
        ...(data.league !== undefined && { league: data.league || null }),
        ...(data.bio !== undefined && { bio: data.bio || null }),
        ...(data.image !== undefined && { image: data.image || null }),
        ...(data.socialLink !== undefined && { socialLink: data.socialLink?.trim() || null }),
        ...(data.goals !== undefined && { goals: data.goals }),
        ...(data.assists !== undefined && { assists: data.assists }),
        ...(data.plusMinus !== undefined && { plusMinus: data.plusMinus }),
        ...(data.gaa !== undefined && { gaa: data.gaa }),
        ...(data.savePct !== undefined && { savePct: data.savePct || null }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
      return NextResponse.json(
        { error: `Invalid input: ${msg}`, details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Player update error:", error);
    const message = error instanceof Error ? error.message : "Failed to update player";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let parentProfileId = (session.user as { parentProfileId?: string | null }).parentProfileId;
    if (!parentProfileId) {
      const role = (session.user as { role?: string })?.role;
      if (role === "PARENT") {
        const profile = await prisma.parentProfile.findUnique({
          where: { userId: session.user.id },
        });
        parentProfileId = profile?.id ?? null;
      }
    }
    if (!parentProfileId) {
      return NextResponse.json(
        { error: "Parent profile required" },
        { status: 403 }
      );
    }

    const { playerId } = await params;
    const existing = await prisma.player.findUnique({
      where: { id: playerId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }
    if (existing.parentId !== parentProfileId) {
      return NextResponse.json(
        { error: "You can only delete your own players" },
        { status: 403 }
      );
    }

    await prisma.player.delete({
      where: { id: playerId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Player delete error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete player";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

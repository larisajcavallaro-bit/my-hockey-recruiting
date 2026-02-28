import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { canParentAddPlayer } from "@/lib/subscription";
import { hasFeature } from "@/constants/plan-features";
import { maskPlayerByPlan } from "@/lib/plan-features";
import { TEST_ACCOUNT_EMAILS } from "@/constants/test-accounts";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const mine = searchParams.get("mine") === "1";
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);

    const parentProfileId = (session?.user as { parentProfileId?: string | null })?.parentProfileId;
    const coachProfileId = (session?.user as { coachProfileId?: string | null })?.coachProfileId;

    // SECURITY: mine=1 must ONLY return the current parent's children. Never return all players.
    if (mine && (!session?.user || !parentProfileId)) {
      return NextResponse.json({ players: [] });
    }

    const searchCondition = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { team: { contains: search, mode: "insensitive" } },
            { league: { contains: search, mode: "insensitive" } },
            { position: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined;
    const parentFilter = mine && parentProfileId ? { parentId: parentProfileId } : undefined;

    const whereClauses: object[] = [];
    if (parentFilter) whereClauses.push(parentFilter);
    if (searchCondition) whereClauses.push(searchCondition);

    // Block filter (coach viewing all players): hide players whose parent has blocked this coach
    if (!mine && coachProfileId && session?.user?.id) {
      whereClauses.push({
        parent: {
          user: {
            blocksGiven: { none: { blockedUserId: session.user.id } },
          },
        },
      });
    }

    // Hide test/demo profiles from real users when viewing all players
    if (!mine) {
      whereClauses.push({
        parent: { user: { email: { notIn: TEST_ACCOUNT_EMAILS } } },
      });
    }

    const where = whereClauses.length > 0 ? { AND: whereClauses } : undefined;

    const players = await prisma.player.findMany({
      where: where as { AND?: object[] } | undefined,
      include: {
        parent: { include: { user: { select: { name: true } } } },
        reviews: true,
        subscription: { select: { planId: true } },
      },
      take: limit,
    });

    // Helper: resolve effective plan (same logic as getPlayersWithPlanInfo)
    const getEffectivePlanForSort = (p: (typeof players)[0]) => {
      const parentPlanId = (p.parent as { planId?: string | null })?.planId ?? "free";
      const isFamily = parentPlanId === "familyGold" || parentPlanId === "familyElite";
      if (p.subscription) return p.subscription.planId as string;
      if (isFamily) return parentPlanId;
      return (p.planId ?? parentPlanId) as string;
    };

    // View Players: sort by plan tier – Elite first, Gold second, Free last (always, regardless of viewer)
    if (!mine) {
      const tierRank: Record<string, number> = {
        elite: 0,
        familyElite: 0,
        gold: 1,
        familyGold: 1,
        free: 2,
      };
      players.sort((a, b) => {
        const planA = getEffectivePlanForSort(a);
        const planB = getEffectivePlanForSort(b);
        return (tierRank[planA] ?? 2) - (tierRank[planB] ?? 2);
      });
    }

    const playersWithRating = players.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
          : null;
      const { reviews, subscription, ...player } = p;
      const base = {
        ...player,
        age: new Date().getFullYear() - player.birthYear,
        rating: avgRating,
        reviewCount: reviews.length,
      };
      const effectivePlanId = getEffectivePlanForSort(p);
      const isOwn = parentProfileId && p.parentId === parentProfileId;
      const role = (session?.user as { role?: string })?.role;
      const hasContactAccess = isOwn || role === "ADMIN"; // Admins get Elite visibility
      return maskPlayerByPlan(base, effectivePlanId, !!hasContactAccess);
    });

    return NextResponse.json({ players: playersWithRating });
  } catch (error) {
    console.error("Players list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}

const createPlayerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  birthYear: z.number().int().min(2000).max(2025),
  position: z.string().optional(),
  level: z.string().optional(),
  gender: z.string().optional(),
  location: z.string().optional(),
  team: z.string().optional(),
  league: z.string().optional(),
  bio: z.string().optional(),
  image: z.string().optional(),
  socialLink: z.union([z.string().url(), z.literal("")]).optional(),
  goals: z.number().optional(),
  assists: z.number().optional(),
  plusMinus: z.number().optional(),
  gaa: z.number().optional(),
  savePct: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    const parentProfileId = (session.user as { parentProfileId?: string | null })
      .parentProfileId;

    if (role !== "PARENT" || !parentProfileId) {
      return NextResponse.json(
        { error: "Only parents can add players" },
        { status: 403 }
      );
    }

    const addResult = await canParentAddPlayer(parentProfileId);
    if (!addResult.allowed) {
      return NextResponse.json(
        {
          error: addResult.reason ?? "Cannot add player",
          limit: addResult.limit,
          current: addResult.current,
          upgradeRequired: true,
          checkoutRequired: addResult.checkoutRequired,
          checkoutPlanOptions: addResult.checkoutPlanOptions,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = createPlayerSchema.parse(body);

    // Find unused PlayerSubscription slot (Gold/Elite per-player) if any
    const unusedSlot = await prisma.playerSubscription.findFirst({
      where: {
        parentId: parentProfileId,
        playerId: null,
        subscriptionStatus: { in: ["active", "trialing"] },
      },
      orderBy: { createdAt: "asc" },
    });

    const parent = await prisma.parentProfile.findUnique({
      where: { id: parentProfileId },
      select: { planId: true },
    });
    const parentPlanId = parent?.planId ?? "free";
    const isFamily = parentPlanId === "familyGold" || parentPlanId === "familyElite";

    const playerPlanId = unusedSlot
      ? unusedSlot.planId
      : isFamily
        ? parentPlanId
        : "free";

    const player = await prisma.player.create({
      data: {
        parentId: parentProfileId,
        name: data.name,
        birthYear: data.birthYear,
        position: data.position,
        level: data.level,
        gender: data.gender,
        location: data.location,
        team: data.team,
        league: data.league,
        bio: data.bio,
        image: data.image,
        socialLink: data.socialLink?.trim() || null,
        goals: data.goals,
        assists: data.assists,
        plusMinus: data.plusMinus,
        gaa: data.gaa,
        savePct: data.savePct,
        status: "Pending",
        planId: playerPlanId,
      },
    });

    // If player has team/level/birthYear, find matching head coach and create pending verification
    if (data.team?.trim() && data.level?.trim() && data.birthYear != null) {
      const matchingCoach = await prisma.coachProfile.findFirst({
        where: {
          coachRole: "HEAD_COACH",
          team: { equals: data.team.trim(), mode: "insensitive" },
          level: { equals: data.level.trim(), mode: "insensitive" },
          birthYear: data.birthYear,
        },
      });
      if (matchingCoach) {
        await prisma.coachPlayerVerification.create({
          data: {
            coachId: matchingCoach.id,
            playerId: player.id,
            status: "PENDING",
          },
        });
      }
    }

    if (unusedSlot) {
      await prisma.playerSubscription.update({
        where: { id: unusedSlot.id },
        data: { playerId: player.id },
      });
    }

    return NextResponse.json({ player }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Create player error:", error);
    return NextResponse.json(
      { error: "Failed to create player" },
      { status: 500 }
    );
  }
}

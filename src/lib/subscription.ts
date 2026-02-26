/**
 * Subscription helpers - check limits, get plan for parent, etc.
 * Free: 1 player, no payment. Gold/Elite: up to 3, pay per child. Family: 1 sub for up to 6.
 */
import { prisma } from "@/lib/db";
import {
  getPlanById,
  type PlanId,
} from "@/constants/subscription";

export interface PlayerPlanInfo {
  id: string;
  name: string;
  planId: PlanId;
  planName: string;
  monthlyPrice: number;
  stripeSubscriptionId: string | null;
  subscriptionStatus: string | null;
  periodEndAt: Date | null;
  /** true if this player has their own billing (per-player); false if shared (Family) */
  hasOwnBilling: boolean;
}

export interface SubscriptionInfo {
  planId: PlanId;
  planName: string;
  playerLimit: number;
  currentPlayerCount: number;
  canAddPlayer: boolean;
  /** For Gold/Elite per-player: need to checkout for another child */
  checkoutRequired?: boolean;
  /** Plan options when checkout required (gold, elite) */
  checkoutPlanOptions?: PlanId[];
  status: "active" | "canceled" | "past_due" | "trialing" | "free" | null;
  periodEndAt: Date | null;
  monthlyPrice: number;
  /** Per-player plan info for subscription/billing UI */
  players?: PlayerPlanInfo[];
}

export async function getSubscriptionForParent(
  parentProfileId: string
): Promise<SubscriptionInfo> {
  const [parent, playerCount, playerSubscriptions] = await Promise.all([
    prisma.parentProfile.findUnique({
      where: { id: parentProfileId },
      select: {
        planId: true,
        subscriptionStatus: true,
        subscriptionPeriodEndAt: true,
      },
    }),
    prisma.player.count({ where: { parentId: parentProfileId } }),
    prisma.playerSubscription.findMany({
      where: { parentId: parentProfileId },
      select: { planId: true, subscriptionStatus: true, playerId: true },
    }),
  ]);

  const parentPlanId = (parent?.planId ?? "free") as PlanId;

  // Family: one subscription on parent, covers up to 6
  if (parentPlanId === "familyGold" || parentPlanId === "familyElite") {
    const isActive =
      parent?.subscriptionStatus &&
      ["active", "trialing"].includes(parent.subscriptionStatus);
    const limit = 6;
    const plan = getPlanById(parentPlanId);
    return {
      planId: parentPlanId,
      planName: plan.name,
      playerLimit: limit,
      currentPlayerCount: playerCount,
      canAddPlayer: !!(isActive && playerCount < limit),
      status: (parent?.subscriptionStatus as SubscriptionInfo["status"]) ?? null,
      periodEndAt: parent?.subscriptionPeriodEndAt ?? null,
      monthlyPrice: plan.monthlyPrice,
    };
  }

  // Free: 1 player, no payment (no PlayerSubscriptions, parent is free)
  if (parentPlanId === "free") {
    const activeSubs = playerSubscriptions.filter((s) =>
      ["active", "trialing"].includes(s.subscriptionStatus ?? "")
    );
    const hasPerPlayerSubs = activeSubs.length > 0;

    if (!hasPerPlayerSubs) {
      const plan = getPlanById("free");
      return {
        planId: "free",
        planName: plan.name,
        playerLimit: 1,
        currentPlayerCount: playerCount,
        canAddPlayer: playerCount < 1,
        status: "free",
        periodEndAt: null,
        monthlyPrice: 0,
      };
    }
  }

  // Gold/Elite per-player: PlayerSubscriptions (or legacy parent.planId gold/elite)
  const activeSubscriptions = playerSubscriptions.filter((s) =>
    ["active", "trialing"].includes(s.subscriptionStatus ?? "")
  );
  // Legacy: parent has gold/elite on ParentProfile with active sub = 1 slot
  const isLegacyGoldElite =
    (parentPlanId === "gold" || parentPlanId === "elite") &&
    parent?.subscriptionStatus &&
    ["active", "trialing"].includes(parent.subscriptionStatus);

  const paidSlots = isLegacyGoldElite
    ? Math.max(1, activeSubscriptions.length)
    : activeSubscriptions.length;
  const unusedSlots = activeSubscriptions.filter((s) => !s.playerId).length;
  const limit = 3;
  const firstSub = activeSubscriptions[0] as { planId?: string } | undefined;
  const primaryPlan: PlanId =
    firstSub?.planId === "elite" || parentPlanId === "elite" ? "elite" : "gold";

  if (playerCount >= limit) {
    return {
      planId: primaryPlan,
      planName: getPlanById(primaryPlan).name,
      playerLimit: limit,
      currentPlayerCount: playerCount,
      canAddPlayer: false,
      status: "active",
      periodEndAt: null,
      monthlyPrice: getPlanById(primaryPlan).monthlyPrice,
    };
  }

  if (unusedSlots > 0) {
    return {
      planId: primaryPlan,
      planName: getPlanById(primaryPlan).name,
      playerLimit: limit,
      currentPlayerCount: playerCount,
      canAddPlayer: true,
      status: "active",
      periodEndAt: null,
      monthlyPrice: getPlanById(primaryPlan).monthlyPrice,
    };
  }

  return {
    planId: primaryPlan,
    planName: getPlanById(primaryPlan).name,
    playerLimit: limit,
    currentPlayerCount: playerCount,
    canAddPlayer: false,
    checkoutRequired: true,
    checkoutPlanOptions: ["gold", "elite"],
    status: paidSlots > 0 ? "active" : null,
    periodEndAt: null,
    monthlyPrice: getPlanById(primaryPlan).monthlyPrice,
  };
}

export async function canParentAddPlayer(
  parentProfileId: string
): Promise<{
  allowed: boolean;
  reason?: string;
  limit?: number;
  current?: number;
  upgradeRequired?: boolean;
  checkoutRequired?: boolean;
  checkoutPlanOptions?: PlanId[];
}> {
  const sub = await getSubscriptionForParent(parentProfileId);

  if (sub.canAddPlayer) {
    return { allowed: true };
  }

  if (sub.checkoutRequired) {
    return {
      allowed: false,
      reason:
        "Subscribe for this child to add them. Choose Gold or Elite—or upgrade to Family for one price for all.",
      limit: sub.playerLimit,
      current: sub.currentPlayerCount,
      checkoutRequired: true,
      checkoutPlanOptions: sub.checkoutPlanOptions,
    };
  }

  if (sub.currentPlayerCount >= sub.playerLimit) {
    const isFree = sub.planId === "free";
    return {
      allowed: false,
      reason: isFree
        ? "Free accounts allow 1 child. Upgrade to Gold or Elite to add more (pay per child), or Family for one price for up to 6."
        : `Player limit reached (${sub.playerLimit}). Upgrade to Family for up to 6 players.`,
      limit: sub.playerLimit,
      current: sub.currentPlayerCount,
    };
  }

  if (sub.status && !["active", "trialing", "free"].includes(sub.status)) {
    return {
      allowed: false,
      reason: "Your subscription is not active. Please update your payment method.",
    };
  }

  return { allowed: false, reason: "Unable to add player." };
}

/** Get each player's plan info for subscription/billing UI */
export async function getPlayersWithPlanInfo(
  parentProfileId: string
): Promise<PlayerPlanInfo[]> {
  const [parent, players] = await Promise.all([
    prisma.parentProfile.findUnique({
      where: { id: parentProfileId },
      select: {
        planId: true,
        stripeSubscriptionId: true,
        subscriptionStatus: true,
        subscriptionPeriodEndAt: true,
      },
    }),
    prisma.player.findMany({
      where: { parentId: parentProfileId },
      select: {
        id: true,
        name: true,
        planId: true,
        subscription: {
          select: {
            planId: true,
            stripeSubscriptionId: true,
            subscriptionStatus: true,
            subscriptionPeriodEndAt: true,
          },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const parentPlanId = (parent?.planId ?? "free") as PlanId;
  const isFamily =
    parentPlanId === "familyGold" || parentPlanId === "familyElite";

  const sharedSubId =
    isFamily || (parent?.stripeSubscriptionId && ["gold", "elite"].includes(parentPlanId))
      ? parent?.stripeSubscriptionId ?? null
      : null;

  return players.map((p) => {
    const hasOwnSub = !!p.subscription;
    const useSharedSub = !hasOwnSub && !!sharedSubId;
    // Source of truth: PlayerSubscription.planId (per-player), parentPlanId (shared/Family/legacy), else player.planId, else free
    const planId = (hasOwnSub
      ? (p.subscription!.planId as PlanId)
      : useSharedSub
        ? parentPlanId
        : (p.planId ?? "free")) as PlanId;
    const plan = getPlanById(planId);
    return {
      id: p.id,
      name: p.name,
      planId,
      planName: plan.name,
      monthlyPrice: plan.monthlyPrice,
      stripeSubscriptionId: hasOwnSub
        ? p.subscription!.stripeSubscriptionId
        : useSharedSub
          ? sharedSubId
          : null,
      subscriptionStatus: hasOwnSub
        ? p.subscription!.subscriptionStatus
        : useSharedSub
          ? parent?.subscriptionStatus ?? null
          : null,
      periodEndAt: hasOwnSub
        ? p.subscription!.subscriptionPeriodEndAt
        : useSharedSub
          ? parent?.subscriptionPeriodEndAt ?? null
          : null,
      hasOwnBilling: hasOwnSub,
    };
  });
}

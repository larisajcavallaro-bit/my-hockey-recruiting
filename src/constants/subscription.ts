/**
 * Subscription plans for My Hockey Recruiting.
 * Plan IDs must match Stripe Price IDs configured in env vars.
 */

export type PlanId =
  | "free"
  | "gold"
  | "elite"
  | "familyGold"
  | "familyElite";

export const SUBSCRIPTION_PLANS: Record<
  PlanId,
  {
    id: PlanId;
    name: string;
    playerLimit: number;
    monthlyPrice: number;
    annualPrice: number;
    stripePriceIdMonthly?: string; // env: STRIPE_PRICE_*_MONTHLY
    stripePriceIdAnnual?: string;  // env: STRIPE_PRICE_*_ANNUAL
  }
> = {
  free: {
    id: "free",
    name: "Free Profile",
    playerLimit: 1,
    monthlyPrice: 0,
    annualPrice: 0,
  },
  gold: {
    id: "gold",
    name: "Gold Profile",
    playerLimit: 3, // per-player billing; pay for each child
    monthlyPrice: 3.99,
    annualPrice: 33.99,
    stripePriceIdMonthly: "STRIPE_PRICE_GOLD_MONTHLY",
    stripePriceIdAnnual: "STRIPE_PRICE_GOLD_ANNUAL",
  },
  elite: {
    id: "elite",
    name: "Elite Profile",
    playerLimit: 3, // per-player billing; pay for each child
    monthlyPrice: 5.99,
    annualPrice: 59.99,
    stripePriceIdMonthly: "STRIPE_PRICE_ELITE_MONTHLY",
    stripePriceIdAnnual: "STRIPE_PRICE_ELITE_ANNUAL",
  },
  familyGold: {
    id: "familyGold",
    name: "Family Gold",
    playerLimit: 6,
    monthlyPrice: 9.99,
    annualPrice: 99.99,
    stripePriceIdMonthly: "STRIPE_PRICE_FAMILY_GOLD_MONTHLY",
    stripePriceIdAnnual: "STRIPE_PRICE_FAMILY_GOLD_ANNUAL",
  },
  familyElite: {
    id: "familyElite",
    name: "Family Elite",
    playerLimit: 6,
    monthlyPrice: 14.99,
    annualPrice: 149.99,
    stripePriceIdMonthly: "STRIPE_PRICE_FAMILY_ELITE_MONTHLY",
    stripePriceIdAnnual: "STRIPE_PRICE_FAMILY_ELITE_ANNUAL",
  },
};

export const PLAN_IDS = Object.keys(SUBSCRIPTION_PLANS) as PlanId[];

export function getPlanById(planId: string | null | undefined) {
  const id = (planId ?? "free") as PlanId;
  return SUBSCRIPTION_PLANS[id] ?? SUBSCRIPTION_PLANS.free;
}

export function getPlayerLimit(planId: string | null | undefined): number {
  return getPlanById(planId).playerLimit;
}

export function getStripePriceId(
  planId: PlanId,
  billingPeriod: "monthly" | "annual"
): string | null {
  const plan = SUBSCRIPTION_PLANS[planId];
  if (!plan || planId === "free") return null;
  const envKey =
    billingPeriod === "monthly"
      ? plan.stripePriceIdMonthly
      : plan.stripePriceIdAnnual;
  if (!envKey) return null;
  return process.env[envKey] ?? null;
}

/**
 * Feature flags per subscription plan.
 * Free < Gold < Elite. FamilyGold = Gold features, FamilyElite = Elite features.
 */
import type { PlanId } from "./subscription";

export type { PlanId };

/** Minimum plan required for each feature. "gold" = Gold and above, "elite" = Elite only. */
export const PLAN_FEATURES: Record<string, PlanId | null> = {
  // Profile visibility (player shown to coaches/other parents)
  public_searchable: "gold",      // Free = view-only, not in public search
  full_last_name: "elite",        // Gold = first + last initial; Elite = full name
  level_visibility: "gold",       // Show level to others
  location_visibility: "elite",   // Show location to others
  social_media_links: "elite",    // Show social links on profile
  higher_stats: "elite",          // Goals, assists, etc. (position-based)

  // Contact & connection
  contact_requests: "gold",       // Parent–coach contact requests
  parent_contact_requests: "gold",// Parent–parent contact requests
  coach_ratings: "elite",         // Submit coach reviews
  coach_evaluations: "elite",     // Request coach to evaluate player (rating requests)

  // Facilities
  facility_reviews: "gold",       // Submit facility reviews (Gold+)
  submit_facilities: "free",      // Submit new facilities (admin-approved) - Free and above
};

const TIER_ORDER: PlanId[] = ["free", "gold", "elite", "familyGold", "familyElite"];

/** Map family plans to their base tier for feature checks. */
const FAMILY_TO_TIER: Record<PlanId, PlanId> = {
  free: "free",
  gold: "gold",
  elite: "elite",
  familyGold: "gold",
  familyElite: "elite",
};

export function getEffectiveTier(planId: string | null | undefined): PlanId {
  const id = (planId ?? "free") as PlanId;
  return FAMILY_TO_TIER[id] ?? "free";
}

export function hasFeature(
  planId: string | null | undefined,
  featureKey: keyof typeof PLAN_FEATURES
): boolean {
  const minPlan = PLAN_FEATURES[featureKey];
  if (!minPlan) return true; // No restriction
  const tier = getEffectiveTier(planId);
  const tierIdx = TIER_ORDER.indexOf(tier);
  const minIdx = TIER_ORDER.indexOf(minPlan as PlanId);
  return tierIdx >= minIdx;
}

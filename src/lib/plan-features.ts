/**
 * Plan feature helpers for masking player data and gating API access.
 */
import { hasFeature, type PlanId } from "@/constants/plan-features";

/** Mask a full name to first + last initial (e.g. "John Smith" -> "John S."). */
export function maskNameToFirstAndInitial(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  const first = parts[0] ?? "";
  const last = parts[parts.length - 1] ?? "";
  const initial = last.charAt(0).toUpperCase();
  return `${first} ${initial}.`;
}

export interface PlayerForMasking {
  name: string;
  level?: string | null;
  location?: string | null;
  socialLink?: string | null;
  goals?: number | null;
  assists?: number | null;
  plusMinus?: number | null;
  gaa?: number | null;
  savePct?: string | null;
}

/**
 * Apply plan-based masking to player data when viewed by someone without contact access.
 * Returns a copy of the player with fields masked based on the player's parent's plan.
 */
export function maskPlayerByPlan<T extends PlayerForMasking>(
  player: T,
  parentPlanId: string | null | undefined,
  hasContactAccess: boolean
): T {
  if (hasContactAccess) return { ...player };
  const planId = (parentPlanId ?? "free") as PlanId;

  const out = { ...player };

  // Name: Elite+ = full; Gold = first + last initial; Free = first + last initial (same as gold for consistency)
  if (!hasFeature(planId, "full_last_name")) {
    out.name = maskNameToFirstAndInitial(player.name);
  }

  // Level: Gold+ only
  if (!hasFeature(planId, "level_visibility")) {
    out.level = null;
  }

  // Location: Elite+ only
  if (!hasFeature(planId, "location_visibility")) {
    out.location = null;
  }

  // Social: Elite+ only
  if (!hasFeature(planId, "social_media_links")) {
    out.socialLink = null;
  }

  // Higher stats: Elite+ only
  if (!hasFeature(planId, "higher_stats")) {
    out.goals = null;
    out.assists = null;
    out.plusMinus = null;
    out.gaa = null;
    out.savePct = null;
  }

  return out as T;
}

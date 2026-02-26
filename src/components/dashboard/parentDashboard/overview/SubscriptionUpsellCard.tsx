"use client";

import { useSubscriptionFeatures } from "@/hooks/useSubscriptionFeatures";
import { hasFeature } from "@/constants/plan-features";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import type { PlanId } from "@/constants/subscription";

type FeatureKey = keyof typeof import("@/constants/plan-features").PLAN_FEATURES;

/** Match wording from SubscriptionPage exactly */
const ALL_FEATURES: { label: string; feature: FeatureKey }[] = [
  // Gold (from subscription page)
  { label: "Level visibility", feature: "level_visibility" },
  { label: "Training location reviews (read & write)", feature: "facility_reviews" },
  { label: "Contact requests between coaches and players", feature: "contact_requests" },
  // Elite (from subscription page)
  { label: "Full last name visibility", feature: "full_last_name" },
  { label: "Show Season Stats (Player & Goalie)", feature: "higher_stats" },
  { label: "Coach Ratings (Anonymously rate your coach)", feature: "coach_ratings" },
  { label: "Player Evaluations (Request private feedback)", feature: "coach_evaluations" },
  { label: "Social media links", feature: "social_media_links" },
];

export default function SubscriptionUpsellCard() {
  const { planId, loading } = useSubscriptionFeatures();

  if (loading) return null;

  const hasUpgradePath =
    planId === "free" ||
    planId === "gold" ||
    planId === "familyGold";

  if (!hasUpgradePath) return null;

  return (
    <div className="relative overflow-hidden mt-4 p-4 rounded-xl border-2 border-orange-500 bg-gradient-to-br from-amber-50/90 to-orange-50/70 dark:from-amber-950/30 dark:to-orange-950/20">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/scratched-metal.png')]" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Upgrade for more features
          </h4>
          <Button
            asChild
            size="sm"
            className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
          >
            <Link href="/subscription" className="flex items-center gap-1.5">
              View plans
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
          {ALL_FEATURES.map(({ label, feature }) => {
            const unlocked = hasFeature(planId as PlanId, feature);
            return (
              <li
                key={feature}
                className={cn(
                  "text-sm transition-colors",
                  unlocked
                    ? "text-slate-800 dark:text-slate-200"
                    : "text-slate-500 dark:text-slate-500"
                )}
              >
                {unlocked ? (
                  <span className="text-amber-600 dark:text-amber-500 mr-1.5">✓</span>
                ) : (
                  <span className="text-slate-400 dark:text-slate-600 mr-1.5">◦</span>
                )}
                {label}
              </li>
          );
        })}
        </ul>
      </div>
    </div>
  );
}

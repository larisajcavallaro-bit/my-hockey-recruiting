"use client";

import Link from "next/link";
import { useSubscriptionFeatures } from "@/hooks/useSubscriptionFeatures";
import { hasFeature as hasFeatureFn } from "@/constants/plan-features";

type FeatureKey = keyof typeof import("@/constants/plan-features").PLAN_FEATURES;

interface FeatureGateProps {
  feature: FeatureKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /** Show upgrade CTA when blocked */
  showUpgrade?: boolean;
  /** Override plan for check (e.g. this player's plan when editing) */
  planIdOverride?: string | null;
}

/** Match wording from SubscriptionPage */
const FEATURE_UPGRADE_MESSAGE: Record<FeatureKey, { plan: string; message: string }> = {
  public_searchable: { plan: "Gold", message: "Upgrade to Gold to make your profile searchable." },
  full_last_name: { plan: "Elite", message: "Upgrade to Elite for full last name visibility." },
  level_visibility: { plan: "Gold", message: "Upgrade to Gold for level visibility." },
  location_visibility: { plan: "Elite", message: "Upgrade to Elite for location visibility." },
  social_media_links: { plan: "Elite", message: "Upgrade to Elite for social media links." },
  higher_stats: { plan: "Elite", message: "Upgrade to Elite for Show Season Stats (Player & Goalie)." },
  contact_requests: { plan: "Gold", message: "Upgrade to Gold for contact requests between coaches and players." },
  parent_contact_requests: { plan: "Gold", message: "Upgrade to Gold for contact requests between parents." },
  coach_ratings: { plan: "Elite", message: "Upgrade to Elite for Coach Ratings (Anonymously rate your coach)." },
  coach_evaluations: { plan: "Elite", message: "Upgrade to Elite for Player Evaluations (Request private feedback)." },
  facility_reviews: { plan: "Gold", message: "Upgrade to Gold for reviews (View + Submit)." },
  submit_facilities: { plan: "Free", message: "Submit training is available on all plans." },
};

export default function FeatureGate({
  feature,
  children,
  fallback,
  showUpgrade = true,
  planIdOverride,
}: FeatureGateProps) {
  const { hasFeature, loading } = useSubscriptionFeatures();

  const checkFeature = (): boolean => {
    if (planIdOverride !== undefined && planIdOverride !== null) {
      return hasFeatureFn(planIdOverride, feature);
    }
    return hasFeature(feature);
  };

  if (loading && planIdOverride === undefined) {
    return fallback ?? null;
  }

  if (checkFeature()) {
    return <>{children}</>;
  }

  if (fallback) return <>{fallback}</>;

  if (showUpgrade) {
    const info = FEATURE_UPGRADE_MESSAGE[feature];
    return (
      <Link
        href="/subscription"
        className="text-sm text-orange-600 hover:text-orange-700 font-extrabold hover:underline"
      >
        {info?.message ?? "Upgrade your plan to use this feature."}
      </Link>
    );
  }

  return null;
}

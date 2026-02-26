"use client";

import { useEffect, useState } from "react";
import { hasFeature, type PlanId } from "@/constants/plan-features";

type FeatureKey = keyof typeof import("@/constants/plan-features").PLAN_FEATURES;

interface SubscriptionStatus {
  planId: string;
  planName: string;
  canAddPlayer: boolean;
}

export function useSubscriptionFeatures() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/subscription/status")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setStatus(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const checkFeature = (featureKey: FeatureKey): boolean => {
    if (!status?.planId) return false;
    return hasFeature(status.planId as PlanId, featureKey);
  };

  return {
    planId: status?.planId ?? "free",
    planName: status?.planName ?? "Free Profile",
    canAddPlayer: status?.canAddPlayer ?? true,
    hasFeature: checkFeature,
    loading,
  };
}

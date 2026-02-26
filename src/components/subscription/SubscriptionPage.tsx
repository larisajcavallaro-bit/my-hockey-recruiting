"use client";

import { FC, ReactNode, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import SubscriptionCard from "./SubscriptionCard";
import SubscriptionLasttwoCard from "./SubscriptionLasttwoCard";
import { useSubscriptionFeatures } from "@/hooks/useSubscriptionFeatures";
import {
  FreeTierIcon,
  GoldTierIcon,
  EliteTierIcon,
  FamilyGoldTierIcon,
  FamilyEliteTierIcon,
} from "./SubscriptionTierIcons";

interface Feature {
  name: string;
  included: boolean;
  subFeatures?: string[];
}

interface Plan {
  id: string;
  planName: string;
  icon: ReactNode;
  price: number | string;
  annualPrice?: number;
  period?: string;
  description: string;
  features: Feature[];
  buttonText: string;
  isPopular?: boolean;
  isFree?: boolean;
  isCurrentPlan?: boolean;
  badge?: string;
  savings?: string;
}

const SubscriptionPage: FC = () => {
  const { data: session, status } = useSession();
  const role = (session?.user as { role?: string })?.role;
  const isCoach = status === "authenticated" && role === "COACH";

  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly",
  );
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const { planId: currentPlanId } = useSubscriptionFeatures();

  if (isCoach) {
    return (
      <div className="bg-gray-50/50 py-6 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 max-w-xl text-center">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              COACH PROFILES ARE ALWAYS FREE
            </h1>
            <p className="text-gray-600">
              You don&apos;t need a subscription. Your coach profile has full access at no cost.
            </p>
          </div>
          <Link
            href="/coach-dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-button-clr1 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            Go to Coach Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const plans: Plan[] = [
    {
      id: "free",
      planName: "Free Profile",
      icon: <FreeTierIcon />,
      price: "Free",
      description: "Platform exploration only.",
      isFree: true,
      isCurrentPlan: currentPlanId === "free",
      features: [
        { name: "Profile photo", included: true },
        { name: "First name + last initial", included: true },
        { name: "Birth year", included: true },
        { name: "Current league name", included: true },
        { name: "Request to add training locations", included: true },
        {
          name: "View-only access to",
          included: true,
          subFeatures: [
            "Coach profiles (no limit)",
            "Training directory (no reviews)",
          ],
        },
      ],
      buttonText: "Start with Free",
    },
    {
      id: "gold",
      planName: "Gold Profile",
      icon: <GoldTierIcon />,
      price: 3.99,
      annualPrice: 33.99,
      period: "month",
      description: "Minimum profile with credibility and connection",
      savings: "$33.99 billed annually",
      features: [
        { name: "Everything in Free, plus", included: true },
        { name: "Level visibility", included: true },
        { name: "Coach verification eligibility", included: true },
        { name: "Training location reviews (read & write)", included: true },
        { name: "Review Schools & Programs", included: true },
        { name: "Contact requests between coaches and players", included: true },
      ],
      buttonText: "Start with Gold",
      isCurrentPlan: currentPlanId === "gold",
    },
    {
      id: "elite",
      planName: "Elite Profile",
      icon: <EliteTierIcon />,
      price: 5.99,
      annualPrice: 59.99,
      period: "month",
      description: "Maximum visibility, evaluation, and opportunity",
      savings: "$59.99 billed annually",
      isPopular: true,
      badge: "Most Popular",
      features: [
        { name: "Everything in Gold, plus", included: true },
        { name: "Full last name visibility", included: true },
        { name: "Show Season Stats (Player & Goalie)", included: true },
        { name: "Coach Ratings (Anonymously rate your coach)", included: true },
        { name: "Player Evaluations (Request private feedback)", included: true },
        { name: "Social media links", included: true },
        { name: "Highest priority on View Players page", included: true },
      ],
      buttonText: "Start with Elite",
      isCurrentPlan: currentPlanId === "elite",
    },
    {
      id: "familyGold",
      planName: "Family Gold",
      icon: <FamilyGoldTierIcon />,
      price: 9.99,
      annualPrice: 99.99,
      period: "month",
      description:
        "Perfect for getting started with basic profile visibility for up to 6 family members",
      savings: "$99.99 billed annually",
      features: [
        {
          name: "Includes all Gold features for up to 6 players",
          included: true,
        },
        { name: "Single payment, one account to manage", included: true },
        { name: "All Gold features for up to 6 players", included: true },
      ],
      buttonText: "Start with Family Gold",
      isCurrentPlan: currentPlanId === "familyGold",
    },
    {
      id: "familyElite",
      planName: "Family Elite",
      icon: <FamilyEliteTierIcon />,
      price: 14.99,
      annualPrice: 149.99,
      period: "month",
      description:
        "Perfect for full features for up to 6 players profiles managed under one family",
      savings: "$149.99 billed annually",
      features: [
        {
          name: "Includes all Elite features for up to 6 players",
          included: true,
        },
        { name: "Single payment, one account to manage", included: true },
        { name: "All Elite features for up to 6 players", included: true },
      ],
      buttonText: "Start with Family Elite",
      isCurrentPlan: currentPlanId === "familyElite",
    },
  ];

  const handlePlanSelect = async (planId: string) => {
    if (planId === "free") return;

    setLoadingPlanId(planId);
    try {
      const res = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billingPeriod }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to start checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <div className="bg-gray-50/50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Choose the Right Plan for Your Family
            </h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto mb-6">
              <strong>30 Days of Starter Access.</strong> Every family starts
              with <strong>30 days of Starter features</strong>, so you can
              explore the platform and see how it works for your player—no
              payment required. During your first 30 days, you will have access
              to Starter-level visibility and features.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setBillingPeriod("annual")}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  billingPeriod === "annual"
                    ? "bg-gray-200 text-gray-900"
                    : "bg-white text-gray-600 border border-gray-300"
                }`}
              >
                Annual (10% off)
              </button>
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  billingPeriod === "monthly"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 border border-gray-300"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          {/* Regular Plans (Free, Gold, Elite) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {plans.slice(0, 3).map((plan) => {
              const isAnnual = billingPeriod === "annual";
              const displayPrice =
                isAnnual && plan.annualPrice !== undefined
                  ? plan.annualPrice
                  : plan.price;
              const displayPeriod =
                isAnnual && plan.annualPrice !== undefined ? "year" : plan.period;
              const displaySavings =
                isAnnual && plan.annualPrice !== undefined
                  ? "Save 10% vs monthly"
                  : plan.savings;
              return (
                <SubscriptionCard
                  key={plan.id}
                  planName={plan.planName}
                  icon={plan.icon}
                  price={displayPrice}
                  period={displayPeriod}
                  description={plan.description}
                  features={plan.features}
                  buttonText={plan.buttonText}
                  isPopular={plan.isPopular}
                  isFree={plan.isFree}
                  isCurrentPlan={plan.isCurrentPlan}
                  badge={plan.badge}
                  savings={displaySavings}
                  onButtonClick={() => handlePlanSelect(plan.id)}
                  isLoading={loadingPlanId === plan.id}
                />
              );
            })}
          </div>

          {/* Family Plans (Centered, 2 columns) */}
          <div className="flex flex-col md:flex-row gap-6 w-full px-4 py-8">
            {plans.slice(3).map((plan) => {
              const isAnnual = billingPeriod === "annual";
              const displayPrice =
                isAnnual && plan.annualPrice !== undefined
                  ? plan.annualPrice
                  : plan.price;
              const displayPeriod =
                isAnnual && plan.annualPrice !== undefined ? "year" : plan.period;
              const displaySavings =
                isAnnual && plan.annualPrice !== undefined
                  ? "Save 10% vs monthly"
                  : plan.savings;
              return (
                <SubscriptionLasttwoCard
                  key={plan.id}
                  planName={plan.planName}
                  icon={plan.icon}
                  price={displayPrice}
                  period={displayPeriod}
                  description={plan.description}
                  features={plan.features}
                  buttonText={plan.buttonText}
                  savings={displaySavings}
                  onButtonClick={() => handlePlanSelect(plan.id)}
                  isLoading={loadingPlanId === plan.id}
                  isCurrentPlan={plan.isCurrentPlan}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;

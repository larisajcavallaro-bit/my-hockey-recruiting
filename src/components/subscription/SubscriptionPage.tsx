"use client";

import { FC, useState } from "react";
import SubscriptionCard from "./SubscriptionCard";
import SubscriptionLasttwoCard from "./SubscriptionLasttwoCard";

interface Feature {
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  planName: string;
  icon: string;
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
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly",
  );

  const plans: Plan[] = [
    {
      id: "free",
      planName: "Free Profile",
      icon: "👥",
      price: "Free",
      description: "Platform exploration only.",
      isFree: true,
      isCurrentPlan: true,
      features: [
        { name: "Profile photo", included: true },
        { name: "First name + last initial", included: true },
        { name: "Birth year", included: true },
        { name: "Current learn name", included: true },
        {
          name: "Student facilities (admin-approved required)",
          included: true,
        },
        { name: "View-only access to", included: true },
        { name: "Coach profiles (No limited)", included: true },
        { name: "Facilities directory (No reviews)", included: true },
        { name: "Exams (No limit)", included: true },
      ],
      buttonText: "Start with Free",
    },
    {
      id: "gold",
      planName: "Gold Profile",
      icon: "🥇",
      price: 3.99,
      annualPrice: 33.99,
      period: "month",
      description: "Minimum profile with credibility and connection",
      savings: "$33.99 billed annually",
      features: [
        { name: "Everything in Free, plus", included: true },
        { name: "Public searchable profile", included: true },
        {
          name: "First name + last initial (in full list name)",
          included: true,
        },
        { name: "Level visibility", included: true },
        { name: "Public profile visibility", included: true },
        { name: "Coach verification eligibility", included: true },
        { name: "Submit facilities (admin-approved)", included: true },
        { name: "Facility reviews (Graders + view)", included: true },
        { name: "Correct requests (player - coach)", included: true },
        { name: "Pro access", included: false },
        { name: "Coach ratings", included: false },
        { name: "Social media links", included: false },
      ],
      buttonText: "Start with Gold",
    },
    {
      id: "elite",
      planName: " Elite Profile",
      icon: "💎",
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
        { name: "Higher stats (position-based)", included: true },
        { name: "Coach ratings (aggregated-anonymous)", included: true },
        { name: "Coach evaluations (request-only)", included: true },
        { name: "Social media links", included: true },
        { name: "Highest priority in coach search results", included: true },
        {
          name: "Expanded profile visibility (location + level-content)",
          included: true,
        },
        { name: "Profile sharing", included: false },
        { name: "Advanced analytics", included: false },
      ],
      buttonText: "Start with Elite",
    },
    {
      id: "familyGold",
      planName: "Family Gold",
      icon: "👨‍👧‍👧",
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
    },
    {
      id: "familyElite",
      planName: "Family Elite",
      icon: "👩‍👩‍👦‍👦",
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
    },
  ];

  const handlePlanSelect = (planId: string) => {
    console.log(`Selected plan: ${planId}`);
    // Add your navigation or API call logic here
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

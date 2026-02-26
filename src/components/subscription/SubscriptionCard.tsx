"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { FC, ReactNode } from "react";

interface Feature {
  name: string;
  included: boolean;
  subFeatures?: string[];
}

interface SubscriptionCardProps {
  planName: string;
  icon: ReactNode;
  price: number | string;
  period?: string;
  description: string;
  features: Feature[];
  buttonText: string;
  isPopular?: boolean;
  isFree?: boolean;
  isCurrentPlan?: boolean;
  badge?: string;
  savings?: string;
  onButtonClick?: () => void;
  isLoading?: boolean;
}

const SubscriptionCard: FC<SubscriptionCardProps> = ({
  planName,
  icon,
  price,
  period = "month",
  description,
  features,
  buttonText,
  isPopular = false,
  isFree = false,
  isCurrentPlan = false,
  badge,
  savings,
  onButtonClick,
  isLoading = false,
}) => {
  return (
    <div
      className={`relative rounded-3xl p-6 transition-all duration-300 ${
        isCurrentPlan
          ? "bg-green-50 border-2 border-green-300"
          : isFree
            ? "border border-gray-200 bg-white shadow-md"
            : isPopular
              ? "border-2 border-blue-500 bg-white shadow-xl"
              : "border border-gray-200 bg-white shadow-md"
      }`}
    >
      {isCurrentPlan && (
        <div className="absolute -top-3 left-6 inline-block">
          <span className="inline-block rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
            {isFree ? "You are currently on the free plan" : `You are currently on the ${planName} plan`}
          </span>
        </div>
      )}

      <div className="mb-6 pt-2">
        {badge && !isCurrentPlan && (
          <div className="mb-3">
            <span className="inline-block rounded-full bg-blue-500 px-4 py-1 text-xs font-semibold text-white">
              {badge}
            </span>
          </div>
        )}
        <div className="flex items-start gap-2 mb-2">
          <span className="flex items-center justify-center">{icon}</span>
          <h3 className="text-xl font-bold text-gray-900">{planName}</h3>
        </div>
        <div className="mb-3 flex items-baseline gap-1">
          {typeof price === "number" ? (
            <>
              <span className="text-4xl font-bold text-gray-900">${price}</span>
              <span className="text-gray-600">/{period}</span>
            </>
          ) : (
            <span className="text-4xl font-bold text-gray-900">{price}</span>
          )}
        </div>
        {savings && (
          <p className="text-sm text-green-600 font-medium mb-2">{savings}</p>
        )}
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <Button
        onClick={onButtonClick}
        disabled={isLoading}
        className={`w-full mb-6 rounded-lg py-2.5 font-semibold transition-all ${
          isFree
            ? "hidden"
            : isPopular
              ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
              : "bg-gray-200 text-gray-900 hover:bg-gray-300"
        }`}
      >
        {isLoading ? "Redirecting..." : buttonText}
      </Button>

      <div className="space-y-2 border-t border-gray-200 pt-6">
        {features.map((feature, index) => (
          <div key={index}>
            <div className="flex items-start gap-3">
              {feature.included ? (
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
              ) : (
                <span className="mt-0.5 h-5 w-5 shrink-0 text-gray-300">-</span>
              )}
              <span
                className={`text-sm ${
                  feature.included ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {feature.name}
              </span>
            </div>
            {feature.subFeatures && feature.subFeatures.length > 0 && (
              <div className="ml-8 mt-1 space-y-1">
                {feature.subFeatures.map((sub, subIdx) => (
                  <div key={subIdx} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="shrink-0">•</span>
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionCard;

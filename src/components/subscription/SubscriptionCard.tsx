"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { FC } from "react";

interface Feature {
  name: string;
  included: boolean;
}

interface SubscriptionCardProps {
  planName: string;
  icon: string;
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
}) => {
  return (
    <div
      className={`relative rounded-3xl p-6 transition-all duration-300 ${
        isFree
          ? "bg-green-50 border-2 border-green-300"
          : isPopular
            ? "border-2 border-blue-500 bg-white shadow-xl"
            : "border border-gray-200 bg-white shadow-md"
      }`}
    >
      {isCurrentPlan && isFree && (
        <div className="absolute -top-3 left-6 inline-block">
          <span className="inline-block rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
            You are currently on the free plan
          </span>
        </div>
      )}

      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
          <span className="inline-block rounded-full bg-blue-500 px-4 py-1 text-xs font-semibold text-white">
            {badge}
          </span>
        </div>
      )}

      <div className="mb-6 pt-2">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-xl">{icon}</span>
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
        className={`w-full mb-6 rounded-lg py-2.5 font-semibold transition-all ${
          isFree
            ? "hidden"
            : isPopular
              ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
              : "bg-gray-200 text-gray-900 hover:bg-gray-300"
        }`}
      >
        {buttonText}
      </Button>

      <div className="space-y-2 border-t border-gray-200 pt-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
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
        ))}
      </div>
    </div>
  );
};

export default SubscriptionCard;

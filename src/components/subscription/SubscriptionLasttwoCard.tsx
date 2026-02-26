"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { FC, ReactNode } from "react";

interface Feature {
  name: string;
  included: boolean;
  subFeatures?: string[];
}

interface SubscriptionLasttwoCardProps {
  planName: string;
  price: number | string;
  icon: ReactNode;
  period?: string;
  description: string;
  features: Feature[];
  buttonText: string;
  savings?: string;
  onButtonClick?: () => void;
  isLoading?: boolean;
  isCurrentPlan?: boolean;
}

const SubscriptionLasttwoCard: FC<SubscriptionLasttwoCardProps> = ({
  planName,
  icon,
  price,
  period = "month",
  description,
  features,
  buttonText,
  savings,
  onButtonClick,
  isLoading = false,
  isCurrentPlan = false,
}) => {
  return (
    <div
      className={`relative flex flex-col w-full h-full rounded-3xl p-6 transition-all duration-300 ${
        isCurrentPlan
          ? "border-2 border-green-300 bg-green-50 shadow-md"
          : "border border-gray-300 bg-white shadow-md hover:shadow-lg"
      }`}
    >
      {isCurrentPlan && (
        <div className="absolute -top-3 left-6 inline-block">
          <span className="inline-block rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
            You are currently on the {planName} plan
          </span>
        </div>
      )}
      {/* Header Section */}

      <div className="flex flex-col sm:flex-col lg:flex-row w-full gap-6 sm:gap-10 items-stretch sm:items-start">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span role="img" aria-label="plan icon" className="flex items-center justify-center">
              {icon}
            </span>
            <h3 className="text-xl font-bold text-gray-900">{planName}</h3>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-gray-900">
              {typeof price === "number" ? `$${price}` : price}
            </span>
            {typeof price === "number" && (
              <span className="text-gray-600">/{period}</span>
            )}
          </div>

          {savings && (
            <p className="text-sm text-green-600 font-semibold mt-1">
              {savings}
            </p>
          )}
        </div>

        {/* Description & Features */}
        <div className="flex-grow space-y-4 mb-8 border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>

          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index}>
                <div className="flex items-start gap-3 text-sm">
                  {feature.included ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  ) : (
                    <span className="mt-0.5 h-4 w-4 shrink-0 text-gray-300 flex justify-center">
                      -
                    </span>
                  )}
                  <span
                    className={
                      feature.included
                        ? "text-gray-700"
                        : "text-gray-400 line-through decoration-gray-300"
                    }
                  >
                    {feature.name}
                  </span>
                </div>
                {feature.subFeatures && feature.subFeatures.length > 0 && (
                  <div className="ml-7 mt-1 space-y-1">
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
      </div>
      {/* Action Button */}
      <Button
        onClick={onButtonClick}
        disabled={isLoading}
        className="bg-gray-200 text-gray-900 hover:bg-gray-300"
      >
        {isLoading ? "Redirecting..." : buttonText}
      </Button>
    </div>
  );
};

export default SubscriptionLasttwoCard;

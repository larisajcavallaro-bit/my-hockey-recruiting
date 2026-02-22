"use client";

import React, { useState } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function SubscriptionSettings() {
  const [subscription] = useState({
    packageLevel: "Elite",
    monthlyPrice: 33.33,
    clientLimit: "3 profile",
    nextBillingDate: "Apr 1, 2026",
    status: "Active",
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
        Subscription & Billing
      </h2>

      <p className="text-sm sm:text-base text-sub-text3/90 mb-6 sm:mb-8">
        Manage your subscription and billing preferences
      </p>

      {/* Current Package Card */}
      <div className="bg-slate-700/50 rounded-2xl p-4 sm:p-6 border border-slate-600/30">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
          <h3 className="text-base sm:text-xl font-semibold text-white">
            Current Package Level :{" "}
            <span className="text-blue-400">{subscription.packageLevel}</span>
          </h3>

          <Badge className="w-fit bg-green-600 text-white hover:bg-green-700">
            {subscription.status}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Monthly Cost */}
          <div className="bg-slate-600/50 rounded-lg p-4">
            <p className="text-xs sm:text-sm text-slate-400 mb-1 sm:mb-2">
              Monthly Cost
            </p>
            <p className="text-xl sm:text-2xl font-bold text-white">
              ${subscription.monthlyPrice.toFixed(2)}
            </p>
          </div>

          {/* Client Limit */}
          <div className="bg-slate-600/50 rounded-lg p-4">
            <p className="text-xs sm:text-sm text-slate-400 mb-1 sm:mb-2">
              Client Limit
            </p>
            <p className="text-xl sm:text-2xl font-bold text-white">
              {subscription.clientLimit}
            </p>
          </div>

          {/* Next Billing Date */}
          <div className="bg-slate-600/50 rounded-lg p-4">
            <p className="text-xs sm:text-sm text-slate-400 mb-1 sm:mb-2">
              Next Billing Date
            </p>
            <p className="text-xl sm:text-2xl font-bold text-white">
              {subscription.nextBillingDate}
            </p>
          </div>
        </div>

        {/* Action */}
        <Button
          asChild
          className=" bg-button-clr1 hover:bg-button-clr1/20 text-white font-semibold px-6 py-2.5 flex flex-row-reverse items-center gap-2 transition-all shadow-lg shadow-orange-500/20"
        >
          <Link
            href="/parent-dashboard/setting/manageBilling"
            className="w-min flex items-center gap-2"
          >
            <CreditCard className="h-4 w-4" />
            <span>Manage Billing</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

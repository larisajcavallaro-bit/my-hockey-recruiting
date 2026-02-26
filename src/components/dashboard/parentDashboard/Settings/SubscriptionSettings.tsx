"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";

interface PlayerPlanInfo {
  id: string;
  name: string;
  planId: string;
  planName: string;
  monthlyPrice: number;
  stripeSubscriptionId: string | null;
  subscriptionStatus: string | null;
  periodEndAt: string | null;
  hasOwnBilling: boolean;
}

interface SubscriptionData {
  planId: string;
  planName: string;
  playerLimit: number;
  currentPlayerCount: number;
  canAddPlayer: boolean;
  status: string | null;
  periodEndAt: string | null;
  monthlyPrice: number;
  players?: PlayerPlanInfo[];
}

export default function SubscriptionSettings() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch("/api/subscription/status");
        if (res.ok) {
          const data = await res.json();
          setSubscription(data);
        } else {
          setSubscription({
            planId: "free",
            planName: "Free Profile",
            playerLimit: 1,
            currentPlayerCount: 0,
            canAddPlayer: true,
            status: "free",
            periodEndAt: null,
            monthlyPrice: 0,
            players: [],
          });
        }
      } catch {
        setSubscription({
          planId: "free",
          planName: "Free Profile",
          playerLimit: 1,
          currentPlayerCount: 0,
          canAddPlayer: true,
          status: "free",
          periodEndAt: null,
          monthlyPrice: 0,
          players: [],
        });
      } finally {
        setLoading(false);
      }
    }
    fetchSubscription();
  }, []);

  const handleManageBilling = async (subscriptionId?: string | null) => {
    setPortalLoading(subscriptionId ?? "default");
    try {
      const res = await fetch("/api/subscription/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          subscriptionId ? { subscriptionId } : {}
        ),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error ?? "No billing account");
      }
    } catch {
      toast.error("Failed to open billing");
    } finally {
      setPortalLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const sub = subscription ?? {
    planId: "free",
    planName: "Free Profile",
    status: "free",
    monthlyPrice: 0,
    playerLimit: 1,
    currentPlayerCount: 0,
    canAddPlayer: true,
    periodEndAt: null,
    players: [] as PlayerPlanInfo[],
  };

  const players = sub.players ?? [];
  const statusLabel = (s: string | null) =>
    s === "free"
      ? "Free"
      : s === "active" || s === "trialing"
        ? "Active"
        : s ?? "Free";

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
        Subscription & Billing
      </h2>

      <p className="text-sm sm:text-base text-sub-text3/90 mb-6 sm:mb-8">
        Manage your subscription and billing preferences
      </p>

      {/* Player Limit Card - Top */}
      <div className="bg-slate-700/50 rounded-2xl p-4 sm:p-6 border border-slate-600/30">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-5 h-5 text-blue-400" />
          <h3 className="text-base sm:text-lg font-semibold text-white">
            Player Limit
          </h3>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-white">
          {sub.currentPlayerCount} / {sub.playerLimit} profile
          {sub.playerLimit !== 1 ? "s" : ""}
        </p>
        {!sub.canAddPlayer && sub.planId !== "familyGold" && sub.planId !== "familyElite" && (
          <p className="text-sm text-slate-400 mt-2">
            <Link
              href="/subscription"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Upgrade to Family
            </Link>{" "}
            for up to 6 players
          </p>
        )}
      </div>

      {/* Per-child cards */}
      {players.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-white">
            Child profiles
          </h3>
          <div className="space-y-3">
            {players.map((player) => {
              const canManage =
                player.stripeSubscriptionId &&
                ["active", "trialing"].includes(
                  player.subscriptionStatus ?? ""
                );
              const isLoading = portalLoading === player.stripeSubscriptionId;

              return (
                <div
                  key={player.id}
                  className="bg-slate-700/50 rounded-2xl p-4 sm:p-6 border border-slate-600/30"
                >
                  {/* Header - larger, like before */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
                    <h3 className="text-base sm:text-xl font-semibold text-white">
                      {player.name} — Current Package Level:{" "}
                      <span className="text-blue-400">{player.planName}</span>
                    </h3>
                    <Badge
                      className={`w-fit shrink-0 ${
                        statusLabel(player.subscriptionStatus) === "Active" ||
                        statusLabel(player.subscriptionStatus) === "Free"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-amber-600 text-white hover:bg-amber-700"
                      }`}
                    >
                      {statusLabel(player.subscriptionStatus)}
                    </Badge>
                  </div>

                  {/* Stats grid - Monthly Cost + Next Billing Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
                    <div className="bg-slate-600/50 rounded-lg p-4">
                      <p className="text-xs sm:text-sm text-slate-400 mb-1 sm:mb-2">
                        Monthly Cost
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-white">
                        ${player.monthlyPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-slate-600/50 rounded-lg p-4">
                      <p className="text-xs sm:text-sm text-slate-400 mb-1 sm:mb-2">
                        {player.subscriptionStatus === "free"
                          ? "Renewal"
                          : "Next Billing Date"}
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-white">
                        {player.periodEndAt
                          ? format(new Date(player.periodEndAt), "MMM d, yyyy")
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-600/50">
                    {canManage ? (
                      <Button
                        onClick={() =>
                          handleManageBilling(player.stripeSubscriptionId)
                        }
                        disabled={!!portalLoading}
                        className="bg-button-clr1 hover:bg-button-clr1/20 text-white font-semibold px-6 py-2.5 flex items-center gap-2 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CreditCard className="h-4 w-4" />
                        )}
                        Manage Billing
                      </Button>
                    ) : (
                      <Button
                        asChild
                        className="bg-button-clr1 hover:bg-button-clr1/20 text-white font-semibold px-6 py-2.5"
                      >
                        <Link href="/subscription">Upgrade</Link>
                      </Button>
                    )}
                    <Button
                      asChild
                      variant="outline"
                      className="border-slate-500 text-blue-500 hover:text-blue-400 hover:bg-slate-600/50 hover:border-slate-400"
                    >
                      <Link href="/subscription">
                        {player.planId === "free" ? "View plans" : "Change plan"}
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-slate-700/50 rounded-2xl p-6 border border-slate-600/30 text-center">
          <p className="text-slate-400 mb-4">
            Add a player from your profile to see their subscription options.
          </p>
          <Button asChild>
            <Link href="/parent-dashboard/profile">Go to Profile</Link>
          </Button>
        </div>
      )}

      {/* Legacy: single Manage Billing when no per-player breakdown (e.g. all free) */}
      {players.length === 0 && sub.status !== "free" && sub.planId !== "free" && (
        <div className="bg-slate-700/50 rounded-2xl p-4 sm:p-6 border border-slate-600/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-white">
                Current Package Level:{" "}
                <span className="text-blue-400">{sub.planName}</span>
              </h3>
              <p className="text-sm text-slate-400">
                ${sub.monthlyPrice.toFixed(2)}/month
              </p>
            </div>
            <Button
              onClick={() => handleManageBilling()}
              disabled={!!portalLoading}
              className="bg-button-clr1 hover:bg-button-clr1/20 text-white font-semibold px-6 py-2.5 flex items-center gap-2"
            >
              {portalLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              Manage Billing
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

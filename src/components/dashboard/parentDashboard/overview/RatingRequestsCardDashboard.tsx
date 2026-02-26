"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Clock, CheckCircle, ExternalLink, Star } from "lucide-react";
import Image from "next/image";
import FeatureGate from "@/components/subscription/FeatureGate";

interface RatingRequestItem {
  id: string;
  playerId: string;
  playerName: string | null;
  coachProfileId: string;
  coachName: string;
  coachImage: string | null;
  status: string;
  playerReviewId: string | null;
  createdAt: string;
}

const RatingRequestsCardDashboard = () => {
  const [requests, setRequests] = useState<RatingRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchRequests = () => {
    setLoading(true);
    fetch("/api/rating-requests")
      .then((r) => (r.ok ? r.json() : { requests: [] }))
      .then((data) => {
        setRequests(
          (data.requests ?? []).map((r: Record<string, unknown>) => ({
            id: r.id,
            playerId: r.playerId,
            playerName: r.playerName ?? null,
            coachProfileId: r.coachProfileId,
            coachName: r.coachName ?? "Coach",
            coachImage: r.coachImage ?? null,
            status: r.status ?? "pending",
            playerReviewId: r.playerReviewId ?? null,
            createdAt: r.createdAt ?? "",
          }))
        );
      })
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void Promise.resolve().then(() => fetchRequests());
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
  };

  const renderRequest = (req: RatingRequestItem) => (
    <Card key={req.id} className="bg-secondary-foreground/10">
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-slate-200">
              <Image
                src={req.coachImage ?? "/newasset/parent/coaches/coaches.png"}
                alt={req.coachName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-sm">{req.coachName}</h3>
              <p className="text-black/50 text-xs">
                {req.playerName ?? "Player"} • Requested {formatDate(req.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {req.status === "pending" && (
              <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                <Clock className="w-3.5 h-3.5" />
                Pending
              </span>
            )}
            {req.status === "completed" && (
              <Link
                href={`/parent-dashboard/players/${req.playerId}`}
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Completed
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 mt-10">
      <div className="mb-6 bg-[#E5E7EB]/50 p-4 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-md font-semibold text-foreground flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-600" />
            Rating Requests
          </h2>

          <div className="flex items-center gap-2">
            <FeatureGate
              feature="coach_evaluations"
              fallback={
                <span className="text-xs text-orange-600 font-extrabold">Upgrade to Elite for Player Evaluations (Request private feedback)</span>
              }
            >
              <Button variant="outline" size="sm" asChild>
                <Link href="/parent-dashboard/rating">Request Rating</Link>
              </Button>
            </FeatureGate>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Show All
                </Button>
              </DialogTrigger>

            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>All Rating Requests</DialogTitle>
              </DialogHeader>

              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                {loading ? (
                  <p className="text-muted-foreground text-sm py-4">Loading...</p>
                ) : requests.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4">
                    No rating requests yet. Request coaches to rate your player from the Coach
                    Ratings & Requests page.
                  </p>
                ) : (
                  requests.map(renderRequest)
                )}
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <p className="text-muted-foreground text-sm py-2">Loading...</p>
          ) : requests.length === 0 ? (
            <p className="text-muted-foreground text-sm py-2">
              No rating requests. Request a coach rating from the Coach Ratings page.
            </p>
          ) : (
            requests.slice(0, 3).map(renderRequest)
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingRequestsCardDashboard;

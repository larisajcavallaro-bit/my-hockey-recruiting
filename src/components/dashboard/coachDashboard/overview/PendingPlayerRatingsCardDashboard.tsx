"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import { PlayerRequestRow } from "@/components/dashboard/coachDashboard/Ratings/PlayerRequestRow";
import { RatingModal } from "@/components/dashboard/coachDashboard/Ratings/RatingModal";

interface RatingRequestItem {
  id: string;
  playerId: string;
  playerName: string | null;
  requesterName: string;
  status: string;
  createdAt: string;
}

function formatRequested(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

export default function PendingPlayerRatingsCardDashboard() {
  const [requests, setRequests] = useState<RatingRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RatingRequestItem | null>(null);

  const fetchRequests = () => {
    fetch("/api/rating-requests?status=pending")
      .then((r) => (r.ok ? r.json() : { requests: [] }))
      .then((data) =>
        setRequests(
          (data.requests ?? []).map((r: Record<string, unknown>) => ({
            id: r.id,
            playerId: r.playerId,
            playerName: r.playerName ?? "Player",
            requesterName: r.requesterName ?? "Parent",
            status: r.status ?? "pending",
            createdAt: r.createdAt ?? "",
          }))
        )
      )
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const pending = requests.filter((r) => r.status === "pending");

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Pending Player Ratings
          </h2>
          <p className="text-sm text-sub-text1/60">
            Parents requesting your evaluation of their player
          </p>
        </div>

        <Button asChild variant="outline" size="sm">
          <Link href="/coach-dashboard/rating" className="flex items-center gap-1">
            Submit Ratings <ChevronRight size={16} />
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-muted-foreground text-sm py-4">Loading…</p>
        ) : pending.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm bg-white/20 rounded-xl border border-dashed border-white/30">
            <Star className="w-10 h-10 mx-auto mb-2 text-slate-400/60" />
            <p>No pending rating requests</p>
            <p className="text-xs mt-1">
              When parents request a player evaluation, they&apos;ll appear here.
            </p>
          </div>
        ) : (
          pending.slice(0, 3).map((req) => (
            <PlayerRequestRow
              key={req.id}
              name={req.playerName ?? "Player"}
              requester={req.requesterName}
              requestedDate={formatRequested(req.createdAt)}
              onRateClick={() => setSelectedRequest(req)}
            />
          ))
        )}
      </div>

      {pending.length > 3 && (
        <Link
          href="/coach-dashboard/rating"
          className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all {pending.length} pending →
        </Link>
      )}

      <RatingModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onSuccess={() => {
          setSelectedRequest(null);
          fetchRequests();
        }}
        playerId={selectedRequest?.playerId ?? ""}
        playerName={selectedRequest?.playerName ?? ""}
      />
    </div>
  );
}

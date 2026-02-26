"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import FeatureGate from "@/components/subscription/FeatureGate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RatingCard,
  type CoachRating,
} from "@/components/dashboard/parentDashboard/Ratings/RatingCard";
import { RatingRequestModal } from "@/components/dashboard/parentDashboard/Ratings/RatingRequestModal";
import Image from "next/image";

function formatRequestedDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

export default function RatingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ratings, setRatings] = useState<CoachRating[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRatings = () => {
    setLoading(true);
    fetch("/api/rating-requests")
      .then((r) => (r.ok ? r.json() : { requests: [] }))
      .then((data) => {
        const requests = data.requests ?? [];
        setRatings(
          requests.map((r: Record<string, unknown>) => {
            const createdAt = r.createdAt as string;
            const d = new Date(createdAt);
            const now = new Date();
            const diffDays = Math.floor(
              (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
            );
            return {
              id: r.id as string,
              playerId: r.playerId as string | undefined,
              coachName: r.coachName as string,
              playerName: r.playerName as string,
              coachImage:
                (r.coachImage as string) ??
                "/newasset/parent/coaches/coaches.png",
              requestedDate: formatRequestedDate(createdAt),
              daysAgo: diffDays,
              status: (r.status as "pending" | "completed") ?? "pending",
            };
          })
        );
      })
      .catch(() => setRatings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void Promise.resolve().then(() => fetchRatings());
  }, []);

  const filteredRatings = ratings.filter((rating) =>
    rating.playerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-black-900 mb-2">
            Coach Ratings & Requests
          </h1>
          <p className="text-sub-text1/80 font-medium">
            Track and manage your child&apos;s feedback requests
          </p>
        </div>

        <FeatureGate
          feature="coach_evaluations"
          fallback={
            <p className="text-sm text-orange-600 font-extrabold">
              Upgrade to Elite for Player Evaluations (Request private feedback).
            </p>
          }
        >
          <Button
            className="bg-button-clr1 hover:bg-blue-700 text-white font-semibold px-4 py-2.5"
            onClick={() => setIsModalOpen(true)}
          >
            + Request New Rating
          </Button>
        </FeatureGate>
      </div>

      {/* Search & Avatars Section */}
      <div className="p-6 rounded-[32px] bg-[#E5E7EB]/50 border mb-8">
        <div className="flex items-center gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3 h-4 w-4 text-sub-text1" />
            <Input
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 bg-white text-sub-text1 placeholder:text-gray-500 rounded-xl border-2 border-button-clr1 focus-visible:ring-2 focus-visible:ring-button-clr1"
            />
          </div>

          {/* Coach Avatars */}
          <div className="flex -space-x-3">
            {ratings.slice(0, 3).map((rating, idx) => (
              <div
                key={idx}
                className="relative w-10 h-10 rounded-full border-2 border-slate-600 overflow-hidden flex-shrink-0 hover:z-10"
              >
                <Image
                  src={rating.coachImage}
                  alt={rating.coachName}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            ))}
            {ratings.length > 3 && (
              <div className="relative w-10 h-10 rounded-full border-2 border-slate-600 bg-slate-600 flex items-center justify-center text-xs text-white font-bold">
                +{ratings.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ratings List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-12 text-sub-text1">Loading...</p>
        ) : filteredRatings.length > 0 ? (
          filteredRatings.map((rating) => (
            <RatingCard key={rating.id} rating={rating} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-white text-lg">
              No ratings found. Request a coach to rate your player above.
            </p>
          </div>
        )}
      </div>

      {/* Rating Request Modal */}
      <RatingRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchRatings}
      />
    </div>
  );
}

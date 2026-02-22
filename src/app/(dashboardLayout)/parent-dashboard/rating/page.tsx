"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RatingCard,
  type CoachRating,
} from "@/components/dashboard/parentDashboard/Ratings/RatingCard";
import { RatingRequestModal } from "@/components/dashboard/parentDashboard/Ratings/RatingRequestModal";
import Image from "next/image";

export default function RatingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ratings] = useState<CoachRating[]>([
    {
      id: "1",
      coachName: "Coach Sarah Jenkins",
      playerName: "Leo Junior",
      coachImage: "/newasset/parent/coaches/coaches.png",
      requestedDate: "2 days ago",
      daysAgo: 2,
      status: "waiting",
    },
    {
      id: "2",
      coachName: "Coach Sarah Jenkins",
      playerName: "Leo Junior",
      coachImage: "/newasset/event/demoLogo1.png",
      requestedDate: "2 days ago",
      daysAgo: 2,
      status: "waiting",
    },
    {
      id: "3",
      coachName: "Coach Sarah Jenkins",
      playerName: "Leo Junior",
      coachImage: "/newasset/parent/coaches/coaches.png",
      requestedDate: "2 days ago",
      daysAgo: 2,
      status: "waiting",
    },
    {
      id: "4",
      coachName: "Coach Sarah Jenkins",
      playerName: "Larisa Junior",
      coachImage: "/newasset/parent/coaches/coaches.png",
      requestedDate: "2 days ago",
      daysAgo: 2,
      status: "waiting",
    },
  ]);

  const filteredRatings = ratings.filter((rating) =>
    rating.playerName.toLowerCase().includes(searchQuery.toLowerCase()),
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
            Track and manage your child's feedback requests
          </p>
        </div>

        <Button
          className="bg-button-clr1 hover:bg-blue-700 text-white font-semibold px-4 py-2.5"
          onClick={() => setIsModalOpen(true)}
        >
          + Request New Rating
        </Button>
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
                  fill
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
        {filteredRatings.length > 0 ? (
          filteredRatings.map((rating) => (
            <RatingCard key={rating.id} rating={rating} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No ratings found</p>
          </div>
        )}
      </div>

      {/* Rating Request Modal */}
      <RatingRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

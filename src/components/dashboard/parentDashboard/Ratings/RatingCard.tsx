"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface CoachRating {
  id: string;
  playerId?: string;
  coachName: string;
  playerName: string;
  coachImage: string;
  requestedDate: string;
  daysAgo: number;
  status: "waiting" | "completed" | "pending";
}

interface RatingCardProps {
  rating: CoachRating;
}

const statusStyles: Record<string, { badge: string; icon: typeof Clock; label: string }> = {
  waiting: {
    badge: "bg-yellow-400 text-yellow-900",
    icon: AlertCircle,
    label: "Waiting for Review",
  },
  completed: {
    badge: "bg-green-500 text-white",
    icon: CheckCircle,
    label: "Completed",
  },
  pending: {
    badge: "bg-amber-100 text-amber-800 border border-amber-200",
    icon: Clock,
    label: "Pending",
  },
};

export const RatingCard = ({ rating }: RatingCardProps) => {
  const statusConfig = statusStyles[rating.status] ?? statusStyles.pending;
  const StatusIcon = statusConfig.icon;

  const statusBadge =
    rating.status === "completed" && rating.playerId ? (
      <Link
        href={`/parent-dashboard/players/${rating.playerId}`}
        className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 whitespace-nowrap rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors text-[10px] sm:text-xs font-semibold"
      >
        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        Completed - View Review
      </Link>
    ) : (
      <Badge
        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 whitespace-nowrap ${statusConfig.badge}`}
      >
        <StatusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="text-[10px] sm:text-xs font-semibold">
          {statusConfig.label}
        </span>
      </Badge>
    );

  return (
    <Card className="border-none bg-slate-700/60 hover:bg-slate-700/80 transition-all overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          {/* Left: Coach Info */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
              <Image
                src={rating.coachImage ?? "/newasset/parent/coaches/coaches.png"}
                alt={rating.coachName}
                fill
                className="rounded-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <h3 className="text-white font-bold text-sm sm:text-base md:text-lg truncate">
                {rating.coachName}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm truncate">
                Player | {rating.playerName}
              </p>
            </div>
          </div>

          {/* Right: Status & Time */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="text-left sm:text-right">
              <p className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-wide font-semibold">
                ⏱ Requested
              </p>
              <p className="text-slate-300 text-xs sm:text-sm">
                {rating.requestedDate}
              </p>
            </div>

            {statusBadge}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingCard;

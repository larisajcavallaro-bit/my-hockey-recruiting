"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, CalendarDays, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// 1. Updated Interface for Hockey Recruiting Data
export default function OverviewHeading({
  data = {
    userName: "Sarah",
    activePlayers: 2,
    upcomingEvents: 3,
    pendingRequests: 5,
  },
}: {
  data?: {
    userName: string;
    activePlayers: number;
    upcomingEvents: number;
    pendingRequests: number;
  };
}) {
  return (
    <div className="w-full space-y-6">
      {/* Welcome Banner - Matching the white ice-texture feel */}
      <div className="relative overflow-hidden p-8">
        {/* Optional: Add a CSS background image/pattern here to mimic the ice scratches */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {data.userName}
          </h2>
          <p className="text-sub-text1/80 font-medium">
            Helping you navigate your player&apos;s journey with clarity and
            confidence.
          </p>
        </div>
      </div>

      {/* Stats Grid - Matching the dark textured cards in the screenshot */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Active Players"
          number={data.activePlayers}
          icon={<Users className="w-6 h-6 text-blue-600" />}
        />
        <StatCard
          title="Upcoming Events"
          number={data.upcomingEvents}
          icon={<CalendarDays className="w-6 h-6 text-blue-600" />}
        />
        <StatCard
          title="Pending Rating Requests"
          number={data.pendingRequests}
          icon={<Star className="w-6 h-6 text-blue-600" />}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  number,
  icon,
}: {
  title: string;
  number: string | number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="relative overflow-hidden border-none bg-secondary-foreground/40 text-sub-text1/90">
      {/* Texture Overlay Placeholder */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/scratched-metal.png')]" />

      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-sub-text1/90">
              {title}
            </span>
            <div className="text-5xl font-bold text-sub-text1/90">{number}</div>
          </div>

          {/* Icon Container - Matching the light blue rounded square */}
          <div className="bg-blue-50 p-3 rounded-xl shadow-inner">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

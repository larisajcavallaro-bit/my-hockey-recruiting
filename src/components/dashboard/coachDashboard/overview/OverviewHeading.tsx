"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, CalendarDays, Star } from "lucide-react";

export default function OverviewHeading({
  data = {
    userName: "Coach",
    activePlayers: 12,
    upcomingEvents: 2,
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
      {/* Welcome Banner - Updated text to match image exactly */}
      <div className="relative overflow-hidden p-8">
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-slate-900 mb-2">
            Welcome back, {data.userName}
          </h2>
          <p className="text-sub-text1/80 text-lg">
            Here&apos;s what&apos;s happening with your recruiting today
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8">
        <StatCard
          title="Team Members"
          number={data.activePlayers}
          subtext="Active team"
          icon={<Users className="w-8 h-8 text-sub-text2" />}
        />
        <StatCard
          title="Upcoming Events"
          number={data.upcomingEvents}
          subtext="This month"
          icon={<CalendarDays className="w-8 h-8 text-sub-text2" />}
        />
        <StatCard
          title="Pending Rating Requests"
          number={data.pendingRequests}
          subtext="Rating Request"
          icon={<Star className="w-8 h-8 text-sub-text2" />}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  number,
  subtext,
  icon,
}: {
  title: string;
  number: string | number;
  subtext: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="relative overflow-hidden border-none bg-secondary-foreground/40">
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/scratched-metal.png')]" />

      <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sub-text1 mb-2">
              {title}
            </span>
            <span className="text-6xl font-bold text-slate-900 leading-tight">
              {number}
            </span>
            <span className="text-sm text-sub-text1 mt-1">{subtext}</span>
          </div>

          {/* White icon container from the image */}
          <div className="bg-white/90 p-3 rounded-2xl shadow-sm">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

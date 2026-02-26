"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CalendarDays, Star } from "lucide-react";

export default function OverviewHeading({
  data = {
    userName: "Coach",
    activePlayers: 0,
    upcomingEvents: 0,
    pendingRequests: 0,
  },
}: {
  data?: {
    userName?: string;
    activePlayers?: number;
    upcomingEvents?: number;
    pendingRequests?: number;
  };
}) {
  const { data: session } = useSession();
  const coachProfileId = (session?.user as { coachProfileId?: string | null })?.coachProfileId;

  const [userName, setUserName] = useState(data.userName ?? "Coach");
  const [activePlayers, setActivePlayers] = useState(data.activePlayers ?? 0);
  const [upcomingEvents, setUpcomingEvents] = useState(data.upcomingEvents ?? 0);
  const [pendingRequests, setPendingRequests] = useState(data.pendingRequests ?? 0);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((profile) => {
        if (profile?.name) {
          const firstName = profile.name.trim().split(/\s+/)[0] || profile.name;
          setUserName(firstName);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!coachProfileId) return;
    fetch(`/api/coaches/${coachProfileId}/roster`)
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        const verified = res?.verified ?? [];
        setActivePlayers(verified.length);
      })
      .catch(() => {});
  }, [coachProfileId]);

  useEffect(() => {
    fetch("/api/events/upcoming")
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => setUpcomingEvents(res?.count ?? 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/rating-requests")
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => setPendingRequests(res?.pendingCount ?? 0))
      .catch(() => {});
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Welcome Banner - Updated text to match image exactly */}
      <div className="relative overflow-hidden p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-slate-900 mb-2">
            Welcome back, {userName}
          </h2>
          <p className="text-sub-text1/80 text-lg">
            Here&apos;s what&apos;s happening with your recruiting today
          </p>
        </div>
        <p className="shrink-0 text-sm font-semibold text-green-700 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
          COACH PROFILES ARE ALWAYS FREE — no subscription needed.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8">
        <StatCard
          title="Team Members"
          number={activePlayers}
          subtext="Verified roster"
          icon={<Users className="w-8 h-8 text-sub-text2" />}
        />
        <StatCard
          title="Upcoming Events"
          number={upcomingEvents}
          subtext="This month"
          icon={<CalendarDays className="w-8 h-8 text-sub-text2" />}
        />
        <StatCard
          title="Pending Rating Requests"
          number={pendingRequests}
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

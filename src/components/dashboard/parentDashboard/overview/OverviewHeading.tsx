"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CalendarDays, Star } from "lucide-react";
// 1. Updated Interface for Hockey Recruiting Data
export default function OverviewHeading({
  data = {
    userName: "",
    activePlayers: 2,
    upcomingEvents: 3,
    pendingRequests: 5,
  },
}: {
  data?: {
    userName?: string;
    activePlayers: number;
    upcomingEvents: number;
    pendingRequests: number;
  };
}) {
  const [parentName, setParentName] = useState(data.userName || "");
  const [activePlayers, setActivePlayers] = useState(data.activePlayers ?? 0);
  const [upcomingEvents, setUpcomingEvents] = useState(data.upcomingEvents ?? 0);
  const [pendingRequests, setPendingRequests] = useState(data.pendingRequests ?? 0);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((profile) => {
        if (profile?.name) {
          const firstName = profile.name.trim().split(/\s+/)[0] || profile.name;
          setParentName(firstName);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/players?mine=1")
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        const players = res?.players ?? [];
        setActivePlayers(players.length);
      })
      .catch(() => {});
  }, []);

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

  const displayName = parentName || data.userName || "there";

  return (
    <div className="w-full space-y-6">
      {/* Welcome Banner - Matching the white ice-texture feel */}
      <div className="relative overflow-hidden p-8">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back, {displayName}
            </h2>
            <p className="text-sub-text1/80 font-medium">
              Helping you navigate your player&apos;s journey with clarity and
              confidence.
            </p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shrink-0">
            <Link href="/parent-dashboard/profile">Manage your profile and players</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid - Matching the dark textured cards in the screenshot */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Active Players"
          number={activePlayers}
          icon={<Users className="w-6 h-6 text-blue-600" />}
        />
        <StatCard
          title="Upcoming Events"
          number={upcomingEvents}
          icon={<CalendarDays className="w-6 h-6 text-blue-600" />}
        />
        <StatCard
          title="Pending Rating Requests"
          number={pendingRequests}
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

"use client";

import { Check, X, MapPin, CalendarDays, User, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

interface PlayerVerification {
  id: string;
  name: string;
  initials: string;
  position: string;
  league: string;
  location: string;
  level: string;
  birthYear: number;
}

const verifications: PlayerVerification[] = [
  {
    id: "1",
    name: "Marcus Johnson",
    initials: "MJ",
    position: "Center",
    league: "OHL",
    location: "Toronto, ON",
    level: "Junior",
    birthYear: 2006,
  },
  {
    id: "2",
    name: "Jake Williams",
    initials: "JW",
    position: "Defenseman",
    league: "USHL",
    location: "Minneapolis, MN",
    level: "Junior",
    birthYear: 2005,
  },
  {
    id: "3",
    name: "Ryan Chen",
    initials: "RC",
    position: "Goalie",
    league: "NCAA",
    location: "Boston, MA",
    level: "Amateur",
    birthYear: 2004,
  },
];

export default function PendingVerifications() {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Pending Verifications
          </h2>
          <p className="text-sm text-sub-text1/60">
            Review athlete profile requests
          </p>
        </div>
        <Link
          href="/coach-dashboard/overview/verifications"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          View all
        </Link>
      </div>

      {/* List of Player Cards */}
      <div className="grid gap-4">
        {verifications.map((player) => (
          <div
            key={player.id}
            className="group relative overflow-hidden bg-secondary-foreground/60 border-slate-200 rounded-2xl p-4 sm:p-5 transition-all hover:border-blue-300 hover:shadow-md"
          >
            {/* Ice Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/scratched-metal.png')]" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Responsive Avatar Size */}
                <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-blue-50 shadow-sm shrink-0">
                  <AvatarFallback className="bg-blue-50 text-blue-600 font-bold text-base sm:text-lg">
                    {player.initials}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-x-2">
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                      {player.name}
                    </h3>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                      {player.position}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-rows- xs:grid-cols-2 gap-x-4 gap-y-1.5 text-slate-500 text-xs sm:text-sm">
                    <div className="flex text-sub-text3/80 items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-sub-text3" />
                      {player.league}
                    </div>
                    <div className="flex text-sub-text3/80 items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sub-text3" />
                      {player.location}
                    </div>
                    <div className="flex text-sub-text3/80 items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-sub-text3" />
                      {player.level}
                    </div>
                    <div className="flex text-sub-text3/80 items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-sub-text3" />
                      Born {player.birthYear}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Full width on mobile, auto on desktop */}
              <div className="flex flex-row sm:flex-col gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 sm:pl-4">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl h-9 sm:h-10 text-sm font-semibold"
                >
                  <X className="w-4 h-4 mr-2" />
                  Decline
                </Button>
                <Button className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white rounded-xl h-9 sm:h-10 text-sm font-semibold shadow-sm">
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

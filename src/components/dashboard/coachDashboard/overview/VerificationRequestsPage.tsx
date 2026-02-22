"use client";

import React, { useState } from "react"; // Added useState
import {
  ArrowLeft,
  ShieldCheck,
  Search,
  ChevronDown,
  MapPin,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

// Data matching the "View All" screenshot
const initialRequests = Array(4)
  .fill({
    name: "Nadib Rana",
    location: "Toronto, ON",
    position: "Forward",
    birthYear: 2025,
    team: "Cyclones",
    level: "AAA",
    description:
      "Fast skater with excellent puck control. Two seasons of competitive hockey experience.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
  })
  .map((p, i) => ({ ...p, id: i })); // Added unique IDs

export default function VerificationRequestsPage() {
  // 1. Setup State for the search query
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Filter logic: This checks if the player name includes the search text
  const filteredRequests = initialRequests.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-none p-6 md:p-10 space-y-8 ">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex gap-3">
            <div className="p-2 bg-blue-100/50 rounded-lg border border-blue-200">
              <ShieldCheck className="w-6 h-6 text-blue-600 align-middle justify-center" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Verification Requests
              </h1>
              <p className="text-slate-500 font-medium">
                Review and verify players for tour team
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-100 px-4 py-2 rounded-xl flex items-center gap-2 self-start md:self-center">
          <div className="w-2 h-2 bg-yellow-400 rounded-full" />
          <span className="text-yellow-700 font-bold text-sm">
            {filteredRequests.length} Results {/* Dynamic result count */}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          {/* 3. Bind Input to State */}
          <Input
            placeholder="Search by player name..."
            className="pl-10 bg-white border-2 border-button-clr1 rounded-xl h-12 text-sub-text1 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-button-clr1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 bg-white border border-white/80 px-6 py-3 rounded-xl text-sub-text1 hover:bg-secondary-foreground/10 transition-colors font-medium h-12">
          All Years <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {/* 4. Map over filteredRequests instead of the original array */}
        {filteredRequests.length > 0 ? (
          filteredRequests.map((player, index) => (
            <div
              key={index}
              className="relative flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl bg-secondary-foreground/40 overflow-hidden shadow-sm"
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/scratched-metal.png')]" />

              <div className="relative flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full border-4 border-slate-400/50 overflow-hidden bg-slate-300">
                  <Image
                    src={player.image}
                    alt={player.name}
                    width={250}
                    height={250}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="bg-blue-100 text-button-clr1 px-4 py-1 rounded-lg text-xs font-bold uppercase tracking-tight">
                  {player.position}
                </span>
              </div>

              <div className="flex-1 space-y-4 z-10">
                <div className="flex flex-col md:flex-row md:items-center gap-x-6 gap-y-2">
                  <h3 className="text-2xl font-bold text-white">
                    {player.name}
                  </h3>
                  <div className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {player.location}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="bg-slate-700/50 px-3 py-1 rounded-md text-sm text-slate-300 border border-slate-600">
                    Birth Year:{" "}
                    <span className="text-blue-400 font-bold">
                      {player.birthYear}
                    </span>
                  </div>
                  <div className="bg-slate-700/50 px-3 py-1 rounded-md text-sm text-slate-300 border border-slate-600">
                    Team :{" "}
                    <span className="text-blue-400 font-bold">
                      {player.team}
                    </span>
                  </div>
                  <div className="bg-slate-700/50 px-3 py-1 rounded-md text-sm text-slate-300 border border-slate-600">
                    Level :{" "}
                    <span className="text-blue-400 font-bold">
                      {player.level}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed max-w-2xl">
                  {player.description}
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-48 z-10">
                <Button className="w-full bg-slate-600 hover:bg-slate-700 text-white rounded-xl h-10 gap-2 text-xs font-bold">
                  <Eye className="w-4 h-4" /> View Full Profile
                </Button>
                <Button className="w-full bg-button-clr1 hover:bg-blue-700 text-white rounded-xl h-10 gap-2 text-xs font-bold shadow-lg shadow-blue-900/20">
                  <CheckCircle2 className="w-4 h-4" /> Verify Player
                </Button>
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl h-10 gap-2 text-xs font-bold">
                  <XCircle className="w-4 h-4" /> Decline
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-secondary-foreground/20 rounded-3xl">
            <p className="text-slate-400">
              No players found matching &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>
      <div>
        <Button>See more...</Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
// import TeamGroup from "./teamGroup";
import PlayersFilterBar from "@/components/dashboard/coachDashboard/teamManagement/playersFilterBar";
import PlayerCard from "@/components/dashboard/coachDashboard/teamManagement/PlayerCard";
import TeamGroup from "@/components/dashboard/coachDashboard/teamManagement/teamGroup";

const INITIAL_TEAMS = [
  { id: 1, name: "2004 AAA Boys", count: 11, active: true },
  { id: 2, name: "2004 AAA Boys", count: 11, active: false },
  { id: 3, name: "2004 AAA Girls", count: 11, active: false },
];

const INITIAL_PLAYERS = [
  {
    id: "1",
    name: "Jake THOMPSON",
    team: "Maple Leafs", // Changed from teamName
    weight: "175 lbs",
    year: "2010", // Changed from birthYear
    position: "Forward",
    level: "AAA",
    isVerified: true,
    stats: {
      goals: 17,
      assists: 10,
      savePct: "800%", // Changed from save
      gaa: "3.00",
      plusMinus: "+5",
    },
  },
  {
    id: "2",
    name: "John SMITH",
    team: "Bruins",
    weight: "185 lbs",
    year: "2009",
    position: "Defense",
    level: "AAA",
    isVerified: true,
    stats: {
      goals: 5,
      assists: 12,
      savePct: "0%",
      gaa: "0.00",
      plusMinus: "+12",
    },
  },
  {
    id: "3",
    name: "Nadib Rana",
    team: "Bruins",
    weight: "185 lbs",
    year: "2009",
    position: "Defense",
    level: "AAA",
    isVerified: true,
    stats: {
      goals: 5,
      assists: 12,
      savePct: "0%",
      gaa: "0.00",
      plusMinus: "+12",
    },
  },
];

export default function PlayersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState(INITIAL_TEAMS);

  const filteredPlayers = INITIAL_PLAYERS.filter(
    (player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.team.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleTeamSelect = (id: string | number) => {
    setTeams((prev) =>
      prev.map((team) => ({
        ...team,
        active: team.id === id,
      })),
    );
  };

  return (
    <div className="min-h-screen antialiased text-sub-text1 md:p-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        <aside>
          <TeamGroup teams={teams} onTeamSelect={handleTeamSelect} />
        </aside>

        <main className="flex-1">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight">
              All Players
            </h1>
            <p className="text-sub-text1/60 mt-2 font-medium">
              Manage your verified players and contact access roster
            </p>
          </header>

          <PlayersFilterBar onSearchChange={setSearchQuery} />

          <div className="space-y-4">
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map((player) => (
                <PlayerCard key={player.id} {...player} />
              ))
            ) : (
              <div className="text-center py-20 bg-black/20 rounded-[32px] border border-dashed border-white/10">
                <p className="text-gray-500 text-lg">
                  No players found matching "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

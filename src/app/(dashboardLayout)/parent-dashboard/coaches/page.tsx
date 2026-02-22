"use client";

import { useMemo, useState } from "react";

import CoachCard, {
  CoachCardProps,
} from "@/components/dashboard/parentDashboard/Coaches/CoachCard";

import CoachesFilterBar from "@/components/dashboard/parentDashboard/Coaches/CoachesFilterBar";

const COACHES = [
  {
    id: "coash1",
    name: "Jake Thompson",
    title: "Head Coach",
    team: "Vegas Golden Knights",
    teamLogo: "/newasset/parent/coaches/coaches.png",
    league: "Elite League",
    level: "Pro",
    birthYear: 1990,
    rating: 4.9,
    image: "/newasset/parent/coaches/coaches.png",
    location: "Las Vegas, NV",
  },
  {
    id: "coash2",
    name: "Sarah Johnson",
    title: "Head Coach",
    team: "Toronto Stars",
    teamLogo: "/newasset/parent/coaches/coaches.png",
    league: "Ontario League",
    level: "AA",
    birthYear: 1985,
    rating: 4.6,
    image: "/newasset/parent/coaches/coaches.png",
    location: "Toronto, ON",
  },
  {
    id: "coash3",
    name: "Mark Stevens",
    title: "Assistant Coach",
    team: "Maple Leafs II",
    teamLogo: "/newasset/parent/coaches/coaches.png",
    league: "Local League",
    level: "AAA",
    birthYear: 1978,
    rating: 4.2,
    image: "/newasset/parent/coaches/coaches.png",
    location: "Toronto, ON",
  },
  {
    id: "coash4",
    name: "Nadib Stevens",
    title: "Assistant Coach",
    team: "Maple Leafs II",
    teamLogo: "/newasset/parent/coaches/coaches.png",
    league: "Local League",
    level: "AAA",
    birthYear: 1978,
    rating: 4.2,
    image: "/newasset/parent/coaches/coaches.png",
    location: "Toronto, ON",
  },
] satisfies CoachCardProps[];

export default function ParentCoachesPage() {
  const [search, setSearch] = useState("");
  const [birthYear, setBirthYear] = useState("all");
  const [league, setLeague] = useState("all");
  const [team, setTeam] = useState("all");
  const [location, setLocation] = useState("all");

  const filteredCoaches = useMemo(() => {
    return COACHES.filter((c) => {
      return (
        (c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.team.toLowerCase().includes(search.toLowerCase())) &&
        (birthYear === "all" || String(c.birthYear) === birthYear) &&
        (league === "all" ||
          (c.league || "").toLowerCase() === league.toLowerCase()) &&
        (team === "all" ||
          (c.team || "").toLowerCase() === team.toLowerCase()) &&
        (location === "all" ||
          (c.location || "").toLowerCase() === location.toLowerCase())
      );
    });
  }, [search, birthYear, league, team, location]);

  return (
    <div className="space-y-6">
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Coach & Team Discovery
        </h2>
        <p className="text-sub-text1/80 font-medium">
          Find and connect with verified coaches and teams.
        </p>
      </div>

      <CoachesFilterBar
        search={search}
        setSearch={setSearch}
        birthYear={birthYear}
        setBirthYear={setBirthYear}
        league={league}
        setLeague={setLeague}
        team={team}
        setTeam={setTeam}
        location={location}
        setLocation={setLocation}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCoaches.map((coach) => (
          <CoachCard key={coach.id} {...coach} />
        ))}
      </div>
    </div>
  );
}

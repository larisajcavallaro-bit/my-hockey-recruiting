"use client";

import { useMemo, useState, useEffect } from "react";

import CoachCard, {
  CoachCardProps,
} from "@/components/dashboard/parentDashboard/Coaches/CoachCard";

import CoachesFilterBar from "@/components/dashboard/parentDashboard/Coaches/CoachesFilterBar";

function mapToCoachCard(c: {
  id: string;
  user: { name: string | null };
  title?: string | null;
  team?: string | null;
  teamLogo?: string | null;
  league?: string | null;
  level?: string | null;
  birthYear?: number | null;
  location?: string | null;
  image?: string | null;
  rating?: number | null;
  reviewCount?: number;
}): CoachCardProps {
  return {
    id: c.id,
    name: c.user?.name ?? "Coach",
    title: c.title ?? undefined,
    team: c.team ?? "-",
    teamLogo: c.teamLogo ?? "",
    league: c.league ?? undefined,
    level: c.level ?? undefined,
    birthYear: c.birthYear ?? undefined,
    rating: c.rating ?? 0,
    reviewCount: c.reviewCount ?? 0,
    image: c.image ?? "/newasset/parent/coaches/coaches.png",
    location: c.location ?? "-",
  };
}

export default function ParentCoachesPage() {
  const [search, setSearch] = useState("");
  const [birthYear, setBirthYear] = useState("all");
  const [league, setLeague] = useState("all");
  const [team, setTeam] = useState("all");
  const [location, setLocation] = useState("all");
  const [coaches, setCoaches] = useState<CoachCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = new URLSearchParams();
    if (search) q.set("search", search);
    fetch(`/api/coaches?${q}`, { credentials: "include", cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setCoaches((data.coaches ?? []).map(mapToCoachCard));
      })
      .catch(() => setCoaches([]))
      .finally(() => setLoading(false));
  }, [search]);

  const filteredCoaches = useMemo(() => {
    return coaches.filter((c) => {
      return (
        (birthYear === "all" || String(c.birthYear) === birthYear) &&
        (league === "all" ||
          (c.league || "").toLowerCase() === league.toLowerCase()) &&
        (team === "all" ||
          (c.team || "").toLowerCase() === team.toLowerCase()) &&
        (location === "all" ||
          (c.location || "").toLowerCase() === location.toLowerCase())
      );
    });
  }, [coaches, birthYear, league, team, location]);

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
        {loading ? (
          <p className="text-sub-text1/80 col-span-2">Loading coaches...</p>
        ) : filteredCoaches.length === 0 ? (
          <p className="text-sub-text1/80 col-span-2">
            No coaches found. Coaches will appear here once they create profiles.
          </p>
        ) : (
          filteredCoaches.map((coach) => (
            <CoachCard key={coach.id} {...coach} />
          ))
        )}
      </div>
    </div>
  );
}

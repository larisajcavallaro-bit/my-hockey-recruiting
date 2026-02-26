"use client";

import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PlayersFilterBar from "@/components/dashboard/coachDashboard/Players/PlayersFilterBar";
import PlayerCard, {
  PlayerCardProps,
  PlayerStatus,
} from "@/components/dashboard/parentDashboard/Players/PlayerCard";

function mapToPlayerCard(
  p: {
    id: string;
    name: string;
    team?: string | null;
    birthYear: number;
    position?: string | null;
    level?: string | null;
    goals?: number | null;
    assists?: number | null;
    plusMinus?: number | null;
    gaa?: number | null;
    savePct?: string | null;
    gender?: string | null;
    location?: string | null;
    status: string;
    image?: string | null;
    socialLink?: string | null;
  },
  profileBasePath: string
): PlayerCardProps & { profileBasePath?: string } {
  return {
    id: p.id,
    name: p.name,
    team: p.team ?? "-",
    age: String(new Date().getFullYear() - p.birthYear),
    birthYear: p.birthYear,
    position: p.position ?? "-",
    level: p.level ?? "-",
    goals: p.goals ?? 0,
    assists: p.assists ?? 0,
    plusMinus: p.plusMinus ?? null,
    gaa: p.gaa ?? 0,
    save: p.savePct ?? "-",
    gender: p.gender ?? "-",
    location: p.location ?? "-",
    status: (p.status === "Verified"
      ? "Verified"
      : p.status === "Rejected"
        ? "Rejected"
        : "Pending") as PlayerStatus,
    image: p.image ?? "/newasset/parent/players/Players1.png",
    socialLink: p.socialLink ?? null,
    profileBasePath,
  };
}

export default function ViewPlayersPage() {
  const { data: session } = useSession();
  const isCoach = (session?.user as { role?: string })?.role === "COACH";
  const profileBasePath = isCoach ? "coach-dashboard" : "parent-dashboard";

  const [search, setSearch] = useState("");
  const [birthYear, setBirthYear] = useState("all");
  const [position, setPosition] = useState("all");
  const [level, setLevel] = useState("all");
  const [gender, setGender] = useState("all");
  const [location, setLocation] = useState("all");
  const [players, setPlayers] = useState<PlayerCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // View Players shows ALL players from all parent accounts (not filtered by current user)
    const q = new URLSearchParams();
    if (search) q.set("search", search);
    q.set("limit", "100");
    fetch(`/api/players?${q}`)
      .then((r) => r.json())
      .then((data) => {
        setPlayers(
          (data.players ?? []).map((p: Record<string, unknown>) =>
            mapToPlayerCard(
              p as Parameters<typeof mapToPlayerCard>[0],
              profileBasePath
            )
          )
        );
      })
      .catch(() => setPlayers([]))
      .finally(() => setLoading(false));
  }, [search, profileBasePath]);

  const filteredPlayers = useMemo(() => {
    return players.filter((p) => {
      return (
        (birthYear === "all" || String(p.birthYear) === birthYear) &&
        (position === "all" || p.position === position) &&
        (level === "all" || p.level === level) &&
        (gender === "all" || p.gender === gender) &&
        (location === "all" || p.location === location)
      );
    });
  }, [players, birthYear, position, level, gender, location]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden p-8">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              View Players
            </h2>
            <p className="text-sub-text1/80 font-medium">
              Explore player profiles and team rosters across the site
            </p>
          </div>
        </div>
      </div>
      <PlayersFilterBar
        search={search}
        setSearch={setSearch}
        birthYear={birthYear}
        setBirthYear={setBirthYear}
        position={position}
        setPosition={setPosition}
        level={level}
        setLevel={setLevel}
        gender={gender}
        setGender={setGender}
        location={location}
        setLocation={setLocation}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-sub-text1/80 col-span-full">Loading players...</p>
        ) : filteredPlayers.length === 0 ? (
          <p className="text-sub-text1/80 col-span-full">
            No players found. Players will appear when parents add their athletes.
          </p>
        ) : (
          filteredPlayers.map((player) => (
            <PlayerCard key={player.id} {...player} />
          ))
        )}
      </div>
    </div>
  );
}

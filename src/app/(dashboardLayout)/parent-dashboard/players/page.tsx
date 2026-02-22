"use client";

import { useMemo, useState } from "react";

import PlayersFilterBar from "@/components/dashboard/coachDashboard/Players/PlayersFilterBar";
import PlayerCard, {
  PlayerCardProps,
} from "@/components/dashboard/coachDashboard/Players/PlayerCard";

const PLAYERS = [
  {
    id: "cdfda4546",
    name: "Jake Thompson",
    team: "Maple Leafs II",
    age: "17",
    birthYear: 2010,
    position: "Forward",
    level: "AAA",
    goals: 17,
    assists: 10,
    gaa: 3.0,
    save: "80%",
    gender: "Male",
    location: "Toronto, ON",
    status: "Verified",
    image: "/newasset/parent/players/Players1.png",
  },
  {
    id: "cdfda45466",
    name: "cdfda4547",
    team: "Toronto Stars",
    age: "16",
    birthYear: 2011,
    position: "Defense",
    level: "AA",
    goals: 8,
    assists: 14,
    gaa: 2.4,
    save: "85%",
    gender: "Female",
    location: "Vancouver, BC",
    status: "Pending",
    image: "/newasset/parent/players/Players1.png",
  },
  {
    id: "cdfda4549",
    name: "Emma Watson",
    team: "Toronto Stars",
    age: "16",
    birthYear: 2011,
    position: "Defense",
    level: "AA",
    goals: 8,
    assists: 14,
    gaa: 2.4,
    save: "85%",
    gender: "Female",
    location: "Vancouver, BC",
    status: "Pending",
    image: "/newasset/parent/players/Players1.png",
  },
  {
    id: "cdfda4550",
    name: "Emma Watson",
    team: "Toronto Stars",
    age: "16",
    birthYear: 2011,
    position: "Defense",
    level: "AA",
    goals: 8,
    assists: 14,
    gaa: 2.4,
    save: "85%",
    gender: "Female",
    location: "Vancouver, BC",
    status: "Pending",
    image: "/newasset/parent/players/Players1.png",
  },
] satisfies PlayerCardProps[];

export default function ParentPlayersPage() {
  const [search, setSearch] = useState("");
  const [birthYear, setBirthYear] = useState("all");
  const [position, setPosition] = useState("all");
  const [level, setLevel] = useState("all");
  const [gender, setGender] = useState("all");
  const [location, setLocation] = useState("all");

  const filteredPlayers = useMemo(() => {
    return PLAYERS.filter((p) => {
      return (
        (p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.team.toLowerCase().includes(search.toLowerCase())) &&
        (birthYear === "all" || String(p.birthYear) === birthYear) &&
        (position === "all" || p.position === position) &&
        (level === "all" || p.level === level) &&
        (gender === "all" || p.gender === gender) &&
        (location === "all" || p.location === location)
      );
    });
  }, [search, birthYear, position, level, gender, location]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden p-8">
        {/* Optional: Add a CSS background image/pattern here to mimic the ice scratches */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            View Players
          </h2>
          <p className="text-sub-text1/80 font-medium">
            Explore player profiles and team rosters
          </p>
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
        {filteredPlayers.map((player) => (
          <PlayerCard key={player.id} {...player} />
        ))}
      </div>
    </div>
  );
}

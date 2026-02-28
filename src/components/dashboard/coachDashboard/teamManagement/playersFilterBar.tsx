"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface PlayersFilterBarProps {
  onSearchChange?: (value: string) => void;
  birthYear?: string;
  setBirthYear?: (v: string) => void;
  position?: string;
  setPosition?: (v: string) => void;
  level?: string;
  setLevel?: (v: string) => void;
  gender?: string;
  setGender?: (v: string) => void;
  location?: string;
  setLocation?: (v: string) => void;
}

const PlayersFilterBar: React.FC<PlayersFilterBarProps> = ({
  birthYear = "all",
  setBirthYear,
  position = "all",
  setPosition,
  level = "all",
  setLevel,
}) => {
  const [birthYears, setBirthYears] = useState<string[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/lookups?category=birth_year", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/lookups?category=position", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/levels?limit=100", { cache: "no-store" }).then((r) => r.json()),
    ]).then(([by, pos, lv]) => {
      setBirthYears((by.lookups ?? []).slice(0, 20));
      setPositions(pos.lookups ?? []);
      setLevels((lv.levels ?? []).map((l: { name: string }) => l.name));
    }).catch(() => {});
  }, []);

  const selectWrapperClass = "flex flex-col gap-1.5 flex-1";
  const selectClass =
    "bg-secondary-foreground/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-sub-text1/80 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none w-full cursor-pointer backdrop-blur-sm";

  return (
    <div className="p-6 rounded-[32px] bg-[#E5E7EB]/50 border mb-6 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={selectWrapperClass}>
          <label className="text-[11px] uppercase tracking-wider font-semibold text-sub-text1/80 ml-1">
            Birth Year
          </label>
          <div className="relative">
            <select
              className={selectClass}
              value={birthYear}
              onChange={(e) => setBirthYear?.(e.target.value)}
            >
              <option value="all">All Years</option>
              {birthYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 text-sub-text1/80 pointer-events-none" size={16} />
          </div>
        </div>
        <div className={selectWrapperClass}>
          <label className="text-[11px] uppercase tracking-wider font-semibold text-sub-text1/80 ml-1">
            Position
          </label>
          <div className="relative">
            <select
              className={selectClass}
              value={position}
              onChange={(e) => setPosition?.(e.target.value)}
            >
              <option value="all">All Positions</option>
              {positions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 text-sub-text1/80 pointer-events-none" size={16} />
          </div>
        </div>
        <div className={selectWrapperClass}>
          <label className="text-[11px] uppercase tracking-wider font-semibold text-sub-text1/80 ml-1">
            Level
          </label>
          <div className="relative">
            <select
              className={selectClass}
              value={level}
              onChange={(e) => setLevel?.(e.target.value)}
            >
              <option value="all">All Levels</option>
              {levels.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 text-sub-text1/80 pointer-events-none" size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayersFilterBar;

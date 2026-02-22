"use client";

import React from "react";
import { Users } from "lucide-react";

interface Team {
  id: string | number;
  name: string;
  count: number;
  active?: boolean;
}

interface TeamGroupProps {
  teams: Team[];
  onTeamSelect?: (id: string | number) => void;
}

const TeamGroup: React.FC<TeamGroupProps> = ({ teams, onTeamSelect }) => {
  return (
    <div className="w-72 flex-shrink-0 p-5 rounded-xl bg-secondary-foreground/60 border border-white/10 h-full shadow-xl">
      <div className="flex items-center gap-3 mb-1 text-white/90">
        <Users size={20} className="text-sub-text3" />
        <h2 className="font-bold text-lg tracking-tight">My Teams</h2>
      </div>
      <p className="text-xs text-sub-text3/80 mb-6 font-medium">
        {teams.length} teams.
      </p>
      <div className="h-[1px] bg-secondary-foreground/60 w-full mb-6" />
      <div className="flex flex-col gap-3">
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => onTeamSelect?.(team.id)}
            className={`group flex justify-between items-center px-5 py-4 rounded-2xl transition-all duration-200 font-semibold text-sm ${
              team.active
                ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-600/20 translate-x-1"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="truncate pr-2">{team.name}</span>
            <span
              className={`flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full text-[11px] font-bold ${
                team.active
                  ? "bg-white text-[#3B82F6]"
                  : "bg-white/10 text-gray-300"
              }`}
            >
              {team.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TeamGroup;

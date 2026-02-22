"use client";

import React from "react";
import { Search, SlidersHorizontal, ChevronDown, Filter } from "lucide-react";

interface PlayersFilterBarProps {
  onSearchChange: (value: string) => void;
}

const PlayersFilterBar: React.FC<PlayersFilterBarProps> = ({
  onSearchChange,
}) => {
  const selectWrapperClass = "flex flex-col gap-1.5 flex-1";
  const selectClass =
    "bg-secondary-foreground/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-sub-text1/80 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none w-full cursor-pointer backdrop-blur-sm";

  return (
    <div className="p-6 rounded-[32px] bg-[#E5E7EB]/50 border mb-6 ">
      <div className="flex gap-4 mb-6">
        <div className="relative flex-grow group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search
              size={18}
              className="text-sub-text2 group-focus-within:text-blue-400 transition-colors"
            />
          </div>
          <input
            type="text"
            placeholder="Search players..."
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border-2 border-button-clr1 rounded-xl py-3 pl-12 pr-4 text-sub-text1 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-button-clr1 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 bg-white border border-white/80 px-6 py-2 rounded-xl text-sub-text1 hover:bg-secondary-foreground/10 transition-colors font-medium">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["Birth Year", "Genders", "Leagues", "Levels"].map((label) => (
          <div key={label} className={selectWrapperClass}>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-sub-text1/80 ml-1">
              {label}
            </label>
            <div className="relative">
              <select className={selectClass}>
                <option value="">All {label}</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-3 text-sub-text1/80 pointer-events-none"
                size={16}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayersFilterBar;

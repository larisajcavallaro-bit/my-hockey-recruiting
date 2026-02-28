"use client";

import { Search, Filter, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useLookupOptions,
  useLeagueOptions,
  useTeamOptions,
} from "@/hooks/useFilterOptions";

interface Props {
  search: string;
  setSearch: (v: string) => void;

  birthYear: string;
  setBirthYear: (v: string) => void;

  league: string;
  setLeague: (v: string) => void;

  team: string;
  setTeam: (v: string) => void;

  location: string;
  setLocation: (v: string) => void;
}

const CoachesFilterBar = ({
  search,
  setSearch,
  birthYear,
  setBirthYear,
  league,
  setLeague,
  team,
  setTeam,
  location,
  setLocation,
}: Props) => {
  const locations = useLookupOptions("area");
  const leagues = useLeagueOptions();
  const teams = useTeamOptions();
  const birthYears = useLookupOptions("birth_year");

  return (
    <div className="p-6 rounded-[32px] bg-[#E5E7EB]/50 border space-y-4">
      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Coach Name"
            className="pl-10 bg-white border-2 border-button-clr1 rounded-xl py-3 text-sub-text1 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-button-clr1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="flex items-center gap-2 bg-white border border-white/80 px-6 py-2 rounded-xl text-sub-text1 hover:bg-secondary-foreground/10 transition-colors font-medium">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full bg-secondary-foreground/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-sub-text1/80 h-auto focus:ring-2 focus:ring-button-clr1">
            <MapPin className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <div className="text-sub-text1">
              <SelectItem value="all">All Cities</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>

        <Select value={league} onValueChange={setLeague}>
          <SelectTrigger className="w-full bg-secondary-foreground/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-sub-text1/80 h-auto focus:ring-2 focus:ring-button-clr1">
            <SelectValue placeholder="League" />
          </SelectTrigger>
          <SelectContent>
            <div className="text-sub-text1">
              <SelectItem value="all">All Leagues</SelectItem>
              {leagues.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>

        <Select value={team} onValueChange={setTeam}>
          <SelectTrigger className="w-full bg-secondary-foreground/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-sub-text1/80 h-auto focus:ring-2 focus:ring-button-clr1">
            <SelectValue placeholder="Team" />
          </SelectTrigger>
          <SelectContent>
            <div className="text-sub-text1">
              <SelectItem value="all">All Teams</SelectItem>
              {teams.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>

        <Select value={birthYear} onValueChange={setBirthYear}>
          <SelectTrigger className="w-full bg-secondary-foreground/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-sub-text1/80 h-auto focus:ring-2 focus:ring-button-clr1">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <div className="text-sub-text1">
              <SelectItem value="all">All Years</SelectItem>
              {birthYears.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CoachesFilterBar;

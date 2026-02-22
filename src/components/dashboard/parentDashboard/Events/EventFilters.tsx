"use client";

import React from "react";
import { Search, Filter, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterState {
  coachName: string;
  location: string;
  league: string;
  team: string;
  ageGroup: string;
}

interface EventFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export const EventFilters = ({
  filters,
  onFiltersChange,
}: EventFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Coach Name"
            className="pl-10 bg-white border-2 border-button-clr1 rounded-xl py-3 text-sub-text1 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-button-clr1"
            value={filters.coachName}
            onChange={(e) =>
              onFiltersChange({ ...filters, coachName: e.target.value })
            }
          />
        </div>

        <button className="flex items-center gap-2 bg-white border border-white/80 px-6 py-2 rounded-xl text-sub-text1 hover:bg-secondary-foreground/10 transition-colors font-medium">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Location Filter */}
        <Select
          value={filters.location}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, location: value })
          }
        >
          <SelectTrigger className="w-full bg-secondary-foreground/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-sub-text1/80 h-auto focus:ring-2 focus:ring-button-clr1">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <SelectValue placeholder="Full Address" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <div className="text-sub-text1">
              <SelectItem value="all">All Addresses</SelectItem>
              <SelectItem value="1200 Ice Rink Blvd, Chicago, IL 60601, USA">Chicago Arena</SelectItem>
              <SelectItem value="2600 W Belmont Ave, Chicago, IL 60618, USA">Northern Ice Center</SelectItem>
              <SelectItem value="100 Arena Dr, Detroit, MI 48226, USA">Detroit Arena</SelectItem>
            </div>
          </SelectContent>
        </Select>

        {/* League Filter */}
        <Select
          value={filters.league}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, league: value })
          }
        >
          <SelectTrigger className="w-full bg-secondary-foreground/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-sub-text1/80 h-auto focus:ring-2 focus:ring-button-clr1">
            <SelectValue placeholder="League" />
          </SelectTrigger>
          <SelectContent>
            <div className="text-sub-text1">
              <SelectItem value="all">All Leagues</SelectItem>
              <SelectItem value="Elite League">Elite League</SelectItem>
              <SelectItem value="AAA League">AAA League</SelectItem>
              <SelectItem value="Rep League">Rep League</SelectItem>
            </div>
          </SelectContent>
        </Select>

        {/* Team Filter */}
        <Select
          value={filters.team}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, team: value })
          }
        >
          <SelectTrigger className="w-full bg-secondary-foreground/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-sub-text1/80 h-auto focus:ring-2 focus:ring-button-clr1">
            <SelectValue placeholder="Team" />
          </SelectTrigger>
          <SelectContent>
            <div className="text-sub-text1">
              <SelectItem value="all">All Teams</SelectItem>
              <SelectItem value="Toronto Elite">Toronto Elite</SelectItem>
              <SelectItem value="Team One">Team One</SelectItem>
              <SelectItem value="Team Two">Team Two</SelectItem>
            </div>
          </SelectContent>
        </Select>

        {/* Age Group Filter */}
        <Select
          value={filters.ageGroup}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, ageGroup: value })
          }
        >
          <SelectTrigger className="w-full bg-secondary-foreground/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-sub-text1/80 h-auto focus:ring-2 focus:ring-button-clr1">
            <SelectValue placeholder="Age Group" />
          </SelectTrigger>
          <SelectContent>
            <div className="text-sub-text1">
              <SelectItem value="All Ages">All Ages</SelectItem>
              <SelectItem value="2012">2012</SelectItem>
              <SelectItem value="2010">2010</SelectItem>
              <SelectItem value="2008">2008</SelectItem>
              <SelectItem value="2006">2006</SelectItem>
            </div>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

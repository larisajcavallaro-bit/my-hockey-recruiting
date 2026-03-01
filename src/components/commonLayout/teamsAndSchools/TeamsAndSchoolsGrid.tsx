"use client";

import { useState, useEffect, useMemo } from "react";
import { Star, MessageSquarePlus, Search, MapPin, Check, ChevronDown, SlidersHorizontal } from "lucide-react";
import { LocationLink } from "@/components/ui/LocationLink";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import AddSchoolFormModal from "./AddSchoolFormModal";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";

const MILES_PER_KM = 0.621371;
const RADIUS_MILES = 30;
const AGE_BRACKETS = ["U6", "U8", "U10", "U12", "U14", "U16", "U18", "U20"] as const;

/** Haversine distance in miles between two lat/lng points */
function distanceMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * MILES_PER_KM;
}

type School = {
  slug: string;
  name: string;
  type: "team" | "school";
  rating: number;
  reviewCount: number;
  rinkName?: string | null;
  location: string;
  lat: number | null;
  lng: number | null;
  imageUrl: string;
  hasBoys: boolean;
  hasGirls: boolean;
  ageBrackets: string[];
  leagues: string[];
};

function ProgramCard({ item }: { item: School }) {
  return (
    <Card
      className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200/70 hover:border-gray-300 group"
    >
      <Link href={`/teams-and-schools/${item.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={item.imageUrl?.startsWith("data:")}
          />
        </div>
      </Link>
      <CardContent className="flex-1 flex flex-col p-5 space-y-3 min-h-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span
                className={`inline-block text-xs px-2 py-0.5 rounded ${
                  item.type === "school"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {item.type === "school" ? "School" : "Team"}
              </span>
              {item.hasBoys && (
                <span className="inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  <Check className="h-3 w-3" /> Boys
                </span>
              )}
              {item.hasGirls && (
                <span className="inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  <Check className="h-3 w-3" /> Girls
                </span>
              )}
            </div>
            <Link
              href={`/teams-and-schools/${item.slug}`}
              className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors block"
            >
              {item.name}
            </Link>
          </div>
          <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-bold text-sub-text">
              {item.reviewCount > 0 ? item.rating.toFixed(1) : "—"}
            </span>
            <span className="text-sub-text">
              ({item.reviewCount.toLocaleString()})
            </span>
          </div>
        </div>
        <div className="space-y-1 text-sm text-muted-foreground">
          {item.rinkName && (
            <p className="font-medium text-foreground">Rink: {item.rinkName}</p>
          )}
          <div className="flex items-center">
            <LocationLink address={item.location} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TeamsAndSchoolsGrid() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "team" | "school">("all");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [filterBoys, setFilterBoys] = useState(false);
  const [filterGirls, setFilterGirls] = useState(false);
  const [filterAgeBrackets, setFilterAgeBrackets] = useState<string[]>([]);
  const [filterLeagues, setFilterLeagues] = useState<string[]>([]);
  const [filterMinStars, setFilterMinStars] = useState<number>(0);
  const [allLeagues, setAllLeagues] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function fetchSchools() {
      try {
        setError(null);
        const res = await fetch("/api/teams-and-schools", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        if (!cancelled && Array.isArray(data.schools)) {
          setSchools(data.schools);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void fetchSchools();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    fetch("/api/leagues?limit=500")
      .then((r) => r.json())
      .then((data) => setAllLeagues(data?.leagues ?? []));
  }, []);

  const filteredSchools = useMemo(() => {
    let result = schools;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q));
    }

    if (userLocation) {
      result = result.filter((s) => {
        if (s.lat == null || s.lng == null) return true;
        const d = distanceMiles(userLocation.lat, userLocation.lng, s.lat, s.lng);
        return d <= RADIUS_MILES;
      });
    }

    if (filterBoys) result = result.filter((s) => s.hasBoys);
    if (filterGirls) result = result.filter((s) => s.hasGirls);

    if (filterAgeBrackets.length > 0) {
      result = result.filter((s) =>
        filterAgeBrackets.some((ab) => s.ageBrackets?.includes(ab))
      );
    }
    if (filterLeagues.length > 0) {
      result = result.filter((s) =>
        filterLeagues.some((l) => s.leagues?.includes(l))
      );
    }
    if (filterMinStars > 0) {
      result = result.filter(
        (s) => s.reviewCount > 0 && s.rating >= filterMinStars
      );
    }

    return filterType === "all"
      ? result
      : result.filter((s) => s.type === filterType);
  }, [schools, searchQuery, userLocation, filterBoys, filterGirls, filterAgeBrackets, filterLeagues, filterMinStars, filterType]);

  const teams = filteredSchools.filter((s) => s.type === "team");
  const schoolEntries = filteredSchools.filter((s) => s.type === "school");

  const handlePlaceSelect = (place: { address: string; lat: number; lng: number }) => {
    setUserLocation({ lat: place.lat, lng: place.lng, address: place.address });
  };

  return (
    <section className="py-10 md:py-14 bg-gray-50/50">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 md:mb-6">
          Teams and Schools
        </h2>

        {/* Request bar */}
        <div className="bg-button-clr1 rounded-lg px-4 py-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-8 md:mb-10">
          <div className="flex gap-3 items-start">
            <div className="mt-0.5 shrink-0 text-white">
              <MessageSquarePlus size={20} />
            </div>
            <div className="text-[12px] sm:text-sm text-white leading-relaxed">
              <p className="font-medium mb-1">Don&apos;t see a program or school?</p>
              <p>Send us a message and we will get it added for you.</p>
            </div>
          </div>
          <div className="shrink-0 rounded-lg border border-white/70 bg-white/15 px-4 py-2.5 hover:bg-white/25 transition-colors inline-flex items-center text-white">
            <AddSchoolFormModal />
          </div>
        </div>

        {/* Search Bar: name, location, boys/girls */}
        <div className="mb-8 md:mb-10">
          <div className="bg-background rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="flex flex-col md:flex-row items-stretch md:items-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div className="flex-1 flex items-center pl-5 pr-4 py-4 md:py-0 md:h-14">
                <Search className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <Input
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 focus-visible:ring-0 shadow-none flex-1 min-w-0"
                />
              </div>
              <div className="flex items-center px-5 py-3 md:py-0 md:h-14 gap-2 bg-gray-50/60 flex-1 min-w-0">
                <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <AddressAutocomplete
                  id="teams-schools-location"
                  placeholder="Town or address (within 30 mi)"
                  onPlaceSelect={handlePlaceSelect}
                  types={["geocode"]}
                  className="flex-1 min-w-0 border-0 bg-transparent px-0 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-0"
                />
              </div>
              <div className="flex items-center gap-4 px-5 py-4 md:py-0 md:h-14 shrink-0">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterBoys}
                    onChange={(e) => setFilterBoys(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">Boys</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterGirls}
                    onChange={(e) => setFilterGirls(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">Girls</span>
                </label>
              </div>
              <div className="px-5 py-3 md:py-0 md:h-14 flex items-center border-t md:border-t-0 md:border-l border-gray-200">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-gray-700 font-medium w-[120px] text-left focus:outline-none focus:ring-0 px-3 py-2 rounded-lg hover:bg-gray-100"
                    >
                      <SlidersHorizontal className="h-4 w-4 shrink-0 text-gray-500" />
                      <span className="truncate">
                        {filterAgeBrackets.length === 0
                          ? "Age"
                          : filterAgeBrackets.length === 1
                            ? filterAgeBrackets[0]
                            : `${filterAgeBrackets.length} ages`}
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[180px]">
                    {AGE_BRACKETS.map((ab) => (
                      <DropdownMenuCheckboxItem
                        key={ab}
                        checked={filterAgeBrackets.includes(ab)}
                        onSelect={(e) => e.preventDefault()}
                        onCheckedChange={(checked) => {
                          setFilterAgeBrackets((prev) =>
                            checked ? [...prev, ab] : prev.filter((c) => c !== ab)
                          );
                        }}
                      >
                        {ab}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="px-5 py-3 md:py-0 md:h-14 flex items-center border-t md:border-t-0 md:border-l border-gray-200">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-gray-700 font-medium w-[140px] text-left focus:outline-none focus:ring-0 px-3 py-2 rounded-lg hover:bg-gray-100"
                    >
                      <span className="truncate">
                        {filterLeagues.length === 0
                          ? "League"
                          : filterLeagues.length === 1
                            ? filterLeagues[0]
                            : `${filterLeagues.length} leagues`}
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="max-h-[280px] overflow-y-auto w-[220px]">
                    {allLeagues.length === 0 ? (
                      <div className="px-2 py-3 text-sm text-muted-foreground">No leagues</div>
                    ) : (
                      allLeagues.map((l) => (
                        <DropdownMenuCheckboxItem
                          key={l.id}
                          checked={filterLeagues.includes(l.name)}
                          onSelect={(e) => e.preventDefault()}
                          onCheckedChange={(checked) => {
                            setFilterLeagues((prev) =>
                              checked ? [...prev, l.name] : prev.filter((c) => c !== l.name)
                            );
                          }}
                        >
                          {l.name}
                        </DropdownMenuCheckboxItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="px-5 py-3 md:py-0 md:h-14 flex items-center border-t md:border-t-0 md:border-l border-gray-200">
                <Select
                  value={filterMinStars.toString()}
                  onValueChange={(v) => setFilterMinStars(parseInt(v, 10))}
                >
                  <SelectTrigger className="w-[120px] h-10 border-gray-200 bg-background">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All ratings</SelectItem>
                    <SelectItem value="5">5 stars</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="px-5 py-3 md:py-0 md:h-14 flex items-center border-t md:border-t-0 md:border-l border-gray-200">
                <Select
                  value={filterType}
                  onValueChange={(v) => setFilterType(v as "all" | "team" | "school")}
                >
                  <SelectTrigger className="w-[140px] h-10 border-gray-200 bg-background">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="team">Teams only</SelectItem>
                    <SelectItem value="school">Schools only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {(searchQuery || userLocation || filterBoys || filterGirls || filterAgeBrackets.length > 0 || filterLeagues.length > 0 || filterMinStars > 0) && (
          <p className="text-sm text-muted-foreground mb-6">
            Showing <strong>{filteredSchools.length}</strong> result
            {filteredSchools.length !== 1 ? "s" : ""}
          </p>
        )}

        {loading ? (
          <div className="text-center py-16 text-muted-foreground">
            Loading...
          </div>
        ) : error ? (
          <div className="text-center py-16 text-destructive">
            <p className="font-medium">{error}</p>
            <p className="text-sm mt-1">Please refresh to try again.</p>
          </div>
        ) : filteredSchools.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="font-medium">No teams or schools match your search and filters.</p>
            <p className="text-sm mt-1">Try adjusting your filters or request one to be added.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {(filterType === "all" || filterType === "team") && teams.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-slate-800">
                  Teams
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {teams.map((item) => (
                    <ProgramCard key={item.slug} item={item} />
                  ))}
                </div>
              </div>
            )}
            {(filterType === "all" || filterType === "school") && schoolEntries.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-slate-800">
                  Schools
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {schoolEntries.map((item) => (
                    <ProgramCard key={item.slug} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" className="min-w-44">
            Load More
          </Button>
        </div>
      </div>
    </section>
  );
}

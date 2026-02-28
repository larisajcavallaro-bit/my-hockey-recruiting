// components/TrainingFacilitiesGrid.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { Star, Dumbbell, MessageSquarePlus, Search, MapPin, SlidersHorizontal, X, ChevronDown, CircleDot } from "lucide-react";
import { LocationLink } from "@/components/ui/LocationLink";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import AddFacilityFormModal from "../modal/AddFacilityFormModal";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { FACILITY_CATEGORIES } from "@/constants/facilities";

const MILES_PER_KM = 0.621371;

/** Haversine distance in miles between two lat/lng points */
function distanceMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius km
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

type Facility = {
  slug: string;
  name: string;
  rating: number;
  reviewCount: number;
  location: string;
  lat: number | null;
  lng: number | null;
  amenities: string[];
  imageUrl: string;
  type?: "in-person" | "app" | "at-home-trainer" | "tournament-teams";
};

const RADIUS_MILES = 30;

const TYPE_OPTIONS = [
  { value: "in-person" as const, label: "In Person" },
  { value: "app" as const, label: "App" },
  { value: "at-home-trainer" as const, label: "At Home Trainer" },
  { value: "tournament-teams" as const, label: "Tournament Teams" },
];

export default function TrainingFacilitiesGrid() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [filterMinStars, setFilterMinStars] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchFacilities() {
      try {
        setError(null);
        const res = await fetch("/api/facilities");
        if (!res.ok) throw new Error("Failed to load training");
        const data = await res.json();
        if (!cancelled && Array.isArray(data.facilities)) {
          setFacilities(data.facilities);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load training");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void fetchFacilities();
    return () => { cancelled = true; };
  }, []);

  const filteredFacilities = useMemo(() => {
    let result = facilities;

    // Name search: filter by facility name
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((f) => f.name.toLowerCase().includes(q));
    }

    // Location filter: only apply to facilities with coords; those without coords are always shown
    if (userLocation) {
      result = result.filter((f) => {
        if (f.lat == null || f.lng == null) return true;
        const d = distanceMiles(userLocation.lat, userLocation.lng, f.lat, f.lng);
        return d <= RADIUS_MILES;
      });
    }

    // Type filter: facility must match one of selected types
    if (selectedTypes.length > 0) {
      result = result.filter((f) => f.type && selectedTypes.includes(f.type));
    }

    // Amenities filter: facility must have ALL selected amenities
    if (selectedAmenities.length > 0) {
      result = result.filter((f) =>
        selectedAmenities.every((amenity) => f.amenities.includes(amenity))
      );
    }

    // Star rating filter: must have reviews and meet minimum
    if (filterMinStars > 0) {
      result = result.filter(
        (f) => f.reviewCount > 0 && f.rating >= filterMinStars
      );
    }

    return result;
  }, [facilities, searchQuery, userLocation, selectedTypes, selectedAmenities, filterMinStars]);

  const handlePlaceSelect = (place: { address: string; lat: number; lng: number }) => {
    setUserLocation({ lat: place.lat, lng: place.lng, address: place.address });
  };

  return (
    <section className="py-10 md:py-14 bg-gray-50/50">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 md:mb-6">
          Training
        </h2>

        {/* Request bar - just below title */}
        <div className="bg-button-clr1 rounded-lg px-4 py-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-8 md:mb-10">
          <div className="flex gap-3 items-start">
            <div className="mt-0.5 shrink-0 text-white">
              <MessageSquarePlus size={20} />
            </div>
            <div className="text-[12px] sm:text-sm text-white leading-relaxed">
              <p className="font-medium mb-1">Don&apos;t see something specific?</p>
              <p>
                Send us a message and we will get it added for you.
              </p>
            </div>
          </div>
          <div className="shrink-0 rounded-lg border border-white/70 bg-white/15 px-4 py-2.5 hover:bg-white/25 transition-colors inline-flex items-center text-white">
            <AddFacilityFormModal />
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-5xl mx-auto mb-8 md:mb-10">
          <div className="bg-background rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="flex items-center h-14 md:h-16 divide-x divide-gray-200 pr-4 sm:pr-5">
              <div className="flex-1 flex items-center pl-5 sm:pl-6 pr-3 sm:pr-4">
                <Search className="h-5 w-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                <Input
                  placeholder="Search rinks, gyms, training centers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-base md:text-lg placeholder:text-gray-500 bg-transparent p-0 h-auto flex-1 focus-visible:outline-none"
                />
              </div>
              <div className="hidden sm:flex items-center px-5 sm:px-6 gap-2 bg-gray-50/60 flex-1 min-w-[280px] max-w-[320px]">
                <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <AddressAutocomplete
                  id="facilities-near-me"
                  placeholder="Town or address (within 30 mi)"
                  onPlaceSelect={handlePlaceSelect}
                  types={["geocode"]}
                  className="flex-1 min-w-0 border-0 bg-transparent px-0 py-1 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-0"
                />
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Select
                  value={filterMinStars.toString()}
                  onValueChange={(v) => setFilterMinStars(parseInt(v, 10))}
                >
                  <SelectTrigger className="w-[115px] h-10 border-0 bg-transparent shadow-none focus:ring-0">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All ratings</SelectItem>
                    <SelectItem value="5">5 stars</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-gray-700 font-medium w-[130px] text-left focus:outline-none focus:ring-0 px-3 py-2 rounded-lg hover:bg-gray-100"
                    >
                      <SlidersHorizontal className="h-4 w-4 shrink-0 text-gray-500" />
                      <span className="truncate">
                        {selectedTypes.length === 0
                          ? "Type"
                          : selectedTypes.length === 1
                            ? TYPE_OPTIONS.find((t) => t.value === selectedTypes[0])?.label ?? selectedTypes[0]
                            : `${selectedTypes.length} types`}
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px]">
                    {TYPE_OPTIONS.map((opt) => (
                      <DropdownMenuCheckboxItem
                        key={opt.value}
                        checked={selectedTypes.includes(opt.value)}
                        onSelect={(e) => e.preventDefault()}
                        onCheckedChange={(checked) => {
                          setSelectedTypes((prev) =>
                            checked ? [...prev, opt.value] : prev.filter((c) => c !== opt.value)
                          );
                        }}
                      >
                        {opt.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-gray-700 font-medium w-[130px] text-left focus:outline-none focus:ring-0 px-3 py-2 rounded-lg hover:bg-gray-100"
                    >
                      <span className="truncate">
                        {selectedAmenities.length === 0
                          ? "Amenities"
                          : selectedAmenities.length === 1
                            ? selectedAmenities[0]
                            : `${selectedAmenities.length} amenities`}
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="max-h-[280px] overflow-y-auto w-[220px]">
                    {FACILITY_CATEGORIES.map((category) => (
                      <DropdownMenuCheckboxItem
                        key={category}
                        checked={selectedAmenities.includes(category)}
                        onSelect={(e) => e.preventDefault()}
                        onCheckedChange={(checked) => {
                          setSelectedAmenities((prev) =>
                            checked ? [...prev, category] : prev.filter((c) => c !== category)
                          );
                        }}
                      >
                        {category}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button className="hover:text-sub-text px-4 sm:px-5 text-sm font-semibold shrink-0">
                Search
              </Button>
            </div>
            {/* Mobile filters - visible on small screens, hidden on md+ */}
            <div className="md:hidden flex flex-col sm:flex-row flex-wrap gap-3 p-3 border-t border-gray-200 bg-gray-50/60">
              <Select
                value={filterMinStars.toString()}
                onValueChange={(v) => setFilterMinStars(parseInt(v, 10))}
              >
                <SelectTrigger className="w-[140px] h-10 bg-white border border-gray-200">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All ratings</SelectItem>
                  <SelectItem value="5">5 stars</SelectItem>
                  <SelectItem value="4">4+ stars</SelectItem>
                  <SelectItem value="3">3+ stars</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2 w-full sm:w-auto sm:min-w-[200px]">
                <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <AddressAutocomplete
                  id="facilities-near-me-mobile"
                  placeholder="Town or address (within 30 mi)"
                  onPlaceSelect={handlePlaceSelect}
                  types={["geocode"]}
                  className="flex-1 min-w-0 border-0 bg-white px-3 py-2 rounded-lg text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-gray-700 font-medium text-sm px-3 py-2 rounded-lg bg-white border border-gray-200"
                  >
                    <SlidersHorizontal className="h-4 w-4 shrink-0" />
                    {selectedTypes.length === 0 ? "Type" : `${selectedTypes.length} selected`}
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  {TYPE_OPTIONS.map((opt) => (
                    <DropdownMenuCheckboxItem
                      key={opt.value}
                      checked={selectedTypes.includes(opt.value)}
                      onSelect={(e) => e.preventDefault()}
                      onCheckedChange={(checked) => {
                        setSelectedTypes((prev) =>
                          checked ? [...prev, opt.value] : prev.filter((c) => c !== opt.value)
                        );
                      }}
                    >
                      {opt.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-gray-700 font-medium text-sm px-3 py-2 rounded-lg bg-white border border-gray-200"
                  >
                    {selectedAmenities.length === 0 ? "Amenities" : `${selectedAmenities.length} selected`}
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-[280px] overflow-y-auto w-[220px]">
                  {FACILITY_CATEGORIES.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={selectedAmenities.includes(category)}
                      onSelect={(e) => e.preventDefault()}
                      onCheckedChange={(checked) => {
                        setSelectedAmenities((prev) =>
                          checked ? [...prev, category] : prev.filter((c) => c !== category)
                        );
                      }}
                    >
                      {category}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Filtered results message */}
        {(userLocation || selectedTypes.length > 0 || selectedAmenities.length > 0) && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200 break-words">
              Showing <strong>{filteredFacilities.length}</strong> training location
              {filteredFacilities.length !== 1 ? "s" : ""}
              {userLocation && <> within 30 miles of <strong>{userLocation.address}</strong></>}
              {userLocation && (selectedTypes.length > 0 || selectedAmenities.length > 0) && " and"}
              {selectedTypes.length > 0 && " matching type"}
              {selectedTypes.length > 0 && selectedAmenities.length > 0 && " and"}
              {selectedAmenities.length > 0 && " amenities"}
            </p>
            <div className="flex items-center gap-1 flex-wrap">
              {selectedTypes.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedTypes([])}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 p-1 rounded"
                  aria-label="Clear type filter"
                  title="Clear type"
                >
                  <span className="text-xs">Clear type</span>
                </button>
              )}
              {selectedAmenities.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedAmenities([])}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 p-1 rounded"
                  aria-label="Clear amenities filter"
                  title="Clear amenities"
                >
                  <span className="text-xs">Clear amenities</span>
                </button>
              )}
              {userLocation && (
                <button
                  type="button"
                  onClick={() => setUserLocation(null)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 p-1 rounded"
                  aria-label="Clear location filter"
                  title="Clear location"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Grid */}

        {loading ? (
          <div className="text-center py-16 text-muted-foreground">
            Loading training...
          </div>
        ) : error ? (
          <div className="text-center py-16 text-destructive">
            <p className="font-medium">{error}</p>
            <p className="text-sm mt-1">Please refresh the page to try again.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFacilities.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">
                No training locations match your filters.
              </p>
              <p className="text-sm mt-1">
                Try a different location, clear type or amenities, or broaden your search.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {userLocation && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUserLocation(null)}
                  >
                    Clear location
                  </Button>
                )}
                {selectedTypes.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTypes([])}
                  >
                    Clear type
                  </Button>
                )}
                {selectedAmenities.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAmenities([])}
                  >
                    Clear amenities
                  </Button>
                )}
              </div>
            </div>
          ) : (
            filteredFacilities.map((facility) => (
            <Card
              key={facility.slug}
              className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200/70 hover:border-gray-300 group"
            >
              <Link
                href={`/training/${facility.slug}`}
                className="block"
              >
                <div className="relative aspect-[4/3] md:mt-[-25px] overflow-hidden">
                  <Image
                    src={facility.imageUrl}
                    alt={facility.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized={facility.imageUrl?.startsWith("data:")}
                  />

                  {/* Type badge */}
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant="secondary"
                      className="bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 flex items-center gap-1 shadow-sm"
                    >
                      {facility.type === "in-person" && (
                        <>
                          <CircleDot size={14} strokeWidth={2.2} />
                          In Person
                        </>
                      )}
                      {facility.type === "app" && (
                        <>
                          <span className="text-sm leading-none">📱</span>
                          App
                        </>
                      )}
                      {facility.type === "at-home-trainer" && (
                        <>
                          <Dumbbell size={14} strokeWidth={2.2} />
                          At Home Trainer
                        </>
                      )}
                      {facility.type === "tournament-teams" && (
                        <>
                          <CircleDot size={14} strokeWidth={2.2} />
                          Tournament Teams
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </Link>

              <CardContent className="flex-1 flex flex-col p-5 space-y-3 min-h-0">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/training/${facility.slug}`}
                    className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors"
                  >
                    {facility.name}
                  </Link>

                  <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-bold text-sub-text">
                      {facility.reviewCount > 0 ? facility.rating.toFixed(1) : "—"}
                    </span>
                    <span className="text-sub-text">
                      ({facility.reviewCount.toLocaleString()})
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <LocationLink address={facility.location} />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {facility.amenities.slice(0, 4).map((amenity) => (
                    <Badge
                      key={amenity}
                      variant="outline"
                      className="text-xs bg-background hover:bg-muted/50"
                    >
                      {amenity}
                    </Badge>
                  ))}
                  {facility.amenities.length > 4 && (
                    <Badge variant="outline" className="text-xs bg-background">
                      +{facility.amenities.length - 4}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
            ))
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

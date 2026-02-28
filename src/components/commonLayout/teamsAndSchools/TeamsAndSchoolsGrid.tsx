"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquarePlus, Search } from "lucide-react";
import { LocationLink } from "@/components/ui/LocationLink";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import AddSchoolFormModal from "./AddSchoolFormModal";

type School = {
  slug: string;
  name: string;
  rating: number;
  reviewCount: number;
  location: string;
  lat: number | null;
  lng: number | null;
  imageUrl: string;
};

export default function TeamsAndSchoolsGrid() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredSchools = searchQuery.trim()
    ? schools.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : schools;

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

        {/* Search */}
        <div className="max-w-xl mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search schools and programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 border-gray-200 bg-background"
            />
          </div>
        </div>

        {searchQuery && (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSchools.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <p className="font-medium">No schools or programs match your search.</p>
                <p className="text-sm mt-1">Try a different search or request one to be added.</p>
              </div>
            ) : (
              filteredSchools.map((school) => (
                <Card
                  key={school.slug}
                  className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200/70 hover:border-gray-300 group"
                >
                  <Link href={`/teams-and-schools/${school.slug}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={school.imageUrl}
                        alt={school.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={school.imageUrl?.startsWith("data:")}
                      />
                    </div>
                  </Link>
                  <CardContent className="flex-1 flex flex-col p-5 space-y-3 min-h-0">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/teams-and-schools/${school.slug}`}
                        className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors"
                      >
                        {school.name}
                      </Link>
                      <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-bold text-sub-text">
                          {school.reviewCount > 0 ? school.rating.toFixed(1) : "—"}
                        </span>
                        <span className="text-sub-text">
                          ({school.reviewCount.toLocaleString()})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <LocationLink address={school.location} />
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

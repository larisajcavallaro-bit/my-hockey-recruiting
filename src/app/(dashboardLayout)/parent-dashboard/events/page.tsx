"use client";

import React, { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { PrivacyBadge } from "../../../../components/dashboard/parentDashboard/Events/PrivacyBadge";
import { EventsGrid } from "../../../../components/dashboard/parentDashboard/Events/EventsGrid";

const EventFilters = dynamic(
  () =>
    import("../../../../components/dashboard/parentDashboard/Events/EventFilters").then(
      (mod) => mod.EventFilters
    ),
  {
    ssr: false,
    loading: () => (
      <div className="p-6 rounded-[32px] bg-[#E5E7EB]/50 border animate-pulse">
        <div className="h-12 bg-white/20 rounded-xl mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-white/20 rounded-xl" />
          ))}
        </div>
      </div>
    ),
  }
);

interface Event {
  id: string;
  title: string;
  date: string;
  description?: string | null;
  eventType?: string | null;
  rinkName?: string | null;
  location: string;
  time: string;
  ageGroup: string;
  teamLogo: string;
  image?: string | null;
  coachName: string;
  organizedBy: string;
  websiteLink?: string | null;
  socialMediaLink?: string | null;
  rsvp: "going" | "notGoing" | null;
  rsvpPlayerId?: string | null;
  rsvpPlayerName?: string | null;
  rsvpPlayerFirstName?: string | null;
}

interface FilterState {
  coachName: string;
  eventType: string;
  location: string;
  league: string;
  team: string;
  ageGroup: string;
}

interface Player {
  id: string;
  name: string;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    coachName: "",
    eventType: "all",
    location: "all",
    league: "all",
    team: "all",
    ageGroup: "All Ages",
  });

  useEffect(() => {
    void Promise.resolve().then(() => {
      setFetchError(null);
      Promise.all([
      fetch("/api/events")
        .then(async (r) => {
          if (!r.ok) {
            const err = await r.text();
            throw new Error(r.status === 401 ? "Please sign in to view events" : err || "Failed to load events");
          }
          return r.json();
        })
        .then((data) => data.events ?? []),
      fetch("/api/players?mine=1").then((r) => (r.ok ? r.json() : { players: [] })),
    ])
      .then(([eventsList, playersRes]) => {
        setEvents(eventsList);
        setPlayers(playersRes.players ?? []);
      })
      .catch((err) => {
        setFetchError(err instanceof Error ? err.message : "Failed to load events");
      })
      .finally(() => setLoading(false));
    });
  }, []);

  const handleRsvp = async (
    eventId: string,
    response: "going" | "notGoing",
    playerId?: string,
  ) => {
    if (response === "going" && (!playerId || players.length === 0)) return;
    const res = await fetch("/api/events/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        status: response,
        ...(response === "going" && playerId ? { playerId } : {}),
      }),
    });
    if (!res.ok) return;
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        if (response === "notGoing") {
          return {
            ...e,
            rsvp: "notGoing" as const,
            rsvpPlayerId: null,
            rsvpPlayerName: null,
            rsvpPlayerFirstName: null,
          };
        }
        const p = players.find((x) => x.id === playerId);
        const firstName = p?.name ? p.name.split(" ")[0] ?? p.name : null;
        return {
          ...e,
          rsvp: "going" as const,
          rsvpPlayerId: playerId,
          rsvpPlayerName: p?.name ?? null,
          rsvpPlayerFirstName: firstName,
        };
      }),
    );
  };

  // Logic: Filter the events based on state
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const searchLower = filters.coachName.toLowerCase();
      const matchCoach = !filters.coachName ||
        event.title.toLowerCase().includes(searchLower) ||
        event.organizedBy.toLowerCase().includes(searchLower) ||
        event.coachName.toLowerCase().includes(searchLower);
      const matchEventType =
        filters.eventType === "all" ||
        (event.eventType?.trim() ?? "") === filters.eventType;
      const matchLocation = !filters.location || filters.location === "all" ||
        event.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchLeague = !filters.league || filters.league === "all" ||
        ((event as { league?: string }).league?.toLowerCase().includes(filters.league.toLowerCase()) ?? true);
      const matchTeam = !filters.team || filters.team === "all" ||
        event.organizedBy.toLowerCase().includes(filters.team.toLowerCase()) ||
        event.coachName.toLowerCase().includes(filters.team.toLowerCase());
      const matchAge =
        filters.ageGroup === "All Ages" || event.ageGroup === filters.ageGroup;

      return matchCoach && matchEventType && matchLocation && matchLeague && matchTeam && matchAge;
    });
  }, [events, filters]);

  return (
    <div className="min-h-screen p-6 lg:p-10 bg-transparent text-slate-50">
      {/* Header */}
      <div className="relative z-10 pb-5">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Events & RSVP
        </h2>
        <p className="text-sub-text1/80 font-medium">
          Browse and register for tryouts, camps, and ID skates.
        </p>
      </div>

      <div className="space-y-8">
        {/* Privacy Protected Badge */}
        <PrivacyBadge />

        {/* Filters Section */}
        <div className="p-6 rounded-[32px] bg-[#E5E7EB]/50 border">
          <EventFilters
            filters={filters}
            onFiltersChange={(newFilters) => setFilters(newFilters)}
          />
        </div>

        {/* Result Stats */}
        <div className="flex justify-between items-center text-sub-text1 px-2">
          <p className="text-sm text-secondary-foreground">
            Showing{" "}
            <span className="text-white font-medium">
              {filteredEvents.length}
            </span>{" "}
            results
          </p>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="py-20 text-center bg-secondary/10 rounded-2xl border-2 border-dashed border-white/10">
            <p className="text-slate-400">Loading events…</p>
          </div>
        ) : fetchError ? (
          <div className="py-20 text-center bg-red-500/10 rounded-2xl border-2 border-dashed border-red-500/30">
            <p className="text-red-400 font-medium">{fetchError}</p>
            <p className="text-slate-400 text-sm mt-2">Try signing out and back in.</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <EventsGrid
            events={filteredEvents}
            players={players}
            onRsvp={handleRsvp}
          />
        ) : (
          <div className="py-20 text-center bg-secondary/10 rounded-2xl border-2 border-dashed border-white/10">
            <p className="text-slate-400">
              No events found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;

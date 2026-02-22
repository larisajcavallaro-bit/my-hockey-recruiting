"use client";

import React, { useState, useMemo } from "react";
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
  coachName: string;
  date: string;
  rinkName?: string;
  location: string;
  time: string;
  ageGroup: string;
  team: string;
  teamLogo: string;
  organizer: string;
  teamDetails: string;
  socialMedia: string;
  rsvp: "going" | "notGoing" | null;
}

interface FilterState {
  coachName: string;
  location: string;
  league: string;
  team: string;
  ageGroup: string;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      coachName: "Jake THOMPSON",
      date: "Jan 15, 2026",
      rinkName: "ICE Arena North",
      location: "1200 Ice Rink Blvd, Chicago, IL 60601, USA",
      time: "6:00 PM-8PM",
      ageGroup: "2012",
      team: "Toronto Elite AAA",
      teamLogo: "/newasset/event/demoLogo1.png",
      organizer: "Toronto Elite AAA",
      teamDetails: "Team Details",
      socialMedia: "Social media",
      rsvp: null,
    },

    {
      id: "2",
      coachName: "Jake THOMPSON",
      date: "Jan 15, 2026",
      rinkName: "ICE Arena North",
      location: "1200 Ice Rink Blvd, Chicago, IL 60601, USA",
      time: "6:00 PM-8PM",
      ageGroup: "2012",
      team: "Toronto Elite AAA",
      teamLogo: "/newasset/event/demoLogo1.png",
      organizer: "Toronto Elite AAA",
      teamDetails: "Team Details",
      socialMedia: "Social media",
      rsvp: null,
    },
  ]);

  const [filters, setFilters] = useState<FilterState>({
    coachName: "",
    location: "",
    league: "",
    team: "",
    ageGroup: "All Ages",
  });

  // Handle RSVP toggle
  const handleRsvp = (eventId: string, response: "going" | "notGoing") => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? { ...event, rsvp: event.rsvp === response ? null : response }
          : event,
      ),
    );
  };

  // Logic: Filter the events based on state
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchCoach = event.coachName
        .toLowerCase()
        .includes(filters.coachName.toLowerCase());
      const matchLocation = event.location
        .toLowerCase()
        .includes(filters.location.toLowerCase());
      const matchAge =
        filters.ageGroup === "All Ages" || event.ageGroup === filters.ageGroup;
      // You can add league/team matching here as well

      return matchCoach && matchLocation && matchAge;
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
        {filteredEvents.length > 0 ? (
          <EventsGrid events={filteredEvents} onRsvp={handleRsvp} />
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

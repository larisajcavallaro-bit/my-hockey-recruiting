"use client";

import React from "react";
import { EventCard } from "./EventCard";

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

interface EventsGridProps {
  events: Event[];
  onRsvp: (eventId: string, response: "going" | "notGoing") => void;
}

export const EventsGrid = ({ events, onRsvp }: EventsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onRsvp={onRsvp} />
      ))}
    </div>
  );
};

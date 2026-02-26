"use client";

import React from "react";
import { EventCard } from "./EventCard";

interface Event {
  id: string;
  title: string;
  date: string;
  eventType?: string | null;
  rinkName?: string | null;
  location: string;
  time: string;
  ageGroup: string;
  teamLogo: string;
  coachName: string;
  organizedBy: string;
  websiteLink?: string | null;
  socialMediaLink?: string | null;
  rsvp: "going" | "notGoing" | null;
  rsvpPlayerId?: string | null;
  rsvpPlayerName?: string | null;
  rsvpPlayerFirstName?: string | null;
}

interface Player {
  id: string;
  name: string;
}

interface EventsGridProps {
  events: Event[];
  players: Player[];
  onRsvp: (
    eventId: string,
    response: "going" | "notGoing",
    playerId?: string,
  ) => void;
}

export const EventsGrid = ({ events, players, onRsvp }: EventsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          players={players}
          onRsvp={onRsvp}
        />
      ))}
    </div>
  );
};

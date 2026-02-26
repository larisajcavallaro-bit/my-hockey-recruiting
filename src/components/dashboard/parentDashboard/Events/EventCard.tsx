"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Clock,
  Users,
  Globe,
  Share2,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { LocationLink } from "@/components/ui/LocationLink";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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

interface Player {
  id: string;
  name: string;
}

interface EventCardProps {
  event: Event;
  players: Player[];
  onRsvp: (
    eventId: string,
    response: "going" | "notGoing",
    playerId?: string,
  ) => void;
}

function getFirstName(name: string): string {
  return name.split(" ")[0] ?? name;
}

export const EventCard = ({ event, players, onRsvp }: EventCardProps) => {
  const [showPlayerPicker, setShowPlayerPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node)
      ) {
        setShowPlayerPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGoingClick = () => {
    if (event.rsvp === "going") return;
    if (players.length === 0) return;
    if (players.length === 1) {
      onRsvp(event.id, "going", players[0].id);
      return;
    }
    setShowPlayerPicker((v) => !v);
  };

  const selectPlayer = (playerId: string) => {
    onRsvp(event.id, "going", playerId);
    setShowPlayerPicker(false);
  };

  const displayGoingLabel = event.rsvp === "going" && event.rsvpPlayerName
    ? `${getFirstName(event.rsvpPlayerName)} – Going`
    : "Going";

  return (
    <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col">
      {/* Header: Event Title, Date underneath; Event Type oval on right */}
      <div className="bg-secondary-foreground/70 px-4 py-3 flex flex-row items-start justify-between gap-3 shrink-0">
        <div className="flex flex-col min-w-0 flex-1">
          <h3 className="text-white text-xl font-bold tracking-tight line-clamp-1">
            {event.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-blue-400">
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              {event.date}
            </span>
          </div>
        </div>
        {event.eventType && (
          <span className="inline-flex items-center shrink-0 rounded-full px-3 py-1 text-xs font-medium bg-white border-2 border-blue-600 text-blue-600">
            {event.eventType}
          </span>
        )}
      </div>

      {/* Main Content Body */}
      <div className="flex flex-col sm:flex-row p-4 gap-4 bg-gradient-to-r from-secondary-foreground/70 to-transparent min-h-0 flex-1">
        {/* Left Side: Event/Team image + Organized By */}
        <div className="flex flex-col items-center sm:items-start shrink-0">
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 shadow-inner rounded-lg overflow-hidden bg-slate-800">
            {event.teamLogo ? (
              event.teamLogo.startsWith("data:") ? (
                <img
                  src={event.teamLogo}
                  alt="Event"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={event.teamLogo}
                  alt="Event"
                  fill
                  className="object-cover"
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                No image
              </div>
            )}
          </div>
          <div className="mt-2 text-center sm:text-left">
            <p className="text-xs font-medium text-slate-400">Organized By</p>
            <p className="text-sm font-medium text-sub-text3">{event.coachName}</p>
            {event.organizedBy && (
              <p className="text-xs text-sub-text3/90 mt-0.5">{event.organizedBy}</p>
            )}
          </div>
        </div>

        {/* Right Side: Rink Name, Address, Time, Age Group */}
        <div className="flex-1 min-w-0 space-y-2">
          {event.rinkName && (
            <span className="block text-sm font-medium text-sub-text3">
              {event.rinkName}
            </span>
          )}
          {event.location && (
            <LocationLink
              address={event.location}
              className="text-sm text-sub-text3 hover:text-white break-words"
            />
          )}

          <div className="flex items-center gap-2 text-sub-text3">
            <div className="bg-slate-800 p-1.5 rounded-lg shrink-0">
              <Clock className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-sm">{event.time}</span>
          </div>

          <div className="flex items-center gap-2 text-sub-text3">
            <div className="bg-slate-800 p-1.5 rounded-lg shrink-0">
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-sm">Age Group: {event.ageGroup || "—"}</span>
          </div>

          {event.description && (
            <p className="text-sm text-sub-text3/90 mt-2 line-clamp-3">
              {event.description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom: Website + Social links (only if coach provided) */}
      {(event.websiteLink || event.socialMediaLink) && (
        <div className="px-4 py-2 flex flex-wrap items-center gap-4 bg-secondary-foreground/40 shrink-0 border-t border-white/5">
          {event.websiteLink && (
            <a
              href={event.websiteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300"
            >
              <Globe className="w-4 h-4" />
              Website
            </a>
          )}
          {event.socialMediaLink && (
            <a
              href={event.socialMediaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300"
            >
              <Share2 className="w-4 h-4" />
              Social Media
            </a>
          )}
        </div>
      )}

      {/* RSVP Footer */}
      <div className="flex p-3 gap-2 bg-secondary-foreground/50 shrink-0">
        <div className="flex-1 min-w-0 relative" ref={pickerRef}>
          <Button
            onClick={handleGoingClick}
            disabled={players.length === 0}
            className={`
              w-full h-10 font-bold transition-all text-sm
              ${event.rsvp === "going"
                ? "bg-blue-600 text-white hover:bg-blue-600"
                : "bg-green-600 text-blue-400 hover:bg-green-500"}
            `}
          >
            {displayGoingLabel}
            {players.length > 1 && event.rsvp !== "going" && (
              <ChevronDown className="ml-1 w-4 h-4 inline" />
            )}
          </Button>
          {showPlayerPicker && (
            <div className="absolute bottom-full left-0 right-0 mb-1 py-1 bg-secondary-foreground rounded-lg shadow-lg z-20 border border-white/10">
              <p className="px-3 py-1 text-xs text-slate-400">Select player</p>
              {players.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => selectPlayer(p.id)}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-white/10 text-white"
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => onRsvp(event.id, "notGoing")}
          className={`
            flex-1 min-w-0 h-10 font-bold transition-all text-sm rounded-md
            ${event.rsvp === "notGoing"
              ? "bg-red-600 text-white hover:bg-red-600"
              : "bg-slate-500/60 text-red-500 hover:bg-slate-500/80 hover:text-red-400"}
          `}
        >
          Not Going
        </button>
      </div>
    </div>
  );
};


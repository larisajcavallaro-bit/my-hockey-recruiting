"use client";

import {
  Clock,
  Users,
  Briefcase,
  Share2,
  Calendar,
} from "lucide-react";
import { LocationLink } from "@/components/ui/LocationLink";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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

interface EventCardProps {
  event: Event;
  onRsvp: (eventId: string, response: "going" | "notGoing") => void;
}

export const EventCard = ({ event, onRsvp }: EventCardProps) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
      {/* Header Section */}

      <div className="bg-secondary-foreground/70 p-6 flex flex-col items-center">
        <h3 className="text-white text-2xl font-bold text-center tracking-tight">
          {event.coachName}
        </h3>
        <div className="flex items-center gap-2 mt-2 text-blue-400">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-semibold uppercase tracking-wider">
            {event.date}
          </span>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex flex-col md:flex-row p-6 gap-6 bg-gradient-to-r from-secondary-foreground/70 to-transparent">
        {/* Left Side: Branding & Team */}
        <div className="flex flex-col lg:-mt-10 items-center md:items-start flex-1">
          <div className="relative w-56 h-56 shadow-inner">
            <Image
              src={event.teamLogo}
              alt={`${event.team} logo`}
              fill
              className="object-contain p-2"
            />
          </div>

          <Button className="bg-secondary-foreground/20 text-center md:text-left ml-2">
            <p className="text-sub-text3">Organized by {event.organizer}</p>
          </Button>
        </div>

        {/* Right Side: Details */}
        <div className="flex-[1.5] space-y-3">
          <div className="flex flex-col gap-1 text-sub-text3">
            {event.rinkName && (
              <span className="font-medium text-sub-text3">{event.rinkName}</span>
            )}
            <LocationLink address={event.location} className="text-sub-text3 hover:text-white" />
          </div>

          <div className="flex items-center gap-3 text-sub-text3">
            <div className="bg-slate-800 p-2 rounded-lg">
              <Clock className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-sm">{event.time}</span>
          </div>

          <div className="flex items-center gap-3 text-sub-text3">
            <div className="bg-slate-800 p-2 rounded-lg">
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-sm">Age Group: {event.ageGroup}</span>
          </div>
          <div className="flex sm:flex-row items-center gap-6 lg:-ml-25 ">
            <Button
              variant="ghost"
              className="h-auto p-2 text-sub-text2 hover:text-white hover:bg-white/10 flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span className="text-xs font-medium">{event.teamDetails}</span>
            </Button>

            <Button
              variant="ghost"
              className="h-auto p-2 text-green-400 hover:text-white hover:bg-white/10 flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-xs font-medium">{event.socialMedia}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* RSVP Footer */}
      <div className="flex p-4 gap-3 bg-secondary-foreground/50 ">
        <Button
          onClick={() => onRsvp(event.id, "going")}
          className="flex-1 h-11 font-bold transition-all bg-none"
        >
          Going
        </Button>
        <Button
          onClick={() => onRsvp(event.id, "notGoing")}
          className="flex-1 h-11 font-bold transition-all bg-secondary-foreground/15 text-red-500 hover:bg-red-500 hover:text-sub-text3"
        >
          Not Going
        </Button>
      </div>
    </div>
  );
};

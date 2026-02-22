"use client";

import React from "react";
import { Calendar, Clock, Users } from "lucide-react";
import { LocationLink } from "@/components/ui/LocationLink";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  rinkName?: string;
  location: string;
  attending: number;
  capacity: number;
}

const events: Event[] = [
  {
    id: "1",
    title: "Elite Prospects Showcase",
    date: "January 15, 2026",
    time: "9:00 AM",
    rinkName: "Ice Sports Arena",
    location: "1200 Woodward Ave, Detroit, MI 48226, USA",
    attending: 45,
    capacity: 60,
  },
  {
    id: "2",
    title: "Regional Combine Event",
    date: "January 22, 2026",
    time: "10:30 AM",
    rinkName: "Northern Ice Center",
    location: "2600 W Belmont Ave, Chicago, IL 60618, USA",
    attending: 28,
    capacity: 40,
  },
];

export default function UpcomingEvents() {
  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Upcoming Events
        </h2>
        <Link
          href="/coach-dashboard/events"
          className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="group relative overflow-hidden bg-white/40 backdrop-blur-md border border-blue-200/60 rounded-2xl p-5 transition-all hover:shadow-lg hover:bg-white/50"
          >
            {/* Ice Scratched Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/scratched-metal.png')]" />

            <div className="relative z-10 space-y-3">
              <h3 className="text-lg font-bold text-slate-800">
                {event.title}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Clock className="w-4 h-4 text-blue-400" />
                  {event.time}
                </div>
                <div className="flex flex-col gap-0.5 text-slate-500 text-sm sm:col-span-2">
                  {event.rinkName && (
                    <span className="font-medium text-slate-600">{event.rinkName}</span>
                  )}
                  <LocationLink address={event.location} className="text-slate-500 hover:text-blue-600" />
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm sm:col-span-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  {event.attending} / {event.capacity} attending
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

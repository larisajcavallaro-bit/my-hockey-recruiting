"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Clock, Users } from "lucide-react";
import { LocationLink } from "@/components/ui/LocationLink";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  rinkName?: string;
  location?: string;
  attending: number;
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events/upcoming")
      .then((r) => (r.ok ? r.json() : { events: [] }))
      .then((data) => setEvents(data.events ?? []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

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
      {loading ? (
        <div className="py-8 text-center text-slate-500 text-sm">
          Loading events…
        </div>
      ) : events.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-sm bg-white/20 rounded-xl border border-dashed border-white/30">
          No upcoming events. Create one in Events Management.
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
          <div
            key={event.id}
            className="group relative overflow-hidden bg-white/40 backdrop-blur-md border border-blue-200/60 rounded-2xl p-5 transition-all hover:shadow-lg hover:bg-white/50"
          >
            {/* Ice Scratched Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/scratched-metal.png')]" />

            <div className="relative z-10 space-y-3">
              <div className="flex justify-between items-start gap-2">
                <h3 className="text-lg font-bold text-slate-800">
                  {event.title}
                </h3>
                <Link
                  href={`/coach-dashboard/events/details?eventId=${event.id}`}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 shrink-0"
                >
                  View RSVPs
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  {event.date}
                </div>
                {event.time && (
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Clock className="w-4 h-4 text-blue-400" />
                    {event.time}
                  </div>
                )}
                {(event.rinkName || event.location) && (
                  <div className="flex flex-col gap-0.5 text-slate-500 text-sm sm:col-span-2">
                    {event.rinkName && (
                      <span className="font-medium text-slate-600">{event.rinkName}</span>
                    )}
                    {event.location && (
                      <LocationLink address={event.location} className="text-slate-500 hover:text-blue-600" />
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-500 text-sm sm:col-span-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  {event.attending} {event.attending === 1 ? "player" : "players"} going
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}

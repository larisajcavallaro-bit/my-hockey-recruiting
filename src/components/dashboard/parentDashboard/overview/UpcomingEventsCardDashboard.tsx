"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  person: string;
  status: string;
}

const statusStyles: Record<string, string> = {
  Confirmed: "bg-blue-100 text-blue-600",
};

const fetchUpcoming = () =>
  fetch("/api/events/upcoming")
    .then((r) => (r.ok ? r.json() : { events: [] }))
    .then((res) => res.events ?? [])
    .catch(() => []);

const UpcomingEventsCardDashboard = () => {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<UpcomingEvent[]>([]);

  useEffect(() => {
    fetchUpcoming().then(setEvents);
  }, []);

  // Refetch when user returns to this page/tab (e.g. after changing RSVP on Events page)
  useEffect(() => {
    const onFocus = () => fetchUpcoming().then(setEvents);
    const onVisibility = () => {
      if (document.visibilityState === "visible") onFocus();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="space-y-4 mt-10">
      {/* SAME wrapper as CoachContactsCard */}
      <div className="mb-6 bg-[#E5E7EB]/50 p-4 rounded-2xl">
        {/* HEADER — SAME STYLE */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-md font-semibold text-foreground">
            Upcoming Events
          </h2>

          {/* SAME “See all” BUTTON */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Show All
              </Button>
            </DialogTrigger>

            {/* SAME MODAL STYLE */}
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>All Upcoming Events</DialogTitle>
              </DialogHeader>

              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                {events.map((event) => (
                  <Card key={event.id} className="bg-secondary-foreground/10">
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-3">
                        {/* LEFT */}
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                            <CalendarDays className="h-5 w-5" />
                          </div>

                          <div>
                            <h3 className="font-medium text-sm">
                              {event.title}
                            </h3>
                            <p className="text-black/50 text-sm">
                              {event.date}
                            </p>
                          </div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="rounded-full px-3"
                          >
                            {event.person}
                          </Badge>

                          <Badge
                            className={cn(
                              "rounded-full px-3",
                              statusStyles[event.status],
                            )}
                          >
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* DASHBOARD PREVIEW — SAME AS COACH CARD */}
        <div className="space-y-3">
          {events.slice(0, 2).map((event) => (
            <Card key={event.id} className="bg-secondary-foreground/10">
              <CardContent>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                      <CalendarDays className="h-5 w-5 " />
                    </div>

                    <div>
                      <h3 className="font-medium text-sm text-foreground">
                        {event.title}
                      </h3>
                      <p className="text-black/50">{event.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-full px-3">
                      {event.person}
                    </Badge>

                    <Badge
                      className={cn(
                        "rounded-full px-1",
                        statusStyles[event.status],
                      )}
                    >
                      {event.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventsCardDashboard;

"use client";

import React, { useState } from "react";
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

const EVENTS = [
  {
    id: 1,
    title: "AAA Tryouts - 2012 Birth Year",
    date: "Jan 15, 2026",
    person: "Jake",
    status: "Confirmed",
  },
  {
    id: 2,
    title: "Skills Development Camp",
    date: "Jan 20, 2026",
    person: "Cav",
    status: "Interested",
  },
  {
    id: 3,
    title: "Elite Summer Camp",
    date: "Feb 02, 2026",
    person: "Noah",
    status: "Confirmed",
  },
];

const statusStyles: Record<string, string> = {
  Confirmed: "bg-blue-100 text-blue-600",
  Interested: "bg-slate-100 text-slate-600",
};

const UpcomingEventsCardDashboard = () => {
  const [open, setOpen] = useState(false);

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
                {EVENTS.map((event) => (
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
          {EVENTS.slice(0, 2).map((event) => (
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

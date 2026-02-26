// app/events/page.tsx
"use client";
import { useState, useEffect } from "react";
import { Plus, Lock } from "lucide-react";
import EventCard from "@/components/dashboard/coachDashboard/Events/EventCard";
import CreateEventModal from "@/components/dashboard/coachDashboard/Events/CreateEventModal";
import { Button } from "@/components/ui/button";

type EventItem = {
  id: string;
  title: string;
  date: string;
  startAt: string;
  endAt: string | null;
  eventType?: string | null;
  rinkName?: string | null;
  location: string;
  ageGroup: string;
  description: string;
  image?: string | null;
  websiteLink?: string | null;
  socialMediaLink?: string | null;
};

export default function EventsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = () => {
    setLoading(true);
    fetch("/api/events?mine=1")
      .then((r) => (r.ok ? r.json() : { events: [] }))
      .then((data) => setEvents(data.events ?? []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void Promise.resolve().then(() => fetchEvents());
  }, []);

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Events Management
            </h1>
            <p className="text-slate-600 mt-1">
              Create and manage your events and view RSVPs.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={20} /> Create Event
          </Button>
        </div>

        {/* Privacy Banner */}
        <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-100 rounded-xl p-4 flex items-start gap-3 mb-8">
          <Lock className="text-blue-600 mt-0.5" size={18} />
          <div>
            <h4 className="text-blue-900 font-semibold text-sm">
              RSVP Privacy
            </h4>
            <p className="text-blue-700 text-xs">
              RSVPs are only visible to you as the event organizer. Players and
              parents cannot see who else has registered.
            </p>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-12 text-center text-slate-500">
              Loading events…
            </div>
          ) : events.length === 0 ? (
            <div className="py-12 text-center bg-secondary-foreground/20 rounded-xl border border-dashed border-white/10">
              <p className="text-slate-400">No events yet.</p>
              <p className="text-slate-500 text-sm mt-1">
                Create your first event to get started.
              </p>
            </div>
          ) : (
            events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onUpdate={fetchEvents}
              />
            ))
          )}
        </div>
      </div>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEvents}
      />
    </main>
  );
}

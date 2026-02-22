// app/events/page.tsx
"use client";
import { useState } from "react";
import { Plus, Lock } from "lucide-react";
import EventCard from "@/components/dashboard/coachDashboard/Events/EventCard";
import CreateEventModal from "@/components/dashboard/coachDashboard/Events/CreateEventModal";
import { Button } from "@/components/ui/button";

export default function EventsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <EventCard
            title="Elite Summer Camp"
            type="Camp"
            date="July 15-20, 2026"
            rinkName="Northern Ice Center"
            location="2600 W Belmont Ave, Chicago, IL 60618, USA"
            ageGroup="U14-U16"
            description="Intensive 5-day development camp focusing on skating, shooting, and game strategy."
          />
          <EventCard
            title="Elite Summer Camp"
            type="Camp"
            date="July 15-20, 2026"
            rinkName="Northern Ice Center"
            location="2600 W Belmont Ave, Chicago, IL 60618, USA"
            ageGroup="U14-U16"
            description="Intensive 5-day development camp focusing on skating, shooting, and game strategy."
          />
        </div>
      </div>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}

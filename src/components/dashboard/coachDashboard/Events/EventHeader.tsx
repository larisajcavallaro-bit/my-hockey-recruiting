import { Calendar, MapPin, Users, Lock } from "lucide-react";

export function EventHeader() {
  return (
    <div className="rounded-2xl bg-secondary-foreground/60 p-4 sm:p-6 text-sub-text3 border border-white/10">
      <a href="#" className="text-sm text-gray-300 hover:text-white">
        ← Back to Events
      </a>

      <h1 className="mt-2 text-xl sm:text-2xl font-bold">Elite Summer Camp</h1>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-200">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          Jan 15–20, 2026
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={16} />
          Ice Arena North
        </div>

        <div className="flex items-center gap-2">
          <Users size={16} />
          Total RSVP: 30
        </div>
      </div>
    </div>
  );
}

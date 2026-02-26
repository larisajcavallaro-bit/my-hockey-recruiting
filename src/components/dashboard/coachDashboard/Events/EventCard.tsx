"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Users, Trash2 } from "lucide-react";
import { LocationLink } from "@/components/ui/LocationLink";
import Link from "next/link";
import { EditEventModal } from "./EditEventModal";

interface EventItem {
  id: string;
  title: string;
  date: string;
  startAt?: string;
  endAt?: string | null;
  eventType?: string | null;
  rinkName?: string | null;
  location: string;
  ageGroup: string;
  description: string;
  image?: string | null;
  websiteLink?: string | null;
  socialMediaLink?: string | null;
}

interface EventCardProps {
  event: EventItem;
  onUpdate?: () => void;
}

export default function EventCard({ event, onUpdate }: EventCardProps) {
  const { title, date, eventType, rinkName, location, ageGroup, description, image } = event;

  return (
    <div className="bg-secondary-foreground/40 border border-white/20 rounded-xl p-4 md:p-6 mb-4 flex flex-col lg:flex-row justify-between items-start lg:items-center shadow-lg gap-4">
      <div className="flex-1 w-full flex gap-4">
        {image && (
          <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-slate-700">
            {image.startsWith("data:") ? (
              <img src={image} alt="" className="w-full h-full object-cover" />
            ) : (
              <img src={image} alt="" className="w-full h-full object-cover" />
            )}
          </div>
        )}
        <div className="min-w-0 flex-1">
          {/* Header Section: Title and Badge */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h3 className="text-lg md:text-xl font-bold text-sub-text1 break-words">
              {title}
            </h3>
            {eventType && (
              <span className="bg-blue-100 text-blue-600 text-[10px] md:text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                {eventType}
              </span>
            )}
          </div>

          {/* Metadata Section */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sub-text1 text-xs md:text-sm mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="md:w-4 md:h-4" /> {date}
            </span>
            <span className="flex flex-col gap-0.5 items-start">
              {rinkName && (
                <span className="font-medium text-sub-text1">{rinkName}</span>
              )}
              <LocationLink address={location} className="text-sub-text1 hover:text-white" />
            </span>
            {ageGroup && (
              <span className="flex items-center gap-1.5">
                <Users size={14} className="md:w-4 md:h-4" /> {ageGroup}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-secondary-foreground text-xs md:text-sm max-w-2xl line-clamp-3 md:line-clamp-none">
            {description || "—"}
          </p>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-auto mt-2 lg:mt-0 items-center lg:items-end border-t lg:border-t-0 border-white/10 pt-4 lg:pt-0">
        <Button
          asChild
          className="flex-1 lg:w-full text-xs md:text-sm h-9 md:h-10"
        >
          <Link href={`/coach-dashboard/events/details?eventId=${event.id}`}>View RSVPs</Link>
        </Button>

        <div className="flex-1 lg:w-full">
          <EditEventModal event={event} onSuccess={onUpdate} />
        </div>

        <button className="p-2 text-red-400 hover:text-red-600 border border-slate-200/50 rounded-lg transition-colors bg-white/5 lg:mt-1">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

// components/CreateEventModal.tsx
"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateEventModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <h2 className="text-xl font-bold text-slate-900">Create New Event</h2>
          <p className="text-slate-500 text-sm">
            Fill in the details for your event
          </p>
        </div>

        {/* Scrollable Form Body */}
        <div className="px-8 py-2 overflow-y-auto max-h-[70vh] space-y-5">
          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Event Title
            </label>
            <input
              type="text"
              placeholder="Event Title"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Event Type
            </label>
            <div className="relative">
              <select className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer text-slate-600">
                <option>Select type</option>
                <option>Camp</option>
                <option>Tournament</option>
                <option>Clinic</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>

          {/* Age Group */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Age Group
            </label>
            <input
              type="text"
              placeholder="e.g., U14-U16"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none placeholder:text-slate-300"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Date(s)
            </label>
            <input
              type="text"
              placeholder="e.g., July 15-20, 2026"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none placeholder:text-slate-300"
            />
          </div>

          {/* Rink Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Rink Name
            </label>
            <input
              type="text"
              placeholder="e.g., Northern Ice Center"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none placeholder:text-slate-300"
            />
          </div>

          {/* Full Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Full Address
            </label>
            <AddressAutocomplete
              placeholder="Start typing an address for suggestions..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
              id="create-event-address"
            />
          </div>

          {/* Website Link */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Website Link
            </label>
            <input
              type="url"
              placeholder="Website Link"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none placeholder:text-slate-300"
            />
          </div>

          {/* Social Media Link */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Social media link
            </label>
            <input
              type="url"
              placeholder="social media link"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none placeholder:text-slate-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe your event..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none resize-none placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-8 flex gap-4 border-t border-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors"
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
}

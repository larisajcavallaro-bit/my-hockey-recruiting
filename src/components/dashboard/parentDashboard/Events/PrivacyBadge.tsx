"use client";

import React from "react";
import { Shield } from "lucide-react";

export const PrivacyBadge = () => {
  return (
    <div className="bg-slate-700 rounded-lg p-4 mb-8 flex items-start gap-3">
      <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
      <div>
        <p className="text-white font-semibold">Privacy Protected</p>
        <p className="text-slate-300 text-sm">
          Your RSVPs are private and only visible to event organizers. Other
          parents and players cannot see your RSVP responses.
        </p>
      </div>
    </div>
  );
};

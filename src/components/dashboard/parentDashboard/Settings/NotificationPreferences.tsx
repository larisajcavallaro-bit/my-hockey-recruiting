"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: "blog",
      label: "Blog Subscription",
      description:
        "Occasional updates to help families stay informed and navigate youth hockey with confidence",
      enabled: true,
    },
    {
      id: "events",
      label: "Event Reminders",
      description:
        "We'll send a reminder before events you've RSVP'd to, so nothing important gets missed",
      enabled: true,
    },
    {
      id: "messages",
      label: "Coach Messages",
      description:
        "Get notified when a coach responds to your request to connect",
      enabled: false,
    },
  ]);

  const handleToggle = (id: string) => {
    setPreferences((prefs) =>
      prefs.map((pref) =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref,
      ),
    );
  };

  return (
    <div className="bg-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="h-5 w-5 text-slate-300" />
        <h2 className="text-lg font-semibold text-white">
          Notification Preferences
        </h2>
      </div>

      <div className="space-y-4">
        {preferences.map((pref) => (
          <div
            key={pref.id}
            className="flex items-start justify-between p-4 bg-slate-600/50 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-colors"
          >
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">{pref.label}</h3>
              <p className="text-sm text-sub-text3/80">{pref.description}</p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <Switch
                checked={pref.enabled}
                onCheckedChange={() => handleToggle(pref.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

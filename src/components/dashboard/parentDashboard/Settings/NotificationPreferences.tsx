"use client";

import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  persisted?: boolean; // true = saved to backend
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
      persisted: true,
    },
    {
      id: "messages",
      label: "Coach Messages",
      description:
        "Get notified when a coach responds to your request to connect",
      enabled: false,
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notification-preferences")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.eventReminderSmsEnabled !== undefined) {
          setPreferences((p) =>
            p.map((pref) =>
              pref.id === "events"
                ? { ...pref, enabled: data.eventReminderSmsEnabled }
                : pref
            )
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (id: string) => {
    const pref = preferences.find((p) => p.id === id);
    if (!pref) return;
    const nextEnabled = !pref.enabled;
    setPreferences((prefs) =>
      prefs.map((p) => (p.id === id ? { ...p, enabled: nextEnabled } : p))
    );

    if (id === "events" && pref.persisted) {
      const res = await fetch("/api/notification-preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventReminderSmsEnabled: nextEnabled }),
      });
      if (!res.ok) {
        setPreferences((prefs) =>
          prefs.map((p) => (p.id === id ? { ...p, enabled: pref.enabled } : p))
        );
        toast.error("Failed to save preference");
        return;
      }
      toast.success(nextEnabled ? "Event reminders enabled" : "Event reminders disabled");
    }
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
                disabled={loading && pref.id === "events"}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

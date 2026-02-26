"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotificationPreferences from "@/components/dashboard/coachDashboard/Settings/NotificationPreferences";
import SecuritySettings from "@/components/dashboard/coachDashboard/Settings/SecuritySettings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications");

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black-900 mb-2">Settings</h1>
        <p className="text-sub-text1/80 font-medium">
          Manage your account settings and preferences
        </p>
        <p className="mt-3 text-sm font-semibold text-green-600 bg-green-50 px-4 py-2 rounded-lg inline-block">
          COACH PROFILES ARE ALWAYS FREE — no subscription needed.
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-700 p-1 rounded-lg mb-8">
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-button-clr1 data-[state=active]:text-white text-slate-300 rounded-md"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-button-clr1 data-[state=active]:text-white text-slate-300 rounded-md"
          >
            Security
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <NotificationPreferences />
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

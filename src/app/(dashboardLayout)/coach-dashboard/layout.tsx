"use client";

import React, { useState } from "react";
import SideBar from "@/components/dashboard/coachDashboard/overview/SideBar";
import DashboardHeader from "@/components/dashboard/parentDashboard/overview/DashboardHeader";

export default function ParentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div
      className="h-screen overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/newasset/parent/dashboard-background.png')",
        backgroundColor: "#0F172A",
      }}
    >
      {/* ===== HEADER ===== */}
      <div className="fixed top-0 left-0 right-0 h-20 z-50">
        <DashboardHeader onMenuClick={() => setIsMobileOpen(true)} />
      </div>

      {/* ===== BODY ===== */}
      <div className="pt-20 h-full flex ">
        {/* SIDEBAR (Handles both Desktop and Mobile logic internally) */}
        <SideBar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* ===== MAIN CONTENT ===== */}
        <main
          className={`flex-1 overflow-y-auto p-4 lg:p-8 transition-all duration-300 ${
            isCollapsed ? "lg:ml-10" : "lg:ml-0"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

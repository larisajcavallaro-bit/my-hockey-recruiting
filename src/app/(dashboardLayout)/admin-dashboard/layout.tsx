"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import AdminSidebar from "@/components/dashboard/adminDashboard/AdminSidebar";
import AdminHeader from "@/components/dashboard/adminDashboard/AdminHeader";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="fixed top-0 left-0 right-0 h-16 z-50 bg-slate-800 border-b border-slate-700">
        <AdminHeader onMenuClick={() => setIsMobileOpen(true)} />
      </div>

      <div className="pt-16 flex">
        <AdminSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        <main
          className={cn(
            "flex-1 overflow-y-auto p-6 lg:p-8 transition-all duration-300",
            isCollapsed ? "lg:ml-20" : "lg:ml-0"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import {
  LayoutDashboard,
  Users,
  Search,
  CalendarDays,
  Star,
  Settings,
  MoveHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/parent-dashboard/overview",
    icon: LayoutDashboard,
  },
  {
    title: "Players",
    href: "/parent-dashboard/players",
    icon: Users,
  },

  {
    title: "Find Coaches",
    href: "/parent-dashboard/coaches",
    icon: Search,
  },
  { title: "Events", href: "/parent-dashboard/events", icon: CalendarDays },
  {
    title: "Coach Ratings & Request",
    href: "/parent-dashboard/rating",
    icon: Star,
  },
  { title: "Settings", href: "/parent-dashboard/setting", icon: Settings },
];

interface SideBarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function SideBar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: SideBarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* ===== SIDEBAR CONTAINER ===== */}
      <aside
        className={cn(
          "flex flex-col justify-between bg-secondary-foreground/70",
          isCollapsed ? "w-20" : "w-72",
          "fixed inset-y-0 left-0 z-[60] lg:static",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* MOBILE CLOSE BUTTON (Optional but helpful) */}
        <div className="lg:hidden flex justify-end p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="w-6 h-6 text-white" />
          </Button>
        </div>

        {/* NAV LINKS */}
        <div className="flex-1 overflow-y-auto border-t-1 border-background/50 px-4 py-6 space-y-2 scrollbar-hide">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  active
                    ? "bg-button-clr1/50 text-sub-text3 shadow-lg shadow-orange-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-colors",
                    active
                      ? "text-sub-text3"
                      : "text-sub-text3 group-hover:text-sub-text2",
                  )}
                />

                {(!isCollapsed || isMobileOpen) && (
                  <span
                    className={cn(
                      "text-sm font-medium whitespace-nowrap transition-colors",
                      active
                        ? "text-sub-text3"
                        : "text-sub-text3 group-hover:text-sub-text2",
                    )}
                  >
                    {item.title}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* FOOTER COLLAPSE BUTTON (Desktop Only) */}
        <div className="hidden lg:block mt-auto p-4 border-t border-white/10">
          <Button
            variant="ghost"
            className="w-full hover:bg-white/5"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <MoveHorizontal
              className={cn(
                "w-5 h-5 text-white transition-transform duration-300",
                isCollapsed && "rotate-180",
              )}
            />
          </Button>
        </div>
      </aside>

      {/* ===== MOBILE OVERLAY ===== */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="absolute inset-0 bg-secondary-foreground/50 backdrop-blur-[2px]"
        />
      )}
    </>
  );
}

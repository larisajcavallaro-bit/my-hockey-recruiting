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
  LogOut,
  Building2,
  GraduationCap,
  FileText,
  MessageSquare,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUnreadContactCount } from "@/hooks/useUnreadContactCount";

const NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/coach-dashboard/overview",
    icon: LayoutDashboard,
  },
  {
    title: "View Players",
    href: "/coach-dashboard/players",
    icon: Users,
  },

  {
    title: "Team Management",
    href: "/coach-dashboard/teamManagement",
    icon: Search,
  },
  { title: "Events", href: "/coach-dashboard/events", icon: CalendarDays },
  {
    title: "Submit Player Ratings",
    href: "/coach-dashboard/rating",
    icon: Star,
  },
  { title: "Training", href: "/training", icon: Building2 },
  { title: "Teams and Programs", href: "/teams-and-schools", icon: GraduationCap },
  { title: "Blog", href: "/blog", icon: FileText },
  { title: "Settings", href: "/coach-dashboard/setting", icon: Settings },
  { title: "Contact Us", href: "/coach-dashboard/messages", icon: MessageSquare },
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
  const unreadContactCount = useUnreadContactCount();

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
            const showUnread = item.href?.includes("/messages") && unreadContactCount > 0;
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
                <span className="relative shrink-0">
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      active
                        ? "text-sub-text3"
                        : "text-sub-text3 group-hover:text-sub-text2",
                    )}
                  />
                  {showUnread && (
                    <span
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-orange-500"
                      aria-label="Unread reply"
                    />
                  )}
                </span>

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

        {/* FOOTER: Logout + Collapse */}
        <div className="mt-auto p-4 border-t border-white/10 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
            onClick={() => signOut({ callbackUrl: "/", redirect: true })}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {(!isCollapsed || isMobileOpen) && (
              <span className="text-sm font-medium">Log Out</span>
            )}
          </Button>
          <div className="hidden lg:block">
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

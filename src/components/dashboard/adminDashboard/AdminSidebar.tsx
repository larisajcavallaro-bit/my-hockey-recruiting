"use client";

import {
  LayoutDashboard,
  ListOrdered,
  MessageSquare,
  AlertTriangle,
  Building2,
  GraduationCap,
  FileText,
  Users,
  Plug,
  X,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { title: "Overview", href: "/admin-dashboard", icon: LayoutDashboard },
  { title: "Team Management", href: "/admin-dashboard/lookups", icon: ListOrdered },
  { title: "Contact Messages", href: "/admin-dashboard/contact-messages", icon: MessageSquare },
  { title: "Review Disputes", href: "/admin-dashboard/disputes", icon: AlertTriangle },
  { title: "Training Submissions", href: "/admin-dashboard/facility-submissions", icon: Building2 },
  { title: "Teams & Schools", href: "/admin-dashboard/schools", icon: GraduationCap },
  { title: "Blog Posts", href: "/admin-dashboard/blog-posts", icon: FileText },
  { title: "Users", href: "/admin-dashboard/users", icon: Users },
  { title: "Zapier", href: "/admin-dashboard/zapier", icon: Plug },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col justify-between bg-slate-800",
        isCollapsed ? "w-20" : "w-72",
        "fixed inset-y-0 left-0 z-[60] lg:static",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="lg:hidden flex justify-end p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(false)}
          className="text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin-dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-amber-600 text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-slate-300 hover:bg-red-600/20 hover:text-red-400"
          onClick={() => signOut({ callbackUrl: "/auth/sign-in" })}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
}

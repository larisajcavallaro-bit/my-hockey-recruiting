"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";
import Logo from "../../../../../public/newasset/auth/logo.png";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  profileImage?: string;
  profileLink?: string;
  notificationsLink?: string;
}

export default function DashboardHeader({
  onMenuClick,
  profileImage,
  profileLink,
  notificationsLink,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [coachProfileImage, setCoachProfileImage] = useState<string | null>(null);
  const isCoachDashboard = pathname?.startsWith("/coach-dashboard");
  const coachProfileId = (session?.user as { coachProfileId?: string | null })?.coachProfileId;

  const fetchCoachImage = useCallback(() => {
    if (!coachProfileId) return;
    fetch(`/api/coaches/${coachProfileId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error && (data.image || data.user?.image)) {
          setCoachProfileImage(data.image ?? data.user?.image ?? null);
        }
      })
      .catch(() => {});
  }, [coachProfileId]);

  useEffect(() => {
    if (!isCoachDashboard || !coachProfileId) return;
    fetchCoachImage();
  }, [isCoachDashboard, coachProfileId, fetchCoachImage]);

  useEffect(() => {
    if (!isCoachDashboard) return;
    const onProfileUpdated = () => fetchCoachImage();
    window.addEventListener("coach-profile-updated", onProfileUpdated);
    return () => window.removeEventListener("coach-profile-updated", onProfileUpdated);
  }, [isCoachDashboard, fetchCoachImage]);

  const unreadCount = useUnreadNotificationCount();
  const resolvedProfileLink = profileLink ?? (isCoachDashboard ? "/coach-dashboard/profile" : "/parent-dashboard/profile");
  const resolvedNotificationsLink = notificationsLink ?? (isCoachDashboard ? "/coach-dashboard/notifications" : "/parent-dashboard/notifications");
  const resolvedProfileImage = profileImage ?? (isCoachDashboard ? coachProfileImage : undefined);
  return (
    <header className="h-20 w-full flex items-center justify-between px-6 lg:px-8 bg-secondary-foreground/70">
      {/* LEFT: MOBILE MENU + LOGO */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden text-white hover:bg-white/10"
        >
          <Menu className="w-6 h-6" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/95 p-1 shadow-sm shrink-0">
            <Image src={Logo} alt="Logo" width={32} height={32} className="object-contain" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sub-text3 font-extrabold text-xl">
              My Hockey Recruiting
            </h1>
            {/* <p className="text-[10px] tracking-widest text-orange-500 uppercase">
              Recruiting Portal
            </p> */}
          </div>
        </div>
      </div>

      {/* RIGHT: NOTIFICATIONS + USER */}
      <div className="flex items-center gap-6">
        <Link
          href={resolvedNotificationsLink}
          className="relative cursor-pointer group"
        >
          <Bell className="text-slate-300 w-5 h-5 group-hover:text-white transition-colors" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] px-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-secondary-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Link>

        <Link href={resolvedProfileLink}>
          {resolvedProfileImage ? (
            resolvedProfileImage.startsWith("data:") ? (
              <img
                src={resolvedProfileImage}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full border-2 border-orange-500 object-cover p-0.5 hover:scale-105 transition-transform w-10 h-10"
              />
            ) : (
              <Image
                src={resolvedProfileImage}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full border-2 border-orange-500 object-cover p-0.5 hover:scale-105 transition-transform"
              />
            )
          ) : (
            <Avatar className="w-10 h-10 rounded-full border-2 border-orange-500 p-0.5 hover:scale-105 transition-transform">
              <AvatarFallback className="bg-slate-600 text-white">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          )}
        </Link>
      </div>
    </header>
  );
}

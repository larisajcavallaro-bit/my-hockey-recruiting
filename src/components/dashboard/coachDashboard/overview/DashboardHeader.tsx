"use client";

import { Bell, Menu } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Logo from "../../../../../public/newasset/auth/logo.png";
import Link from "next/link";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
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
          href="/parent-dashboard/notifications"
          className="relative cursor-pointer group"
        >
          <Bell className="text-slate-300 w-5 h-5 group-hover:text-white transition-colors" />
        </Link>

        <Link href="/parent-dashboard/profile">
          <Image
            src={Logo}
            alt="User"
            width={40}
            height={40}
            className="rounded-full border-2 border-orange-500 p-0.5 hover:scale-105 transition-transform"
          />
        </Link>
      </div>
    </header>
  );
}

"use client";

import { Menu, Shield } from "lucide-react";
import Image from "next/image";
import Logo from "../../../../public/newasset/auth/logo.png";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="h-16 w-full flex items-center justify-between px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-300 hover:bg-white/10 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/95 p-1 flex items-center justify-center shrink-0">
            <Image src={Logo} alt="Logo" width={32} height={32} className="object-contain" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Admin Portal</h1>
            <p className="text-slate-400 text-xs flex items-center gap-1">
              <Shield className="w-3 h-3" /> My Hockey Recruiting
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

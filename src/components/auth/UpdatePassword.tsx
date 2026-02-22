"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function UpdatePassword() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8">
      {/* 1. Background Layer (Fixed and behind everything) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/newasset/auth/Sign up.png"
          alt="Hockey Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay with slight blur as per your design */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 2. Card Layer (Centered automatically by the flex parent) */}
      <div className="relative z-10 w-full max-w-[500px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 text-white shadow-2xl">
        {/* Brand Identity */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="rounded-2xl bg-[#1e293b] p-4 shadow-lg flex items-center justify-center ring-1 ring-white/10">
            <Image
              src="/newasset/auth/logo2.png"
              width={100}
              height={100}
              alt="My Hockey Recruiting"
              className="object-contain"
            />
          </div>
          <span className="font-bold tracking-tight text-lg text-white">
            My Hockey Recruiting
          </span>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-xl font-bold mb-4 text-white leading-tight">
            Create a new password for your account
          </h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Access a comprehensive hub of materials tailored for exam success.
            Gain instant mastery over all mandatory school-leaving exam topics.
          </p>
        </div>

        <form className="space-y-6">
          {/* New Password Field */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest ml-1">
              New Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#2563eb] transition-colors" />
              <Input
                type={showNewPassword ? "text" : "password"}
                className="bg-white/5 border-white/10 pl-12 pr-12 h-12 text-sm text-white placeholder:text-gray-600 rounded-xl focus:border-[#2563eb]/50 focus:ring-0 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest ml-1">
              Confirm Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#2563eb] transition-colors" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                className="bg-white/5 border-white/10 pl-12 pr-12 h-12 text-sm text-white placeholder:text-gray-600 rounded-xl focus:border-[#2563eb]/50 focus:ring-0 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Update Button */}
          <Button className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] h-12 text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
            Update <CheckCircle2 className="w-4 h-4" />
          </Button>

          {/* Back Link */}
          <Link
            href="/auth/sign-in"
            className="flex items-center justify-center w-full text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors pt-2"
          >
            <ChevronLeft className="w-3 h-3 mr-1" /> Back to Login
          </Link>
        </form>
      </div>
    </main>
  );
}

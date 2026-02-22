"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronLeft,
  ArrowRight,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<"coach" | "parent">("coach");
  const router = useRouter();

  // Dynamic content based on user selection
  const isCoach = userType === "coach";

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/newasset/auth/Sign up.png" // Ensure this matches your public folder path
          alt="Hockey background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />{" "}
        {/* Dark overlay for readability */}
      </div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-[520px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 text-white shadow-2xl">
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex flex-col items-center gap-3 mb-4">
            <div className="rounded-2xl bg-[#1e293b] p-4 shadow-lg flex items-center justify-center ring-1 ring-white/10">
              <Image
                src="/newasset/auth/logo2.png"
                width={120}
                height={120}
                alt="My Hockey Recruiting"
                className="object-contain"
              />
            </div>
            <span className="font-bold tracking-tight text-xl text-white">
              My Hockey Recruiting
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-2">
            Create {isCoach ? "Coach" : "parent"} Account
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed max-w-[400px]">
            {isCoach
              ? "Set up your coach profile to verify players, share events, and communicate clearly with families."
              : "Set up a family account to manage player profiles, understand options, and navigate youth hockey with confidence."}
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex bg-black/20 p-1.5 rounded-xl mb-6 border border-white/10">
          <button
            onClick={() => setUserType("coach")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              isCoach
                ? "bg-button-clr1 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            I am a Coach
          </button>
          <button
            onClick={() => setUserType("parent")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              !isCoach
                ? "bg-button-clr1 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            I am a Parent
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <button
            onClick={() => router.back()}
            type="button"
            className="flex items-center text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-200 ml-1">
              Full Name
            </Label>
            <div className="relative group">
              <User className="absolute text-sub-text3/80 left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-blue-400 transition-colors" />
              <Input
                className="bg-white/5 placeholder:text-sub-text3/80 border-white/10 pl-11 focus:border-blue-500/50 focus:ring-0 h-12 text-white rounded-xl"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-200 ml-1">
              Email
            </Label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sub-text3/80 group-focus-within:text-blue-400 transition-colors" />
              <Input
                type="email"
                className="bg-white/5 border-white/10 pl-11 focus:border-blue-500/50 focus:ring-0 h-12 text-white placeholder:text-sub-text3/80 rounded-xl"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-200 ml-1">
              Phone Number
            </Label>
            <div className="relative group">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sub-text3/80 group-focus-within:text-blue-400 transition-colors" />
              <Input
                type="tel"
                className="bg-white/5 border-white/10 pl-11 focus:border-blue-500/50 focus:ring-0 h-12 text-white placeholder:text-sub-text3/80 rounded-xl"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-200 ml-1">
              Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sub-text3/80 group-focus-within:text-blue-400 transition-colors" />
              <Input
                type={showPassword ? "text" : "password"}
                className="bg-white/5 border-white/10 pl-11 pr-11 focus:border-blue-500/50 focus:ring-0 h-12 text-white placeholder:text-sub-text3/80 rounded-xl"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-200 ml-1">
              Confirm Password
            </Label>
            <div className="relative group">
              <Lock className="absolute text-sub-text3/80 left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-blue-400 transition-colors" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                className="bg-white/5 placeholder:text-sub-text3/80 border-white/10 pl-11 pr-11 focus:border-blue-500/50 focus:ring-0 h-12 text-white rounded-xl"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              id="terms"
              className="border-white/40 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <label htmlFor="terms" className="text-[11px] text-gray-300">
              I agree to the{" "}
              <span className="text-blue-400 hover:underline cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-blue-400 hover:underline cursor-pointer">
                Privacy Policy
              </span>
            </label>
          </div>

          {/* Submit */}
          <Button className="w-full h-12 text-sm font-bold flex items-center justify-center gap-2 rounded-xl transition-all shadow-lg active:scale-[0.98]">
            Create Account <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="text-blue-400 font-bold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TypeaheadInput } from "@/components/ui/TypeaheadInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Birth years for youth hockey (players typically born 2006-2016 for U10-U18)
const BIRTH_YEARS = Array.from({ length: 15 }, (_, i) => 2016 - i);

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<"coach" | "parent">("coach");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [league, setLeague] = useState("");
  const [level, setLevel] = useState("");
  const [team, setTeam] = useState("");
  const [birthYear, setBirthYear] = useState<number | "">("");
  const [coachRole, setCoachRole] = useState<"HEAD_COACH" | "ASSISTANT_COACH">("ASSISTANT_COACH");
  const router = useRouter();

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
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!terms) {
              toast.error("Please agree to the Terms of Service and Privacy Policy");
              return;
            }
            if (password !== confirmPassword) {
              toast.error("Passwords do not match");
              return;
            }
            if (password.length < 8) {
              toast.error("Password must be at least 8 characters");
              return;
            }
            if (!phone.trim()) {
              toast.error("Phone number is required for text verification");
              return;
            }
            if (isCoach) {
              if (!league.trim()) {
                toast.error("Please select your league");
                return;
              }
              if (!level.trim()) {
                toast.error("Please select the level you coach");
                return;
              }
              if (!team.trim()) {
                toast.error("Please select the team you coach");
                return;
              }
              if (!birthYear) {
                toast.error("Please select the birth year of the players you coach");
                return;
              }
            }
            setLoading(true);
            try {
              const res = await fetch("/api/auth/sign-up", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email,
                  password,
                  name,
                  userType,
                  phone: phone.trim() || undefined,
                  ...(isCoach && {
                    league: league.trim(),
                    level: level.trim(),
                    team: team.trim(),
                    birthYear,
                    coachRole,
                  }),
                }),
              });
              const data = await res.json().catch(() => ({}));
              if (!res.ok) throw new Error(data.error ?? "Sign up failed");
              // Redirect to verification - must verify before access
              const roleParam = userType === "coach" ? "COACH" : "PARENT";
              const verifyUrl = `/auth/email-verify?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&role=${roleParam}`;
              if (data._devCode) {
                toast.success(
                  `Account created! Your verification code is: ${data._devCode}`,
                  { duration: 10000 }
                );
              } else {
                toast.success("Account created! Check your phone for the verification code.");
              }
              router.push(verifyUrl);
            } catch (err) {
              const msg = err instanceof Error ? err.message : "Sign up failed";
              toast.error(msg);
              if (typeof msg === "string" && msg.includes("head coach is already registered")) {
                toast.info("Use the Contact Us page to submit a dispute if you believe this is a mistake.", {
                  duration: 8000,
                  action: { label: "Contact Us", onClick: () => router.push("/contact-us") },
                });
              }
            } finally {
              setLoading(false);
            }
          }}
        >
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="bg-white/5 border-white/10 pl-11 focus:border-blue-500/50 focus:ring-0 h-12 text-white placeholder:text-sub-text3/80 rounded-xl"
                placeholder="e.g. 555-123-4567 (for text verification)"
              />
            </div>
          </div>

          {/* Coach-specific: League > Level > Team, Birth Year, Role */}
          {isCoach && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-200 ml-1">League</Label>
                <TypeaheadInput
                  fetchUrl="/api/leagues?q={q}"
                  value={league}
                  onChange={setLeague}
                  itemsKey="leagues"
                  placeholder="Type to search leagues..."
                  className="bg-white/5 border-white/10 h-12 text-white rounded-xl placeholder:text-gray-400"
                />
                <p className="text-[11px] text-gray-400 ml-1">
                  Don&apos;t see yours? Use <Link href="/contact-us" className="text-blue-400 hover:underline">Contact Us</Link> to request it.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-200 ml-1">Level You Coach</Label>
                <TypeaheadInput
                  fetchUrl="/api/levels?q={q}"
                  value={level}
                  onChange={setLevel}
                  itemsKey="levels"
                  placeholder="Type to search levels..."
                  className="bg-white/5 border-white/10 h-12 text-white rounded-xl placeholder:text-gray-400"
                />
                <p className="text-[11px] text-gray-400 ml-1">
                  Don&apos;t see yours? Use <Link href="/contact-us" className="text-blue-400 hover:underline">Contact Us</Link> to request it.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-200 ml-1">Team You Coach</Label>
                <TypeaheadInput
                  fetchUrl="/api/teams?q={q}"
                  value={team}
                  onChange={setTeam}
                  itemsKey="teams"
                  placeholder="Type to search teams..."
                  className="bg-white/5 border-white/10 h-12 text-white rounded-xl placeholder:text-gray-400"
                />
                <p className="text-[11px] text-gray-400 ml-1">
                  Don&apos;t see yours? Use <Link href="/contact-us" className="text-blue-400 hover:underline">Contact Us</Link> to request it.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-200 ml-1">
                  Birth Year of Players You Coach
                </Label>
                <Select
                  value={birthYear === "" ? " " : String(birthYear)}
                  onValueChange={(v) => setBirthYear(v === " " ? "" : parseInt(v, 10))}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 h-12 text-white rounded-xl w-full [&>span]:text-white">
                    <SelectValue placeholder="Select birth year" />
                  </SelectTrigger>
                  <SelectContent className="!bg-slate-800 !text-white border-slate-600 [&>*]:text-white">
                    <SelectItem value=" " className="!text-white focus:!bg-white/20 focus:!text-white">
                      Select birth year
                    </SelectItem>
                    {BIRTH_YEARS.map((y) => (
                      <SelectItem key={y} value={String(y)} className="!text-white focus:!bg-white/20 focus:!text-white">
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-200 ml-1">
                  Coaching Role
                </Label>
                <Select
                  value={coachRole}
                  onValueChange={(v) => setCoachRole(v as "HEAD_COACH" | "ASSISTANT_COACH")}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 h-12 text-white rounded-xl w-full [&>span]:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="!bg-slate-800 !text-white border-slate-600 [&>*]:text-white">
                    <SelectItem value="ASSISTANT_COACH" className="!text-white focus:!bg-white/20 focus:!text-white">
                      Assistant Coach
                    </SelectItem>
                    <SelectItem value="HEAD_COACH" className="!text-white focus:!bg-white/20 focus:!text-white">
                      Head Coach
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-gray-400 ml-1">
                  Only one head coach per team/level/birth year. If head coach is taken, use Contact
                  Us to dispute.
                </p>
              </div>
            </>
          )}

          {/* Password */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-200 ml-1">
              Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sub-text3/80 group-focus-within:text-blue-400 transition-colors" />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
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
              checked={terms}
              onCheckedChange={(c) => setTerms(!!c)}
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
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-sm font-bold flex items-center justify-center gap-2 rounded-xl transition-all shadow-lg active:scale-[0.98]"
          >
            {loading ? "Creating..." : "Create Account"}{" "}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="text-blue-400 font-bold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}

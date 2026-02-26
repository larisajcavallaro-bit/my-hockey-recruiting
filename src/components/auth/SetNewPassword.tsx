"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ChevronLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

function SetNewPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/auth/forgot-password");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/set-new-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resetToken: token,
          newPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to update password");
      toast.success("Password reset! Sign in with your new password.");
      router.push("/auth/sign-in");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <Image
          src="/newasset/auth/Sign up.png"
          alt="Hockey background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-[500px] bg-[#1a1a1a]/65 backdrop-blur-xl border border-white/10 rounded-[28px] p-8 md:p-12 text-white shadow-2xl text-center">
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
          <span className="font-bold tracking-tight text-xl text-white">
            My Hockey Recruiting
          </span>
        </div>

        <h1 className="text-2xl font-bold mb-3">Create New Password</h1>
        <p className="text-sm text-gray-400 mb-8">
          Enter your new password below. You&apos;ll use this to sign in from now
          on.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-left text-xs font-medium text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-white/5 border-white/20 h-12 pr-10 text-white"
                placeholder="At least 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-left text-xs font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-white/5 border-white/20 h-12 text-white"
              placeholder="Confirm your new password"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full hover:bg-[#1d4ed8] h-12 text-sm font-bold rounded-xl"
          >
            {loading ? "Updating..." : "Reset Password"}{" "}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <button
            type="button"
            onClick={() => router.push("/auth/sign-in")}
            className="flex items-center justify-center w-full text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest"
          >
            <ChevronLeft className="w-3 h-3 mr-1" /> Back to Sign In
          </button>
        </form>
      </div>
    </main>
  );
}

export default function SetNewPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background2">
          <p className="text-white">Loading...</p>
        </main>
      }
    >
      <SetNewPasswordContent />
    </Suspense>
  );
}

"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

function OTPVerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") ?? "";
  const phone = searchParams.get("phone") ?? "";

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState(50);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.push("/auth/sign-up");
    }
  }, [email, router]);

  // Countdown logic for "Resend Code"
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const val = element.value.replace(/\D/g, "").slice(-1);
    if (!val) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-advance to next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length > 0) {
      const digits = pasted.split("");
      setOtp((prev) => {
        const next = [...prev];
        digits.forEach((d, i) => (next[i] = d));
        return next;
      });
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const digits = phone.replace(/\D/g, "");
  const maskedPhone = digits.length >= 4 ? `***-***-${digits.slice(-4)}` : "your phone";

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to resend");
      setTimer(60);
      if (data._devCode) {
        toast.success(`Code resent: ${data._devCode}`, { duration: 8000 });
      } else {
        toast.success("Code resent to your phone.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to resend");
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Verification failed");

      // Auto sign-in with one-time token (no password needed)
      const token = data.oneTimeToken;
      if (token) {
        const result = await signIn("credentials", {
          email,
          oneTimeToken: token,
          redirect: false,
        });
        if (result?.ok) {
          toast.success("Verified! Welcome to your portal.");
          const role = new URLSearchParams(window.location.search).get("role");
          const dest = role === "COACH" ? "/coach-dashboard" : "/parent-dashboard";
          router.push(dest);
          router.refresh();
          return;
        }
      }

      // Fallback: redirect to sign-in if auto sign-in failed
      toast.success("Verified! Sign in to access your portal.");
      router.push(`/auth/sign-in?verified=1&email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4">
      {/* Background Image Overlay */}
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

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-[500px] bg-[#1a1a1a]/65 backdrop-blur-xl border border-white/10 rounded-[28px] p-8 md:p-12 text-white shadow-2xl text-center">
        {/* Logo */}
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

        <h1 className="text-2xl font-bold mb-3">
          Enter Your Verification Code
        </h1>
        <p className="text-xs text-gray-400 mb-2">
          Enter the 6-digit code we sent to your phone.
        </p>
        <p className="text-xs font-medium mb-10">
          Code sent to{" "}
          <span className="underline decoration-gray-500 underline-offset-4">
            {maskedPhone}
          </span>
        </p>

        {/* OTP Input Group */}
        <div className="flex justify-between gap-2 mb-10">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              maxLength={1}
              inputMode="numeric"
              autoComplete="one-time-code"
              value={digit}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-12 h-14 md:w-14 md:h-16 text-center text-xl font-bold bg-white/5 border-white/20 rounded-xl focus:border-[#2563eb] focus:ring-0 transition-all"
            />
          ))}
        </div>

        <div className="space-y-6">
          <div className="text-[11px] text-gray-400">
            Did not receive the code?{" "}
            <button
              type="button"
              disabled={timer > 0}
              onClick={handleResend}
              className={`mt-1 font-bold ${timer > 0 ? "text-sub-text3/80 cursor-not-allowed" : "text-blue-500 hover:underline"}`}
            >
              Resend code{timer > 0 ? ` (${timer}s)` : ""}
            </button>
          </div>

          <Button
            onClick={handleVerify}
            disabled={loading}
            className="w-full hover:bg-[#1d4ed8] h-12 text-sm font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? "Verifying..." : "Verify"}{" "}
            <ArrowRight className="w-4 h-4" />
          </Button>

          <button
            type="button"
            onClick={() => router.push("/auth/sign-up")}
            className="flex items-center justify-center w-full text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
          >
            <ChevronLeft className="w-3 h-3 mr-1" />
            Back to Sign Up
          </button>
        </div>
      </div>
    </main>
  );
}

export default function OTPVerificationPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background2">
          <p className="text-white">Loading...</p>
        </main>
      }
    >
      <OTPVerificationContent />
    </Suspense>
  );
}

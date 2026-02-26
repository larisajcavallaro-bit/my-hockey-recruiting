"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

function ForgotPasswordVerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.push("/auth/forgot-password");
    }
  }, [email, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const val = element.value.replace(/\D/g, "").slice(-1);
    if (!val) {
      setOtp((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }
    setOtp((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
    if (index < 5) inputRefs.current[index + 1]?.focus();
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

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      const res = await fetch("/api/auth/forgot-password-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to resend");
      setTimer(60);
      toast.success("Code resent to your phone.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to resend");
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 4) {
      toast.error("Please enter the verification code");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Verification failed");

      const resetToken = data.resetToken;
      if (resetToken) {
        router.push(
          `/auth/set-new-password?token=${encodeURIComponent(resetToken)}`
        );
        return;
      }
      toast.error("Something went wrong. Please try again.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

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

        <h1 className="text-2xl font-bold mb-3">Enter Verification Code</h1>
        <p className="text-xs text-gray-400 mb-2">
          Enter the 6-digit code we sent to your phone.
        </p>
        <p className="text-xs font-medium mb-10">
          Code sent to the phone for <span className="underline decoration-gray-500 underline-offset-4">{email}</span>
        </p>

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
            Didn&apos;t get the code?{" "}
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
            {loading ? "Verifying..." : "Verify & Sign In"}{" "}
            <ArrowRight className="w-4 h-4" />
          </Button>

          <button
            type="button"
            onClick={() => router.push("/auth/forgot-password")}
            className="flex items-center justify-center w-full text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
          >
            <ChevronLeft className="w-3 h-3 mr-1" /> Back
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ForgotPasswordVerifyPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background2">
          <p className="text-white">Loading...</p>
        </main>
      }
    >
      <ForgotPasswordVerifyContent />
    </Suspense>
  );
}

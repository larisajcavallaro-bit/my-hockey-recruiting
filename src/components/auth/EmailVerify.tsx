"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState(50);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown logic for "Resend Code"
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
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
  const router = useRouter();
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
          Enter the 6-digit code we sent to your email.
        </p>
        <p className="text-xs font-medium mb-10">
          Enter the 6-digit code we sent to{" "}
          <span className="underline decoration-gray-500 underline-offset-4">
            t*n@gl.com.
          </span>
        </p>

        {/* OTP Input Group */}
        <div className="flex justify-between gap-2 mb-10">
          {otp.map((digit, index) => (
            <Input
              key={index}
              type="text"
              maxLength={1}
              // ref={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 md:w-14 md:h-16 text-center text-xl font-bold bg-white/5 border-white/20 rounded-xl focus:border-[#2563eb] focus:ring-0 transition-all"
            />
          ))}
        </div>

        <div className="space-y-6">
          <div className="text-[11px] text-gray-400">
            Did not receive verification code? <br />
            <button
              disabled={timer > 0}
              className={`mt-1 font-bold ${timer > 0 ? "text-sub-text3/80" : "text-blue-500 hover:underline"}`}
            >
              Resend Code, 00:{timer < 10 ? `0${timer}` : timer}
            </button>
          </div>

          <Button className="w-full hover:bg-[#1d4ed8] h-12 text-sm font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
            Verify <ArrowRight className="w-4 h-4" />
          </Button>

          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-full text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
          >
            <ChevronLeft className="w-3 h-3 mr-1" />
            Back
          </button>
        </div>
      </div>
    </main>
  );
}

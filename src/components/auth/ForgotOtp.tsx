"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerificationPage() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 3) inputs.current[index + 1]?.focus();
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <Image
          src="/newasset/auth/Sign up.png"
          alt="BG"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-[480px] bg-[#1a1a1a]/60 backdrop-blur-2xl border border-white/10 rounded-[28px] p-10 text-white text-center">
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

        <h1 className="text-2xl font-bold mb-4">Check your email</h1>
        <p className="text-sm text-gray-400 mb-8 leading-relaxed">
          We sent a verification code to{" "}
          <span className="text-white font-medium">lasira@gmail.com</span>.
          Enter it below to continue.
        </p>

        <div className="flex justify-center gap-4 mb-8">
          {otp.map((digit, i) => (
            <Input
              key={i}
              // ref={(el) => (inputs.current[i] = el)}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              className="w-14 h-14 text-center text-xl font-bold bg-white/5 border-white/10 rounded-xl focus:border-blue-500"
            />
          ))}
        </div>

        <Button className="w-full hover:bg-blue-700 h-12 text-sm font-bold rounded-xl mb-6">
          Verify Code <ArrowRight className="ml-2 w-4 h-4" />
        </Button>

        <p className="text-xs text-gray-500">
          Did not receive the code?{" "}
          <button className="text-blue-500 hover:underline">Resend code</button>
        </p>
      </div>
    </main>
  );
}

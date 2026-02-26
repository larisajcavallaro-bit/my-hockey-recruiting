"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to send code");
      toast.success("Verification code sent to your phone.");
      router.push(`/auth/forgot-password-verify?email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <Image
          src="/newasset/auth/Sign up.png"
          alt="logo"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-[480px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-10 text-sub-text3">
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

        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <p className="text-sm text-gray-400 mb-8 leading-relaxed">
          Enter the email associated with your account. We&apos;ll send a
          verification code to the phone number on file so you can sign in and
          reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-300">
              Email address
            </Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 h-12 text-white placeholder:text-sub-text3/80 rounded-lg focus:border-blue-500/50"
              placeholder="Enter your Email"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-sm font-bold rounded-lg shadow-lg"
          >
            {loading ? "Sending..." : "Send Verification Code"}
          </Button>

          <button
            onClick={() => router.back()}
            type="button"
            className="w-full flex justify-center items-center text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
        </form>
      </div>
    </main>
  );
}

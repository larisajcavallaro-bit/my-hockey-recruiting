"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, ArrowRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
  rememberMe: z.boolean(),
});

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? undefined;
  const verifiedEmail = searchParams.get("email") ?? "";
  const verified = searchParams.get("verified") === "1";
  const [showP, setShowP] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: verifiedEmail,
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (verified) {
      toast.success("Your phone is verified! Sign in to access your portal.");
    }
  }, [verified]);

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/newasset/auth/Sign up.png')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-secondary-foreground/40" />

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl border border-white/10 bg-secondary-foreground/40 backdrop-blur-xl shadow-2xl text-sub-text3">
        <div className="flex flex-col items-center gap-3 mb-8">
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

        <div className="mb-8 text-center flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-sm text-sub-text3/80 mt-1">
            Sign in to your account to continue.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              async (v) => {
                setLoading(true);
                try {
                  const result = await signIn("credentials", {
                    email: v.email.trim().toLowerCase(),
                    password: v.password,
                    redirect: false,
                  });
                  if (result?.error) {
                    const msg =
                      result.error === "CredentialsSignin" ||
                      result.error === "Configuration"
                        ? "Invalid email or password"
                        : result.error;
                    const needsVerify = typeof msg === "string" && msg.includes("verify your phone");
                    toast.error(msg, {
                      duration: needsVerify ? 10000 : 5000,
                      action: needsVerify
                        ? {
                            label: "Verify phone",
                            onClick: () =>
                              router.push(`/auth/email-verify?email=${encodeURIComponent(v.email.trim())}`),
                          }
                        : undefined,
                    });
                    return;
                  }
                  if (result?.ok) {
                    const session = await getSession();
                    const url =
                      callbackUrl ??
                      (session?.user?.role === "ADMIN"
                        ? "/admin-dashboard"
                        : session?.user?.role === "COACH"
                          ? "/coach-dashboard"
                          : "/parent-dashboard");
                    router.push(url ?? "/parent-dashboard");
                    router.refresh();
                  } else {
                    toast.error("Sign in failed. Please try again.");
                  }
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Sign in failed");
                } finally {
                  setLoading(false);
                }
              },
              (errors) => {
                const first = Object.values(errors)[0];
                toast.error(first?.message?.toString() ?? "Please fix the form errors.");
              }
            )}
            className="space-y-5"
          >
            <button
              onClick={() => router.back()}
              type="button"
              className="flex items-center text-xs text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </button>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase text-sub-text3/80">
                    Email
                  </FormLabel>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-3 text-sub-text3/80"
                      size={18}
                    />
                    <FormControl>
                      <Input
                        className="bg-primary-foreground/5 placeholder:text-sub-text3/80 border-primary-foreground/20 pl-10 pr-10 focus-visible:ring-primary h-12"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase text-sub-text3/80">
                    Password
                  </FormLabel>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-3 text-sub-text3/80 group-focus-within:text-blue-400 transition-colors"
                      size={18}
                    />
                    <FormControl>
                      <Input
                        type={showP ? "text" : "password"}
                        className="bg-primary-foreground/5 placeholder:text-sub-text3/80 border-primary-foreground/20 pl-10 pr-10 focus-visible:ring-primary h-12"
                        placeholder="Create a strong password"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowP(!showP)}
                      className="absolute right-3 top-3 text-sub-text3/80"
                    >
                      {showP ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-white/40 data-[state=checked]:bg-button-clr1"
                    />
                    <label
                      htmlFor="remember"
                      className="text-xs text-sub-text3/80 cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>
                )}
              />
              <Link
                href="/auth/forgot-password"
                className="text-xs text-sub-text2/85 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg bg-button-clr1/80 hover:bg-button-clr1 text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </Form>

        <p className="mt-8 text-center text-sm text-sub-text3/60">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="text-sub-text2/85 font-bold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

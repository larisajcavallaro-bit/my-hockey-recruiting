"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import { Menu, User, LogOut, X } from "lucide-react";
import logo from "../../../../../public/newasset/auth/logo.png";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session?.user;
  const role = (session?.user as { role?: string })?.role;
  const coachProfileId = (session?.user as { coachProfileId?: string | null })?.coachProfileId;
  const dashboardPath =
    role === "ADMIN" ? "/admin-dashboard" : role === "COACH" ? "/coach-dashboard" : "/parent-dashboard";

  const fetchProfileImage = useCallback(() => {
    if (!isLoggedIn) return;
    if (role === "COACH" && coachProfileId) {
      fetch(`/api/coaches/${coachProfileId}`)
        .then((r) => r.json())
        .then((data) => {
          if (!data.error && (data.image || data.user?.image)) {
            setProfileImage(data.image ?? data.user?.image ?? null);
          }
        })
        .catch(() => {});
    } else if (role === "PARENT") {
      fetch("/api/profile")
        .then((r) => r.json())
        .then((data) => {
          if (!data.error && data.image) setProfileImage(data.image);
        })
        .catch(() => {});
    }
  }, [isLoggedIn, role, coachProfileId]);

  useEffect(() => {
    fetchProfileImage();
  }, [fetchProfileImage]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Training", path: "/training" },
    { name: "Teams and Schools", path: "/teams-and-schools" },
    ...(role === "COACH" ? [] : [{ name: "Subscription", path: "/subscription" }]),
    { name: "Contact", path: "/contact-us" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <header className="sticky border-b text-primary-foreground bg-nav-background2 top-0 z-50">
      <section className="container mx-auto px-4 sm:px-6 flex justify-between items-center py-4 h-20 min-w-0">
        {/* Logo - Option A: white rounded backdrop for contrast on dark header */}
        <div className="flex gap-2 items-center justify-start min-w-0 overflow-hidden">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/95 p-1.5 shadow-sm">
            <Image width={44} height={44} src={logo} alt="Logo" className="object-contain" />
          </div>
          <h1 className="font-semibold text-base sm:text-lg truncate">My Hockey Recruiting</h1>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                ${isActive ? "text-primary font-semibold" : "text-foreground hover:text-primary"}`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop Right */}
        {isLoggedIn ? (
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={dashboardPath}
              className="flex items-center gap-2 text-sm font-medium hover:underline"
            >
              {profileImage ? (
                profileImage.startsWith("data:") ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-9 h-9 rounded-full border-2 border-primary/50 object-cover"
                  />
                ) : (
                  <Image
                    src={profileImage}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-primary/50 object-cover w-9 h-9"
                  />
                )
              ) : (
                <span className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </span>
              )}
              My Dashboard
            </Link>
            <button
              onClick={() => signOut()}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/auth/sign-in"
              className="text-sm font-medium hover:underline"
            >
              Sign In
            </Link>
            <Link href="/auth/sign-up">
              <Button className="rounded-lg w-full bg-button-clr1">
                Sign Up
              </Button>
            </Link>
          </div>
        )}

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden flex items-center justify-center p-2 rounded-md hover:bg-muted"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </section>

      {/* Overlay */}
      <div
        className={`lg:hidden fixed inset-0 transition-opacity duration-500 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 bg-nav-background2 z-50 transform transition-all duration-500 ease-in-out ${
          isOpen
            ? "translate-y-0 opacity-100 mt-20"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-4 px-4 py-6 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;

            return (
              <Link
                key={link.name}
                href={link.path}
                className={`text-foreground text-lg font-medium transition 
                ${isActive ? "text-primary font-semibold" : "hover:text-primary"}`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Mobile user menu */}
          {isLoggedIn ? (
            <div className="flex flex-col gap-3 pt-4 border-t border-white/20">
              <Link
                href={dashboardPath}
                className="flex items-center gap-2 text-foreground text-lg font-medium hover:text-primary transition"
                onClick={() => setIsOpen(false)}
              >
                {profileImage ? (
                  profileImage.startsWith("data:") ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-primary/50 object-cover"
                    />
                  ) : (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-primary/50 object-cover"
                    />
                  )
                ) : (
                  <User className="w-5 h-5" />
                )}
                My Dashboard
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 text-foreground text-lg font-medium hover:text-primary transition text-left"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:hidden gap-5 space-x-4">
              <Link
                href="/auth/sign-in"
                className="text-foreground text-lg font-medium hover:text-primary transition"
              >
                Sign In
              </Link>
              <Link href="/auth/sign-up">
                <Button className="rounded-2xl w-full">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

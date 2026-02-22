"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";
import { Menu, User, X } from "lucide-react";
import logo from "../../../../../public/newasset/auth/logo.png";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const user = false;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Facilities", path: "/facilities" },
    { name: "Subscription", path: "/subscription" },
    { name: "Contact", path: "/contact-us" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <header className="sticky border-b text-primary-foreground bg-nav-background2 top-0 z-50">
      <section className="container mx-auto px-4 flex justify-between items-center py-4 h-20">
        {/* Logo - Option A: white rounded backdrop for contrast on dark header */}
        <div className="flex gap-2 items-center justify-start">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/95 p-1.5 shadow-sm">
            <Image width={44} height={44} src={logo} alt="Logo" className="object-contain" />
          </div>
          <h1 className="font-semibold text-lg">My Hockey Recruiting</h1>
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
        {user ? (
          <div className="hidden lg:flex items-end gap-3">
            <Link
              href="/dashboard"
              className="text-sm font-medium bg-primary p-3 rounded-full"
            >
              <User />
            </Link>
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
          {user ? (
            <Link
              href="/auth/sign-in"
              className="text-sm font-medium hover:underline"
            >
              Account
            </Link>
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

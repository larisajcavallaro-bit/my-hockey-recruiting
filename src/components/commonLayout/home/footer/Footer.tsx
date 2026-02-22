// components/Footer.tsx
import type { FC } from "react";
import Link from "next/link";
import logo from "../../../../../public/newasset/auth/logo.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Footer: FC = () => {
  return (
    <footer className="bg-[#E9EFFD] text-secondary-foreground">
      {/* Main content area - centered layout */}
      <div className="max-w-3xl mx-auto px-6 py-14 text-center">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 rounded-xl bg-white p-2 shadow-md ring-1 ring-black/5">
              <Image
                src={logo}
                alt="My Hockey Recruiting Logo"
                width={40}
                height={40}
                priority
                className="h-10 w-10 object-contain"
              />
            </div>
            <span className="text-2xl md:text-3xl font-bold text-secondary-foreground tracking-tight">
              My Hockey Recruiting
            </span>
          </div>
          <p className="text-sub-text1/70 leading-relaxed text-base max-w-md">
            Helping families navigate youth hockey with clarity, credibility,
            and confidence.
          </p>
          <div className="pt-2">
            <Link href="/contact-us">
              <Button className="bg-button-clr1 hover:bg-button-clr1/90 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                Contact Form
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom blue bar */}
      <div className="bg-button-clr1 text-white py-5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <div>Copyright © 2026 My Hockey Recruiting. All rights reserved.</div>
          <div className="mt-3 md:mt-0 flex flex-wrap justify-center gap-4 md:gap-6">
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

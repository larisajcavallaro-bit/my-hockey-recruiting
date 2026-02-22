import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { Users, UserPlus } from "lucide-react";

const Banner = () => {
  return (
    <div
      className="relative h-[60vh] md:h-[calc(100vh-80px)] bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: "url(/newasset/homepage/hero/hero-bg-img.png)",
      }}
    >
      {/* Gradient overlay */}

      {/* Main content — bottom */}
      <div className="relative z-10 h-full flex items-end">
        <div className="inset-0 w-full bg-gradient-to-t from-black/20 via-black/40 to-white/10">
          <div className="container pt-12 mx-auto px-4 pb-12 md:pb-20">
            <div className="flex flex-col items-center text-center">
              {/* Top badge */}
              <div className="mb-6 flex items-center gap-2 bg-[#1e3a8a]/80 backdrop-blur-sm border border-blue-400/30 px-4 py-1.5 rounded-full text-white text-sm md:text-base font-medium">
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                Helping Families Navigate Youth Hockey
              </div>

              <h1 className="text-background text-3xl sm:text-4xl md:text-3xl lg:text-3xl font-bold leading-[1.1] tracking-tight max-w-5xl mb-6">
                Clarity, Credibility, and Confidence
                <br />
                for the Youth Hockey Journey
              </h1>

              <p className="text-background/90 text-lg md:text-xl lg:text-2xl max-w-4xl leading-relaxed mb-10 font-normal">
                A player-first platform built to help families understand their
                options, verify credibility, and make informed decisions about
                teams, coaches, and development.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4 sm:mt-8 w-full sm:w-auto">
                <Link href="/#buy-Tickets" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto rounded-lg text-base md:text-lg font-medium"
                  >
                    <Users size={20} />
                    Get Started as a Coach
                  </Button>
                </Link>

                <Link href="/#faq" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto rounded-lg text-base md:text-lg font-medium bg-primary-foreground hover:bg-white/10 hover:text-background"
                  >
                    <UserPlus size={20} />
                    Get Started as a Parent
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;

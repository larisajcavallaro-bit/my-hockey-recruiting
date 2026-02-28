// components/HeroSection.tsx
import type { FC } from "react";
import Link from "next/link";

const HeroSection: FC = () => {
  return (
    <section
      className="relative pt-11 pb-11 flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url(/newasset/homepage/hero/hero-bg-last.png)",
      }}
    >
      {/* Overlay for better text readability */}
      <div />
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight drop-shadow-2xl">
          Helping Families Navigate
          <br className="sm:block" />
          <span className="text-sub-text1">Youth Hockey</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl md:text-2xl text-background/80 max-w-4xl mx-auto font-light leading-relaxed drop-shadow-lg">
          A player-first platform designed to bring clarity, credibility, and
          confidence
          <br className="hidden md:block" />
          to every step of the youth hockey journey.
        </p>

        <div className="mt-10 sm:mt-14">
          <Link
            href="/auth/sign-up" // ← change to your actual signup / get-started route
            className="inline-block px-10 py-3 bg-button-clr1 hover:bg-button-clr1/10 text-background text-xl md:text-2xl font-semibold rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-button-clr1/10 focus:ring-opacity-50 hover:text-sub-text1/50"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

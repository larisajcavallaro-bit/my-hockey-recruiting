// components/FeaturesSection.tsx
import type { FC } from "react";

const FeaturesSection: FC = () => {
  return (
    <section
      className="relative min-h-[70vh] md:min-h-[85vh] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url(/newasset/homepage/feature/feature-bg-img.png)",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-20 lg:py-24">
        {/* Heading */}
        <div className="text-center text-button-clr1/70 mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground mb-6 drop-shadow-lg">
            Built for Clarity and Trust in Youth Hockey
          </h2>
          <p className="text-base md:text-lg text-secondary-foreground/60 max-w-3xl mx-auto leading-relaxed">
            A player-first platform designed to help families and coaches
            navigate youth hockey with transparency, verification, and control.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Card 1 */}
          <div className="bg-white backdrop-blur-sm rounded-2xl shadow-xl p-7 md:p-8 text-center transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl border border-secondary-foreground/5">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-button-clr1/20 text-button-clr1">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-sub-text1 mb-4">
              Verified Profiles
            </h3>
            <p className="text-sub-text leading-relaxed">
              Player profiles can be verified by coaches, adding credibility and
              transparency where it matters.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white backdrop-blur-sm rounded-2xl shadow-xl p-7 md:p-8 text-center transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl border border-secondary-foreground/5">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-button-clr1/20 text-button-clr1">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8a5 5 0 11-10 0 5 5 0 0110 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Privacy First
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Families stay in control of privacy, with contact information
              shared only when explicitly approved.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white backdrop-blur-sm rounded-2xl shadow-xl p-7 md:p-8 text-center transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl border border-white/20">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-button-clr1/20 text-button-clr1">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Event RSVP</h3>
            <p className="text-gray-700 leading-relaxed">
              Coaches can post events and manage RSVPs for ID skates, tryouts,
              camps, and hockey-related activities.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white backdrop-blur-sm rounded-2xl shadow-xl p-7 md:p-8 text-center transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl border border-white/20">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-button-clr1/20 text-button-clr1">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M6 12h12M10 18h4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Advanced Filters
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Search and filter profiles by league, position, age group, and
              other relevant details.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

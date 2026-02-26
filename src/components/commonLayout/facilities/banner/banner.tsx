// components/HeroBanner.tsx
"use client";

export default function HeroBanner() {
  return (
    <section
      className="relative h-[60vh] md:h-[calc(100vh-80px)] bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage:
          "url(/newasset/facilities/banner/facilitiesBanner.png)",
      }}
    >
      {/* Overlay gradient */}
      <div className="" />

      {/* Main content - centered both horizontally & vertically */}
      <div className="relative z-20 flex min-h-full items-center justify-center">
        <div className="container mx-auto px-5 sm:px-8 w-full max-w-6xl text-center">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight drop-shadow-2xl mb-5 md:mb-8 leading-tight">
            Find Training
            <br className="hidden sm:block" />
            You Can Trust
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/95 max-w-4xl mx-auto drop-shadow-lg font-light">
            Explore ice rinks, gyms, and training centers near you — with parent
            reviews
            <br className="hidden sm:inline" /> and clear information to help
            families make informed decisions.
          </p>
        </div>
      </div>
    </section>
  );
}

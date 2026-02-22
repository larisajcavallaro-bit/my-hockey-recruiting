// components/HowItWorks.tsx
import type { FC } from "react";

const steps = [
  {
    number: "01",
    title: "Create Profile",
    description:
      "Create a player or coach profile with the information that matters, managed and controlled by you.",
    icon: (
      <svg
        className="h-10 w-10 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Verify & Explore",
    description:
      "Coaches can verify player profiles, and families can explore teams, coaches, events, and training resources.",
    icon: (
      <svg
        className="h-10 w-10 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Stay Informed & In Control",
    description:
      "Use the platform to stay informed, manage visibility, and make confident decisions as your player develops.",
    icon: (
      <svg
        className="h-10 w-10 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
];

const HowItWorks: FC = () => {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="inline-block text-button-clr1/70 uppercase tracking-wider text-sm font-semibold mb-3">
            HOW IT WORKS
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-secondary-foreground mb-5">
            How My Hockey Recruiting Works
          </h2>

          <p className="text-lg text-secondary-foreground/60 max-w-3xl mx-auto leading-relaxed">
            Getting started is straightforward, with tools designed to support
            families and coaches from day one.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Horizontal connecting line – visible only on md+ */}
          <div className="hidden md:block absolute top-[4.5rem] left-1/2 -translate-x-1/2 w-[70%] h-0.5 bg-secondary-foreground/40 " />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 relative">
            {steps.map((step, idx) => (
              <div
                key={step.number}
                className="flex flex-col items-center text-center relative"
              >
                {/* Circle + Number */}
                <div className="relative mb-6 md:mb-8">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white border-4 border-blue-100 flex items-center justify-center shadow-lg relative z-10">
                    <div className="bg-accent-">{step.icon}</div>
                  </div>
                  {/* Number badge */}
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-button-clr1 text-white text-sm font-bold flex items-center justify-center shadow-md border-2 border-white z-20">
                    {step.number}
                  </div>
                  {/* Small connecting line on mobile */}
                  {/* {idx < steps.length - 1 && (
                    <div className=" md:hidden absolute top-1/2 left-full w-16 h-0.5 bg-blue-200 -translate-y-1/2" />
                  )} */}
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-sub-text1 mb-4">
                  {step.title}
                </h3>

                <p className="text-sub-text leading-relaxed max-w-xs mx-auto text-base">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

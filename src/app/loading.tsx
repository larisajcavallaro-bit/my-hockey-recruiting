"use client";

import { useState, useEffect } from "react";
import { Loader2, BookOpen, Target, TrendingUp, Award } from "lucide-react";

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    { icon: BookOpen, text: "Small progress every day makes big change" },
    { icon: Target, text: "Set clear goals and track your milestones" },
    { icon: TrendingUp, text: "Consistency beats intensity over time" },
    { icon: Award, text: "Celebrate your learning achievements" },
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 30);

    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, []);

  const TipIcon = tips[currentTip].icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4">
      {/* Logo Section */}
      <div className="mb-8 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-primary blur-2xl opacity-20 rounded-full"></div>
          <div className="relative bg-primary text-primary-foreground px-8 py-4 rounded-2xl shadow-xl">
            <h1 className="text-4xl font-bold tracking-tight">
              My Hockey Recruiting
            </h1>
          </div>
        </div>
        <p className="text-base text-muted-foreground font-medium">
          Preparing your learning environment...
        </p>
      </div>

      {/* Interactive Loading Animation */}
      <div className="relative mb-8 w-32 h-32">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-border"></div>

        {/* Animated progress ring */}
        <svg className="w-32 h-32 absolute inset-0 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            className="stroke-primary"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.3s ease" }}
          />
        </svg>

        {/* Center spinner and percentage */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-1" />
          <span className="text-sm font-semibold text-foreground">
            {progress}%
          </span>
        </div>

        {/* Orbiting dots */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 opacity-0"
            style={{
              animation: `orbit 3s linear infinite ${i * 0.75}s, orbitFadeIn 0.3s ease-out ${i * 0.75}s forwards`,
            }}
          >
            <div className="w-3 h-3 bg-primary rounded-full shadow-lg"></div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-80 max-w-full mb-8">
        <div className="h-2 bg-secondary rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Animated Tips Section */}
      <div className="bg-card rounded-xl shadow-lg px-6 py-4 max-w-md w-full border border-border">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            <div className="bg-secondary p-2 rounded-lg">
              <TipIcon className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
              Learning Tip
            </p>
            <p
              key={currentTip}
              className="text-sm text-muted-foreground leading-relaxed"
              style={{
                animation: "fadeIn 0.5s ease-out",
              }}
            >
              {tips[currentTip].text}
            </p>
          </div>
        </div>

        {/* Tip indicators */}
        <div className="flex justify-center gap-1.5 mt-4">
          {tips.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentTip ? "w-8 bg-primary" : "w-1.5 bg-muted"
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Loading stages */}
      <div className="mt-8 flex items-center gap-6 text-xs">
        {["Initializing", "Loading modules", "Almost ready"].map((stage, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                progress > (i + 1) * 30
                  ? "bg-green-500"
                  : progress > i * 30
                    ? "bg-primary animate-pulse"
                    : "bg-muted"
              }`}
            ></div>
            <span
              className={`font-medium ${
                progress > i * 30 ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {stage}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(70px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(70px) rotate(-360deg);
          }
        }

        @keyframes orbitFadeIn {
          from {
            opacity: 0;
            scale: 0;
          }
          to {
            opacity: 1;
            scale: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PlayerStatus = "Verified" | "Pending" | "Rejected";

export interface PlayerCardProps {
  id: string;
  name: string;
  team: string;
  age: string;
  birthYear: number;
  position: string;
  level: string;
  goals: number;
  assists: number;
  plusMinus?: number | null;
  gaa: number;
  save: string;
  gender: string;
  location: string;
  status: PlayerStatus;
  image: string;
  socialLink?: string | null;
  /** Base path for profile link, e.g. "parent-dashboard" or "coach-dashboard". Defaults to parent-dashboard. */
  profileBasePath?: string;
}

const statusStyles: Record<PlayerStatus, string> = {
  Verified: "bg-green-600 text-white",
  Pending: "bg-amber-500 text-white",
  Rejected: "bg-red-600 text-white",
};

const PlayerCard = ({
  id,
  name,
  team,
  position,
  level,
  goals,
  assists,
  plusMinus,
  gaa,
  save,
  status,
  image,
  socialLink,
  profileBasePath = "parent-dashboard",
}: PlayerCardProps) => {
  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? name;
  const lastName = nameParts.slice(1).join(" ");
  const teamLeague = [team !== "-" && team, level !== "-" && level]
    .filter(Boolean)
    .join(" • ") || "—";

  const isGoalie = position === "Goalie";
  const isForwardOrDefense = position === "Forward" || position === "Defense";

  return (
    <div className="rounded-2xl p-4 bg-sky-100/80 dark:bg-sky-950/30">
      <div className="group relative w-full overflow-hidden rounded-[2rem] bg-black/95 shadow-[0_0_0_1px_rgba(148,163,184,0.4),0_4px_20px_rgba(0,0,0,0.3)]">
        {/* Photo as full background, expands on hover */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 400px, 500px"
            unoptimized={image?.startsWith("data:")}
          />
        </div>
        {/* Glass effect overlay - dark grey frosted layer */}
        <div className="absolute inset-0 z-[1] backdrop-blur-[1px] bg-gray-800/75 dark:bg-gray-900/80" />

        <div className="relative z-10 flex flex-col justify-between min-h-[420px] p-6 md:p-8">
          {/* Top Badge */}
          <div className="absolute top-6 right-6">
            <Badge
              className={cn(
                "rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] border-none shadow-lg",
                statusStyles[status]
              )}
            >
              {status}
            </Badge>
          </div>

          {/* Player Identity - just below status badge, left aligned */}
          <div className="pt-14 mb-6 space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 italic">
              {position !== "-" ? position : "—"}
            </h4>
            <h2 className="text-3xl md:text-[2.5rem] font-black uppercase leading-[1.05] tracking-tight">
              <span className="block text-white italic">{firstName}</span>
              {lastName && (
                <span className="block text-blue-500">{lastName}</span>
              )}
            </h2>
            <div className="pt-3 flex items-center gap-2">
              <span className="h-px w-4 bg-white/60 shrink-0" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/80">
                {teamLeague}
              </p>
            </div>
          </div>

          {/* Stats Bar - conditional by position */}
          {(isForwardOrDefense || isGoalie) && (
            <div
              className={`grid bg-gray-800/95 rounded-2xl border border-gray-600/60 overflow-hidden mb-6 ${
                isGoalie ? "grid-cols-2" : "grid-cols-3"
              } [&>div:not(:first-child)]:relative [&>div:not(:first-child)]:before:content-[''] [&>div:not(:first-child)]:before:absolute [&>div:not(:first-child)]:before:left-0 [&>div:not(:first-child)]:before:top-1/2 [&>div:not(:first-child)]:before:-translate-y-1/2 [&>div:not(:first-child)]:before:h-1/2 [&>div:not(:first-child)]:before:w-px [&>div:not(:first-child)]:before:bg-white/50`}
            >
              {isForwardOrDefense && (
                <>
                  <div className="text-center py-1.5 px-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/70 mb-0.5">
                      G
                    </p>
                    <p className="text-base font-bold text-white">{goals}</p>
                  </div>
                  <div className="text-center py-1.5 px-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/70 mb-0.5">
                      A
                    </p>
                    <p className="text-base font-bold text-white">{assists}</p>
                  </div>
                  <div className="text-center py-1.5 px-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/70 mb-0.5">
                      +/-
                    </p>
                    <p className="text-base font-bold text-white">
                      {plusMinus != null ? plusMinus : "-"}
                    </p>
                  </div>
                </>
              )}
              {isGoalie && (
                <>
                  <div className="text-center py-1.5 px-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/70 mb-0.5">
                      GAA
                    </p>
                    <p className="text-base font-bold text-white">{gaa}</p>
                  </div>
                  <div className="text-center py-1.5 px-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/70 mb-0.5">
                      SV%
                    </p>
                    <p className="text-base font-bold text-white">{save}</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className={cn("flex gap-3", socialLink && "justify-between")}>
            <Link
              href={`/${profileBasePath}/players/${id}`}
              className="flex items-center justify-center gap-2 h-12 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm uppercase tracking-[0.1em] transition-colors italic"
            >
              Profile
              <ArrowRight size={16} />
            </Link>
            {socialLink && (
              <a
                href={socialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-12 px-5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm uppercase tracking-[0.1em] transition-colors shrink-0"
                aria-label="Social Media"
              >
                Social
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;

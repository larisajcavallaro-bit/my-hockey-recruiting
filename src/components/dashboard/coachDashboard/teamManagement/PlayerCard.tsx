import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

interface PlayerProps {
  name: string;
  team: string;
  weight: string;
  year: string;
  position: string;
  level: string;
  stats: {
    goals: number;
    assists: number;
    savePct: string;
    gaa: string;
    plusMinus: string;
  };
  isVerified?: boolean;
}

export default function PlayerCard({
  name,
  team,
  weight,
  year,
  position,
  level,
  stats,
  isVerified,
}: PlayerProps) {
  return (
    <div className="relative flex flex-col sm:flex-row gap-4 p-4 rounded-3xl bg-secondary-foreground/40 border border-white/10 mb-3 hover:bg-black/50 transition-colors">
      {/* Avatar */}
      <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-white/20 mx-auto sm:mx-0">
        <Image
          src="/player-placeholder.jpg"
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-grow text-white">
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          {/* Name + Meta */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight">
              {name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 font-medium">
              {team} • {weight} • {year} • {position} • {level}
            </p>
          </div>

          {/* Verified Badge */}
          {isVerified && (
            <div className="self-center sm:self-start flex items-center gap-2 bg-green-600/90 text-white px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold border border-green-400/30">
              <CheckCircle2 size={14} />
              Verified
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-mono uppercase text-sub-text3/80 justify-center sm:justify-start">
          <span>
            Goals: <b className="text-white text-sm">{stats.goals}</b>
          </span>
          <span>
            Assists: <b className="text-white text-sm">{stats.assists}</b>
          </span>
          <span>
            Save: <b className="text-white text-sm">{stats.savePct}</b>
          </span>
          <span>
            GAA: <b className="text-white text-sm">{stats.gaa}</b>
          </span>
          <span>
            +/-: <b className="text-white text-sm">{stats.plusMinus}</b>
          </span>
        </div>
      </div>
    </div>
  );
}

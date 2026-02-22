"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Share2 } from "lucide-react";

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
  gaa: number;
  save: string;
  gender: string;
  location: string;
  status: PlayerStatus;
  image: string;
}

const statusStyles: Record<PlayerStatus, string> = {
  Verified: "bg-green-600 text-white",
  Pending: "bg-yellow-500 text-black",
  Rejected: "bg-red-600 text-white",
};

const PlayerCard = ({
  name,
  team,
  age,
  birthYear,
  position,
  level,
  goals,
  assists,
  gaa,
  save,
  status,
  image,
}: PlayerCardProps) => {
  return (
    <Card
      className="border-none rounded-2xl bg-secondary-foreground/60 overflow-hidden bg-cover bg-center shadow-xl"
      style={{
        backgroundImage:
          "url('/newasset/parent/players/Player Profile (3).png')",
      }}
    >
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-white text-lg sm:text-xl uppercase tracking-tight">
              {name}
            </h3>
            <p className="text-xs sm:text-sm text-white/80 font-medium">
              {team} || {age} || {birthYear} || {position} || {level}
            </p>
          </div>

          <Badge
            className={cn(
              "rounded-full px-3 py-1 shadow-sm",
              statusStyles[status],
            )}
          >
            {status}
          </Badge>
        </div>

        {/* Body */}
        <div className="flex items-center gap-2 sm:gap-4 lg:mt-8">
          {/* Player Image */}
          <div className="relative shrink-0">
            <Image
              src={image}
              alt={name}
              width={550}
              height={550}
              className="-ml-6 lg:-ml-8 rounded-xl object-cover w-36 h-36 md:w-44 md:h-44 xl:w-52 xl:h-52 border border-white/10 shadow-lg"
            />
          </div>

          {/* Centered Stats Table - Nice Formatting */}
          <div className="flex-1 flex justify-center items-center overflow-hidden">
            <table className="w-auto border-collapse text-xs sm:text-sm lg:text-base">
              <tbody>
                {[
                  ["Goals", goals],
                  ["Assists", assists],
                  ["GAA", gaa],
                  ["Save", save],
                  ["+/-", "+5"],
                ].map(([label, value]) => (
                  <tr key={label as string} className="border-none">
                    {/* Label Column: Aligned Right */}
                    <td className="w-16 sm:w-24 px-1 py-1 font-medium text-right text-white/70">
                      {label as string}
                    </td>

                    {/* Colon Column: Centered and Dimmed */}
                    <td className="px-1 py-1 text-center text-white/30 font-bold">
                      :
                    </td>

                    {/* Value Column: Aligned Left */}
                    <td className="w-16 sm:w-24 px-1 py-1 text-left font-bold text-white">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 mt-4 w-full">
          <Button className="relative overflow-hidden flex-1 px-5 py-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-300 group border border-white/20 shadow-lg active:scale-95">
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-[45deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700" />
            <span className="relative z-10 text-[13px] sm:text-sm whitespace-nowrap tracking-wide">
              View Player
            </span>
          </Button>

          <Button
            asChild
            className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all duration-300 rounded-xl px-4 py-6 group shadow-md active:scale-95"
          >
            <Link
              href="https://github.com/Nadib-Rana"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <div className="flex items-center justify-center bg-green-400/20 p-1.5 rounded-full">
                <Share2 size={14} className="text-green-400" />
              </div>
              <span className="font-bold text-white tracking-tight text-[13px] sm:text-sm whitespace-nowrap">
                Social media
              </span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;

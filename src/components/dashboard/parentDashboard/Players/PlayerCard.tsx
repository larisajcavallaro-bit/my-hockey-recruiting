"use client";

import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Share2 } from "lucide-react";

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
  id,
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
      className="border-none rounded-2xl bg-secondary-foreground/60 overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage:
          "url('/newasset/parent/players/Player Profile (3).png')",
      }}
    >
      <CardContent className=" space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-sub-text3 text-lg uppercase">
              {name}
            </h3>
            <p className="text-sm text-sub-text3 opacity-80">
              {team} || {age} || {birthYear} || {position} || {level}
            </p>
          </div>

          <Badge className={cn("rounded-full", statusStyles[status])}>
            {status}
          </Badge>
        </div>

        {/* Body */}
        <div className="flex items-center sm:items-start gap-4 lg:mt-[35px]">
          <Image
            src={image}
            alt={name}
            width={550}
            height={550}
            className="mt-1 -ml-6 lg:-ml-8 rounded-xl object-cover w-40 h-40 md:w-48 md:h-48 lg:mt-[pt5] xl:w-56 xl:h-56"
          />

          <div className="w-full lg:-mt-2 rounded-lg overflow-x-auto border border-none">
            <table className="w-full border-collapse text-xs sm:text-sm lg:text-base">
              <tbody>
                {[
                  ["Goals", goals],
                  ["Assists", assists],
                  ["GAA", gaa],
                  ["Save", save],
                  ["+/-", "+5"],
                ].map(([label, value]) => (
                  <tr key={label} className="border-b-none border-none">
                    <td className="w-1/3 px-2 sm:px-4 font-medium ">{label}</td>
                    <td className="px-2 border-none sm:px-4 py-2">: {value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 mt-4 w-full">
          <Button className="relative overflow-hidden flex-1 sm:flex-none px-5 py-5 bg-blue-600/90 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-300 group border border-white/20 backdrop-blur-sm shadow-lg">
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-[45deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700" />
            <Link href={`/parent-dashboard/players/${id}`}>
              <span className="relative flex items-center justify-center gap-2 tracking-tight text-[13px] sm:text-sm whitespace-nowrap">
                View profile
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </Link>
          </Button>

          <Button
            asChild
            className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-lg transition-all duration-300 rounded-xl px-4 py-5 group shadow-md"
          >
            <Link
              href="https://github.com/Nadib-Rana"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <div className="flex items-center justify-center bg-green-400/20 p-1 rounded-full">
                <Share2 size={14} className="text-green-900" />
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

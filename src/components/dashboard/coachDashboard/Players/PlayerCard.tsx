"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Share2, Zap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  gaa: number;
  gender: string;
  location: string;
  save: string;
  status: PlayerStatus;
  image: string;
}

const statusStyles: Record<PlayerStatus, string> = {
  Verified: "bg-blue-600 text-white",
  Pending: "bg-white/10 text-white/50 backdrop-blur-md",
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
  gaa,
  save,
  status,
  image,
}: PlayerCardProps) => {
  const nameParts = name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  return (
    //  bg-[#080808]
    <Card
      className="group relative w-full max-w-[450px] overflow-hidden bg-[#080808] rounded-[2.5rem] border-0 shadow-2xl"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover opacity-70 grayscale-[30%] transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0"
        />
        {/* Gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
      </div>

      <CardContent className="relative z-10 flex flex-col justify-end min-h-[480px] p-8">
        {/* Top Floating Badge */}
        <div className="absolute top-8 left-8">
          <Badge
            className={cn(
              "rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-[0.2em] border-none shadow-lg",
              statusStyles[status],
            )}
          >
            {status}
          </Badge>
        </div>

        {/* Player Identity Section */}
        <div className="mb-8 space-y-1">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic leading-none">
            {position}
          </h4>
          <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white leading-[0.85]">
            {firstName} <br />
            <span className="text-blue-500 not-italic">{lastName}</span>
          </h2>
          <div className="pt-4 flex items-center gap-2">
            <span className="h-[1px] w-6 bg-blue-500" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
              {team} • {level}
            </p>
          </div>
        </div>

        {/* Stats HUD (Horizontal HUD - No Table) */}
        <div className="grid grid-cols-4 gap-2 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 p-5 mb-6 shadow-inner">
          <div className="text-center">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">
              G
            </p>
            <p className="text-xl font-black text-white leading-none">
              {goals}
            </p>
          </div>
          <div className="text-center border-l border-white/10">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">
              A
            </p>
            <p className="text-xl font-black text-white leading-none">
              {assists}
            </p>
          </div>
          <div className="text-center border-l border-white/10">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">
              GAA
            </p>
            <p className="text-xl font-black text-white leading-none">{gaa}</p>
          </div>
          <div className="text-center border-l border-white/10">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">
              SV%
            </p>
            <p className="text-xl font-black text-blue-500 leading-none">
              {save}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button className="flex-[4] h-14 text-black hover:bg-blue-600 hover:text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all duration-500">
            <Link
              href={`/coach-dashboard/players/${id}`}
              className="flex items-center justify-center gap-2"
            >
              Profile
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-md transition-all"
          >
            <Share2 size={18} />
          </Button>
        </div>
      </CardContent>

      {/* Decorative Olympic Line */}
      <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-600 to-transparent opacity-50" />
    </Card>
  );
};

export default PlayerCard;

"use client";

import Image from "next/image";
import { Star, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface CoachCardProps {
  id: string;
  name: string;
  title?: string;
  team: string;
  teamLogo?: string;
  league?: string;
  level?: string;
  birthYear?: number;
  rating?: number;
  reviewCount?: number;
  image: string;
  location: string;
}

const CoachCard = ({
  id,
  name,
  title,
  team,
  teamLogo,
  league = "-",
  level = "-",
  birthYear = 0,
  rating = 0,
  reviewCount = 0,
  image,
}: CoachCardProps) => {
  const router = useRouter();
  const fullStars = Math.floor(rating);

  const handleViewProfile = () => {
    router.push(`/parent-dashboard/coaches/${id}`);
  };

  return (
    <Card className="border-none p-0 overflow-hidden bg-cover bg-center text-white min-h-[280px] relative cursor-pointer hover:shadow-lg transition-shadow">
      <div className="absolute inset-0 bg-secondary-foreground/30 backdrop-blur-[2px]" />

      <CardContent className="relative z-10 p-0 mt-0 h-full flex flex-col">
        {/* Top Section: Name and Team */}
        <div className="text-center p-2 bg-gradient-to-r from-secondary-foreground/88 to-secondary-foreground/30 rounded-t-2xl">
          <div className="" />
          <h3 className="font-bold text-2xl text-sub-text3">{name}</h3>
          <p className="text-sm font-light z-100">{title}</p>
          <div className="flex items-center justify-center gap-2 mt-1 z-100">
            {/* Small Team Icon Container */}
            <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 bg-slate-600/50">
              {teamLogo ? (
                teamLogo.startsWith("data:") ? (
                  <img
                    src={teamLogo}
                    alt="Team Logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Image
                    src={teamLogo}
                    alt="Team Logo"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                )
              ) : (
                <Shield className="w-3 h-3 text-slate-400" />
              )}
            </div>
            <p className="text-sm font-medium">{team}</p>
          </div>
        </div>

        {/* Middle Section */}
        <div className="flex gap-4 items-end bg-gradient-to-r from-secondary-foreground/90 to-secondary-foreground/0">
          <div className="relative">
            <div className="relative w-42 h-42 md:w-40 md:h-40">
              <Image src={image} alt={name} fill className="object-cover " />
            </div>
            {/* View Profile Button - Positioned partly over image like reference */}
          </div>

          {/* Right: The Data Table */}
          <div className="flex-1 pb-2 z-100">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm md:text-base">
              <span className="text-gray-300">League</span>
              <span className="font-medium">: {league}</span>

              <span className="text-gray-300">Level</span>
              <span className="font-medium">: {level}</span>

              <span className="text-gray-300">birth year</span>
              <span className="font-medium">: {birthYear} Year</span>

              {/* Rating Row */}
              <div className="col-span-2 flex items-center gap-2 mt-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < fullStars
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-400/50"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-sm">
                  {rating.toFixed(1)}
                  {reviewCount > 0 && (
                    <span className="font-normal text-gray-300 ml-1">
                      ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <div className="bottom-1 left-0 right-0 px-2 z-100 top-1.5">
        <Button className="flex -mt-3 mb-2" onClick={handleViewProfile}>
          View Profile
        </Button>
      </div>
    </Card>
  );
};

export default CoachCard;

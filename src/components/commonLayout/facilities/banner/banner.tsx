// components/HeroBanner.tsx
"use client";

import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
            Find Training Facilities
            <br className="hidden sm:block" />
            You Can Trust
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/95 max-w-4xl mx-auto mb-10 md:mb-14 drop-shadow-lg font-light">
            Explore ice rinks, gyms, and training centers near you — with parent
            reviews
            <br className="hidden sm:inline" /> and clear information to help
            families make informed decisions.
          </p>

          {/* Search Bar Container */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-background rounded-xl shadow-2xl overflow-hidden border border">
              <div className="flex items-center h-14 md:h-16 divide-x divide-gray-200 pr-4 sm:pr-5">
                {/* Search input + icon */}
                <div className="flex-1 flex items-center pl-5 sm:pl-6 pr-3 sm:pr-4">
                  <Search className="h-5 w-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                  <Input
                    placeholder="Search rinks, gyms, training centers..."
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-base md:text-lg placeholder:text-gray-500 bg-transparent p-0 h-auto flex-1 focus-visible:outline-none"
                  />
                </div>

                {/* Location pill – hidden on mobile */}
                <div className="hidden sm:flex items-center px-5 sm:px-6 gap-2 bg-gray-50/60 whitespace-nowrap">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700 font-medium text-sm md:text-base">
                    Near me
                  </span>
                </div>

                {/* Filter dropdown – hidden below md */}
                <div className="hidden md:flex items-center px-4 sm:px-5 bg-gray-50/60">
                  <SlidersHorizontal className="h-5 w-5 text-gray-500 mr-2" />
                  <Select defaultValue="all">
                    <SelectTrigger className="border-0 focus:ring-0 shadow-none bg-transparent p-0 h-auto w-[120px] sm:w-[130px] text-gray-700 font-medium">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="ice-rink">Ice Rinks</SelectItem>
                      <SelectItem value="gym">Gyms</SelectItem>
                      <SelectItem value="training-center">
                        Training Centers
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Button */}
                <Button className="hover:text-sub-text px-4 sm:px-5 text-sm font-semibold shrink-0">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

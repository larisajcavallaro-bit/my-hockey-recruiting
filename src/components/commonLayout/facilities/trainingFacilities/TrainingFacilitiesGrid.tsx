// components/TrainingFacilitiesGrid.tsx
"use client";

import { Star, Dumbbell, MessageSquarePlus } from "lucide-react";
import { LocationLink } from "@/components/ui/LocationLink";
import { Icon } from "lucide-react"; // ← required for Lab icons
import { iceHockey } from "@lucide/lab";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import AddFacilityFormModal from "../modal/AddFacilityFormModal";

type Facility = {
  slug: string;
  name: string;
  rating: number;
  reviewCount: number;
  location: string;
  tags: string[];
  imageUrl: string;
  type?: "ice-rink" | "gym" | "ski" | "multi";
};

const mockFacilities: Facility[] = [
  {
    slug: "arctic-ice-arena",
    name: "Arctic Ice Arena",
    rating: 4.8,
    reviewCount: 312,
    location: "12000 Portland Ave S, Minneapolis, MN 55337, USA",
    tags: ["Ice Rink", "Locker", "Cafe/Bar"],
    imageUrl: "/newasset/facilities/card/arctic-arena-1.png",
    type: "ice-rink",
  },
  {
    slug: "champions-sports-complex",
    name: "Champions Sports Complex",
    rating: 4.5,
    reviewCount: 187,
    location: "5750 Cowboys Pkwy, Frisco, TX 75034, USA",
    tags: ["Multi-sport", "Locker", "Cafe/Bar"],
    imageUrl: "/newasset/facilities/card/Elite-Training-Hub -1.png",
    type: "multi",
  },
  {
    slug: "glacial-gardens",
    name: "Glacial Gardens",
    rating: 4.2,
    reviewCount: 94,
    location: "7900 Xerxes Ave S, Bloomington, MN 55431, USA",
    tags: ["Ice Rink", "Locker", "Training"],
    imageUrl: "/newasset/facilities/card/skydiving-wsc.jpg",
    type: "ski",
  },
  {
    slug: "elite-training-hub",
    name: "Elite Training Hub",
    rating: 4.9,
    reviewCount: 108,
    location: "5701 Normandale Rd, Edina, MN 55424, USA",
    tags: ["Gym", "Locker", "Equipment Rental"],
    imageUrl: "/newasset/facilities/card/arctic-arena-1.png",
    type: "gym",
  },
];

export default function TrainingFacilitiesGrid() {
  return (
    <section className="py-10 md:py-14 bg-gray-50/50">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 md:mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Training Facilities
          </h2>

          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <AddFacilityFormModal />
            </Button>
          </div>
        </div>

        {/* Grid */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockFacilities.map((facility) => (
            <Card
              key={facility.slug}
              className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200/70 hover:border-gray-300 group"
            >
              <Link
                href={`/facilities/${facility.slug}`}
                className="block"
              >
                <div className="relative aspect-[4/3] mt-[-25px] overflow-hidden">
                  <Image
                    src={facility.imageUrl}
                    alt={facility.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Type badge */}
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant="secondary"
                      className="bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 flex items-center gap-1 shadow-sm"
                    >
                      {facility.type === "ice-rink" && (
                        <>
                          <Icon
                            iconNode={iceHockey}
                            size={14}
                            strokeWidth={2.2}
                          />
                          Ice Rink
                        </>
                      )}
                      {facility.type === "gym" && (
                        <>
                          <Dumbbell size={14} strokeWidth={2.2} />
                          Gym
                        </>
                      )}
                      {facility.type === "ski" && (
                        <>
                          <span className="text-sm leading-none">⛷️</span>
                          Ski
                        </>
                      )}
                      {facility.type === "multi" && <>Multi-sport</>}
                    </Badge>
                  </div>
                </div>
              </Link>

              <CardContent className="flex-1 flex flex-col p-5 space-y-3 min-h-0">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/facilities/${facility.slug}`}
                    className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors"
                  >
                    {facility.name}
                  </Link>

                  <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-bold text-sub-text">
                      {facility.rating}
                    </span>
                    <span className="text-sub-text">
                      ({facility.reviewCount.toLocaleString()})
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <LocationLink address={facility.location} />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {facility.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs bg-background hover:bg-muted/50"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" className="min-w-44">
            Load More Facilities
          </Button>
        </div>
      </div>
      <div className="pt-6 px-4 sm:px-8 md:px-16 lg:px-44">
        <div className="bg-button-clr1 rounded-lg px-4 py-4 flex gap-3 items-start">
          {/* Icon */}
          <div className="mt-1 shrink-0 text-white">
            <MessageSquarePlus size={20} />
          </div>

          {/* Text */}
          <div className="text-[12px] sm:text-sm text-white leading-relaxed">
            <p className="font-medium mb-1">Don’t see something specific?</p>

            <p>
              Send us a message and we will get it added for you and notify
              <span className="block sm:inline">
                {" "}
                <Link
                  href="#"
                  className="text-blue-100 underline underline-offset-2 hover:text-white"
                >
                  when it’s ready
                </Link>
                .
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

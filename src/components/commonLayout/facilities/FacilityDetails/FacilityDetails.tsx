"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Phone, Clock, Globe } from "lucide-react";
import { LocationLink } from "@/components/ui/LocationLink";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import WriteReviewModal from "@/components/commonLayout/facilities/modal/WriteReviewModal";
import FeatureGate from "@/components/subscription/FeatureGate";
import Link from "next/link";

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
};

type FacilityInfo = {
  slug: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
  description: string;
  amenities: string[];
  website?: string | null;
};

interface FacilityDetailsProps {
  facilitySlug: string;
}

export default function FacilityDetails({ facilitySlug }: FacilityDetailsProps) {
  const [facilityInfo, setFacilityInfo] = useState<FacilityInfo | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [facilityLoading, setFacilityLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchFacility() {
      try {
        const res = await fetch(`/api/facilities/${facilitySlug}`);
        if (res.status === 404) {
          if (!cancelled) setFacilityInfo(null);
          return;
        }
        if (!res.ok) throw new Error("Failed to load training");
        const data = await res.json();
        if (!cancelled && data.facility) setFacilityInfo(data.facility);
      } catch {
        if (!cancelled) setFacilityInfo(null);
      } finally {
        if (!cancelled) setFacilityLoading(false);
      }
    }
    void fetchFacility();
    return () => { cancelled = true; };
  }, [facilitySlug]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/facilities/${facilitySlug}/reviews`);
      const data = await res.json();
      setReviews(data.reviews ?? []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (facilityInfo) {
      setLoading(true);
      void fetchReviews();
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facilitySlug, facilityInfo]);

  const rating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  const reviewCount = reviews.length;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 1) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (facilityLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
        <Link
          href="/training"
          className="text-sm text-muted-foreground hover:underline mb-4 inline-block"
        >
          ← Back to all training
        </Link>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!facilityInfo) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
        <Link
          href="/training"
          className="text-sm text-muted-foreground hover:underline mb-4 inline-block"
        >
          ← Back to all training
        </Link>
        <p className="text-muted-foreground">Training location not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
      {/* Back */}
      <Link
        href="/training"
        className="text-sm text-muted-foreground hover:underline mb-4 inline-block"
      >
        ← Back to all training
      </Link>

      {/* Hero Image Section */}
      <div className="relative w-full h-[320px] sm:h-[380px] rounded-xl overflow-hidden mb-8">
        <Image
          src={facilityInfo.image}
          alt={facilityInfo.name}
          fill
          className="object-cover"
          priority
          unoptimized={facilityInfo.image?.startsWith("data:")}
        />
        <div className="absolute inset-0 bg-black/30 flex items-end p-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{facilityInfo.name}</h1>
            <div className="flex items-center gap-2 text-white text-sm mt-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {reviewCount > 0 ? rating.toFixed(1) : "—"}
              <span className="opacity-80">
                ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* About & Amenities */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-2">
                About This Training Location
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {facilityInfo.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {facilityInfo.amenities.map((item) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* REVIEWS SECTION */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xl">Reviews</h3>
                <FeatureGate feature="facility_reviews">
                  <WriteReviewModal
                    facilitySlug={facilitySlug}
                    onSubmitted={fetchReviews}
                  />
                </FeatureGate>
              </div>

              <div className="space-y-8">
                {loading ? (
                  <p className="text-muted-foreground text-sm">
                    Loading reviews...
                  </p>
                ) : reviews.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4">
                    No reviews yet. Be the first to write one!
                  </p>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-t pt-6 first:border-t-0 first:pt-0"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{review.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-sm">{review.name}</p>
                            <div className="flex items-center gap-1 text-amber-500">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i <= review.rating
                                      ? "fill-current"
                                      : "text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(review.date)}
                        </span>
                      </div>

                      {review.comment && (
                        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Contact & Address</h3>
              <div className="flex items-start gap-3 text-sm">
                <LocationLink address={facilityInfo.address} />
              </div>
              {facilityInfo.phone && facilityInfo.phone !== "Contact for info" && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                  <a href={`tel:${facilityInfo.phone.replace(/\D/g, "")}`} className="text-primary hover:underline">
                    {facilityInfo.phone}
                  </a>
                </div>
              )}
              {facilityInfo.hours && facilityInfo.hours !== "Contact for hours" && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  {facilityInfo.hours}
                </div>
              )}
              {facilityInfo.website && (
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                  <a
                    href={facilityInfo.website.startsWith("http") ? facilityInfo.website : `https://${facilityInfo.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    {facilityInfo.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                </div>
              )}
              <Button asChild className="w-full mt-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facilityInfo.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">Overall Rating</p>
              <p className="text-4xl font-bold mt-1">
                {reviewCount > 0 ? rating.toFixed(1) : "—"}
              </p>
              <div className="flex justify-center gap-1 text-amber-500 mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i <= Math.round(rating) ? "fill-current" : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {reviewCount} review{reviewCount !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

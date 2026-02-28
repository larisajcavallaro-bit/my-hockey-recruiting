"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Star, Phone, Globe, Filter } from "lucide-react";
import { LocationLink } from "@/components/ui/LocationLink";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import WriteSchoolReviewModal from "./WriteSchoolReviewModal";
import FeatureGate from "@/components/subscription/FeatureGate";
import Link from "next/link";

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  ageBracket?: string[];
  gender?: string | null;
  league?: string | null;
};

type SchoolInfo = {
  slug: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
  description: string;
  website?: string | null;
  boysWebsite?: string | null;
  girlsWebsite?: string | null;
  boysLeague?: string[];
  girlsLeague?: string[];
};

interface SchoolDetailsProps {
  schoolSlug: string;
}

const ALL = "__all__";
const AGE_BRACKETS = ["U6", "U8", "U10", "U12", "U14", "U16", "U18", "U20"] as const;

export default function SchoolDetails({ schoolSlug }: SchoolDetailsProps) {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allReviewsForFilterOptions, setAllReviewsForFilterOptions] = useState<Review[]>([]);
  const [filterAgeBracket, setFilterAgeBracket] = useState(ALL);
  const [filterGender, setFilterGender] = useState(ALL);
  const [filterLeague, setFilterLeague] = useState(ALL);
  const [loading, setLoading] = useState(true);
  const [schoolLoading, setSchoolLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchSchool() {
      try {
        const res = await fetch(`/api/teams-and-schools/${schoolSlug}`, { cache: "no-store" });
        if (res.status === 404) {
          if (!cancelled) setSchoolInfo(null);
          return;
        }
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        if (!cancelled && data.school) setSchoolInfo(data.school);
      } catch {
        if (!cancelled) setSchoolInfo(null);
      } finally {
        if (!cancelled) setSchoolLoading(false);
      }
    }
    void fetchSchool();
    return () => { cancelled = true; };
  }, [schoolSlug]);

  const fetchReviews = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterAgeBracket && filterAgeBracket !== ALL) params.set("ageBracket", filterAgeBracket);
      if (filterGender && filterGender !== ALL) params.set("gender", filterGender);
      if (filterLeague && filterLeague !== ALL) params.set("league", filterLeague);
      const qs = params.toString();
      const res = await fetch(`/api/teams-and-schools/${schoolSlug}/reviews${qs ? `?${qs}` : ""}`, { cache: "no-store" });
      const data = await res.json();
      const reviewsData = data.reviews ?? [];
      setReviews(reviewsData);
      if (!qs) setAllReviewsForFilterOptions(reviewsData);
    } catch {
      setReviews([]);
      setAllReviewsForFilterOptions([]);
    } finally {
      setLoading(false);
    }
  }, [schoolSlug, filterAgeBracket, filterGender, filterLeague]);

  useEffect(() => {
    if (schoolInfo) {
      setLoading(true);
      void fetchReviews();
    } else {
      setLoading(false);
    }
  }, [schoolInfo, fetchReviews]);

  const rating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  const reviewCount = reviews.length;

  const uniqueGenders = [...new Set(allReviewsForFilterOptions.map((r) => r.gender).filter(Boolean))].sort() as string[];
  const uniqueLeagues = [...new Set(allReviewsForFilterOptions.map((r) => r.league).filter(Boolean))].sort() as string[];

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

  if (schoolLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
        <Link href="/teams-and-schools" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
          ← Back to all
        </Link>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!schoolInfo) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
        <Link href="/teams-and-schools" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
          ← Back to all
        </Link>
        <p className="text-muted-foreground">School or program not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
      <Link href="/teams-and-schools" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
        ← Back to all teams and schools
      </Link>

      <div className="relative w-full h-[320px] sm:h-[380px] rounded-xl overflow-hidden mb-8">
        <Image
          src={schoolInfo.image}
          alt={schoolInfo.name}
          fill
          className="object-cover"
          priority
          unoptimized={schoolInfo.image?.startsWith("data:")}
        />
        <div className="absolute inset-0 bg-black/30 flex items-end p-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{schoolInfo.name}</h1>
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

      {/* Boys / Girls blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="p-5">
            <h3 className="font-semibold text-lg mb-3">Boys</h3>
            {(schoolInfo.boysWebsite || (schoolInfo.boysLeague?.length ?? 0) > 0) ? (
              <div className="space-y-2 text-sm">
                {schoolInfo.boysWebsite && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                    <a
                      href={schoolInfo.boysWebsite.startsWith("http") ? schoolInfo.boysWebsite : `https://${schoolInfo.boysWebsite}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate"
                    >
                      {schoolInfo.boysWebsite.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  </div>
                )}
                {(schoolInfo.boysLeague?.length ?? 0) > 0 && (
                  <div>
                    <span className="text-muted-foreground">Leagues: </span>
                    <span className="font-medium">{schoolInfo.boysLeague!.join(", ")}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No boys program info.</p>
            )}
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-pink-500">
          <CardContent className="p-5">
            <h3 className="font-semibold text-lg mb-3">Girls</h3>
            {(schoolInfo.girlsWebsite || (schoolInfo.girlsLeague?.length ?? 0) > 0) ? (
              <div className="space-y-2 text-sm">
                {schoolInfo.girlsWebsite && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                    <a
                      href={schoolInfo.girlsWebsite.startsWith("http") ? schoolInfo.girlsWebsite : `https://${schoolInfo.girlsWebsite}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate"
                    >
                      {schoolInfo.girlsWebsite.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  </div>
                )}
                {(schoolInfo.girlsLeague?.length ?? 0) > 0 && (
                  <div>
                    <span className="text-muted-foreground">Leagues: </span>
                    <span className="font-medium">{schoolInfo.girlsLeague!.join(", ")}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No girls program info.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-2">About</h2>
              <p className="text-muted-foreground leading-relaxed">{schoolInfo.description}</p>
              <p className="mt-4">
                <Link
                  href="/contact-us?topic=info-correction"
                  className="text-sm text-primary hover:underline"
                >
                  See something incorrect? Contact us to get it updated
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold text-xl">Reviews</h3>
                <FeatureGate feature="facility_reviews">
                  <WriteSchoolReviewModal schoolSlug={schoolSlug} onSubmitted={fetchReviews} />
                </FeatureGate>
              </div>

              <div className="flex flex-wrap items-center gap-3 py-2 border-y">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">Filter:</span>
                <Select value={filterAgeBracket} onValueChange={setFilterAgeBracket}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Age bracket" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>All ages (U6–U20)</SelectItem>
                    {AGE_BRACKETS.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <Checkbox
                    checked={filterGender === "Boys"}
                    onCheckedChange={(checked) => setFilterGender(checked ? "Boys" : ALL)}
                    className="border-slate-400"
                  />
                  <span className="text-sm text-muted-foreground">See Boys Reviews Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <Checkbox
                    checked={filterGender === "Girls"}
                    onCheckedChange={(checked) => setFilterGender(checked ? "Girls" : ALL)}
                    className="border-slate-400"
                  />
                  <span className="text-sm text-muted-foreground">See Girls Reviews Only</span>
                </label>
                {uniqueLeagues.length > 0 && (
                  <Select value={filterLeague} onValueChange={setFilterLeague}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="League" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL}>All leagues</SelectItem>
                      {uniqueLeagues.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-8">
                {loading ? (
                  <p className="text-muted-foreground text-sm">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4">No reviews yet. Be the first to write one!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border-t pt-6 first:border-t-0 first:pt-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{review.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-sm">{review.name}</p>
                            {((review.ageBracket?.length ?? 0) > 0 || review.gender || review.league) && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {[
                                  review.ageBracket?.join(", "),
                                  review.gender,
                                  review.league,
                                ].filter(Boolean).join(" · ")}
                              </p>
                            )}
                            <div className="flex items-center gap-1 text-amber-500 mt-1">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${i <= review.rating ? "fill-current" : "text-muted"}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
                      </div>
                      {review.comment && (
                        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Contact</h3>
              <div className="flex items-start gap-3 text-sm">
                <LocationLink address={schoolInfo.address} />
              </div>
              {schoolInfo.phone && schoolInfo.phone !== "Contact for info" && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                  <a href={`tel:${schoolInfo.phone.replace(/\D/g, "")}`} className="text-primary hover:underline">
                    {schoolInfo.phone}
                  </a>
                </div>
              )}
              {schoolInfo.website && (
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                  <a
                    href={schoolInfo.website.startsWith("http") ? schoolInfo.website : `https://${schoolInfo.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    {schoolInfo.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                </div>
              )}
              <Button asChild className="w-full mt-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(schoolInfo.address)}`}
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
              <p className="text-4xl font-bold mt-1">{reviewCount > 0 ? rating.toFixed(1) : "—"}</p>
              <div className="flex justify-center gap-1 text-amber-500 mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i <= Math.round(rating) ? "fill-current" : "text-muted"}`}
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

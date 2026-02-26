"use client";

import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Star,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Award,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample coach data - replace with API call

import { Info, Briefcase, Zap, Ban, Shield } from "lucide-react";
import FeatureGate from "@/components/subscription/FeatureGate";
import WriteCoachReviewModal from "@/components/dashboard/parentDashboard/Coaches/WriteCoachReviewModal";

// Update your tab mapping to include icons
const tabs = [
  { id: "about", label: "About", icon: Info },
  { id: "experience", label: "Exp.", icon: Briefcase },
  { id: "certifications", label: "Certs", icon: Award },
  { id: "specialties", label: "Specs", icon: Zap },
  { id: "reviews", label: "Reviews", icon: Star },
];

type CoachDetail = {
  id: string;
  userId?: string;
  name: string;
  title?: string | null;
  team?: string | null;
  teamLogo?: string | null;
  league?: string | null;
  level?: string | null;
  birthYear?: number | null;
  phone?: string | null;
  location?: string | null;
  email: string;
  about?: string | null;
  philosophy?: string | null;
  image?: string | null;
  rating: number;
  reviewCount: number;
  currentUserHasReviewed?: boolean;
  certifications: { name: string; number?: string | null }[];
  experience: { title: string; team?: string | null; years?: string | null; description?: string | null }[];
  specialties: string[];
  reviews: { author: string; authorId?: string | null; rating: number; text: string; date: string }[];
};

export default function CoachDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const coachId = params.coachId as string;
  const [coach, setCoach] = useState<CoachDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactStatus, setContactStatus] = useState<"none" | "pending" | "approved">("none");
  const [requesting, setRequesting] = useState(false);
  const [blocking, setBlocking] = useState(false);

  const parentProfileId = (session?.user as { parentProfileId?: string | null })?.parentProfileId;

  useEffect(() => {
    fetch(`/api/coaches/${coachId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setCoach(null);
          return;
        }
        setCoach({
          id: data.id,
          userId: data.userId,
          name: data.user?.name ?? "Coach",
          title: data.title,
          team: data.team,
          teamLogo: data.teamLogo,
          league: data.league,
          level: data.level,
          birthYear: data.birthYear,
          phone: data.phone,
          location: data.location,
          email: data.user?.email ?? "",
          about: data.about,
          philosophy: data.philosophy,
          image: data.image ?? data.user?.image,
          rating: data.rating ?? 0,
          reviewCount: data.reviewCount ?? 0,
          currentUserHasReviewed: data.currentUserHasReviewed ?? false,
          certifications: data.certifications ?? [],
          experience: data.experience ?? [],
          specialties: (data.specialties ?? []).map((s: { name: string }) => s.name),
          reviews: (data.reviews ?? []).map((r: { author: string; authorId?: string | null; rating: number; text: string; createdAt: string }) => ({
            author: r.author,
            authorId: r.authorId,
            rating: r.rating,
            text: r.text,
            date: r.createdAt,
          })),
        });
      })
      .catch(() => setCoach(null))
      .finally(() => setLoading(false));
  }, [coachId]);

  useEffect(() => {
    if (!coach?.id || !parentProfileId) return;
    const q = new URLSearchParams({
      coachProfileId: coach.id,
      parentProfileId,
    });
    fetch(`/api/contact-requests/check?${q}`)
      .then((r) => r.json())
      .then((res) => setContactStatus(res.status ?? "none"))
      .catch(() => setContactStatus("none"));
  }, [coach?.id, parentProfileId]);

  const handleRequestContact = async () => {
    if (!coach || !parentProfileId) return;
    setRequesting(true);
    try {
      const res = await fetch("/api/contact-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coachProfileId: coach.id,
          parentProfileId,
          requestedBy: "parent",
        }),
      });
      const data = await res.json();
      if (data.request?.status === "pending") {
        setContactStatus("pending");
      }
    } finally {
      setRequesting(false);
    }
  };

  const handleBlockUser = async () => {
    if (!coach?.userId) return;
    setBlocking(true);
    try {
      const res = await fetch("/api/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockedUserId: coach.userId }),
      });
      if (res.ok) {
        toast.success("User blocked");
        router.push("/parent-dashboard/coaches");
      } else {
        toast.error("Failed to block user");
      }
    } finally {
      setBlocking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sub-text1/80">Loading coach...</p>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Coach not found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 ">
      {/* Back Button and Block */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Coaches
        </Button>
        <Button
          variant="outline"
          onClick={handleBlockUser}
          disabled={blocking}
          className="flex items-center gap-2 border-red-500/50 text-red-600 hover:bg-red-500/10"
        >
          <Ban className="w-4 h-4" />
          {blocking ? "Blocking..." : "Block User"}
        </Button>
      </div>

      {/* Hero Section */}
      <Card className="overflow-hidden bg-secondary-foreground/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
          {/* Image and Basic Info */}
          <div className="md:col-span-1 flex flex-col items-center space-y-4">
            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-lg overflow-hidden">
              <Image
                src={coach.image ?? "/newasset/parent/coaches/coaches.png"}
                alt={coach.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center space-y-2 text-sub-text3">
              <h1 className="text-3xl font-bold">{coach.name}</h1>
              <p className="text-lg text-sub-text3/62">{coach.title}</p>
              {/* Rating */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(coach.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold">
                  {coach.reviewCount > 0
                    ? `${coach.rating.toFixed(1)} (${coach.reviewCount} review${coach.reviewCount !== 1 ? "s" : ""})`
                    : "No reviews yet"}
                </span>
              </div>
            </div>
          </div>

          {/* Contact and Team Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Team Info Card */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Current Team</h3>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                  {coach.teamLogo ? (
                    coach.teamLogo.startsWith("data:") ? (
                      <img
                        src={coach.teamLogo}
                        alt={coach.team ?? "Team logo"}
                        className="w-full h-full object-contain p-0.5"
                      />
                    ) : (
                      <Image
                        src={coach.teamLogo}
                        alt={coach.team ?? "Team"}
                        fill
                        className="object-contain p-1"
                      />
                    )
                  ) : (
                    <Shield className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{coach.team}</p>
                  <p className="text-sm text-muted-foreground">
                    {coach.league}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="font-semibold">{coach.level}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Birth Year</p>
                  <p className="font-semibold">{coach.birthYear}</p>
                </div>
              </div>
            </div>

            {/* Contact Info - hidden until approved */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Contact Information</h3>
              {contactStatus === "approved" ? (
                <div className="space-y-2">
                  {coach.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <a href={`mailto:${coach.email}`} className="text-primary hover:underline">
                        {coach.email}
                      </a>
                    </div>
                  )}
                  {coach.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <a href={`tel:${coach.phone}`} className="text-primary hover:underline">
                        {coach.phone}
                      </a>
                    </div>
                  )}
                  {coach.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span>{coach.location}</span>
                    </div>
                  )}
                  {!coach.email && !coach.phone && !coach.location && (
                    <p className="text-muted-foreground text-sm">No contact info on file.</p>
                  )}
                </div>
              ) : contactStatus === "pending" ? (
                <p className="text-amber-600 dark:text-amber-400 font-medium">
                  Contact request pending. The coach will be notified to approve.
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="text-muted-foreground text-sm">
                    Contact info is private. Request access to connect with this coach.
                  </p>
                  <FeatureGate
                    feature="contact_requests"
                    fallback={
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-extrabold">
                        Upgrade to Gold for contact requests between coaches and players.
                      </p>
                    }
                  >
                    <Button
                      onClick={handleRequestContact}
                      disabled={requesting}
                      className="bg-green-600 hover:bg-green-500 text-white"
                    >
                      {requesting ? "Sending..." : "Request Contact Info"}
                    </Button>
                  </FeatureGate>
                </div>
              )}
            </div>

            {/* Have you played for this coach? Leave a review */}
            <div className="bg-white text-black p-4 rounded-lg flex items-center justify-between gap-4 flex-wrap">
              <p className="font-medium">
                {coach.currentUserHasReviewed
                  ? "Thank you for reviewing this coach!"
                  : "Have you played for this coach?"}
              </p>
              {!coach.currentUserHasReviewed && (
                <WriteCoachReviewModal
                  coachId={coach.id}
                  coachName={coach.name}
                  trigger={
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white">
                      Leave a review!
                    </Button>
                  }
                  onSubmitted={() => {
                    fetch(`/api/coaches/${coachId}`)
                      .then((r) => r.json())
                      .then((data) => {
                        if (!data.error) {
                          setCoach({
                            id: data.id,
                            userId: data.userId,
                            name: data.user?.name ?? "Coach",
                            title: data.title,
                            team: data.team,
                            teamLogo: data.teamLogo,
                            league: data.league,
                            level: data.level,
                            birthYear: data.birthYear,
                            phone: data.phone,
                            location: data.location,
                            email: data.user?.email ?? "",
                            about: data.about,
                            philosophy: data.philosophy,
                            image: data.image ?? data.user?.image,
                            rating: data.rating ?? 0,
                            reviewCount: data.reviewCount ?? 0,
                            currentUserHasReviewed: data.currentUserHasReviewed ?? false,
                            certifications: data.certifications ?? [],
                            experience: data.experience ?? [],
                            specialties: (data.specialties ?? []).map((s: { name: string }) => s.name),
                            reviews: (data.reviews ?? []).map(
                              (r: { author: string; authorId?: string | null; rating: number; text: string; createdAt: string }) => ({
                                author: r.author,
                                authorId: r.authorId,
                                rating: r.rating,
                                text: r.text,
                                date: r.createdAt,
                              })
                            ),
                          });
                        }
                      })
                      .catch(() => {});
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs for Additional Information */}
      <Tabs defaultValue="about" className="w-full">
        <TabsList
          className="
    flex h-12 w-full items-center justify-between gap-1 p-1.5
    
   
    sm:grid sm:grid-cols-5 sm:h-11
    
    /* 3. Visual Style */
    rounded-2xl bg-muted/50 text-muted-foreground
  "
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="
        /* Layout: Center the icon */
        flex items-center justify-center gap-2
        h-full w-full rounded-xl transition-all duration-300
        
        /* Active State: Scale slightly on click for better feedback */
        data-[state=active]:bg-background data-[state=active]:text-primary 
        data-[state=active]:shadow-md active:scale-95
      "
            >
              {/* Icon is always visible */}
              <tab.icon className="w-5 h-5 sm:w-4 sm:h-4" />

              {/* Hidden on mobile (hidden), shown on desktop (inline-block) */}
              <span className="hidden sm:inline-block text-sm font-medium">
                {tab.label}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6 bg-foreground">
          <Card className="bg-secondary-foreground/60 text-sub-text3">
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Background</h4>
                <p className="text-sub-text3/80">{coach.about}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Coaching Philosophy</h4>
                <p className="text-sub-text3/80">{coach.philosophy}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-4">
          {coach.experience.map((exp, idx) => (
            <Card
              className="bg-secondary-foreground/60 text-sub-text3"
              key={idx}
            >
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{exp.title}</h4>
                      <p className="text-sub-text2">{exp.team}</p>
                    </div>
                    <span className="text-sm text-muted-foreground bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                      {exp.years}
                    </span>
                  </div>
                  <p className="text-sub-text3/80">{exp.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-4">
          {coach.certifications.map((cert, idx) => (
            <Card
              className="bg-secondary-foreground/60 text-sub-text3 "
              key={idx}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold">{cert.name}</h4>
                    {(cert as { number?: string | null }).number && (
                      <p className="text-sm text-sub-text3/80">{(cert as { number?: string | null }).number}</p>
                    )}
                    {(cert as { expiresAt?: string | Date | null }).expiresAt && (
                      <p className="text-sm text-sub-text3/70 mt-1">
                        Expires:{" "}
                        {(() => {
                          const exp = (cert as { expiresAt?: string | Date | null }).expiresAt;
                          return exp ? new Date(exp).toLocaleDateString() : "";
                        })()}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Specialties Tab */}
        <TabsContent value="specialties">
          <Card className="bg-secondary-foreground/60">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {coach.specialties.map((specialty, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-none border-2 rounded-lg"
                  >
                    <Zap className="w-5 h-5 text-sub-text3 flex-shrink-0" />
                    <span className="font-medium text-sub-text3">
                      {specialty}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          {coach.reviews.length > 0 ? (
            coach.reviews.map((review, idx) => (
              <Card
                className="bg-secondary-foreground/60 text-sub-text3"
                key={idx}
              >
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{review.author}</h4>
                        <span className="text-sm text-sub-text3/90">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-bold text-">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                    <p className="text-sub-text3/90">{review.text}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  No reviews yet
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

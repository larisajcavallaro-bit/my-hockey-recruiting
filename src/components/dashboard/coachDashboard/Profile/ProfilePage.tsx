"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  Edit2,
  Mail,
  Phone,
  MapPin,
  Star,
  Award,
  Users,
  Briefcase,
  Zap,
  Info,
  Shield,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CoachEditProfileDialog from "./CoachEditProfileDialog";
import { toast } from "sonner";

function formatPhoneDisplay(value: string): string {
  if (!value) return "";
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  if (digits.length > 10) digits = digits.slice(0, 10);
  if (digits.length <= 3) return digits ? `(${digits}` : digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

type CoachDetail = {
  id: string;
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
  certifications: { name: string; number?: string | null; expiresAt?: string | null }[];
  experience: {
    title: string;
    team?: string | null;
    years?: string | null;
    description?: string | null;
  }[];
  specialties: string[];
  reviews: { id: string; author: string; rating: number; text: string; date: string }[];
};

const tabs = [
  { id: "about", label: "About", icon: Info },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "specialties", label: "Specialties", icon: Zap },
  { id: "reviews", label: "Reviews", icon: Star },
];

export default function CoachProfilePage() {
  const { data: session } = useSession();
  const coachProfileId = (session?.user as { coachProfileId?: string | null })
    ?.coachProfileId;

  const [coach, setCoach] = useState<CoachDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [disputingId, setDisputingId] = useState<string | null>(null);

  const fetchCoach = useCallback(() => {
    if (!coachProfileId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/coaches/${coachProfileId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setCoach(null);
          return;
        }
        setCoach({
          id: data.id,
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
          certifications: data.certifications ?? [],
          experience: data.experience ?? [],
          specialties: (data.specialties ?? []).map(
            (s: { name: string }) => s.name
          ),
          reviews: (data.reviews ?? []).map(
            (r: { id: string; author: string; rating: number; text: string; createdAt: string }) => ({
              id: r.id,
              author: r.author,
              rating: r.rating,
              text: r.text,
              date: r.createdAt,
            })
          ),
        });
      })
      .catch(() => setCoach(null))
      .finally(() => setLoading(false));
  }, [coachProfileId]);

  useEffect(() => {
    fetchCoach();
  }, [fetchCoach]);

  const handleDispute = async (reviewId: string) => {
    if (!window.confirm("Dispute this review? It will be hidden immediately and sent for admin review.")) return;
    setDisputingId(reviewId);
    try {
      const res = await fetch(`/api/coaches/reviews/${reviewId}/dispute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Review disputed and hidden. Admin has been notified.");
        fetchCoach();
      } else {
        toast.error(data.error ?? "Failed to dispute review");
      }
    } catch {
      toast.error("Failed to dispute review");
    } finally {
      setDisputingId(null);
    }
  };

  if (!coachProfileId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sub-text1/80">Please sign in as a coach to view your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sub-text1/80">Loading profile...</p>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sub-text1/80">Failed to load profile.</p>
      </div>
    );
  }

  const editInitial = {
    title: coach.title ?? "",
    team: coach.team ?? "",
    teamLogo: coach.teamLogo ?? "",
    league: coach.league ?? "",
    level: coach.level ?? "",
    birthYear: coach.birthYear ?? undefined,
    phone: coach.phone ?? "",
    location: coach.location ?? "",
    about: coach.about ?? "",
    philosophy: coach.philosophy ?? "",
    image: coach.image ?? "",
    experience: (coach.experience ?? []).map((exp) => ({
      id: (exp as { id?: string }).id,
      title: exp.title ?? "",
      team: exp.team ?? "",
      years: exp.years ?? "",
      description: exp.description ?? "",
    })),
    certifications: (coach.certifications ?? []).map((cert) => {
      const c = cert as { name: string; number?: string | null; expiresAt?: string | Date | null };
      return {
        id: (c as { id?: string }).id,
        name: c.name ?? "",
        number: c.number ?? "",
        expiresAt: c.expiresAt
          ? typeof c.expiresAt === "string"
            ? c.expiresAt.slice(0, 10)
            : new Date(c.expiresAt).toISOString().slice(0, 10)
          : "",
      };
    }),
    specialties: coach.specialties ?? [],
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-sm text-sub-text1/90 mt-1">
            Your coach profile and teams you coach
          </p>
        </div>
        <Button
          size="sm"
          className="bg-button-clr1 hover:bg-blue-700 text-sub-text3"
          onClick={() => setEditOpen(true)}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Hero Section */}
      <Card className="overflow-hidden bg-secondary-foreground/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
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
              <h2 className="text-2xl font-bold">{coach.name}</h2>
              <p className="text-lg text-sub-text3/80">{coach.title}</p>
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
                  {coach.rating.toFixed(1)} ({coach.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            {/* Current Team */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Current Team
              </h3>
              {(coach.team || coach.league) ? (
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
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
                    <p className="font-medium">{coach.team ?? "—"}</p>
                    <p className="text-sm text-muted-foreground">
                      {coach.league}
                    </p>
                  </div>
                </div>
              ) : null}
              <div className="grid grid-cols-2 gap-4 pt-2">
                {coach.level && (
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="font-semibold">{coach.level}</p>
                  </div>
                )}
                {coach.birthYear && (
                  <div>
                    <p className="text-sm text-muted-foreground">Birth Year</p>
                    <p className="font-semibold">{coach.birthYear}</p>
                  </div>
                )}
              </div>
              {!coach.team && !coach.league && !coach.level && !coach.birthYear && (
                <p className="text-muted-foreground text-sm">
                  Add your team info in Edit Profile.
                </p>
              )}
            </div>

            {/* Contact Info */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Information
              </h3>
              <div className="space-y-2">
                {coach.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <a
                      href={`mailto:${coach.email}`}
                      className="text-primary hover:underline"
                    >
                      {coach.email}
                    </a>
                  </div>
                )}
                {coach.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>{formatPhoneDisplay(coach.phone)}</span>
                  </div>
                )}
                {coach.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{coach.location}</span>
                  </div>
                )}
                {!coach.email && !coach.phone && !coach.location && (
                  <p className="text-muted-foreground text-sm">
                    Add contact info in Edit Profile.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="flex h-12 w-full items-center justify-between gap-1 p-1.5 sm:grid sm:grid-cols-5 sm:h-11 rounded-2xl bg-muted/50 text-muted-foreground">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center justify-center gap-2 h-full w-full rounded-xl transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md active:scale-95"
            >
              <tab.icon className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline-block text-sm font-medium">
                {tab.label}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="about" className="space-y-6 bg-foreground">
          <Card className="bg-secondary-foreground/60 text-sub-text3">
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Background</h4>
                <p className="text-sub-text3/80 whitespace-pre-wrap">
                  {coach.about || "Add your background in Edit Profile."}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Coaching Philosophy</h4>
                <p className="text-sub-text3/80 whitespace-pre-wrap">
                  {coach.philosophy ||
                    "Add your coaching philosophy in Edit Profile."}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          {coach.experience.length > 0 ? (
            coach.experience.map((exp, idx) => (
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
            ))
          ) : (
            <Card className="bg-secondary-foreground/60">
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  No experience added yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          {coach.certifications.length > 0 ? (
            coach.certifications.map((cert, idx) => (
              <Card
                className="bg-secondary-foreground/60 text-sub-text3"
                key={idx}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{cert.name}</h4>
                      {cert.number && (
                        <p className="text-sm text-sub-text3/80">{cert.number}</p>
                      )}
                      {(cert as { expiresAt?: string | Date | null }).expiresAt && (
                        <p className="text-sm text-sub-text3/70 mt-1">
                          Expires:{" "}
                          {new Date(
                            (cert as { expiresAt: string | Date }).expiresAt
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-secondary-foreground/60">
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  No certifications added yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="specialties">
          {coach.specialties.length > 0 ? (
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
          ) : (
            <Card className="bg-secondary-foreground/60">
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  No specialties added yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          {coach.reviews.length > 0 ? (
            coach.reviews.map((review) => (
              <Card
                className="bg-secondary-foreground/60 text-sub-text3"
                key={review.id}
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
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
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
                          <span className="ml-1 font-medium">{review.rating}/5</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-amber-600 border-amber-600/50 hover:bg-amber-50 hover:text-amber-700"
                          onClick={() => handleDispute(review.id)}
                          disabled={disputingId === review.id}
                        >
                          <Flag className="w-4 h-4 mr-1" />
                          {disputingId === review.id ? "Disputing..." : "Dispute Review"}
                        </Button>
                      </div>
                    </div>
                    <p className="text-sub-text3/90">{review.text}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-secondary-foreground/60">
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  No reviews yet. Parents can leave reviews after connecting.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <CoachEditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        coachId={coachProfileId}
        initialData={editInitial}
        onSave={fetchCoach}
      />
    </div>
  );
}

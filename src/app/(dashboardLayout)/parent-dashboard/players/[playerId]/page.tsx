"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  Activity,
  User,
  Star,
  Info,
  Power,
  PercentCircle,
  ActivityIcon,
  GoalIcon,
  HandHelpingIcon,
  ShieldCheckIcon,
  Ban,
  Flag,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import FeatureGate from "@/components/subscription/FeatureGate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlayerData {
  id: string;
  parentId: string;
  parentUserId?: string;
  name: string;
  birthYear: number;
  position?: string | null;
  level?: string | null;
  gender?: string | null;
  location?: string | null;
  team?: string | null;
  league?: string | null;
  image?: string | null;
  bio?: string | null;
  goals?: number | null;
  assists?: number | null;
  plusMinus?: number | null;
  gaa?: number | null;
  savePct?: string | null;
  status: string;
  socialLink?: string | null;
  age?: number;
  rating?: number | null;
  reviewCount?: number;
  parent?: {
    phone?: string | null;
    user?: { name?: string | null; email?: string | null };
  };
  reviews?: Array<{
    id: string;
    author: string;
    rating: number;
    text: string;
    createdAt: string;
  }>;
}

export default function PlayerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const playerId = params.playerId as string;
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);

  const parentProfileId = (session?.user as { parentProfileId?: string | null })?.parentProfileId;
  const isOwnPlayer = !!player && !!parentProfileId && player.parentId === parentProfileId;

  const [contactStatus, setContactStatus] = useState<"none" | "pending" | "approved">("none");
  const [requesting, setRequesting] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [disputingId, setDisputingId] = useState<string | null>(null);

  useEffect(() => {
    if (!playerId) {
      setLoading(false);
      return;
    }
    fetch(`/api/players/${playerId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setPlayer(null);
        } else {
          setPlayer(data);
        }
      })
      .catch(() => setPlayer(null))
      .finally(() => setLoading(false));
  }, [playerId]);

  useEffect(() => {
    if (!player?.parentId || !parentProfileId || isOwnPlayer) return;
    const q = new URLSearchParams({
      targetParentId: player.parentId,
      playerId: player.id,
    });
    fetch(`/api/parent-contact-requests/check?${q}`)
      .then((r) => r.json())
      .then((res) => setContactStatus(res.status ?? "none"))
      .catch(() => setContactStatus("none"));
  }, [player?.id, player?.parentId, parentProfileId, isOwnPlayer]);

  const handleRequestContact = async () => {
    if (!player || !parentProfileId) return;
    setRequesting(true);
    try {
      const res = await fetch("/api/parent-contact-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetParentId: player.parentId,
          playerId: player.id,
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

  const handleDisputeReview = async (reviewId: string) => {
    if (!window.confirm("Dispute this review? It will be hidden immediately and sent for admin review.")) return;
    setDisputingId(reviewId);
    try {
      const res = await fetch(`/api/players/reviews/${reviewId}/dispute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Review disputed and hidden. Admin has been notified.");
        fetch(`/api/players/${playerId}`)
          .then((r) => r.json())
          .then((d) => !d.error && setPlayer(d))
          .catch(() => {});
      } else {
        toast.error(data.error ?? "Failed to dispute review");
      }
    } catch {
      toast.error("Failed to dispute review");
    } finally {
      setDisputingId(null);
    }
  };

  const handleBlockUser = async () => {
    const parentUserId = player?.parentUserId;
    if (!parentUserId) return;
    setBlocking(true);
    try {
      const res = await fetch("/api/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockedUserId: parentUserId }),
      });
      if (res.ok) {
        toast.success("User blocked");
        router.push("/parent-dashboard/players");
      } else {
        toast.error("Failed to block user");
      }
    } finally {
      setBlocking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-sub-text1/80">Loading player...</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-bold mb-4">Player not found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const hasContactAccess = isOwnPlayer || contactStatus === "approved";
  const email = hasContactAccess ? (player.parent?.user?.email ?? "") : "";
  const phone = hasContactAccess ? (player.parent?.phone ?? "") : "";
  const rating = player.rating ?? 0;
  const reviewCount = player.reviewCount ?? 0;
  const reviews = player.reviews ?? [];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Players
          </Button>
          {isOwnPlayer && (
            <Button
              asChild
              className="bg-green-600 hover:bg-green-500 text-white"
            >
              <Link href={`/parent-dashboard/players/${playerId}/manage`}>
                Manage Player
              </Link>
            </Button>
          )}
        </div>
        {!isOwnPlayer && player.parentUserId && (
          <Button
            variant="outline"
            onClick={handleBlockUser}
            disabled={blocking}
            className="flex items-center gap-2 border-red-500/50 text-red-600 hover:bg-red-500/10"
          >
            <Ban className="w-4 h-4" />
            {blocking ? "Blocking..." : "Block User"}
          </Button>
        )}
      </div>

      {/* Hero Section */}
      <Card className="overflow-hidden border-none bg-secondary-foreground/60 dark:bg-slate-900/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
          <div className="md:col-span-1 flex flex-col items-center space-y-4">
            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-lg overflow-hidden bg-slate-200">
              <Image
                src={player.image ?? "/newasset/parent/players/Players1.png"}
                alt={player.name}
                fill
                className="object-cover"
                unoptimized={player.image?.startsWith("data:")}
              />
            </div>
            <div className="text-center space-y-2 text-sub-text3">
              <h1 className="text-3xl font-bold text-sub-text3">{player.name}</h1>
              {reviewCount > 0 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">
                    {rating.toFixed(1)} ({reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-extrabold text-sub-text3">
                  {player.name}
                </h1>
                <p className="text-xl text-primary font-semibold">
                  {[player.team, player.position].filter(Boolean).join(" • ") || "Player"}
                </p>
              </div>
              {player.socialLink && (
                <a
                  href={player.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-11 px-5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm uppercase tracking-[0.1em] shrink-0"
                >
                  Social
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm">
                <p className="text-xs text-muted-foreground uppercase">
                  Birth Year
                </p>
                <p className="text-lg font-bold">{player.birthYear}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm">
                <p className="text-xs text-muted-foreground uppercase">Level</p>
                <p className="text-lg font-bold">{player.level ?? "-"}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm">
                <p className="text-xs text-muted-foreground uppercase">
                  Gender
                </p>
                <p className="text-lg font-bold">{player.gender ?? "-"}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm">
                <p className="text-xs text-muted-foreground uppercase">
                  Location
                </p>
                <p className="text-lg font-bold">{player.location ?? "-"}</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Contact Information</h3>
              {hasContactAccess ? (
                (email || phone || player.location) ? (
                  <div className="space-y-2">
                    {email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-primary" />
                        <a href={`mailto:${email}`} className="text-primary hover:underline">
                          {email}
                        </a>
                      </div>
                    )}
                    {phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-primary" />
                        <a href={`tel:${phone}`} className="text-primary hover:underline">
                          {phone}
                        </a>
                      </div>
                    )}
                    {player.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span>{player.location}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No contact info on file.</p>
                )
              ) : contactStatus === "pending" ? (
                <p className="text-amber-600 dark:text-amber-400 font-medium">
                  Contact request pending. The parent will be notified to approve.
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="text-muted-foreground text-sm">
                    Contact info is private. Request access to connect with the parent.
                  </p>
                  <FeatureGate
                    feature="parent_contact_requests"
                    fallback={
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-extrabold">
                        Upgrade to Gold for contact requests between parents.
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

          </div>
        </div>
      </Card>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid bg-muted/50 text-muted-foreground w-full grid-cols-3">
          <TabsTrigger value="about">
            <span>
              <Info />
            </span>
            About
          </TabsTrigger>
          <TabsTrigger value="stats">
            <span>
              <Power />
            </span>
            Performance
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <span>
              <User />
            </span>
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <Card className="bg-secondary-foreground/60 border-none">
            <CardHeader>
              <CardTitle className="flex items-center text-sub-text3 gap-2">
                <User className="text-blue-500" /> Player Bio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-sub-text3/80">
                {player.bio || "No biography provided for this player."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="text-blue-500" /> Season Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center text-sub-text3">
                {(player.position === "Forward" ||
                  player.position === "Defense" ||
                  !player.position) && (
                  <>
                    <div className="space-y-2 bg-secondary-foreground/50 rounded-2xl p-3 flex flex-col items-center justify-center">
                      <GoalIcon className="w-5 h-5 opacity-70" />
                      <div className="space-y-1">
                        <p className="text-3xl font-bold leading-none">
                          {player.goals ?? 0}
                        </p>
                        <p className="text-xs uppercase tracking-wider font-medium">
                          Goals
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 bg-secondary-foreground/50 rounded-2xl p-3 flex flex-col items-center justify-center">
                      <HandHelpingIcon className="w-5 h-5 opacity-70" />
                      <div className="space-y-1">
                        <p className="text-3xl font-bold leading-none">
                          {player.assists ?? 0}
                        </p>
                        <p className="text-xs uppercase tracking-wider font-medium">
                          Assists
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 bg-secondary-foreground/50 rounded-2xl p-3 flex flex-col items-center justify-center">
                      <ActivityIcon className="w-5 h-5 opacity-70" />
                      <div className="space-y-1">
                        <p className="text-3xl font-bold leading-none">
                          {player.plusMinus != null ? player.plusMinus : "-"}
                        </p>
                        <p className="text-xs uppercase tracking-wider font-medium">
                          +/-
                        </p>
                      </div>
                    </div>
                  </>
                )}
                {player.position === "Goalie" && (
                  <>
                    <div className="space-y-2 bg-secondary-foreground/50 rounded-2xl p-3 flex flex-col items-center justify-center">
                      <ShieldCheckIcon className="w-5 h-5 opacity-70" />
                      <div className="space-y-1">
                        <p className="text-3xl font-bold leading-none">
                          {player.gaa ?? "-"}
                        </p>
                        <p className="text-xs uppercase tracking-wider font-medium">
                          GAA
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 bg-secondary-foreground/50 rounded-2xl p-3 flex flex-col items-center justify-center">
                      <PercentCircle className="w-5 h-5 opacity-70" />
                      <div className="space-y-1">
                        <p className="text-3xl font-bold leading-none">
                          {player.savePct ?? "-"}
                        </p>
                        <p className="text-xs uppercase tracking-wider font-medium">
                          Save %
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
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
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
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
                          <span className="ml-1 font-bold">{review.rating}/5</span>
                        </div>
                        {isOwnPlayer && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-amber-600 border-amber-600/50 hover:bg-amber-50 hover:text-amber-700"
                            onClick={() => handleDisputeReview(review.id)}
                            disabled={disputingId === review.id}
                          >
                            <Flag className="w-4 h-4 mr-1" />
                            {disputingId === review.id ? "Disputing..." : "Dispute Review"}
                          </Button>
                        )}
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

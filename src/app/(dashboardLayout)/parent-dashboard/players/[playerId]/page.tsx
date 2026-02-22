"use client";

import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Activity,
  User,
  Phone,
  Mail,
  Star,
  Info,
  Award,
  Power,
  Percent,
  PercentCircle,
  ActivityIcon,
  GoalIcon,
  HandHelpingIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RatingModal } from "@/components/dashboard/coachDashboard/Ratings/RatingModal";

// Data imported/copied from your Players list for consistency
const PLAYERS_DATA = [
  {
    id: "cdfda4546",
    name: "Jake Thompson",
    team: "Maple Leafs II",
    age: "17",

    teamLogo: "/newasset/parent/coaches/coaches.png",
    league: "Elite League",
    rating: 4.9,
    reviewCount: 25,
    email: "jake.thompson@email.com",
    phone: "+1 (702) 555-0123",

    birthYear: 2010,
    position: "Forward",
    level: "AAA",
    goals: 17,
    assists: 10,
    gaa: 3.0,
    save: "80%",
    gender: "Male",
    location: "Toronto, ON",
    status: "Verified",
    image: "/newasset/parent/players/Players1.png",
    bio: "I've been playing hockey since I was 5 years old and it's been my passion ever since. My goal is to become a professional hockey player and represent my country. I'm known for my speed, strong skating ability, and playmaking skills. I love being a leader on the ice and helping my teammates succeed. Off the ice, I focus on my conditioning and studying game footage to improve every day.",

    reviews: [
      {
        author: "Emma Davis",
        rating: 5,
        text: "Great communication with parents. Always updates us on what the team is working on and how our kids are progressing. My daughter looks forward to every practice session now.",
        date: "2024-01-12",
      },
      {
        author: "Robert Wilson",
        rating: 4,
        text: "Great communication with parents. Always updates us on what the team is working on and how our kids are progressing. My daughter looks forward to every practice session now.",
        date: "2024-01-08",
      },
    ],

    experience: [
      {
        title: "Defence",
        team: "Toronto Stars",
        years: "2018 - Present",
        description: "Leading AA level competitive team",
      },
      {
        title: "Defence",
        team: "Toronto Youth Hockey",
        years: "2012 - 2018",
        description: "Developed beginner to intermediate level players",
      },
    ],
  },
  {
    id: "cdfda45466",
    name: "Sarah Miller",
    team: "Toronto Stars",
    age: "16",

    teamLogo: "/newasset/parent/coaches/coaches.png",
    league: "Elite League",
    rating: 4.9,
    reviewCount: 25,
    email: "jake.thompson@email.com",
    phone: "+1 (702) 555-0123",

    birthYear: 2011,
    position: "Defense",
    level: "AA",
    goals: 8,
    assists: 14,
    gaa: 2.4,
    save: "85%",
    gender: "Female",
    location: "Vancouver, BC",
    status: "Pending",
    image: "/newasset/parent/players/Players1.png",
    bio: "I've been playing hockey since I was 5 years old and it's been my passion ever since. My goal is to become a professional hockey player and represent my country. I'm known for my speed, strong skating ability, and playmaking skills. I love being a leader on the ice and helping my teammates succeed. Off the ice, I focus on my conditioning and studying game footage to improve every day.",

    reviews: [
      {
        author: "Emma Davis",
        rating: 5,
        text: "Great communication with parents. Always updates us on what the team is working on and how our kids are progressing. My daughter looks forward to every practice session now.",
        date: "2024-01-12",
      },
      {
        author: "Robert Wilson",
        rating: 4,
        text: "Great communication with parents. Always updates us on what the team is working on and how our kids are progressing. My daughter looks forward to every practice session now.",
        date: "2024-01-08",
      },
    ],
    experience: [
      {
        title: "Defence",
        team: "Toronto Stars",
        years: "2018 - Present",
        description: "Leading AA level competitive team",
      },
      {
        title: "Defence",
        team: "Toronto Youth Hockey",
        years: "2012 - 2018",
        description: "Developed beginner to intermediate level players",
      },
    ],
  },
  {
    id: "cdfda4550",
    name: "Emma Watson",
    team: "Toronto Stars",
    age: "16",

    teamLogo: "/newasset/parent/coaches/coaches.png",
    league: "Elite League",
    rating: 4.9,
    reviewCount: 25,
    email: "jake.thompson@email.com",
    phone: "+1 (702) 555-0123",

    birthYear: 2011,
    position: "Defense",
    level: "AA",
    goals: 8,
    assists: 14,
    gaa: 2.4,
    save: "85%",
    gender: "Female",
    location: "Vancouver, BC",
    status: "Pending",
    image: "/newasset/parent/players/Players1.png",

    reviews: [
      {
        author: "Emma Davis",
        rating: 5,
        text: "Great communication with parents. Always updates us on what the team is working on and how our kids are progressing. My daughter looks forward to every practice session now.",
        date: "2024-01-12",
      },
      {
        author: "Robert Wilson",
        rating: 4,
        text: "Great communication with parents. Always updates us on what the team is working on and how our kids are progressing. My daughter looks forward to every practice session now.",
        date: "2024-01-08",
      },
    ],

    experience: [
      {
        title: "Defence",
        team: "Toronto Stars",
        years: "2018 - Present",
        description: "Leading AA level competitive team",
      },
      {
        title: "Defence",
        team: "Toronto Youth Hockey",
        years: "2012 - 2018",
        description: "Developed beginner to intermediate level players",
      },
    ],
  },
];

export default function PlayerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const playerId = params.playerId as string;

  const player = PLAYERS_DATA.find((p) => p.id === playerId);

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Player not found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Players
      </Button>

      {/* Hero Section */}
      <Card className="overflow-hidden border-none bg-secondary-foreground/60 dark:bg-slate-900/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
          <div className="md:col-span-1 flex flex-col items-center space-y-4">
            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-lg overflow-hidden">
              <Image
                src={player.image}
                alt={player.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center space-y-2 text-sub-text3">
              <h1 className="text-3xl font-bold text-sub-text3">
                {player.name}
              </h1>
              {/* Rating */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(player.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold">
                  {player.rating.toFixed(1)} ({player.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-extrabold text-sub-text3">
                {player.name}
              </h1>
              <p className="text-xl text-primary font-semibold">
                {player.team} • {player.position}
              </p>
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
                <p className="text-lg font-bold">{player.level}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm">
                <p className="text-xs text-muted-foreground uppercase">
                  Gender
                </p>
                <p className="text-lg font-bold">{player.gender}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm">
                <p className="text-xs text-muted-foreground uppercase">
                  Location
                </p>
                <p className="text-lg font-bold">{player.location}</p>
              </div>
            </div>

            {/* Cpntract Information */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <a
                    href={`mailto:${player.email}`}
                    className="text-primary hover:underline"
                  >
                    {player.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <a
                    href={`tel:${player.phone}`}
                    className="text-primary hover:underline"
                  >
                    {player.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{player.location}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1">Request Contact</Button>
              <Button variant="outline" className="flex-1">
                Block Coach
              </Button>
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
          {/* <TabsTrigger value="experience">Experience</TabsTrigger> */}
          <TabsTrigger value="reviews">
            <span>
              <Award />
            </span>
            Reviews
          </TabsTrigger>
        </TabsList>

        {/* About  */}
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

        {/* Performance */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="text-blue-500" /> Season Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center text-sub-text3">
                {/* Goals */}
                <div className="space-y-2 bg-secondary-foreground/50 rounded-2xl p-3 flex flex-col items-center justify-center">
                  <GoalIcon className="w-5 h-5 opacity-70" />
                  <div className="space-y-1">
                    <p className="text-3xl font-bold leading-none">
                      {player.goals}
                    </p>
                    <p className="text-xs uppercase tracking-wider font-medium">
                      Goals
                    </p>
                  </div>
                </div>

                {/* Assists */}
                <div className="space-y-2 bg-secondary-foreground/50 rounded-2xl p-3 flex flex-col items-center justify-center">
                  <HandHelpingIcon className="w-5 h-5 opacity-70" />
                  <div className="space-y-1">
                    <p className="text-3xl font-bold leading-none">
                      {player.assists}
                    </p>
                    <p className="text-xs uppercase tracking-wider font-medium">
                      Assists
                    </p>
                  </div>
                </div>

                {/* GAA */}
                <div className="space-y-2 bg-secondary-foreground/50 rounded-2xl p-3 flex flex-col items-center justify-center">
                  <ShieldCheckIcon className="w-5 h-5 opacity-70" />
                  <div className="space-y-1">
                    <p className="text-3xl font-bold leading-none">
                      {player.gaa}
                    </p>
                    <p className="text-xs uppercase tracking-wider font-medium">
                      GAA
                    </p>
                  </div>
                </div>

                {/* Save % */}
                <div className="space-y-2 bg-secondary-foreground/50 rounded-2xl p-3 flex flex-col items-center justify-center">
                  <PercentCircle className="w-5 h-5 opacity-70" />
                  <div className="space-y-1">
                    <p className="text-3xl font-bold leading-none">
                      {player.save}
                    </p>
                    <p className="text-xs uppercase tracking-wider font-medium">
                      Save %
                    </p>
                  </div>
                </div>

                {/* Plus/Minus */}
                <div className="space-y-2 bg-secondary-foreground/50 rounded-2xl p-3 flex flex-col items-center justify-center">
                  <ActivityIcon className="w-5 h-5 opacity-70" />
                  <div className="space-y-1">
                    <p className="text-3xl font-bold leading-none">+5</p>
                    <p className="text-xs uppercase tracking-wider font-medium">
                      +/-
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* reviews */}
        <TabsContent value="reviews" className="space-y-4">
          {player.reviews.length > 0 ? (
            player.reviews.map((review, idx) => (
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

          {/* <RatingModal
            isOpen={!!selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
            playerName={selectedPlayer || ""}
          /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}

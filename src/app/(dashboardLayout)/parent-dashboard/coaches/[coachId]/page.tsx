"use client";

import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
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

import { Info, Briefcase, Zap } from "lucide-react";

// Update your tab mapping to include icons
const tabs = [
  { id: "about", label: "About", icon: Info },
  { id: "experience", label: "Exp.", icon: Briefcase },
  { id: "certifications", label: "Certs", icon: Award },
  { id: "specialties", label: "Specs", icon: Zap },
  { id: "reviews", label: "Reviews", icon: Star },
];

const COACHES_DATA = [
  {
    id: "coash1",
    name: "Jake Thompson",
    title: "Head Coach",
    team: "Vegas Golden Knights",
    teamLogo: "/newasset/parent/coaches/coaches.png",
    league: "Elite League",
    level: "Pro",
    birthYear: 1990,
    rating: 4.9,
    reviewCount: 25,
    image: "/newasset/parent/coaches/coaches.png",
    location: "Las Vegas, NV",
    email: "jake.thompson@email.com",
    phone: "+1 (702) 555-0123",
    about:
      "I'm Coach Jake Thompson, a dedicated hockey coach with a strong passion for developing players both on and off the ice. With years of experience in coaching and player development, I focus on building strong fundamentals, game intelligence, and confidence in every athlete I work with.",
    philosophy:
      "My coaching philosophy is centered on discipline, teamwork, and continuous improvement. I believe every player has potential, and my goal is to create a positive, supportive environment where athletes can grow their skills, understand the game, and enjoy the process of competing.",
    certifications: [
      {
        name: "CEP Level 5",
        number: "#123467940",
      },
      {
        name: "USA Hockey Coaching Certification",
        number: "#USA-HC-2023",
      },
      {
        name: "Advanced Player Development",
        number: "#APD-2022",
      },
    ],
    experience: [
      {
        title: "Head Coach",
        team: "Vegas Golden Knights",
        years: "2020 - Present",
        description: "Leading the professional team with 3 championship titles",
      },
      {
        title: "Assistant Coach",
        team: "Northside FC Academy",
        years: "2015 - 2020",
        description: "Developed youth players and managed training programs",
      },
      {
        title: "Player Development Coach",
        team: "Las Vegas Sports Center",
        years: "2010 - 2015",
        description: "Focused on skill development and game strategy",
      },
    ],
    specialties: [
      "Offensive Strategy",
      "Player Development",
      "Game Intelligence",
    ],
    reviews: [
      {
        author: "John Doe",
        rating: 5,
        text: "Excellent coach! My son improved significantly under his guidance.",
        date: "2024-01-15",
      },
      {
        author: "Jane Smith",
        rating: 5,
        text: "Very professional and knowledgeable. Highly recommended!",
        date: "2024-01-10",
      },
      {
        author: "Mike Johnson",
        rating: 4,
        text: "Great coaching methods and very attentive to details.",
        date: "2024-01-05",
      },
    ],
  },
  {
    id: "coash3",
    name: "Sarah Johnson",
    title: "Head Coach",
    team: "Toronto Stars",
    teamLogo: "/newasset/parent/coaches/coaches.png",
    league: "Ontario League",
    level: "AA",
    birthYear: 1985,
    rating: 4.6,
    reviewCount: 18,
    image: "/newasset/parent/coaches/coaches.png",
    location: "Toronto, ON",
    email: "sarah.johnson@email.com",
    phone: "+1 (416) 555-0456",
    about:
      "Sarah Johnson is an experienced hockey coach specializing in youth development and player excellence. With a background in competitive hockey, she brings practical knowledge and a passion for nurturing young talent.",
    philosophy:
      "I believe in creating an inclusive environment where every player feels valued. My focus is on building confidence, technical skills, and a love for the game.",
    certifications: [
      {
        name: "CEP Level 4",
        number: "#234567891",
      },
      {
        name: "Youth Hockey Development",
        number: "#YHD-2021",
      },
    ],
    experience: [
      {
        title: "Head Coach",
        team: "Toronto Stars",
        years: "2018 - Present",
        description: "Leading AA level competitive team",
      },
      {
        title: "Skills Coach",
        team: "Toronto Youth Hockey",
        years: "2012 - 2018",
        description: "Developed beginner to intermediate level players",
      },
    ],
    specialties: [
      "Youth Development",
      "Skating Techniques",
      "Fundamental Skills",
      "Positive Coaching",
    ],
    reviews: [
      {
        author: "Emma Davis",
        rating: 5,
        text: "Sarah is amazing with kids. Very encouraging and supportive.",
        date: "2024-01-12",
      },
      {
        author: "Robert Wilson",
        rating: 4,
        text: "Great coach with good communication skills.",
        date: "2024-01-08",
      },
    ],
  },
  {
    id: "coash4",
    name: "Mark Stevens",
    title: "Assistant Coach",
    team: "Maple Leafs II",
    teamLogo: "/newasset/parent/coaches/coaches.png",
    league: "Local League",
    level: "AAA",
    birthYear: 1978,
    rating: 4.2,
    reviewCount: 12,
    image: "/newasset/parent/coaches/coaches.png",
    location: "Toronto, ON",
    email: "mark.stevens@email.com",
    phone: "+1 (416) 555-0789",
    about:
      "Mark Stevens brings decades of hockey experience as both a player and coach. His strategic approach and attention to detail make him an excellent mentor for aspiring players.",
    philosophy:
      "Strategy and fundamentals are key to success. I emphasize the importance of understanding the game at a deeper level.",
    certifications: [
      {
        name: "CEP Level 3",
        number: "#345678902",
      },
    ],
    experience: [
      {
        title: "Assistant Coach",
        team: "Maple Leafs II",
        years: "2015 - Present",
        description: "Supporting team strategy and player development",
      },
    ],
    specialties: ["Tactical Strategy", "Advanced Players", "Team Dynamics"],
    reviews: [
      {
        author: "Tom Harris",
        rating: 4,
        text: "Very knowledgeable and great at explaining tactics.",
        date: "2024-01-10",
      },
    ],
  },
  {
    id: "coash5",
    name: "Nadib Stevens",
    title: "Assistant Coach",
    team: "Maple Leafs II",
    teamLogo: "/newasset/parent/coaches/coaches.png",
    league: "Local League",
    level: "AAA",
    birthYear: 1978,
    rating: 4.2,
    reviewCount: 8,
    image: "/newasset/parent/coaches/coaches.png",
    location: "Toronto, ON",
    email: "nadib.stevens@email.com",
    phone: "+1 (416) 555-0321",
    about:
      "Nadib is an enthusiastic coach dedicated to helping players reach their full potential through structured training and mentorship.",
    philosophy:
      "Every player is unique. I tailor my coaching approach to meet individual needs while maintaining team cohesion.",
    certifications: [
      {
        name: "CEP Level 3",
        number: "#456789013",
      },
    ],
    experience: [
      {
        title: "Assistant Coach",
        team: "Maple Leafs II",
        years: "2018 - Present",
        description: "Focused on individual player improvement",
      },
    ],
    specialties: ["Personal Training", "Confidence Building", "Skill Training"],
    reviews: [
      {
        author: "Lisa Brown",
        rating: 4,
        text: "Very attentive and patient coach.",
        date: "2024-01-09",
      },
    ],
  },
];

export default function CoachDetailPage() {
  const router = useRouter();
  const params = useParams();
  const coachId = params.coachId as string;

  const coach = COACHES_DATA.find((c) => c.id === coachId);

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
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Coaches
      </Button>

      {/* Hero Section */}
      <Card className="overflow-hidden bg-secondary-foreground/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
          {/* Image and Basic Info */}
          <div className="md:col-span-1 flex flex-col items-center space-y-4">
            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-lg overflow-hidden">
              <Image
                src={coach.image}
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
                  {coach.rating.toFixed(1)} ({coach.reviewCount} reviews)
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
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={coach.teamLogo}
                    alt={coach.team}
                    fill
                    className="object-cover"
                  />
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

            {/* Contact Info */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <a
                    href={`mailto:${coach.email}`}
                    className="text-primary hover:underline"
                  >
                    {coach.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <a
                    href={`tel:${coach.phone}`}
                    className="text-primary hover:underline"
                  >
                    {coach.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{coach.location}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button className="flex-1">Request Contact</Button>
              <Button variant="outline" className="flex-1">
                Block Coach
              </Button>
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
                    <p className="text-sm text-sub-text3/80">{cert.number}</p>
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
                    <Users className="w-5 h-5 text-sub-text3 flex-shrink-0" />
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

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, BarChart2, FileText, Video } from "lucide-react";

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: "exercise" | "class" | "progress" | "notes" | "video";
}

interface FeaturesSectionProps {
  features?: FeatureItem[];
}

const iconMap = {
  exercise: GraduationCap,
  class: Users,
  progress: BarChart2,
  notes: FileText,
  video: Video,
};

export default function FeaturesSection({
  features = [
    {
      id: "1",
      title: "Interactive Exercises",
      description: "MCQs, gap filling, listening, and more",
      icon: "exercise",
    },
    {
      id: "2",
      title: "Class Management",
      description: "Easy class creation and student tracking",
      icon: "class",
    },
    {
      id: "3",
      title: "Progress Tracking",
      description: "Real-time performance monitoring",
      icon: "progress",
    },
    {
      id: "4",
      title: "Progress Tracking",
      description: "Real-time performance monitoring",
      icon: "progress",
    },
    {
      id: "5",
      title: "Grammar Notes",
      description: "Comprehensive learning materials",
      icon: "notes",
    },
    {
      id: "6",
      title: "Video Lessons",
      description: "Engaging multimedia content",
      icon: "video",
    },
  ],
}: FeaturesSectionProps) {
  return (
    <section className="w-full py-15 px-4 bg-background2 rounded-xl">
      <div className="container mx-auto">
        <h2 className="heading text-center ">
          KEY <span className="text-primary">FEATURES</span>
        </h2>
        <p className="subheading text-center text-muted-foreground">
          The essential tools and content you need to ace your school-leaving exams.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = iconMap[feature.icon];
          return (
            <Card
              key={feature.id}
              className={`rounded-xl bg-background hover:shadow-lg transition p-4 ${feature.title === "Grammar Notes" || feature.title === "Video Lessons" ? 'md:col-span-2 lg:col-span-2' : ''}`}
            >
              <CardContent className="flex items-start gap-4 p-0">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>

                <div>
                  <h3 className="font-semibold text-foreground text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      </div>
    </section>
  );
}

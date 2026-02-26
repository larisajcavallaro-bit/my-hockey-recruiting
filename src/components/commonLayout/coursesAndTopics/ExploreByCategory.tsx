"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  Target,
  Lightbulb,
  MessageCircle,
  FileText,
} from "lucide-react";

// Dummy data structure - easily replaceable with API data
type Difficulty = "Easy" | "Medium" | "Hard";

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type Category = {
  id: string;
  label: string;
  icon: IconComponent;
};

type Topic = {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  lessons: number;
  icon: IconComponent;
};

const categories: Category[] = [
  { id: "all", label: "All Topics", icon: BookOpen },
  { id: "grammar", label: "Grammar", icon: FileText },
  { id: "training", label: "Training Topics", icon: Target },
  { id: "listening", label: "Listening & Reading", icon: MessageCircle },
];

const topics: Topic[] = [
  {
    id: 1,
    title: "Advanced English Grammar",
    description:
      "Master advanced grammar concepts and improve your writing skills",
    category: "grammar",
    difficulty: "Medium",
    lessons: 6,
    icon: BookOpen,
  },
  {
    id: 2,
    title: "Present Perfect Tense",
    description:
      "Master advanced grammar concepts and improve your writing skills",
    category: "grammar",
    difficulty: "Hard",
    lessons: 6,
    icon: FileText,
  },
  {
    id: 3,
    title: "Conversation Skills",
    description:
      "Master advanced grammar concepts and improve your writing skills",
    category: "listening",
    difficulty: "Easy",
    lessons: 6,
    icon: MessageCircle,
  },
  {
    id: 4,
    title: "Modal Verbs",
    description:
      "Master advanced grammar concepts and improve your writing skills",
    category: "grammar",
    difficulty: "Hard",
    lessons: 6,
    icon: Lightbulb,
  },
  {
    id: 5,
    title: "Culture & Traditions",
    description:
      "Master advanced grammar concepts and improve your writing skills",
    category: "training",
    difficulty: "Easy",
    lessons: 6,
    icon: Users,
  },
  {
    id: 6,
    title: "Essay Writing",
    description:
      "Master advanced grammar concepts and improve your writing skills",
    category: "listening",
    difficulty: "Medium",
    lessons: 6,
    icon: Target,
  },
];

const LearningTopicsExplorer = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter topics based on active category
  const filteredTopics =
    activeCategory === "all"
      ? topics
      : topics.filter((topic) => topic.category === activeCategory);

  // Difficulty color mapping
  const getDifficultyColor = (difficulty: "Easy" | "Medium" | "Hard") => {
    const colors = {
      Easy: "bg-chart-2/20 text-chart-2 border-chart-2/40",
      Medium: "bg-primary/20 text-primary border-primary/40",
      Hard: "bg-chart-1/20 text-chart-1 border-chart-1/40",
    };
    return colors[difficulty] || "bg-card text-muted-foreground";
  };

  // Icon background color mapping
  const getIconBgColor = (difficulty: "Easy" | "Medium" | "Hard") => {
    const colors: Record<"Easy" | "Medium" | "Hard", string> = {
      Easy: "bg-chart-2",
      Medium: "bg-primary",
      Hard: "bg-chart-1",
    };
    return colors[difficulty] || "bg-muted-foreground";
  };

  return (
    <div className="py-15 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="heading text-center ">
          Explore by <span className="text-primary">Category</span>
        </h2>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                variant={activeCategory === category.id ? "default" : "default"}
                className={`
                  ${
                    activeCategory === category.id
                      ? "bg-primary hover:bg-chart-4 text-foreground border-chart-5"
                      : "bg-background hover:bg-card text-secondary-foreground border-accent"
                  }
                  transition-all duration-200 shadow-sm
                `}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Featured Topics Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-3">
            Featured Topics
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Start your learning journey with these popular topics
          </p>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => {
              const Icon = topic.icon;
              return (
                <Card
                  key={topic.id}
                  className="hover:shadow-lg transition-shadow duration-300 bg-background"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-3 rounded-lg ${getIconBgColor(
                          topic.difficulty
                        )}`}
                      >
                        <Icon className="w-6 h-6 text-background" />
                      </div>
                      <Badge
                        variant="outline"
                        className={`${getDifficultyColor(
                          topic.difficulty
                        )} border`}
                      >
                        {topic.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground mb-2">
                      {topic.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {topic.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {topic.lessons} Lessons
                      </span>
                    </div>
                    <Button className="w-full text-foreground font-semibold">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredTopics.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No topics found in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningTopicsExplorer;

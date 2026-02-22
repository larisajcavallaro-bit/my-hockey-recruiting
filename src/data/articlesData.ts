import { StaticImageData } from "next/image";

export interface Article {
  title: string;
  category: string;
  date: string;
  author: string;
  image: string | StaticImageData;
  excerpt: string;
  content: string;
}

export const defaultArticles: Record<string, Article> = {
  "team-building": {
    title: "Essential Team Building Strategies for Youth Hockey",
    category: "Player Development",
    date: "January 12, 2026",
    author: "Coach Marko",
    image: "/speed-drills.jpg",
    excerpt:
      "The foundation of any great team is psychological safety. When team members feel safe to take risks and be vulnerable in front of each other, they are more likely to innovate and solve complex problems effectively. As a coach, you play a critical role in establishing this climate of trust.",
    content: `Effective communication isn't just about talking; it's about active listening and clear expectations. High-performance units often have 'unspoken' rules that are actually deeply defined through consistent behavior and accountability. We call these 'cultural non-negotiables.'

Alignment on the mission is the third pillar. Every member of the team should be able to articulate not just what they are doing, but 'why' it matters. This purpose-driven approach sustains motivation even when the immediate tasks become repetitive or difficult.

Lastly, continuous feedback loops ensure that the team is always learning. Instead of annual reviews, move towards real-time coaching moments. This agile approach to professional development keeps the team sharp and responsive to changing environments.`,
  },
  "speed-and-agility": {
    title: "Building Speed and Agility in Young Hockey Players",
    category: "Skills Training",
    date: "January 10, 2026",
    author: "Coach Sarah",
    image: "/speed-drills.jpg",
    excerpt:
      "Discover the best skating drills and exercises to help young players develop explosive speed and quick feet on the ice.",
    content: `Speed and agility are crucial skills in modern hockey. Players need to be able to change direction quickly and accelerate explosively.

Key drills include ladder work, cone drills, and plyometric exercises. Each of these targets different aspects of speed development.

Starting with proper technique is essential before adding intensity. Make sure players understand the fundamentals before progressing to more advanced drills.`,
  },
  "nutrition-guide": {
    title: "Nutrition Guide for Young Athletes",
    category: "Health & Wellness",
    date: "January 8, 2026",
    author: "Coach Mike",
    image: "/speed-drills.jpg",
    excerpt:
      "Learn how proper nutrition can enhance athletic performance and recovery for youth hockey players.",
    content: `Nutrition plays a vital role in athletic performance. Young athletes need proper fuel to perform at their best.

Key nutrients include carbohydrates for energy, proteins for muscle repair, and fats for hormone production. Hydration is equally important.

Before games, focus on familiar foods that provide sustained energy. During competition, ensure proper hydration with sports drinks containing electrolytes.

Post-game nutrition is critical for recovery. Include protein and carbohydrates within 30 minutes of finishing play.`,
  },
};

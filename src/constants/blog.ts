/**
 * Blog post categories for the blog section.
 * Source: User-provided list from design.
 */
export const BLOG_CATEGORIES = [
  "New Parent Guide",
  "Player Development",
  "Teams, Tryouts & Pathways",
  "Costs, Gear & Value",
  "The Hockey Coach",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

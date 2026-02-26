"use client";

import ArticleCard from "./ArticleCard";

export type BlogPostItem = {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  author: string;
  category: string;
  publishedAt: string;
};

const PLACEHOLDER_IMAGE = "/newasset/facilities/card/arctic-arena-1.png";

function toArticle(post: BlogPostItem) {
  const excerpt = post.content.length > 150 ? post.content.slice(0, 150) + "…" : post.content;
  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return {
    title: post.title,
    category: post.category,
    date,
    author: post.author,
    image: post.imageUrl || PLACEHOLDER_IMAGE,
    excerpt,
    content: post.content,
  };
}

interface BlogPostGridProps {
  posts: BlogPostItem[];
}

export default function BlogPostGrid({ posts }: BlogPostGridProps) {
  if (posts.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <ArticleCard key={post.id} {...toArticle(post)} />
      ))}
    </div>
  );
}

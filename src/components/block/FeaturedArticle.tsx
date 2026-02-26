"use client";

import React, { useState } from "react";
import ArticleModal from "./ArticleModal";
import Image from "next/image";
import { Button } from "../ui/button";
import BLOG_IMG from "../../../public/newasset/blog/Building Speed and Agility in Young Hockey Players.png";

export type BlogPostForDisplay = {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  author: string;
  category: string;
  publishedAt: string;
};

function toArticle(post: BlogPostForDisplay) {
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
    image: post.imageUrl || BLOG_IMG,
    excerpt,
    content: post.content,
  };
}

interface FeaturedArticleProps {
  post: BlogPostForDisplay | null;
}

const FeaturedArticle = ({ post }: FeaturedArticleProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!post) return null;

  const article = toArticle(post);
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-blue-600 font-bold uppercase tracking-tighter mb-4 border-b-2 border-blue-100 pb-2">
        Featured Article
      </h2>
      <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
        <div className="h-full min-h-[300px] overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            width={600}
            height={400}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            unoptimized={typeof article.image === "string" && article.image.startsWith("data:")}
          />
        </div>
        <div className="p-8">
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded font-semibold">
              {article.category}
            </span>
            <span>{article.date}</span>
            <span>By {article.author}</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {article.title}
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {article.excerpt}
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-button-clr1 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            Read Full Article <span>→</span>
          </Button>
        </div>
      </div>

      <ArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        article={article}
      />
    </div>
  );
};

export default FeaturedArticle;

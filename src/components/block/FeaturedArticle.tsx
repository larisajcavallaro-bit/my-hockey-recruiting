"use client";

import React, { useState } from "react";
import ArticleModal from "./ArticleModal";
import { defaultArticles } from "@/data/articlesData";
import BLOG_IMG from "../../../public/newasset/blog/Building Speed and Agility in Young Hockey Players.png";
import Image from "next/image";
import { Button } from "../ui/button";

const FeaturedArticle = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use the team-building article as featured
  const article = defaultArticles["team-building"];
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-blue-600 font-bold uppercase tracking-tighter mb-4 border-b-2 border-blue-100 pb-2">
        Featured Article
      </h2>
      <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
        <div className="h-full min-h-[300px] overflow-hidden">
          <Image
            src={BLOG_IMG}
            alt={article.title}
            width={600}
            height={400}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="p-8">
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded font-semibold">
              Player Development
            </span>
            <span>January 12, 2026</span>
            <span>By Coach Marko</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Building Speed and Agility in Young Hockey Players
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Discover the best skating drills and exercises to help young players
            develop explosive speed and quick feet on the ice.
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-button-clr1 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            Read Full Article <span>→</span>
          </Button>
        </div>
      </div>

      {/* Article Modal */}
      <ArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        article={article}
      />
    </div>
  );
};

export default FeaturedArticle;

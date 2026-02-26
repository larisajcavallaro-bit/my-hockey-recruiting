"use client";

import Image from "next/image";
import { useState } from "react";
import ArticleModal from "./ArticleModal";
import { Article } from "@/data/articlesData";

type ArticleCardProps = Article;

const ArticleCard = ({
  title,
  category,
  date,
  author,
  image,
  excerpt,
  content,
}: ArticleCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const article = {
    title,
    category,
    date,
    author,
    image,
    excerpt,
    content,
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
      {/* ✅ IMAGE */}
      <div className="overflow-hidden h-48">
        <Image
          src={image}
          alt={title}
          width={600}
          height={400}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          unoptimized={typeof image === "string" && image.startsWith("data:")}
        />
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-blue-500 text-[10px] font-bold uppercase border border-blue-200 px-2 py-0.5 rounded">
            {category}
          </span>
          <span className="text-gray-400 text-xs">{date}</span>
        </div>

        <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
          {title}
        </h4>

        <p className="text-gray-500 text-sm mb-4 line-clamp-3">{excerpt}</p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="text-blue-600 font-bold text-sm hover:underline inline-flex items-center gap-1"
        >
          Read More <span className="text-xs">→</span>
        </button>
      </div>

      <ArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        article={article}
      />
    </div>
  );
};

export default ArticleCard;

"use client";

import { X } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import React from "react";

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: {
    title: string;
    category: string;
    date: string;
    author: string;
    image: string | StaticImageData;
    excerpt: string;
    content: string;
  };
}

const ArticleModal: React.FC<ArticleModalProps> = ({
  isOpen,
  onClose,
  article,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Article Content */}
        <div className="p-8">
          {/* Featured Image */}
          <div className="mb-8 rounded-lg overflow-hidden h-96">
            <Image
              src={article.image}
              alt={article.title}
              width={600}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <span className="bg-blue-600 text-white px-4 py-1 rounded-full font-semibold">
              {article.category}
            </span>
            <span>{article.date}</span>
            <span>By {article.author}</span>
          </div>

          {/* Article Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {article.title}
          </h1>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="mb-6 text-lg">{article.excerpt}</p>

            <div className="space-y-6 text-gray-600">
              {article.content.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;

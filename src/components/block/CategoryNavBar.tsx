import React from "react";

const categories = [
  "All",
  "New Parent Guide",
  "Player Development",
  "Teams, Tryouts & Pathways",
  "Costs, Gear & Value",
  "The Hockey Coach",
];

const CategoryNavBar = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Input */}
      <div className="relative max-w-xl mx-auto mb-8">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search articles..."
          className="w-full pl-10 pr-4 py-3 border-2 border-button-clr1 rounded-xl focus:outline-none focus:ring-2 focus:ring-button-clr1 bg-white text-sub-text1 placeholder:text-gray-500"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-colors border
              ${
                index === 0
                  ? "bg-button-clr1 text-white border-button-clr1/60"
                  : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
              }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNavBar;

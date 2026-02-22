"use client";
import { Star } from "lucide-react";
import { useState } from "react";

export const RatingStars = ({ onRate }: { onRate?: (val: number) => void }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={22}
            className={`cursor-pointer transition-colors ${
              star <= (hover || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-slate-200"
            }`}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => {
              setRating(star);
              if (onRate) onRate(star);
            }}
          />
        ))}
      </div>
      <span className="text-slate-300 font-bold text-xs min-w-[24px] text-right">
        {rating}/5
      </span>
    </div>
  );
};

"use client";

import { useState } from "react";
import { Star } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function WriteReviewModal() {
  const [rating, setRating] = useState(0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Write a Review</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>

        {/* Rating */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Your Rating</p>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                className={`w-6 h-6 cursor-pointer transition ${
                  rating >= star
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Name</label>
          <Input placeholder="John Doe" />
        </div>

        {/* Review */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Review</label>
          <Textarea
            placeholder="Share your experience..."
            className="min-h-[120px]"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline">Cancel</Button>
          <Button>Submit Review</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

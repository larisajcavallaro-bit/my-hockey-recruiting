"use client";

import { useState, useEffect } from "react";
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

interface WriteReviewModalProps {
  facilitySlug: string;
  onSubmitted?: () => void;
}

/** Format "John Smith" -> "John S.", "Sarah" -> "Sarah" */
function formatAuthorName(name: string | null | undefined): string {
  if (!name?.trim()) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const lastInitial = parts[parts.length - 1]?.[0] ?? "";
  return `${first} ${lastInitial}.`;
}

export default function WriteReviewModal({
  facilitySlug,
  onSubmitted,
}: WriteReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        const name = data?.user?.name ?? "";
        setAuthorName(formatAuthorName(name));
      } catch {
        setAuthorName("");
      }
    }
    if (open) fetchUser();
  }, [open]);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/facilities/${facilitySlug}/reviews`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          text: comment.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.details
          ? `${data.error}: ${data.details}`
          : data.error ?? "Failed to submit review";
        setError(msg);
        setSubmitting(false);
        return;
      }

      setOpen(false);
      setRating(0);
      setComment("");
      onSubmitted?.();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Write a Review</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>

        {/* Your Name - auto-populated, read-only */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Name</label>
          <div className="rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            {authorName || "—"}
          </div>
        </div>

        {/* Rating - required */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Your Rating *</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                className={`w-8 h-8 cursor-pointer transition ${
                  rating >= star
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground hover:text-yellow-400/70"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Commentary - optional */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Review (optional)</label>
          <Textarea
            placeholder="Share your experience..."
            className="min-h-[100px]"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

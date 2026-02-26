"use client";

import { useState, useEffect } from "react";
import { Star, Target, Brain, Zap, Heart, Users, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { COACH_REVIEW_CRITERIA } from "@/constants/rating-criteria";
import FeatureGate from "@/components/subscription/FeatureGate";

const ICONS = {
  target: Target,
  brain: Brain,
  lightning: Zap,
  heart: Heart,
  users: Users,
} as const;

interface WriteCoachReviewModalProps {
  coachId: string;
  coachName: string;
  onSubmitted?: () => void;
  /** Custom trigger element; defaults to "Leave a Rating" button */
  trigger?: React.ReactNode;
}

function CriterionStars({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 cursor-pointer transition ${
            value >= star
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground hover:text-yellow-400/70"
          }`}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  );
}

export default function WriteCoachReviewModal({
  coachId,
  coachName,
  onSubmitted,
  trigger,
}: WriteCoachReviewModalProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [criteriaRatings, setCriteriaRatings] = useState<
    Record<string, number>
  >(
    Object.fromEntries(COACH_REVIEW_CRITERIA.map((c) => [c.id, 0]))
  );
  const [commentary, setCommentary] = useState("");

  useEffect(() => {
    if (open) {
      setCriteriaRatings(
        Object.fromEntries(COACH_REVIEW_CRITERIA.map((c) => [c.id, 0]))
      );
      setCommentary("");
      setError(null);
    }
  }, [open]);

  const allRated = COACH_REVIEW_CRITERIA.every(
    (c) => criteriaRatings[c.id] >= 1 && criteriaRatings[c.id] <= 5
  );
  const averageRating = allRated
    ? Math.round(
        Object.values(criteriaRatings).reduce((a, b) => a + b, 0) /
          COACH_REVIEW_CRITERIA.length
      )
    : 0;

  const handleSubmit = async () => {
    if (!allRated) {
      setError("Please rate all 5 categories.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/coaches/${coachId}/reviews`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: averageRating,
          text: commentary.trim() || undefined,
          criteriaRatings: Object.fromEntries(
            Object.entries(criteriaRatings).filter(
              ([, v]) => typeof v === "number" && v >= 1 && v <= 5
            )
          ),
        }),
      });

      let data: {
        error?: string;
        details?: {
          formErrors?: string[];
          fieldErrors?: Record<string, string[]>;
        };
      } = {};
      try {
        const text = await res.text();
        if (text) data = JSON.parse(text);
      } catch {
        if (!res.ok) {
          setError(`Server error (${res.status}). Please try again later.`);
          setSubmitting(false);
          return;
        }
      }

      if (!res.ok) {
        const d = data.details;
        const parts: string[] = [];
        if (d?.formErrors?.length) parts.push(...d.formErrors);
        if (d?.fieldErrors)
          parts.push(
            ...Object.entries(d.fieldErrors).flatMap(([k, v]) =>
              (v || []).map((m) => `${k}: ${m}`)
            )
          );
        const msg =
          parts.length > 0 ? parts.join(". ") : data.error ?? `Failed (${res.status})`;
        setError(msg);
        setSubmitting(false);
        return;
      }

      setOpen(false);
      onSubmitted?.();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Network or server error.";
      setError(msg.includes("fetch") || msg.includes("Network") ? "Please check your connection and try again." : msg);
    } finally {
      setSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button size="sm" variant="default">
      Leave a Rating
    </Button>
  );

  return (
    <FeatureGate
      feature="coach_ratings"
      fallback={
        <Button size="sm" variant="default" disabled>
          Leave a Rating (Elite plan required)
        </Button>
      }
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger ?? defaultTrigger}
        </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rate {coachName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {COACH_REVIEW_CRITERIA.map((criterion) => {
            const Icon = ICONS[criterion.icon];
            return (
              <div
                key={criterion.id}
                className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-4 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-200/50 dark:bg-slate-700/50">
                    <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground">
                      {criterion.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {criterion.description}
                    </p>
                    <div className="mt-3">
                      <CriterionStars
                        value={criteriaRatings[criterion.id] ?? 0}
                        onChange={(v) =>
                          setCriteriaRatings((prev) => ({
                            ...prev,
                            [criterion.id]: v,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="space-y-2">
            <label className="text-sm font-medium">Detailed Commentary (optional)</label>
            <Textarea
              placeholder="Provide additional feedback, observations, or recommendations for the coach."
              className="min-h-[100px]"
              value={commentary}
              onChange={(e) => setCommentary(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your comments will remain anonymous and confidential.
            </p>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            className="w-full gap-2"
            onClick={handleSubmit}
            disabled={submitting || !allRated}
          >
            <Send className="w-4 h-4" />
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </FeatureGate>
  );
}

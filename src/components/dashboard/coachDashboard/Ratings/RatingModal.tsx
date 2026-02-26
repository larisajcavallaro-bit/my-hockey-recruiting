"use client";

import { useState, useEffect } from "react";
import {
  X,
  Lock,
  Eye,
  Send,
  Star,
  BarChart2,
  Activity,
  Crosshair,
  Target,
  Brain,
  Dumbbell,
} from "lucide-react";
import { toast } from "sonner";
import { PLAYER_EVALUATION_CRITERIA } from "@/constants/rating-criteria";

const CRITERIA_ICONS = {
  skating: Activity,
  shooting: Crosshair,
  passing: Target,
  "game-sense": Brain,
  "work-ethic": Dumbbell,
} as const;

function CriterionStars({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 cursor-pointer transition ${
              value >= star
                ? "text-yellow-400 fill-yellow-400"
                : "text-slate-200 hover:text-yellow-400/70"
            }`}
            onClick={() => onChange(star)}
          />
        ))}
      </div>
      <span className="text-slate-400 font-medium text-xs min-w-[28px]">
        {value}/5
      </span>
    </div>
  );
}

export const RatingModal = ({
  isOpen,
  onClose,
  playerId,
  playerName,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  playerId: string;
  playerName: string;
  onSuccess?: () => void;
}) => {
  const [criteriaRatings, setCriteriaRatings] = useState<Record<string, number>>(
    Object.fromEntries(PLAYER_EVALUATION_CRITERIA.map((c) => [c.id, 0]))
  );
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCriteriaRatings(
        Object.fromEntries(PLAYER_EVALUATION_CRITERIA.map((c) => [c.id, 0]))
      );
      setFeedback("");
    }
  }, [isOpen, playerId]);

  const ratedCount = Object.values(criteriaRatings).filter(
    (v) => v >= 1 && v <= 5
  ).length;
  const allRated = ratedCount === PLAYER_EVALUATION_CRITERIA.length;
  const averageRating = allRated
    ? Math.round(
        Object.values(criteriaRatings).reduce((a, b) => a + b, 0) /
          PLAYER_EVALUATION_CRITERIA.length
      )
    : 0;

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!allRated) {
      toast.error("Please rate all 5 criteria.");
      return;
    }
    if (!feedback || feedback.trim().length < 10) {
      toast.error("Please provide at least 10 characters of feedback.");
      return;
    }
    if (!playerId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/players/${playerId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: averageRating,
          text: feedback.trim(),
          criteriaRatings,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "Failed to submit");
      }
      toast.success("Review submitted");
      setCriteriaRatings(
        Object.fromEntries(PLAYER_EVALUATION_CRITERIA.map((c) => [c.id, 0]))
      );
      setFeedback("");
      onSuccess?.();
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Evaluating: {playerName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Performance Evaluation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={18} className="text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm uppercase">
                Performance Evaluation
              </h3>
            </div>
            <div className="space-y-4">
              {PLAYER_EVALUATION_CRITERIA.map((criterion) => {
                const Icon = CRITERIA_ICONS[criterion.icon];
                return (
                  <div
                    key={criterion.id}
                    className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-slate-200/50 shrink-0">
                        <Icon className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">
                          {criterion.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {criterion.description}
                        </p>
                      </div>
                    </div>
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
                );
              })}
            </div>
          </div>

          {/* Coach's Feedback / Commentary */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-purple-600" />
              <h3 className="font-bold text-slate-800 text-sm">
                Coach&apos;s Feedback / Commentary
              </h3>
            </div>
            <textarea
              className="w-full h-36 p-5 bg-slate-50 rounded-2xl outline-none text-sm resize-none"
              placeholder="Share your evaluation (min 10 characters)..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              minLength={10}
            />
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 flex items-start gap-4">
              <Eye className="text-purple-400 mt-1 shrink-0" size={18} />
              <p className="text-purple-500 text-[11px] leading-relaxed">
                This comment is private and only visible to the player&apos;s
                parents. It will not be shown to other coaches or players.
              </p>
            </div>
          </div>
        </div>

        {/* Submit area */}
        <div className="p-8 border-t bg-white flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            Ready to Submit? {ratedCount} of 5 criteria rated.
          </p>
          <button
            onClick={handleSubmit}
            disabled={
              loading || !allRated || feedback.trim().length < 10
            }
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-2xl flex items-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500"
          >
            <Send size={18} /> {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

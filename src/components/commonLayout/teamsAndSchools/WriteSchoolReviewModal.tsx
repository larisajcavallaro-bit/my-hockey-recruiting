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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WriteSchoolReviewModalProps {
  schoolSlug: string;
  onSubmitted?: () => void;
}

const PLACEHOLDER = "__pl__";
const GENDER_OPTIONS = ["Boys", "Girls"] as const;
const AGE_BRACKETS = ["U6", "U8", "U10", "U12", "U14", "U16", "U18", "U20"] as const;

function formatAuthorName(name: string | null | undefined): string {
  if (!name?.trim()) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const lastInitial = parts[parts.length - 1]?.[0] ?? "";
  return `${first} ${lastInitial}.`;
}

export default function WriteSchoolReviewModal({
  schoolSlug,
  onSubmitted,
}: WriteSchoolReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [ageBracket, setAgeBracket] = useState<string[]>([]);
  const [gender, setGender] = useState("");
  const [league, setLeague] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [leagues, setLeagues] = useState<{ id: string; name: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        setAuthorName(formatAuthorName(data?.user?.name ?? ""));
      } catch {
        setAuthorName("");
      }
    }
    if (open) fetchUser();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    fetch("/api/leagues")
      .then((r) => r.json())
      .then((data) => setLeagues(data?.leagues ?? []));
  }, [open]);

  const handleAgeToggle = (age: string) => {
    setAgeBracket((prev) =>
      prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age]
    );
  };

  const handleSubmit = async () => {
    setError(null);
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (ageBracket.length === 0) {
      setError("Please select at least one age your kid played.");
      return;
    }
    if (!gender || gender === PLACEHOLDER) {
      setError("Please select Boys or Girls.");
      return;
    }
    if (!league || league === PLACEHOLDER) {
      setError("Please select the league.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/teams-and-schools/${schoolSlug}/reviews`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          text: comment.trim() || undefined,
          ageBracket,
          gender,
          league,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data?.error ?? data?.details ?? "Failed to submit review";
        setError(typeof msg === "string" ? msg : "Failed to submit review");
        setSubmitting(false);
        return;
      }
      setOpen(false);
      setRating(0);
      setComment("");
      setAgeBracket([]);
      setGender("");
      setLeague("");
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
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Name</label>
            <div className="rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              {authorName || "—"}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Select the age(s) your kid played *</p>
            <p className="text-xs text-muted-foreground">You can select multiple if they played at different ages.</p>
            <div className="flex flex-wrap gap-2">
              {AGE_BRACKETS.map((age) => (
                <div
                  key={age}
                  className="flex items-center space-x-2 border border-input rounded-md px-3 py-2"
                >
                  <Checkbox
                    id={`age-${age}`}
                    checked={ageBracket.includes(age)}
                    onCheckedChange={() => handleAgeToggle(age)}
                  />
                  <label htmlFor={`age-${age}`} className="text-sm cursor-pointer">
                    {age}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Boys or Girls *</p>
            <Select value={gender || PLACEHOLDER} onValueChange={(v) => setGender(v === PLACEHOLDER ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PLACEHOLDER}>Select</SelectItem>
                {GENDER_OPTIONS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">League *</p>
            <Select value={league || PLACEHOLDER} onValueChange={(v) => setLeague(v === PLACEHOLDER ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select league" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PLACEHOLDER}>Select league</SelectItem>
                {leagues.map((l) => (
                  <SelectItem key={l.id} value={l.name}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Review (optional)</label>
            <Textarea
              placeholder="Share your experience..."
              className="min-h-[100px]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
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

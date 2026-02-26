"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X } from "lucide-react";
import FeatureGate from "@/components/subscription/FeatureGate";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TypeaheadInput } from "@/components/ui/TypeaheadInput";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const POSITIONS = ["Forward", "Defense", "Goalie"] as const;
const GENDERS = ["Male", "Female"] as const;

function resizeImageFile(
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context failed"));
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = url;
  });
}

export interface PlayerFormData {
  name: string;
  birthYear: number;
  position: string;
  level: string;
  team: string;
  league: string;
  location: string;
  gender: string;
  bio: string;
  image: string;
  socialLink: string;
  goals: string;
  assists: string;
  plusMinus: string;
  gaa: string;
  savePct: string;
}

const emptyForm: PlayerFormData = {
  name: "",
  birthYear: new Date().getFullYear() - 10,
  position: "",
  level: "",
  team: "",
  league: "",
  location: "",
  gender: "",
  bio: "",
  image: "",
  socialLink: "",
  goals: "",
  assists: "",
  plusMinus: "",
  gaa: "",
  savePct: "",
};

interface PlayerFormProps {
  mode: "add" | "edit";
  initialData?: Partial<PlayerFormData>;
  onSubmit: (data: PlayerFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  /** When editing, use this player's plan for feature gates (social links, stats) */
  planIdOverride?: string | null;
}

export default function PlayerForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
  planIdOverride,
}: PlayerFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<PlayerFormData>(() => {
    if (initialData && mode === "edit") {
      return {
        name: initialData.name ?? "",
        birthYear: initialData.birthYear ?? new Date().getFullYear() - 10,
        position: initialData.position ?? "",
        level: initialData.level ?? "",
        team: initialData.team ?? "",
        league: initialData.league ?? "",
        location: initialData.location ?? "",
        gender: initialData.gender ?? "",
        bio: initialData.bio ?? "",
        image: initialData.image ?? "",
        socialLink: initialData.socialLink ?? "",
        goals: initialData.goals ?? "",
        assists: initialData.assists ?? "",
        plusMinus: initialData.plusMinus ?? "",
        gaa: initialData.gaa ?? "",
        savePct: initialData.savePct ?? "",
      };
    }
    return { ...emptyForm };
  });

  const isGoalie = form.position === "Goalie";
  const isForwardOrDefense = form.position === "Forward" || form.position === "Defense";

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        name: initialData.name ?? "",
        birthYear: initialData.birthYear ?? new Date().getFullYear() - 10,
        position: initialData.position ?? "",
        level: initialData.level ?? "",
        team: initialData.team ?? "",
        league: initialData.league ?? "",
        location: initialData.location ?? "",
        gender: initialData.gender ?? "",
        bio: initialData.bio ?? "",
        image: initialData.image ?? "",
        socialLink: initialData.socialLink ?? "",
        goals: initialData.goals ?? "",
        assists: initialData.assists ?? "",
        plusMinus: initialData.plusMinus ?? "",
        gaa: initialData.gaa ?? "",
        savePct: initialData.savePct ?? "",
      });
    }
  }, [mode, initialData]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPEG, PNG, etc.)");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be under 2MB. Resizing...");
    }
    try {
      const dataUrl = await resizeImageFile(file, 400, 400);
      setForm((f) => ({ ...f, image: dataUrl }));
    } catch {
      toast.error("Failed to process image");
    }
    e.target.value = "";
  };

  const clearPhoto = () => setForm((f) => ({ ...f, image: "" }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Photo</Label>
        <div className="flex items-start gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer overflow-hidden shrink-0"
          >
            {form.image ? (
              <div className="relative w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearPhoto();
                  }}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <Camera className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <p className="text-xs text-slate-500">
              Click to add a photo. JPEG or PNG, max 2MB.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => fileInputRef.current?.click()}
            >
              {form.image ? "Change Photo" : "Add Photo"}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold border-b pb-2 text-sm">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              placeholder="Player name"
            />
          </div>
          <div>
            <Label htmlFor="birthYear">Birth Year *</Label>
            <Input
              id="birthYear"
              type="number"
              min={2000}
              max={2025}
              value={form.birthYear}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  birthYear: parseInt(e.target.value, 10) || f.birthYear,
                }))
              }
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="position">Position</Label>
            <Select
              value={form.position || " "}
              onValueChange={(v) => setForm((f) => ({ ...f, position: v.trim() || "" }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">Select position</SelectItem>
                {POSITIONS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={form.gender || " "}
              onValueChange={(v) => setForm((f) => ({ ...f, gender: v.trim() || "" }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">Select gender</SelectItem>
                {GENDERS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="City, Province"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold border-b pb-2 text-sm">League / Level / Team</h3>
        <p className="text-xs text-slate-500">Type to search. Don&apos;t see yours? Use Contact Us to request it.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="league">League</Label>
            <TypeaheadInput
              fetchUrl="/api/leagues?q={q}"
              value={form.league}
              onChange={(v) => setForm((f) => ({ ...f, league: v }))}
              itemsKey="leagues"
              placeholder="Type to search..."
            />
          </div>
          <div>
            <Label htmlFor="level">Level</Label>
            <TypeaheadInput
              fetchUrl="/api/levels?q={q}"
              value={form.level}
              onChange={(v) => setForm((f) => ({ ...f, level: v }))}
              itemsKey="levels"
              placeholder="Type to search..."
            />
          </div>
          <div>
            <Label htmlFor="team">Team</Label>
            <TypeaheadInput
              fetchUrl="/api/teams?q={q}"
              value={form.team}
              onChange={(v) => setForm((f) => ({ ...f, team: v }))}
              itemsKey="teams"
              placeholder="Type to search..."
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio / About</Label>
        <Textarea
          id="bio"
          value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          placeholder="Tell coaches about your athlete—skills, achievements, goals..."
          rows={3}
        />
      </div>

      <FeatureGate
        feature="social_media_links"
        planIdOverride={planIdOverride}
        fallback={
          <p className="text-sm text-orange-600 font-extrabold py-2">
            Upgrade to Elite for social media links.
          </p>
        }
      >
        <div className="space-y-2">
          <Label htmlFor="socialLink">Social Media</Label>
          <Input
            id="socialLink"
            type="url"
            value={form.socialLink}
            onChange={(e) => setForm((f) => ({ ...f, socialLink: e.target.value }))}
            placeholder="https://instagram.com/athleteprofile"
          />
          <p className="text-xs text-muted-foreground">
            Link shown on the View Player card. Instagram, TikTok, etc.
          </p>
        </div>
      </FeatureGate>

      <FeatureGate
        feature="higher_stats"
        planIdOverride={planIdOverride}
        fallback={
          <p className="text-sm text-orange-600 font-extrabold py-2">
            Upgrade to Elite for Show Season Stats (Player & Goalie).
          </p>
        }
      >
        <div className="space-y-4">
          <h3 className="font-semibold border-b pb-2 text-sm">Stats (Optional) - Current Season Only</h3>
        {!isForwardOrDefense && !isGoalie && (
          <p className="text-xs text-muted-foreground">
            Select Forward, Defense, or Goalie above to see relevant stats.
          </p>
        )}
        {isForwardOrDefense && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="goals">Goals</Label>
              <Input
                id="goals"
                type="number"
                min={0}
                value={form.goals}
                onChange={(e) => setForm((f) => ({ ...f, goals: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="assists">Assists</Label>
              <Input
                id="assists"
                type="number"
                min={0}
                value={form.assists}
                onChange={(e) => setForm((f) => ({ ...f, assists: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="plusMinus">+/-</Label>
              <Input
                id="plusMinus"
                type="number"
                value={form.plusMinus}
                onChange={(e) => setForm((f) => ({ ...f, plusMinus: e.target.value }))}
                placeholder="0"
              />
            </div>
          </div>
        )}
        {isGoalie && (
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gaa">GAA</Label>
              <Input
                id="gaa"
                type="number"
                min={0}
                step={0.1}
                value={form.gaa}
                onChange={(e) => setForm((f) => ({ ...f, gaa: e.target.value }))}
                placeholder="e.g. 2.5"
              />
            </div>
            <div>
              <Label htmlFor="savePct">Save %</Label>
              <Input
                id="savePct"
                value={form.savePct}
                onChange={(e) => setForm((f) => ({ ...f, savePct: e.target.value }))}
                placeholder="e.g. 92%"
              />
            </div>
          </div>
        )}
        </div>
      </FeatureGate>

      <div className="flex justify-end gap-2 pt-4 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading
            ? mode === "add"
              ? "Adding..."
              : "Saving..."
            : submitLabel ?? (mode === "add" ? "Add Player" : "Save Changes")}
        </Button>
      </div>
    </form>
  );
}

export { emptyForm };

"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Camera, X, Plus, Trash2, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_DISPLAY_SIZE = 300; // Keep base64 payload small to avoid body size limits
const JPEG_QUALITY = 0.75;

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
      resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = url;
  });
}

function formatPhoneDisplay(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  if (digits.length > 10) digits = digits.slice(0, 10);
  if (digits.length <= 3) return digits ? `(${digits}` : digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function formatPhoneStore(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

export interface CoachExperienceItem {
  id?: string;
  title: string;
  team: string;
  years: string;
  description: string;
}

export interface CoachCertificationItem {
  id?: string;
  name: string;
  number: string;
  expiresAt: string;
}

interface CoachEditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coachId: string;
  initialData: {
    title: string;
    team: string;
    teamLogo: string;
    league: string;
    level: string;
    birthYear?: number;
    phone: string;
    location: string;
    about: string;
    philosophy: string;
    image: string;
    experience: CoachExperienceItem[];
    certifications: CoachCertificationItem[];
    specialties: string[];
  };
  onSave?: () => void;
}

export default function CoachEditProfileDialog({
  open,
  onOpenChange,
  coachId,
  initialData,
  onSave,
}: CoachEditProfileDialogProps) {
  const [form, setForm] = useState({
    ...initialData,
    experience: initialData.experience ?? [],
    certifications: initialData.certifications ?? [],
    specialties: initialData.specialties ?? [],
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const teamLogoInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [titles, setTitles] = useState<string[]>([]);
  const [birthYears, setBirthYears] = useState<string[]>([]);
  const [specialtyOptions, setSpecialtyOptions] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      Promise.all([
        fetch("/api/lookups?category=coach_title", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/lookups?category=birth_year", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/lookups?category=coach_specialty", { cache: "no-store" }).then((r) => r.json()),
      ]).then(([a, b, c]) => {
        setTitles((a.lookups ?? []) as string[]);
        setBirthYears((b.lookups ?? []) as string[]);
        setSpecialtyOptions((c.lookups ?? []) as string[]);
      });
    }
  }, [open]);

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
      const dataUrl = await resizeImageFile(file, MAX_DISPLAY_SIZE, MAX_DISPLAY_SIZE);
      setForm((f) => ({ ...f, image: dataUrl }));
    } catch {
      toast.error("Failed to process image");
    }
    e.target.value = "";
  };

  const clearPhoto = () => setForm((f) => ({ ...f, image: "" }));

  const handleTeamLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPEG, PNG, etc.)");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) toast.error("Image must be under 2MB. Resizing...");
    try {
      const dataUrl = await resizeImageFile(file, MAX_DISPLAY_SIZE, MAX_DISPLAY_SIZE);
      setForm((f) => ({ ...f, teamLogo: dataUrl }));
    } catch {
      toast.error("Failed to process image");
    }
    e.target.value = "";
  };

  const clearTeamLogo = () => setForm((f) => ({ ...f, teamLogo: "" }));

  useEffect(() => {
    if (open) {
      setForm({
        ...initialData,
        teamLogo: initialData.teamLogo ?? "",
        phone: initialData.phone ? formatPhoneDisplay(initialData.phone) : "",
        experience: initialData.experience ?? [],
        certifications: initialData.certifications ?? [],
        specialties: initialData.specialties ?? [],
      });
    }
  }, [open, initialData]);

  const addCertification = () => {
    setForm((f) => ({
      ...f,
      certifications: [
        ...f.certifications,
        { name: "", number: "", expiresAt: "" },
      ],
    }));
  };

  const updateCertification = (
    index: number,
    updates: Partial<CoachCertificationItem>
  ) => {
    setForm((f) => ({
      ...f,
      certifications: f.certifications.map((cert, i) =>
        i === index ? { ...cert, ...updates } : cert
      ),
    }));
  };

  const setSpecialty = (index: number, value: string) => {
    setForm((f) => {
      const next = [...f.specialties];
      next[index] = value === " " ? "" : value;
      return { ...f, specialties: next.slice(0, 3) };
    });
  };

  const removeCertification = (index: number) => {
    setForm((f) => ({
      ...f,
      certifications: f.certifications.filter((_, i) => i !== index),
    }));
  };

  const addExperience = () => {
    setForm((f) => ({
      ...f,
      experience: [
        ...f.experience,
        { title: "", team: "", years: "", description: "" },
      ],
    }));
  };

  const updateExperience = (index: number, updates: Partial<CoachExperienceItem>) => {
    setForm((f) => ({
      ...f,
      experience: f.experience.map((exp, i) =>
        i === index ? { ...exp, ...updates } : exp
      ),
    }));
  };

  const removeExperience = (index: number) => {
    setForm((f) => ({
      ...f,
      experience: f.experience.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/coaches/${coachId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title || undefined,
          team: form.team || undefined,
          league: form.league || undefined,
          level: form.level || undefined,
          birthYear: form.birthYear ?? undefined,
          phone: form.phone ? formatPhoneStore(form.phone) : undefined,
          location: form.location || undefined,
          about: form.about || undefined,
          philosophy: form.philosophy || undefined,
          image: form.image || undefined,
          teamLogo: form.teamLogo || undefined,
          experience: form.experience
            .filter((e) => e.title.trim())
            .map((e) => ({
              title: e.title.trim(),
              team: e.team.trim() || undefined,
              years: e.years.trim() || undefined,
              description: e.description.trim() || undefined,
            })),
          certifications: form.certifications
            .filter((c) => c.name.trim())
            .map((c) => ({
              name: c.name.trim(),
              number: c.number.trim() || undefined,
              expiresAt: c.expiresAt.trim() || undefined,
            })),
          specialties: form.specialties.filter((s) => s.trim()).slice(0, 3),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const message =
          typeof err?.error === "string" ? err.error : "Failed to update profile";
        const isHeadCoachConflict = res.status === 409 && err?.code === "HEAD_COACH_TAKEN";
        toast.error(message);
        if (isHeadCoachConflict) {
          toast.info("Use the Contact Us page to submit a dispute if you believe this is a mistake.", {
            duration: 8000,
            action: { label: "Contact Us", onClick: () => router.push("/contact-us") },
          });
        }
        return;
      }
      onSave?.();
      onOpenChange(false);
      toast.success("Profile updated");
      window.dispatchEvent(new Event("coach-profile-updated"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Coach Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo upload at top */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Profile Photo</Label>
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
                      alt="Profile preview"
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
                  Click to upload a photo. JPEG or PNG, max 2MB.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {form.image ? "Change Photo" : "Upload Photo"}
                </Button>
              </div>
            </div>
          </div>

          {/* Team Logo upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Team Logo
            </Label>
            <p className="text-xs text-slate-500">
              Shown next to your team name. Upload your team&apos;s logo (JPEG or PNG, max 2MB).
            </p>
            <div className="flex items-start gap-4">
              <div
                onClick={() => teamLogoInputRef.current?.click()}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer overflow-hidden shrink-0"
              >
                {form.teamLogo ? (
                  <div className="relative w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.teamLogo}
                      alt="Team logo preview"
                      className="w-full h-full object-contain p-1"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearTeamLogo();
                      }}
                      className="absolute top-0.5 right-0.5 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <Shield className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <input
                  ref={teamLogoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleTeamLogoChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => teamLogoInputRef.current?.click()}
                >
                  {form.teamLogo ? "Change Logo" : "Upload Team Logo"}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Select
                value={form.title || " "}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, title: v === " " ? "" : v }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Select title</SelectItem>
                  {[
                    ...new Set([
                      ...(form.title ? [form.title] : []),
                      ...titles,
                    ]),
                  ].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
          <div>
            <Label htmlFor="birthYear">Birth Year</Label>
            <Select
              value={
                form.birthYear != null ? String(form.birthYear) : " "
              }
              onValueChange={(v) =>
                setForm((f) => ({
                  ...f,
                  birthYear: v === " " ? undefined : parseInt(v, 10),
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select birth year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">Select birth year</SelectItem>
                {[
                  ...new Set([
                    ...(form.birthYear != null ? [String(form.birthYear)] : []),
                    ...birthYears,
                  ]),
                ].map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="City, Province/State"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="about">About / Background</Label>
            <Textarea
              id="about"
              value={form.about}
              onChange={(e) => setForm((f) => ({ ...f, about: e.target.value }))}
              placeholder="Tell parents about your coaching background..."
              rows={4}
              className="resize-none"
            />
          </div>
          <div>
            <Label htmlFor="philosophy">Coaching Philosophy</Label>
            <Textarea
              id="philosophy"
              value={form.philosophy}
              onChange={(e) =>
                setForm((f) => ({ ...f, philosophy: e.target.value }))
              }
              placeholder="Share your coaching approach and philosophy..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Experience */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Experience</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExperience}
                className="gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Add where you previously coached, your role, and a brief description.
            </p>
            <div className="space-y-4">
              {form.experience.map((exp, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/30"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-medium text-slate-500">
                      Experience #{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-600 shrink-0"
                      onClick={() => removeExperience(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Where you coached</Label>
                      <Input
                        value={exp.team}
                        onChange={(e) =>
                          updateExperience(index, { team: e.target.value })
                        }
                        placeholder="e.g. Boston Jr. Eagles, U14 Lightning"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Role</Label>
                      <Select
                        value={exp.title || " "}
                        onValueChange={(v) =>
                          updateExperience(index, {
                            title: v === " " ? "" : v,
                          })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Head or Assistant" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=" ">Select role</SelectItem>
                          <SelectItem value="Head Coach">Head Coach</SelectItem>
                          <SelectItem value="Assistant Coach">
                            Assistant Coach
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Years (optional)</Label>
                    <Input
                      value={exp.years}
                      onChange={(e) =>
                        updateExperience(index, { years: e.target.value })
                      }
                      placeholder="e.g. 2018 - 2022"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) =>
                        updateExperience(index, { description: e.target.value })
                      }
                      placeholder="Brief description of your role and achievements..."
                      rows={3}
                      className="mt-1 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Certifications</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCertification}
                className="gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Add your coaching certifications (CEP Level, USA Hockey, etc.) and expiration dates.
            </p>
            <div className="space-y-4">
              {form.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/30"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-medium text-slate-500">
                      Certification #{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-600 shrink-0"
                      onClick={() => removeCertification(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <Label className="text-xs">Certification name</Label>
                    <Input
                      value={cert.name}
                      onChange={(e) =>
                        updateCertification(index, { name: e.target.value })
                      }
                      placeholder="e.g. CEP Level 5, USA Hockey Coaching Certification"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Number / ID (optional)</Label>
                    <Input
                      value={cert.number}
                      onChange={(e) =>
                        updateCertification(index, { number: e.target.value })
                      }
                      placeholder="e.g. USA Hockey number, certification ID"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Expiration date (optional)</Label>
                    <Input
                      type="date"
                      value={cert.expiresAt}
                      onChange={(e) =>
                        updateCertification(index, { expiresAt: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 3 Specialties (match rating criteria) */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Top 3 Specialties</Label>
            <p className="text-xs text-slate-500">
              Choose up to 3 areas you excel in. These match the criteria parents can rate you on.
            </p>
            <div className="space-y-3">
              {[0, 1, 2].map((idx) => {
                const selected = form.specialties[idx] ?? "";
                const usedByOthers = form.specialties.filter((_, i) => i !== idx);
                const available = [
                  ...new Set([
                    ...(selected ? [selected] : []),
                    ...specialtyOptions.filter(
                      (opt) => opt === selected || !usedByOthers.includes(opt)
                    ),
                  ]),
                ].filter(Boolean);
                return (
                  <div key={idx}>
                    <Label className="text-xs">Specialty #{idx + 1}</Label>
                    <Select
                      value={selected || " "}
                      onValueChange={(v) => setSpecialty(idx, v)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue
                          placeholder={
                            idx === 0
                              ? "e.g. Skill Development, Communication"
                              : "Select or leave blank"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=" ">None</SelectItem>
                        {available
                          .filter(Boolean)
                          .map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

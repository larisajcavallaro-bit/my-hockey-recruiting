"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Camera, X } from "lucide-react";
import { EVENT_TYPES } from "@/constants/events";
import { toast } from "sonner";

const inputClass =
  "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all";

function normalizeUrl(value: string): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("http://") || lower.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
}

function resizeImageFile(file: File, maxW: number, maxH: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxW || height > maxH) {
        const r = Math.min(maxW / width, maxH / height);
        width = Math.round(width * r);
        height = Math.round(height * r);
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas failed"));
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.65));
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = url;
  });
}

interface EventData {
  id: string;
  title: string;
  date: string;
  startAt?: string;
  endAt?: string | null;
  eventType?: string | null;
  rinkName?: string | null;
  location: string;
  ageGroup: string;
  description: string;
  image?: string | null;
  websiteLink?: string | null;
  socialMediaLink?: string | null;
}

interface EditEventModalProps {
  event: EventData;
  onSuccess?: () => void;
}

export function EditEventModal({ event, onSuccess }: EditEventModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toDatetimeLocal = (iso: string | undefined) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toISOString().slice(0, 16);
  };

  const [form, setForm] = useState({
    title: event.title,
    eventType: event.eventType ?? "",
    ageGroup: event.ageGroup ?? "",
    rinkName: event.rinkName ?? "",
    location: event.location ?? "",
    startAt: toDatetimeLocal(event.startAt),
    endAt: toDatetimeLocal(event.endAt ?? undefined),
    websiteLink: event.websiteLink ?? "",
    socialMediaLink: event.socialMediaLink ?? "",
    description: event.description ?? "",
    image: event.image ?? "",
  });

  const handleOpenChange = (o: boolean) => {
    setOpen(o);
    if (!o) {
      setForm({
        title: event.title,
        eventType: event.eventType ?? "",
        ageGroup: event.ageGroup ?? "",
        rinkName: event.rinkName ?? "",
        location: event.location ?? "",
        startAt: toDatetimeLocal(event.startAt),
        endAt: toDatetimeLocal(event.endAt ?? undefined),
        websiteLink: event.websiteLink ?? "",
        socialMediaLink: event.socialMediaLink ?? "",
        description: event.description ?? "",
        image: event.image ?? "",
      });
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          eventType: form.eventType.trim() || null,
          ageGroup: form.ageGroup.trim() || null,
          rinkName: form.rinkName.trim() || null,
          location: form.location.trim() || null,
          startAt: form.startAt ? new Date(form.startAt).toISOString() : undefined,
          endAt: form.endAt ? new Date(form.endAt).toISOString() : null,
          websiteLink: normalizeUrl(form.websiteLink) ?? null,
          socialMediaLink: normalizeUrl(form.socialMediaLink) ?? null,
          description: form.description.trim() || null,
          image: form.image || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data.detail ?? data.error ?? (res.status === 413 ? "Photo too large – try a smaller image" : "Failed to update event");
        throw new Error(msg);
      }
      toast.success("Event updated");
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700">
          Edit Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
          )}

          {/* Event Photo */}
          <div>
            <Label>Event Photo</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 w-full aspect-video rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer overflow-hidden"
            >
              {form.image ? (
                <div className="relative w-full h-full">
                  <img
                    src={form.image}
                    alt="Event"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setForm((f) => ({ ...f, image: "" }));
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center text-slate-400">
                  <Camera className="w-10 h-10 mx-auto mb-2" />
                  <span className="text-sm">Click to upload</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !file.type.startsWith("image/")) return;
                try {
                  const dataUrl = await resizeImageFile(file, 480, 320);
                  setForm((f) => ({ ...f, image: dataUrl }));
                } catch {
                  toast.error("Failed to process image");
                }
                e.target.value = "";
              }}
            />
          </div>

          <div>
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <div className="relative">
                <select
                  value={form.eventType}
                  onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value }))}
                  className={`${inputClass} appearance-none pr-10`}
                >
                  <option value="">Select type</option>
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <Label>Age Group</Label>
              <Input
                value={form.ageGroup}
                onChange={(e) => setForm((f) => ({ ...f, ageGroup: e.target.value }))}
                placeholder="e.g. U14-U16"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start</Label>
              <Input
                type="datetime-local"
                value={form.startAt}
                onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))}
                className={inputClass}
                required
              />
            </div>
            <div>
              <Label>End</Label>
              <Input
                type="datetime-local"
                value={form.endAt}
                onChange={(e) => setForm((f) => ({ ...f, endAt: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <Label>Rink Name</Label>
            <Input
              value={form.rinkName}
              onChange={(e) => setForm((f) => ({ ...f, rinkName: e.target.value }))}
              placeholder="e.g. Northern Ice Center"
              className={inputClass}
            />
          </div>

          <div>
            <Label>Address</Label>
            <AddressAutocomplete
              id="edit-event-address"
              defaultValue={form.location}
              placeholder="Address..."
              className={inputClass}
              onChange={(addr) => setForm((f) => ({ ...f, location: addr }))}
            />
          </div>

          <div>
            <Label>Website</Label>
            <Input
              type="text"
              value={form.websiteLink}
              onChange={(e) => setForm((f) => ({ ...f, websiteLink: e.target.value }))}
              placeholder="https:// or www."
              className={inputClass}
            />
          </div>

          <div>
            <Label>Social Media</Label>
            <Input
              type="text"
              value={form.socialMediaLink}
              onChange={(e) => setForm((f) => ({ ...f, socialMediaLink: e.target.value }))}
              placeholder="Instagram, etc."
              className={inputClass}
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

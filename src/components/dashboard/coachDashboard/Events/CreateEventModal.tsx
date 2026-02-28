// components/CreateEventModal.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Camera, X } from "lucide-react";
import { toast } from "sonner";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const EVENT_IMAGE_SIZE = { w: 600, h: 400 };

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
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = url;
  });
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputClass =
  "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300";

// Normalize URL: add https:// if missing; allow www. at start
function normalizeUrl(value: string): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("http://") || lower.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
}

export default function CreateEventModal({
  isOpen,
  onClose,
  onSuccess,
}: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/lookups?category=event_type", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setEventTypes(d.lookups ?? []))
      .catch(() => setEventTypes([]));
  }, []);

  const [form, setForm] = useState({
    title: "",
    eventType: "",
    ageGroup: "",
    rinkName: "",
    location: "",
    startAt: "",
    endAt: "",
    websiteLink: "",
    socialMediaLink: "",
    description: "",
    image: "",
  });

  const resetForm = () => {
    setForm({
      title: "",
      eventType: "",
      ageGroup: "",
      rinkName: "",
      location: "",
      startAt: "",
      endAt: "",
      websiteLink: "",
      socialMediaLink: "",
      description: "",
      image: "",
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.title.trim() || !form.startAt.trim()) {
      setError("Event title and start date are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          eventType: form.eventType.trim() || undefined,
          ageGroup: form.ageGroup.trim() || undefined,
          rinkName: form.rinkName.trim() || undefined,
          location: form.location.trim() || undefined,
          startAt: new Date(form.startAt).toISOString(),
          endAt: form.endAt ? new Date(form.endAt).toISOString() : undefined,
          websiteLink: normalizeUrl(form.websiteLink),
          socialMediaLink: normalizeUrl(form.socialMediaLink),
          description: form.description.trim() || undefined,
          image: form.image || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create event");
      }
      resetForm();
      onClose();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <h2 className="text-xl font-bold text-slate-900">Create New Event</h2>
          <p className="text-slate-500 text-sm">
            Fill in the details for your event
          </p>
        </div>

        {/* Scrollable Form Body */}
        <div className="px-8 py-2 overflow-y-auto max-h-[70vh] space-y-5">
          {/* Event Photo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Event Photo
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer overflow-hidden"
            >
              {form.image ? (
                <div className="relative w-full h-full">
                  <img
                    src={form.image}
                    alt="Event preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setForm((f) => ({ ...f, image: "" }));
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center text-slate-400">
                  <Camera className="w-10 h-10 mx-auto mb-2" />
                  <span className="text-sm">Click to upload photo</span>
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
                if (!file) return;
                if (!file.type.startsWith("image/")) {
                  toast.error("Please select an image file");
                  return;
                }
                if (file.size > MAX_IMAGE_SIZE) toast.error("Image must be under 2MB. Resizing…");
                try {
                  const dataUrl = await resizeImageFile(file, EVENT_IMAGE_SIZE.w, EVENT_IMAGE_SIZE.h);
                  setForm((f) => ({ ...f, image: dataUrl }));
                } catch {
                  toast.error("Failed to process image");
                }
                e.target.value = "";
              }}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Event Title
            </label>
            <input
              type="text"
              placeholder="Event Title"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={inputClass}
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Event Type
            </label>
            <div className="relative">
              <select
                value={form.eventType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, eventType: e.target.value }))
                }
                className={`${inputClass} appearance-none cursor-pointer pr-10`}
              >
                <option value="">Select type</option>
                {eventTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>

          {/* Age Group */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Age Group
            </label>
            <input
              type="text"
              placeholder="e.g., U14-U16"
              value={form.ageGroup}
              onChange={(e) =>
                setForm((f) => ({ ...f, ageGroup: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          {/* Date(s) - Start & End */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                required
                value={form.startAt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startAt: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                value={form.endAt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, endAt: e.target.value }))
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Rink Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Rink Name
            </label>
            <input
              type="text"
              placeholder="e.g., Northern Ice Center"
              value={form.rinkName}
              onChange={(e) =>
                setForm((f) => ({ ...f, rinkName: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          {/* Full Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Full Address
            </label>
            <AddressAutocomplete
              placeholder="Start typing an address for suggestions..."
              className={inputClass}
              id="create-event-address"
              onChange={(address) =>
                setForm((f) => ({ ...f, location: address }))
              }
            />
          </div>

          {/* Website Link */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Website Link
            </label>
            <input
              type="text"
              placeholder="https://example.com or www.example.com"
              value={form.websiteLink}
              onChange={(e) =>
                setForm((f) => ({ ...f, websiteLink: e.target.value }))
              }
              className={inputClass}
            />
            <p className="text-xs text-slate-500 mt-1">
              https:// is added automatically if omitted
            </p>
          </div>

          {/* Social Media Link */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Social media link
            </label>
            <input
              type="text"
              placeholder="https://instagram.com/... or www.instagram.com/..."
              value={form.socialMediaLink}
              onChange={(e) =>
                setForm((f) => ({ ...f, socialMediaLink: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe your event..."
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-8 flex gap-4 border-t border-slate-50">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}

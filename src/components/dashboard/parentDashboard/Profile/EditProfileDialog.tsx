"use client";

import { useState, useEffect } from "react";

function formatPhoneDisplay(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  if (digits.length > 10) digits = digits.slice(0, 10);
  if (digits.length <= 3) return digits ? `(${digits}` : digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}
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
import { toast } from "sonner";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: {
    name: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    socialLink: string;
  };
  onSave?: (data: EditProfileDialogProps["initialData"]) => void;
}

export default function EditProfileDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: EditProfileDialogProps) {
  const [form, setForm] = useState(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      if (open) {
      setForm({
        ...initialData,
        phone: initialData.phone ? formatPhoneDisplay(initialData.phone) : "",
        socialLink: initialData.socialLink ?? "",
      });
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          location: form.location,
          bio: form.bio,
          socialLink: form.socialLink,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const message =
          typeof err?.error === "string" ? err.error : "Failed to update profile";
        throw new Error(message);
      }
      onSave?.(form);
      toast.success("Profile updated");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="your@email.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  phone: formatPhoneDisplay(e.target.value),
                }))
              }
              placeholder="(555) 123-4567"
              maxLength={14}
            />
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
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              placeholder="A bit about you..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="socialLink">Social Media</Label>
            <Input
              id="socialLink"
              type="url"
              value={form.socialLink}
              onChange={(e) => setForm((f) => ({ ...f, socialLink: e.target.value }))}
              placeholder="https://instagram.com/yourprofile"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Link to your Instagram, Twitter/X, or other social profile
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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

// components/EditEventModal.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { Textarea } from "@/components/ui/textarea";

interface EditModalProps {
  event: {
    title: string;
    type: string;
    date: string;
    rinkName?: string;
    location: string;
    ageGroup: string;
    description: string;
  };
}

export function EditEventModal({ event }: EditModalProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your update logic here
    console.log("Updated Event Data:", event);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700">
          Edit Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] bg-background text-sub-text1 ">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Edit Event Details
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              defaultValue={event.title}
              className="bg-background border-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                defaultValue={event.type}
                className="bg-background border-2"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                defaultValue={event.date}
                className="bg-background border-2"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rinkName">Rink Name</Label>
            <Input
              id="rinkName"
              placeholder="e.g., Northern Ice Center"
              defaultValue={event.rinkName ?? ""}
              className="bg-background border-2"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Full Address</Label>
            <AddressAutocomplete
              id="edit-event-address"
              defaultValue={event.location}
              placeholder="Start typing an address for suggestions..."
              className="w-full px-3 py-2 bg-background border-2 rounded-md"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              defaultValue={event.description}
              className="bg-background border-2"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

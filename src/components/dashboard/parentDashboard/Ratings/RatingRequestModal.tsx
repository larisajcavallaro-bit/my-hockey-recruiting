"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface RatingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface PlayerOption {
  id: string;
  name: string;
}

interface CoachOption {
  id: string;
  name: string;
}

export function RatingRequestModal({
  isOpen,
  onClose,
  onSuccess,
}: RatingRequestModalProps) {
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedCoach, setSelectedCoach] = useState("");
  const [message, setMessage] = useState("");
  const [players, setPlayers] = useState<PlayerOption[]>([]);
  const [coaches, setCoaches] = useState<CoachOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFetching(true);
      Promise.all([
        fetch("/api/players?mine=1").then((r) => (r.ok ? r.json() : { players: [] })),
        fetch("/api/coaches").then((r) => (r.ok ? r.json() : { coaches: [] })),
      ])
        .then(([playerRes, coachRes]) => {
          setPlayers(
            (playerRes.players ?? []).map((p: { id: string; name: string }) => ({
              id: p.id,
              name: p.name,
            }))
          );
          setCoaches(
            (coachRes.coaches ?? []).map((c: { id: string; user?: { name?: string } }) => ({
              id: c.id,
              name: c.user?.name ?? "Coach",
            }))
          );
        })
        .catch(() => {})
        .finally(() => setFetching(false));
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedPlayer || !selectedCoach) {
      toast.error("Please select both a player and a coach.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/rating-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: selectedPlayer,
          coachProfileId: selectedCoach,
          message: message || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedPlayer("");
        setSelectedCoach("");
        setMessage("");
        onSuccess?.();
        onClose();
        toast.success("Rating request sent to coach");
      } else {
        toast.error(data.message ?? data.error ?? "Failed to send request");
      }
    } catch {
      toast.error("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl p-6">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl text-left font-bold text-secondary-foreground">
                New Rating Request
              </DialogTitle>
              <p className="text-sm text-sub-text1/50 mt-1">
                Fill out the details for your coach feedback request
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 bg-none hover:text-gray-600"
            ></button>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {/* Select Player */}
          <div>
            <label className="block text-sm font-medium text-sub-text1 mb-2">
              Select your player
            </label>
            <Select value={selectedPlayer} onValueChange={setSelectedPlayer} disabled={fetching}>
              <SelectTrigger className="w-full bg-white border border-gray-200 text-sub-text1 rounded-lg">
                <SelectValue placeholder={fetching ? "Loading..." : "Select"} />
              </SelectTrigger>
              <SelectContent className="text-sub-text1">
                {players.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Select Coach */}
          <div className="text-sub-text1">
            <label className="block text-sm font-medium text-sub-text1 mb-2">
              Select your coach
            </label>

            <Select value={selectedCoach} onValueChange={setSelectedCoach} disabled={fetching}>
              <SelectTrigger className="w-full bg-white border border-gray-200 rounded-lg">
                <SelectValue placeholder={fetching ? "Loading..." : "Select"} />
              </SelectTrigger>

              <SelectContent className="text-sub-text1">
                {coaches.map((coach) => (
                  <SelectItem key={coach.id} value={coach.id}>
                    {coach.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Message (Optional)
            </label>
            <Textarea
              placeholder="Add a message for the coach..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg placeholder-gray-400 min-h-24 resize-none"
            />
          </div>
        </div>

        {/* Send Request Button */}
        <div className="mt-6">
          <Button
            onClick={handleSubmit}
            disabled={loading || fetching}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2"
          >
            <span>👤</span>
            {loading ? "Sending..." : "Send Request"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

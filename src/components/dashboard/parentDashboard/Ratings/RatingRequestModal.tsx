"use client";

import React, { useState } from "react";
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

interface RatingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RatingRequestModal({
  isOpen,
  onClose,
}: RatingRequestModalProps) {
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedCoach, setSelectedCoach] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      player: selectedPlayer,
      coach: selectedCoach,
      message: message,
    });
    // Reset form
    setSelectedPlayer("");
    setSelectedCoach("");
    setMessage("");
    onClose();
  };

  const players = ["Leo Junior", "Emma Wilson", "Alex Thompson"];
  const coaches = [
    "Coach Sarah Jenkins",
    "Coach Michael Brown",
    "Coach Lisa Anderson",
  ];

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
            <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
              <SelectTrigger className="w-full bg-white border border-gray-200 text-sub-text1 rounded-lg">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="text-sub-text1">
                {players.map((player) => (
                  <SelectItem key={player} value={player}>
                    {player}
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

            <Select value={selectedCoach} onValueChange={setSelectedCoach}>
              <SelectTrigger className="w-full bg-white border border-gray-200 rounded-lg">
                <SelectValue placeholder="Select" />
              </SelectTrigger>

              <SelectContent className="text-sub-text1">
                {coaches.map((coach) => (
                  <SelectItem key={coach} value={coach}>
                    {coach}
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
              placeholder="Select"
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2"
          >
            <span>👤</span>
            Send Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

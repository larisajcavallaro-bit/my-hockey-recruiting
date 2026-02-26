"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ShieldOff, LogOut } from "lucide-react";

interface ReleaseTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coachProfileId: string;
  onSuccess: () => void;
}

export default function ReleaseTeamModal({
  open,
  onOpenChange,
  coachProfileId,
  onSuccess,
}: ReleaseTeamModalProps) {
  const [step, setStep] = useState<"choose" | "new_team" | "closing">(
    "choose"
  );
  const [loading, setLoading] = useState(false);
  const [newTeam, setNewTeam] = useState("");
  const [newLevel, setNewLevel] = useState("");
  const [newBirthYear, setNewBirthYear] = useState("");

  const handleReleaseOnly = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/coaches/${coachProfileId}/release-team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "release_only" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      toast.success("Team released. Another coach can now adopt it.");
      onOpenChange(false);
      setStep("choose");
      onSuccess();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleNewTeam = async () => {
    const year = parseInt(newBirthYear, 10);
    if (!newTeam.trim() || !newLevel.trim() || isNaN(year)) {
      toast.error("Please fill in team, level, and birth year.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/coaches/${coachProfileId}/release-team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "new_team",
          team: newTeam.trim(),
          level: newLevel.trim(),
          birthYear: year,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      toast.success("New team details saved.");
      onOpenChange(false);
      setStep("choose");
      setNewTeam("");
      setNewLevel("");
      setNewBirthYear("");
      onSuccess();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleNoLongerCoaching = () => {
    setStep("closing");
  };

  const handleConfirmClose = () => {
    window.location.href = "/auth/close-account";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldOff className="w-5 h-5" />
            Release Team
          </DialogTitle>
        </DialogHeader>

        {step === "choose" && (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Choose what you&apos;d like to do:
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleReleaseOnly}
                disabled={loading}
              >
                Release team only — Another coach can adopt it
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setStep("new_team")}
              >
                Enter new team details — I&apos;m coaching a different team
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleNoLongerCoaching}
              >
                <LogOut className="w-4 h-4 mr-2" />
                No longer coaching — Close my account
              </Button>
            </div>
          </div>
        )}

        {step === "new_team" && (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Enter your new team information:
            </p>
            <div className="space-y-4">
              <div>
                <Label>Team name</Label>
                <Input
                  value={newTeam}
                  onChange={(e) => setNewTeam(e.target.value)}
                  placeholder="e.g. Boston Jr. Eagles"
                />
              </div>
              <div>
                <Label>Level</Label>
                <Input
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value)}
                  placeholder="e.g. AAA, AA"
                />
              </div>
              <div>
                <Label>Birth year</Label>
                <Input
                  type="number"
                  value={newBirthYear}
                  onChange={(e) => setNewBirthYear(e.target.value)}
                  placeholder="e.g. 2010"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("choose")}>
                Back
              </Button>
              <Button onClick={handleNewTeam} disabled={loading}>
                Save new team
              </Button>
            </div>
          </div>
        )}

        {step === "closing" && (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Closing your account will remove your coach profile and all
              associated data. This cannot be undone.
            </p>
            <p className="text-sm font-medium">
              Are you sure you want to proceed?
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("choose")}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmClose}
              >
                Yes, close my account
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

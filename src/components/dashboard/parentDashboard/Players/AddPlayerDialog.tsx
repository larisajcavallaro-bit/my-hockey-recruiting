"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PlayerForm, { type PlayerFormData } from "./PlayerForm";

interface AddPlayerDialogProps {
  onSuccess?: () => void;
  triggerLabel?: string;
  triggerClassName?: string;
}

export default function AddPlayerDialog({
  onSuccess,
  triggerLabel = "Add Player",
  triggerClassName,
}: AddPlayerDialogProps) {
  const [open, setOpen] = useState(false);
  const [checkoutRequired, setCheckoutRequired] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const handleSubmit = async (data: PlayerFormData) => {
    const res = await fetch("/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        birthYear: data.birthYear,
        position: data.position || undefined,
        level: data.level || undefined,
        team: data.team || undefined,
        league: data.league || undefined,
        location: data.location || undefined,
        gender: data.gender || undefined,
        bio: data.bio || undefined,
        image: data.image || undefined,
        socialLink: data.socialLink?.trim() || undefined,
        goals: data.goals ? parseInt(data.goals, 10) : undefined,
        assists: data.assists ? parseInt(data.assists, 10) : undefined,
        plusMinus: data.plusMinus !== "" ? parseInt(data.plusMinus, 10) : undefined,
        gaa: data.gaa ? parseFloat(data.gaa) : undefined,
        savePct: data.savePct || undefined,
      }),
    });
    const result = await res.json();
    if (!res.ok) {
      if (result.checkoutRequired) {
        setCheckoutError(result.error ?? "Subscribe for this child to add them.");
        setCheckoutRequired(true);
      } else if (result.upgradeRequired) {
        toast.error(result.error ?? "Player limit reached", {
          action: {
            label: "View plans",
            onClick: () => window.open("/subscription", "_self"),
          },
        });
      } else {
        throw new Error(result.error ?? "Failed to add player");
      }
      return;
    }
    toast.success("Player added successfully!");
    setOpen(false);
    setCheckoutRequired(false);
    setCheckoutError(null);
    onSuccess?.();
  };

  const handleCheckout = async (planId: "gold" | "elite") => {
    setCheckoutLoading(planId);
    try {
      const res = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billingPeriod: "monthly", intent: "addChild" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setCheckoutRequired(false);
          setCheckoutError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className={triggerClassName ?? "bg-button-clr1 hover:bg-button-clr1/90"}>
          <Plus className="w-4 h-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {checkoutRequired ? "Subscribe for This Child" : "Add Player Profile"}
          </DialogTitle>
        </DialogHeader>
        {checkoutRequired ? (
          <div className="space-y-4 py-4">
            <p className="text-orange-600 font-extrabold">{checkoutError}</p>
            <p className="text-sm text-muted-foreground">
              Gold and Elite are charged per child. Or upgrade to Family for one price for up to 6
              players.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleCheckout("gold")}
                disabled={!!checkoutLoading}
              >
                {checkoutLoading === "gold" ? "Redirecting..." : "Gold — $3.99/mo"}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleCheckout("elite")}
                disabled={!!checkoutLoading}
              >
                {checkoutLoading === "elite" ? "Redirecting..." : "Elite — $5.99/mo"}
              </Button>
            </div>
            <Link
              href="/subscription"
              className="block text-center text-sm text-orange-600 font-extrabold hover:underline"
            >
              Or upgrade to Family (one price for up to 6 players)
            </Link>
            <Button variant="ghost" onClick={() => setCheckoutRequired(false)}>
              ← Back to form
            </Button>
          </div>
        ) : (
          <PlayerForm
            mode="add"
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
            submitLabel={triggerLabel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

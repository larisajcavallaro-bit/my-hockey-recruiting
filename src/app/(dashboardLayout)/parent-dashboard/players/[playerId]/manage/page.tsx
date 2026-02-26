"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { toast } from "sonner";
import PlayerForm, { type PlayerFormData } from "@/components/dashboard/parentDashboard/Players/PlayerForm";

interface PlayerData {
  id: string;
  parentId: string;
  planId?: string | null;
  hasPaidSubscription?: boolean;
  name: string;
  birthYear: number;
  position?: string | null;
  level?: string | null;
  gender?: string | null;
  location?: string | null;
  team?: string | null;
  league?: string | null;
  image?: string | null;
  bio?: string | null;
  socialLink?: string | null;
  goals?: number | null;
  assists?: number | null;
  plusMinus?: number | null;
  gaa?: number | null;
  savePct?: string | null;
}

export default function ManagePlayerPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const playerId = params.playerId as string;
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwnPlayer =
    !!player &&
    !!session?.user &&
    (session.user as { parentProfileId?: string | null }).parentProfileId ===
      player.parentId;

  useEffect(() => {
    if (!playerId || typeof playerId !== "string" || playerId === "undefined") {
      setLoading(false);
      setPlayer(null);
      return;
    }
    fetch(`/api/players/${playerId}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) {
          setPlayer(null);
          return;
        }
        if (data.error) setPlayer(null);
        else setPlayer(data);
      })
      .catch(() => setPlayer(null))
      .finally(() => setLoading(false));
  }, [playerId]);

  const initialData: Partial<PlayerFormData> | undefined = player
    ? {
        name: player.name,
        birthYear: player.birthYear,
        position: player.position ?? "",
        level: player.level ?? "",
        team: player.team ?? "",
        league: player.league ?? "",
        location: player.location ?? "",
        gender: player.gender ?? "",
        bio: player.bio ?? "",
        image: player.image ?? "",
        socialLink: player.socialLink ?? "",
        goals: player.goals != null ? String(player.goals) : "",
        assists: player.assists != null ? String(player.assists) : "",
        plusMinus: player.plusMinus != null ? String(player.plusMinus) : "",
        gaa: player.gaa != null ? String(player.gaa) : "",
        savePct: player.savePct ?? "",
      }
    : undefined;

  const handleSubmit = async (data: PlayerFormData) => {
    const goalsNum = data.goals ? parseInt(data.goals, 10) : undefined;
    const assistsNum = data.assists ? parseInt(data.assists, 10) : undefined;
    const plusMinusNum = data.plusMinus !== "" && data.plusMinus != null ? parseInt(data.plusMinus, 10) : undefined;
    const gaaNum = data.gaa ? parseFloat(data.gaa) : undefined;

    const payload: Record<string, unknown> = {
      name: data.name,
      birthYear: data.birthYear,
      position: data.position || undefined,
      level: data.level || undefined,
      team: data.team || undefined,
      league: data.league || undefined,
      location: data.location || undefined,
      gender: data.gender || undefined,
      bio: data.bio || undefined,
      socialLink: data.socialLink?.trim() || null,
      savePct: data.savePct || undefined,
    };
    // Only send image if it changed (avoids re-sending large base64 on stats-only updates)
    if (data.image && data.image !== (player?.image ?? "")) {
      payload.image = data.image;
    }
    if (goalsNum !== undefined && !Number.isNaN(goalsNum)) payload.goals = goalsNum;
    if (assistsNum !== undefined && !Number.isNaN(assistsNum)) payload.assists = assistsNum;
    if (plusMinusNum !== undefined && !Number.isNaN(plusMinusNum)) payload.plusMinus = plusMinusNum;
    if (gaaNum !== undefined && !Number.isNaN(gaaNum)) payload.gaa = gaaNum;

    const res = await fetch(`/api/players/${playerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error ?? "Failed to update player");
    toast.success("Player updated successfully!");
    router.push(`/parent-dashboard/players/${playerId}`);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/players/${playerId}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Failed to delete player");
      toast.success("Player deleted");
      setDeleteDialogOpen(false);
      router.push("/parent-dashboard/profile");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete player");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-sub-text1/80">Loading player...</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-bold mb-4">Player not found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  if (!isOwnPlayer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-bold mb-4">You can only manage your own players</h1>
        <Button onClick={() => router.push(`/parent-dashboard/players/${playerId}`)}>
          View Player
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push(`/parent-dashboard/players/${playerId}`)}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Player
      </Button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Manage Player: {player.name}
        </h1>
        <p className="text-sm text-sub-text1/80">
          Update your player&apos;s profile. Same fields as when you first added them.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border p-6 shadow-sm">
        <PlayerForm
          mode="edit"
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/parent-dashboard/players/${playerId}`)}
          submitLabel="Save Changes"
          planIdOverride={player?.planId ?? null}
        />
      </div>

      <div className="pt-6 border-t border-red-200 dark:border-red-900/30">
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 hover:border-red-400 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950/50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Player
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete player profile?</DialogTitle>
              <DialogDescription asChild>
                <div className="space-y-2">
                  <p>Are you sure? All information for {player.name} will be permanently deleted. This cannot be undone.</p>
                  {player.hasPaidSubscription && (
                    <p className="text-amber-600 dark:text-amber-500 font-medium pt-1">
                      This child has a paid subscription. You&apos;ll continue to be charged until you cancel in{" "}
                      <Link href="/parent-dashboard/setting?tab=subscription" className="underline hover:no-underline">
                        Manage Billing
                      </Link>
                      . You can assign this subscription to another child when you add them.
                    </p>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

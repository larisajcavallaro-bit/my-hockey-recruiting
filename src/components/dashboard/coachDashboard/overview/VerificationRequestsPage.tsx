"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  ShieldCheck,
  MapPin,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

type PendingPlayer = {
  id: string;
  verificationId: string;
  name: string;
  birthYear: number;
  position?: string | null;
  team?: string | null;
  level?: string | null;
  location?: string | null;
  image?: string | null;
};

export default function VerificationRequestsPage() {
  const { data: session } = useSession();
  const coachProfileId = (session?.user as { coachProfileId?: string | null })
    ?.coachProfileId;

  const [pending, setPending] = useState<PendingPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = () => {
    if (!coachProfileId) {
      setLoading(false);
      return;
    }
    fetch(`/api/coaches/${coachProfileId}/roster`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setPending(data.pending ?? []);
      })
      .catch(() => setPending([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void Promise.resolve().then(() => fetchPending());
  }, [coachProfileId]);

  const handleApprove = async (playerId: string) => {
    if (!coachProfileId) return;
    const res = await fetch(
      `/api/coaches/${coachProfileId}/verifications/${playerId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Failed to approve");
      return;
    }
    toast.success("Player verified");
    fetchPending();
  };

  const handleDecline = async (playerId: string) => {
    if (!coachProfileId) return;
    const res = await fetch(
      `/api/coaches/${coachProfileId}/verifications/${playerId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "decline" }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Failed to decline");
      return;
    }
    toast.success("Player declined");
    fetchPending();
  };

  if (!coachProfileId) {
    return (
      <div className="min-h-screen p-6 md:p-10">
        <p className="text-sub-text1/80">Please sign in as a coach.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-none p-6 md:p-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100/50 rounded-lg border border-blue-200">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Verification Requests
            </h1>
            <p className="text-slate-500 font-medium">
              Review and verify players for your team
            </p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl flex items-center gap-2 self-start md:self-center">
          <div className="w-2 h-2 bg-amber-500 rounded-full" />
          <span className="text-amber-700 font-bold text-sm">
            {pending.length} Pending
          </span>
        </div>
      </div>

      {loading ? (
        <p className="text-sub-text1/80 py-8">Loading...</p>
      ) : pending.length === 0 ? (
        <div className="text-center py-20 bg-secondary-foreground/20 rounded-3xl">
          <p className="text-slate-400">
            No pending verification requests. When parents add player profiles
            that match your team, level, and birth year, they will appear here.
          </p>
          <Link href="/coach-dashboard/teamManagement">
            <Button className="mt-4">Go to All Players</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((player) => (
            <div
              key={player.id}
              className="relative flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl bg-secondary-foreground/40 overflow-hidden shadow-sm"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full border-4 border-slate-400/50 overflow-hidden bg-slate-300">
                  {player.image ? (
                    player.image.startsWith("data:") ? (
                      <img
                        src={player.image}
                        alt={player.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={player.image}
                        alt={player.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="w-full h-full bg-slate-500 flex items-center justify-center text-white text-2xl font-bold">
                      {player.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="bg-amber-100 text-amber-700 px-4 py-1 rounded-lg text-xs font-bold uppercase">
                  {player.position ?? "—"}
                </span>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-x-6 gap-y-2">
                  <h3 className="text-2xl font-bold text-white">{player.name}</h3>
                  {player.location && (
                    <div className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">{player.location}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-slate-700/50 px-3 py-1 rounded-md text-sm text-slate-300 border border-slate-600">
                    Birth Year: <span className="text-blue-400 font-bold">{player.birthYear}</span>
                  </div>
                  <div className="bg-slate-700/50 px-3 py-1 rounded-md text-sm text-slate-300 border border-slate-600">
                    Team: <span className="text-blue-400 font-bold">{player.team ?? "-"}</span>
                  </div>
                  <div className="bg-slate-700/50 px-3 py-1 rounded-md text-sm text-slate-300 border border-slate-600">
                    Level: <span className="text-blue-400 font-bold">{player.level ?? "-"}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-48">
                <Link href={`/coach-dashboard/players/${player.id}`}>
                  <Button variant="secondary" className="w-full gap-2">
                    <Eye className="w-4 h-4" /> View Profile
                  </Button>
                </Link>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 gap-2"
                  onClick={() => handleApprove(player.id)}
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </Button>
                <Button
                  variant="destructive"
                  className="w-full gap-2"
                  onClick={() => handleDecline(player.id)}
                >
                  <XCircle className="w-4 h-4" /> Decline
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

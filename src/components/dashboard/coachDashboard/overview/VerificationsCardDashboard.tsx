"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Check, X, MapPin, CalendarDays, User, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { toast } from "sonner";

type PendingPlayer = {
  id: string;
  name: string;
  position?: string | null;
  league?: string | null;
  location?: string | null;
  level?: string | null;
  birthYear: number;
};

export default function VerificationsCardDashboard() {
  const { data: session } = useSession();
  const coachProfileId = (session?.user as { coachProfileId?: string | null })
    ?.coachProfileId;

  const [pending, setPending] = useState<PendingPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coachProfileId) {
      void Promise.resolve().then(() => setLoading(false));
      return;
    }
    void Promise.resolve().then(() =>
      fetch(`/api/coaches/${coachProfileId}/roster`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setPending(data.pending ?? []);
      })
      .catch(() => setPending([]))
      .finally(() => setLoading(false))
    );
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
    setPending((prev) => prev.filter((p) => p.id !== playerId));
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
    setPending((prev) => prev.filter((p) => p.id !== playerId));
  };

  const displayList = pending.slice(0, 3);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Pending Verifications
          </h2>
          <p className="text-sm text-sub-text1/60">
            Review athlete profile requests
          </p>
        </div>
        <Link
          href="/coach-dashboard/overview/verifications"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          View all
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground py-4">Loading...</p>
      ) : displayList.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">
          No pending verification requests.
        </p>
      ) : (
        <div className="grid gap-4">
          {displayList.map((player) => (
            <div
              key={player.id}
              className="group relative overflow-hidden bg-secondary-foreground/60 border-slate-200 rounded-2xl p-4 sm:p-5 transition-all hover:border-blue-300 hover:shadow-md"
            >
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-blue-50 shadow-sm shrink-0">
                    <AvatarFallback className="bg-blue-50 text-blue-600 font-bold text-base sm:text-lg">
                      {player.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-x-2">
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                        {player.name}
                      </h3>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                        {player.position ?? "—"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-y-1 text-slate-500 text-xs sm:text-sm">
                      {player.league && (
                        <div className="flex text-sub-text3/80 items-center gap-1.5">
                          <Trophy className="w-3.5 h-3.5 text-sub-text3" />
                          {player.league}
                        </div>
                      )}
                      {player.location && (
                        <div className="flex text-sub-text3/80 items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-sub-text3" />
                          {player.location}
                        </div>
                      )}
                      <div className="flex text-sub-text3/80 items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-sub-text3" />
                        {player.level ?? "—"}
                      </div>
                      <div className="flex text-sub-text3/80 items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-sub-text3" />
                        Born {player.birthYear}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 sm:pl-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-100 text-red-600 hover:bg-red-50"
                    onClick={() => handleDecline(player.id)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleApprove(player.id)}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

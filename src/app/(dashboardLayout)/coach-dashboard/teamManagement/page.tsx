"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import PlayersFilterBar from "@/components/dashboard/coachDashboard/teamManagement/playersFilterBar";
import PlayerCard from "@/components/dashboard/coachDashboard/teamManagement/PlayerCard";
import TeamGroup from "@/components/dashboard/coachDashboard/teamManagement/teamGroup";
import { Button } from "@/components/ui/button";
import { ShieldOff } from "lucide-react";
import ReleaseTeamModal from "@/components/dashboard/coachDashboard/teamManagement/ReleaseTeamModal";

type PlayerRecord = {
  id: string;
  name: string;
  birthYear: number;
  position?: string | null;
  level?: string | null;
  team?: string | null;
  goals?: number | null;
  assists?: number | null;
  plusMinus?: number | null;
  gaa?: number | null;
  savePct?: string | null;
  status: string;
  image?: string | null;
};

function mapToPlayerCard(p: PlayerRecord) {
  return {
    id: p.id,
    name: p.name,
    team: p.team ?? "-",
    weight: "-",
    year: String(p.birthYear),
    position: p.position ?? "—",
    level: p.level ?? "-",
    isVerified: p.status === "Verified",
    stats: {
      goals: p.goals ?? 0,
      assists: p.assists ?? 0,
      savePct: p.savePct ?? "0%",
      gaa: String(p.gaa ?? "0.00"),
      plusMinus: `+${p.plusMinus ?? 0}`,
    },
  };
}

export default function AllPlayersPage() {
  const { data: session } = useSession();
  const coachProfileId = (session?.user as { coachProfileId?: string | null })
    ?.coachProfileId;

  const [coachInfo, setCoachInfo] = useState<{
    showTeamPanel: boolean;
    teams: { id: string; name: string; count: number; active?: boolean }[];
  } | null>(null);
  const [verified, setVerified] = useState<PlayerRecord[]>([]);
  const [pending, setPending] = useState<(PlayerRecord & { verificationId: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [birthYearFilter, setBirthYearFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const fetchRoster = useCallback(() => {
    if (!coachProfileId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/coaches/${coachProfileId}/roster`)
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) {
          toast.error(data?.error ?? "Failed to fetch roster");
          return;
        }
        setCoachInfo({
          showTeamPanel: data.coach?.showTeamPanel ?? false,
          teams: data.teams ?? [],
        });
        setVerified(data.verified ?? []);
        setPending(data.pending ?? []);
      })
      .catch(() => toast.error("Failed to load roster"))
      .finally(() => setLoading(false));
  }, [coachProfileId]);

  useEffect(() => {
    void Promise.resolve().then(() => fetchRoster());
  }, [fetchRoster]);

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
    fetchRoster();
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
    fetchRoster();
  };

  const handleRemove = async (playerId: string) => {
    if (!coachProfileId) return;
    const res = await fetch(
      `/api/coaches/${coachProfileId}/roster/${playerId}`,
      { method: "DELETE" }
    );
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Failed to remove player");
      return;
    }
    toast.success("Player removed from roster");
    fetchRoster();
  };

  const handleReleaseTeam = () => {
    setReleaseModalOpen(true);
  };

  const filteredVerified = verified.filter((p) => {
    return (
      (birthYearFilter === "all" || String(p.birthYear) === birthYearFilter) &&
      (positionFilter === "all" || (p.position ?? "") === positionFilter) &&
      (levelFilter === "all" || (p.level ?? "") === levelFilter)
    );
  });

  if (!coachProfileId) {
    return (
      <div className="min-h-screen antialiased text-sub-text1 md:p-10 flex items-center justify-center">
        <p className="text-sub-text1/80">Please sign in as a coach.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen antialiased text-sub-text1 md:p-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {coachInfo?.showTeamPanel && (
          <aside>
            <TeamGroup
              teams={coachInfo.teams}
              onTeamSelect={() => {}}
            />
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full border-amber-500/50 text-amber-600 hover:bg-amber-500/10"
                onClick={handleReleaseTeam}
              >
                <ShieldOff className="w-4 h-4 mr-2" />
                Release Team
              </Button>
            </div>
          </aside>
        )}

        {coachProfileId && (
          <ReleaseTeamModal
          open={releaseModalOpen}
          onOpenChange={setReleaseModalOpen}
          coachProfileId={coachProfileId}
          onSuccess={fetchRoster}
          />
        )}

        <main className="flex-1">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight">
              All Players
            </h1>
            <p className="text-sub-text1/60 mt-2 font-medium">
              Manage your verified players and pending verifications
            </p>
          </header>

          <PlayersFilterBar
            birthYear={birthYearFilter}
            setBirthYear={setBirthYearFilter}
            position={positionFilter}
            setPosition={setPositionFilter}
            level={levelFilter}
            setLevel={setLevelFilter}
            gender={genderFilter}
            setGender={setGenderFilter}
            location={locationFilter}
            setLocation={setLocationFilter}
          />

          {loading ? (
            <p className="text-sub-text1/80 py-8">Loading...</p>
          ) : (
            <div className="space-y-8">
              {pending.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-amber-500" />
                    Pending Verification ({pending.length})
                  </h2>
                  <div className="space-y-4">
                    {pending.map((p) => (
                      <PendingPlayerRow
                        key={p.id}
                        player={p}
                        onApprove={() => handleApprove(p.id)}
                        onDecline={() => handleDecline(p.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h2 className="text-xl font-bold mb-4">
                  Verified Roster ({filteredVerified.length})
                </h2>
                <div className="space-y-4">
                  {filteredVerified.length > 0 ? (
                    filteredVerified.map((player) => (
                      <VerifiedPlayerRow
                        key={player.id}
                        player={player}
                        coachProfileId={coachProfileId}
                        onRemove={() => handleRemove(player.id)}
                      />
                    ))
                  ) : (
                    <div className="text-center py-20 bg-black/20 rounded-[32px] border border-dashed border-white/10">
                      <p className="text-gray-500 text-lg">
                        {verified.length === 0
                          ? "No verified players yet. Approve players from the pending list above when parents add profiles matching your team."
                          : "No players match the current filters."}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function PendingPlayerRow({
  player,
  onApprove,
  onDecline,
}: {
  player: PlayerRecord;
  onApprove: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-secondary-foreground/40 border border-amber-500/30">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className="bg-amber-500/20 text-amber-600 px-3 py-1 rounded-lg text-xs font-bold">
            Pending
          </span>
          <h3 className="font-bold text-lg">{player.name}</h3>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          {player.team ?? "-"} • {player.level ?? "-"} • {player.birthYear} • {player.position ?? "-"}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="border-red-500/50 text-red-500 hover:bg-red-500/10"
          onClick={onDecline}
        >
          Decline
        </Button>
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          onClick={onApprove}
        >
          Approve
        </Button>
        <Link href={`/coach-dashboard/players/${player.id}`}>
          <Button size="sm" variant="secondary">
            View
          </Button>
        </Link>
      </div>
    </div>
  );
}

function VerifiedPlayerRow({
  player,
  onRemove,
}: {
  player: PlayerRecord;
  coachProfileId: string;
  onRemove: () => void;
}) {
  const cardProps = mapToPlayerCard(player);
  return (
    <div className="space-y-2">
      <PlayerCard {...cardProps} />
      <div className="flex gap-2">
        <Link href={`/coach-dashboard/players/${player.id}`}>
          <Button size="sm" variant="secondary">
            View Profile
          </Button>
        </Link>
        <Button
          size="sm"
          variant="outline"
          className="border-red-500/50 text-red-500 hover:bg-red-500/10"
          onClick={onRemove}
        >
          Remove from roster
        </Button>
      </div>
    </div>
  );
}

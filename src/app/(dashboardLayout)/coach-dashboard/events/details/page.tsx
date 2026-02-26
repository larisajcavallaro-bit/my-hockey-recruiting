"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PlayerCard, {
  PlayerCardProps,
  PlayerStatus,
} from "@/components/dashboard/parentDashboard/Players/PlayerCard";

function mapToPlayerCard(p: {
  id: string;
  name: string;
  team?: string | null;
  birthYear: number;
  position?: string | null;
  level?: string | null;
  goals?: number | null;
  assists?: number | null;
  plusMinus?: number | null;
  gaa?: number | null;
  savePct?: string | null;
  gender?: string | null;
  location?: string | null;
  status: string;
  image?: string | null;
  socialLink?: string | null;
}): PlayerCardProps {
  return {
    id: p.id,
    name: p.name,
    team: p.team ?? "-",
    age: String(new Date().getFullYear() - p.birthYear),
    birthYear: p.birthYear,
    position: p.position ?? "-",
    level: p.level ?? "-",
    goals: p.goals ?? 0,
    assists: p.assists ?? 0,
    plusMinus: p.plusMinus ?? null,
    gaa: p.gaa ?? 0,
    save: p.savePct ?? "-",
    gender: p.gender ?? "-",
    location: p.location ?? "-",
    status: (p.status === "Verified"
      ? "Verified"
      : p.status === "Rejected"
        ? "Rejected"
        : "Pending") as PlayerStatus,
    image: p.image ?? "/newasset/parent/players/Players1.png",
    socialLink: p.socialLink ?? null,
    profileBasePath: "coach-dashboard",
  };
}

function EventRsvpsDetailsContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");

  const [event, setEvent] = useState<{ id: string; title: string; date: string; eventType?: string | null; rinkName?: string | null; location?: string | null } | null>(null);
  const [players, setPlayers] = useState<PlayerCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      void Promise.resolve().then(() => {
        setError("No event selected");
        setLoading(false);
      });
      return;
    }
    void Promise.resolve().then(() => {
      setLoading(true);
      setError(null);
      fetch(`/api/events/${eventId}/rsvps`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setEvent(data.event);
        setPlayers(
          (data.players ?? []).map((p: Record<string, unknown>) =>
            mapToPlayerCard(p as Parameters<typeof mapToPlayerCard>[0])
          )
        );
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load RSVPs"))
      .finally(() => setLoading(false));
    });
  }, [eventId]);

  if (!eventId) {
    return (
      <div className="min-h-screen p-6 lg:p-10">
        <Link
          href="/coach-dashboard/events"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>
        <p className="text-red-400">No event selected.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <Link
        href="/coach-dashboard/events"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Events
      </Link>

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          Loading RSVPs…
        </div>
      ) : error ? (
        <div className="py-20 text-center text-red-400">
          <p className="font-medium">{error}</p>
        </div>
      ) : (
        <>
          {/* Event header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {event?.title ?? "Event"}
            </h1>
            <p className="text-slate-600">
              {event?.date}
              {event?.eventType && ` • ${event.eventType}`}
              {event?.rinkName && ` • ${event.rinkName}`}
            </p>
            <p className="text-lg font-semibold text-green-600 mt-4">
              {players.length} {players.length === 1 ? "player" : "players"} going
            </p>
          </div>

          {/* Player cards grid */}
          {players.length === 0 ? (
            <div className="py-12 text-center bg-secondary-foreground/20 rounded-xl border border-dashed border-white/10">
              <p className="text-slate-400">No RSVPs yet.</p>
              <p className="text-slate-500 text-sm mt-1">
                Players who respond &quot;Going&quot; will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {players.map((player) => (
                <PlayerCard key={player.id} {...player} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function EventRsvpsDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen p-6 lg:p-10">
        <div className="py-20 text-center text-slate-500">Loading…</div>
      </div>
    }>
      <EventRsvpsDetailsContent />
    </Suspense>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Search, BarChart2, ChevronRight } from "lucide-react";
import { PlayerRequestRow } from "@/components/dashboard/coachDashboard/Ratings/PlayerRequestRow";
import { RatingModal } from "@/components/dashboard/coachDashboard/Ratings/RatingModal";

interface PendingRequest {
  id: string;
  playerId: string;
  playerName: string;
  requesterName: string;
  status: string;
  createdAt: string;
}

function formatRequested(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

export default function RatingsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<PendingRequest | null>(null);
  const [players, setPlayers] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    setLoading(true);
    fetch("/api/rating-requests?status=pending")
      .then((r) => (r.ok ? r.json() : { requests: [] }))
      .then((data) => {
        setPlayers(
          (data.requests ?? []).map((r: Record<string, unknown>) => ({
            id: r.id,
            playerId: r.playerId,
            playerName: r.playerName ?? "Player",
            requesterName: r.requesterName ?? "Parent",
            status: r.status ?? "pending",
            createdAt: r.createdAt ?? "",
          }))
        );
      })
      .catch(() => setPlayers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void Promise.resolve().then(() => fetchRequests());
  }, []);

  const filtered = players.filter((p) =>
    (p.playerName ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const pendingCount = players.length;

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900">
            Submit Player Ratings
          </h1>
          <p className="text-slate-500 text-sm font-medium tracking-wider">
            Parent send rating request
          </p>
        </header>

        <div className="p-6 rounded-[32px] bg-[#E5E7EB]/50 border mb-6">
          <div className="relative mb-6">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search players..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white py-4 pl-14 pr-6 rounded-xl outline-none text-sm text-sub-text1 placeholder:text-gray-500 border-2 border-button-clr1 focus:ring-2 focus:ring-button-clr1"
            />
          </div>

          <div className="space-y-3">
            {loading ? (
              <p className="text-sub-text1 py-4">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-sub-text1 py-4">No pending rating requests.</p>
            ) : (
              filtered.map((p) => (
                <PlayerRequestRow
                  key={p.id}
                  name={p.playerName}
                  requester={p.requesterName}
                  requestedDate={formatRequested(p.createdAt)}
                  onRateClick={() => setSelectedRequest(p)}
                />
              ))
            )}
          </div>

          <div className="mt-10 bg-secondary border border-blue-100 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600">
                <BarChart2 size={24} />
              </div>
              <div>
                <h4 className="text-sub-text1/60 font-black text-sm">
                  Prompt Feedback Matters
                </h4>
                <p className="text-blue-600 text-[11px]">
                  Quick ratings help parents track development.
                </p>
              </div>
            </div>
            <div className="bg-white px-5 py-2.5 rounded-xl text-sm font-black text-slate-800 shadow-sm border border-blue-50 flex items-center gap-2">
              {pendingCount} Pending <ChevronRight size={16} className="text-blue-500" />
            </div>
          </div>
        </div>
      </div>
      <RatingModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onSuccess={() => {
          setSelectedRequest(null);
          fetchRequests();
        }}
        playerId={selectedRequest?.playerId ?? ""}
        playerName={selectedRequest?.playerName ?? ""}
      />
    </div>
  );
}

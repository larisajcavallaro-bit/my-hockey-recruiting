"use client";
import { useState } from "react";
import { Search, BarChart2, ChevronRight } from "lucide-react";
import { PlayerRequestRow } from "@/components/dashboard/coachDashboard/Ratings/PlayerRequestRow";
import { RatingModal } from "@/components/dashboard/coachDashboard/Ratings/RatingModal";

export default function RatingsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const players = [
    { id: 1, name: "Alex Johnson", requester: "Robert Johnson" },
    { id: 2, name: "Marcus Smith", requester: "Sarah Smith" },
    { id: 3, name: "Sarah Jenkins", requester: "Mike Jenkins" },
  ];

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
            {players
              .filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((player) => (
                <PlayerRequestRow
                  key={player.id}
                  name={player.name}
                  requester={player.requester}
                  onRateClick={() => setSelectedPlayer(player.name)}
                />
              ))}
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
              4 Pending <ChevronRight size={16} className="text-blue-500" />
            </div>
          </div>
        </div>
      </div>
      <RatingModal
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        playerName={selectedPlayer || ""}
      />
    </div>
  );
}

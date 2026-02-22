"use client";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock } from "lucide-react";

interface PlayerRowProps {
  name: string;
  requester: string;
  onRateClick: () => void;
}

export const PlayerRequestRow = ({
  name,
  requester,
  onRateClick,
}: PlayerRowProps) => {
  return (
    <div className="bg-background/60 rounded-2xl w-full p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm border border-white/10 transition-all gap-4">
      {/* Left Section: Avatar and Name */}
      <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
        <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-200 bg-cover bg-center" />
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-900 text-sm md:text-base leading-tight truncate">
            {name}
          </h3>
          <p className="text-[11px] md:text-xs text-sub-text1 flex items-center gap-1 mt-0.5">
            <span className="opacity-70">Requested by</span>
            <span className="font-semibold truncate">{requester}</span>
          </p>

          {/* Mobile-only timestamp */}
          <div className="flex sm:hidden items-center gap-1 mt-1 text-[10px] text-sub-text1/60 italic font-medium">
            <Clock size={10} />
            <span>Requested 2 days ago</span>
          </div>
        </div>
      </div>

      {/* Right Section: Info and Action */}
      <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-8 w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0 border-white/10">
        {/* Desktop/Tablet-only timestamp */}
        <div className="text-right hidden sm:block shrink-0">
          <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-sub-text1 font-bold mb-0.5">
            Requested
          </p>
          <p className="text-[11px] text-sub-text1/60 font-black italic">
            2 days ago
          </p>
        </div>

        <Button
          onClick={onRateClick}
          className="w-full sm:w-auto text-xs md:text-sm h-9 md:h-10 px-4 md:px-6"
        >
          Rate Now <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

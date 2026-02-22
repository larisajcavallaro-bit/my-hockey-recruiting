// components/ratings/PendingSummary.tsx
import { BarChart2, ChevronRight } from "lucide-react";

export const PendingSummary = ({ count }: { count: number }) => (
  <div className="mt-8 md:mt-10 bg-blue-50/90 border border-blue-100 rounded-[1.25rem] md:rounded-[1.5rem] p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm gap-4">
    <div className="flex items-center gap-3 md:gap-4">
      {/* Icon: Hidden on very small screens or resized */}
      <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg md:rounded-xl flex items-center justify-center shadow-sm text-blue-600">
        <BarChart2 size={20} className="md:w-6 md:h-6" />
      </div>

      <div>
        <h4 className="text-blue-900 font-black text-xs md:text-sm uppercase tracking-tight">
          Prompt Feedback Matters
        </h4>
        <p className="text-blue-600 text-[10px] md:text-[11px] font-medium opacity-80 leading-snug max-w-[180px] md:max-w-[200px]">
          Quick ratings help parents track development in real-time
        </p>
      </div>
    </div>

    {/* Badge: Full width on mobile, auto on tablet+ */}
    <div className="w-full sm:w-auto bg-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-black text-slate-800 shadow-sm border border-blue-50 flex items-center justify-between sm:justify-start gap-2 hover:bg-blue-50/50 transition-colors cursor-pointer">
      <span className="flex items-center gap-1">
        <span className="text-blue-600">{count}</span> Pending
      </span>
      <ChevronRight size={16} className="text-blue-500" />
    </div>
  </div>
);

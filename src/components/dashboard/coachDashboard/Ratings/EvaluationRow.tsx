import { RatingStars } from "./RatingStars";

export const EvaluationRow = ({
  icon,
  label,
  desc,
}: {
  icon: string;
  label: string;
  desc: string;
}) => (
  <div className="bg-[#E9E9E9]/60 rounded-xl p-4 flex items-center justify-between mb-2 border border-transparent hover:border-slate-200 transition-all">
    <div className="flex items-center gap-3">
      <span className="text-xl">{icon}</span>
      <div>
        <h4 className="font-bold text-slate-800 text-sm">{label}</h4>
        <p className="text-slate-500 text-[10px] leading-tight">{desc}</p>
      </div>
    </div>
    <RatingStars />
  </div>
);

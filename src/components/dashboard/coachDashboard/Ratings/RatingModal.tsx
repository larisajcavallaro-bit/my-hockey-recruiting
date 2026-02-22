import { X, Lock, Eye, Send, BarChart2 } from "lucide-react";
import { EvaluationRow } from "./EvaluationRow";

export const RatingModal = ({
  isOpen,
  onClose,
  playerName,
}: {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Evaluating: {playerName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={18} className="text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm uppercase">
                Performance Evaluation
              </h3>
            </div>
            <EvaluationRow
              icon="⛸️"
              label="Skating"
              desc="Speed, agility, edge work, and balance on ice"
            />
            <EvaluationRow
              icon="🏒"
              label="Shooting"
              desc="Shot power, accuracy, and quick release"
            />
            <EvaluationRow
              icon="🥅"
              label="Passing"
              desc="Vision, accuracy, and timing of passes"
            />
            <EvaluationRow
              icon="🧠"
              label="Game Sense"
              desc="Positioning, awareness, and hockey IQ"
            />
            <EvaluationRow
              icon="💪"
              label="Work Ethic"
              desc="Effort, attitude, and coachability"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-purple-600" />
              <h3 className="font-bold text-slate-800 text-sm">
                Coach's Feedback
              </h3>
            </div>
            <textarea
              className="w-full h-36 p-5 bg-slate-50 rounded-2xl outline-none text-sm resize-none"
              placeholder="Feedback..."
            />
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 flex items-start gap-4">
              <Eye className="text-purple-400 mt-1" size={18} />
              <p className="text-purple-500 text-[11px] leading-relaxed">
                This comment is private and only visible to parents.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 border-t bg-white flex items-center justify-between">
          <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl">
            <Send size={18} /> Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

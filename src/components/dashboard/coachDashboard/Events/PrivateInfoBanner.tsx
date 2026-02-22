import { Lock } from "lucide-react";

export function PrivateInfoBanner() {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-xl bg-background/60 border border-blue-400/20 p-4 text-sm text-sub-text1/80">
      <Lock size={18} className="mt-0.5" />
      <div>
        <p className="font-semibold">Private Information</p>
        <p className="text-xs opacity-80">
          The information below is only visible to you. Keep all contact
          information confidential.
        </p>
      </div>
    </div>
  );
}

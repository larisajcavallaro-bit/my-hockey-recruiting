"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getPageHelpTip } from "@/constants/page-help-tips";

const STORAGE_KEY = "mhr_page_help_seen";
const MIN_TIME_ON_PAGE_MS = 30_000; // 30 seconds

export default function PageHelpTip() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const tip = pathname ? getPageHelpTip(pathname) : null;

  // Track time on page and show "New? Click ? for tips" prompt for first 30 sec
  useEffect(() => {
    if (!pathname || !tip) return;

    const seen = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY);
    const seenPaths = seen ? (JSON.parse(seen) as string[]) : [];

    // Already "graduated" from this page
    if (seenPaths.includes(pathname)) {
      setShowPrompt(false);
      return;
    }

    // Show prompt briefly for new pages
    setShowPrompt(true);
    const timer = setTimeout(() => {
      setShowPrompt(false);
      // Mark as seen after 30 seconds
      const next = [...new Set([...seenPaths, pathname])];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }, MIN_TIME_ON_PAGE_MS);

    return () => clearTimeout(timer);
  }, [pathname, tip]);

  if (!tip) return null;

  return (
    <div className="fixed top-24 right-6 z-40 flex flex-col items-end gap-2">
      {showPrompt && (
        <div className="animate-in fade-in slide-in-from-right-2 rounded-lg bg-orange-500/90 px-3 py-2 text-xs font-medium text-white shadow-lg">
          New here? Click the ? for tips
        </div>
      )}

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-2 border-orange-500/50 bg-slate-800/90 text-orange-400 shadow-lg backdrop-blur hover:bg-slate-700/90 hover:text-orange-300"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="bottom"
          sideOffset={8}
          className="max-w-xs rounded-xl border-slate-600 bg-slate-800 p-4 text-white shadow-xl"
        >
          <h3 className="font-semibold text-orange-400">{tip.title}</h3>
          <p className="mt-2 text-sm text-slate-200">{tip.body}</p>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

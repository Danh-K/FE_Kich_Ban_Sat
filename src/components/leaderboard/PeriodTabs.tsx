"use client";

import { cn } from "@/lib/utils";
import type { LeaderboardPeriod } from "@/lib/types";

const TABS: { key: LeaderboardPeriod; label: string }[] = [
  { key: "week", label: "Tuần này" },
  { key: "month", label: "Tháng này" },
  { key: "all", label: "Mọi thời điểm" },
];

interface PeriodTabsProps {
  active: LeaderboardPeriod;
  onChange: (period: LeaderboardPeriod) => void;
}

export function PeriodTabs({ active, onChange }: PeriodTabsProps) {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/[0.02] p-1">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm transition-colors",
            active === tab.key
              ? "bg-[#8B0000] text-white"
              : "text-white/60 hover:text-white/90"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: { value: string; positive: boolean };
}

export function StatCard({ icon: Icon, label, value, trend }: StatCardProps) {
  return (
    <div className="rounded-xl border border-red-900/15 bg-noir-850 p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-900/20">
        <Icon size={17} className="text-red-500" />
      </div>
      <p className="mt-4 font-mono text-[11px] uppercase tracking-wide text-white/45">
        {label}
      </p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-[26px] font-bold text-white">{value}</span>
        {trend && (
          <span
            className={cn(
              "font-mono text-xs",
              trend.positive ? "text-green-400" : "text-red-400"
            )}
          >
            {trend.positive ? "▲" : "▼"} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}

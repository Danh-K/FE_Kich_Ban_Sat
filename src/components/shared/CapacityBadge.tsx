import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface CapacityBadgeProps {
  booked: number;
  total: number;
  className?: string;
}

export function CapacityBadge({ booked, total, className }: CapacityBadgeProps) {
  const pct = total > 0 ? booked / total : 0;
  const isFull = booked >= total;
  const isAlmostFull = !isFull && pct >= 0.7;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[11px] font-semibold",
        isFull
          ? "border-red-600 bg-[#8B0000]/20 text-red-500"
          : isAlmostFull
            ? "border-amber-600/40 text-amber-400"
            : "border-white/20 text-white/70",
        className
      )}
    >
      <Users size={12} />
      {booked} / {total} người
    </span>
  );
}

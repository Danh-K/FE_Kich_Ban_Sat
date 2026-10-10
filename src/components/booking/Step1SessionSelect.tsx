import { Clock } from "lucide-react";
import type { SessionWithCapacity } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";
import { CapacityBadge } from "@/components/shared/CapacityBadge";

interface Step1SessionSelectProps {
  sessions: SessionWithCapacity[];
  onSelect: (sessionId: string) => void;
}

export function Step1SessionSelect({ sessions, onSelect }: Step1SessionSelectProps) {
  if (sessions.length === 0) {
    return (
      <p className="text-sm text-white/50">
        Chưa có buổi chơi nào được mở cho kịch bản này.
      </p>
    );
  }

  return (
    <div>
      <h2 className="font-display text-xl font-black uppercase tracking-tight text-[#f5f0f0]">
        Chọn buổi chơi
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sessions.map((session) => {
          const isFull = session.bookedSlots >= session.maxPlayers;
          const canBook = !isFull && (session.status === "OPEN" || session.status === "CONFIRMED");
          return (
            <button
              key={session.id}
              type="button"
              disabled={!canBook}
              onClick={() => onSelect(session.id)}
              className={cn(
                "rounded-xl border p-5 text-left transition-all",
                !canBook
                  ? "cursor-not-allowed border-white/10 bg-noir-850/50 opacity-50"
                  : "border-red-900/15 bg-noir-850 hover:border-red-600/50 hover:shadow-[0_0_20px_rgba(139,0,0,0.2)]"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-[#f5f0f0]">
                    <Clock size={14} className="text-white/50" />
                    {formatDateTime(session.startTime)}
                  </p>
                </div>
                <CapacityBadge booked={session.bookedSlots} total={session.maxPlayers} />
              </div>
              {isFull && (
                <p className="mt-3 font-mono text-[11px] font-bold uppercase tracking-wide text-red-500">
                  Đã hết chỗ
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

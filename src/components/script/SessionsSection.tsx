"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import type { Script, SessionStatus, SessionWithCapacity } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";
import { CapacityBadge } from "@/components/shared/CapacityBadge";
import { useSessionUpdates } from "@/lib/use-session-updates";

const STATUS_STYLES: Record<SessionStatus, { label: string; className: string }> = {
  OPEN: { label: "ĐANG MỞ", className: "bg-green-900/40 text-green-300" },
  CONFIRMED: { label: "ĐÃ XÁC NHẬN", className: "bg-green-700 text-white" },
  CANCELLED: { label: "ĐÃ HUỶ", className: "bg-white/5 text-red-400/60" },
  COMPLETED: { label: "ĐÃ HOÀN THÀNH", className: "bg-white/10 text-white/50" },
};

function SessionCard({ script, session }: { script: Script; session: SessionWithCapacity }) {
  const isFull = session.bookedSlots >= session.maxPlayers;
  const status = STATUS_STYLES[session.status];
  const canBook = !isFull && (session.status === "OPEN" || session.status === "CONFIRMED");

  return (
    <div
      className={cn(
        "relative rounded-xl border border-red-900/15 bg-noir-850 p-5 transition-opacity",
        isFull && "opacity-60"
      )}
    >
      <CapacityBadge
        booked={session.bookedSlots}
        total={session.maxPlayers}
        className="absolute right-3 top-3"
      />

      <span
        className={cn(
          "inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
          status.className
        )}
      >
        {status.label}
      </span>

      <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#f5f0f0]">
        <Clock size={14} className="text-white/50" />
        {formatDateTime(session.startTime)}
      </p>

      <div className="mt-4">
        {isFull ? (
          <button
            disabled
            className="w-full cursor-not-allowed rounded-full border border-white/10 bg-white/5 py-2.5 text-xs font-bold uppercase tracking-wide text-white/40"
          >
            Hết chỗ
          </button>
        ) : canBook ? (
          <Link
            href={`/dat-lich/${script.slug}?session=${session.id}`}
            className="block w-full rounded-full bg-[#8B0000] py-2.5 text-center text-xs font-bold uppercase tracking-wide text-[#f5f0f0] transition-all hover:bg-red-600 hover:shadow-[0_0_16px_rgba(220,38,38,0.4)]"
          >
            Đặt lịch
          </Link>
        ) : (
          <button
            disabled
            className="w-full cursor-not-allowed rounded-full border border-white/10 bg-white/5 py-2.5 text-xs font-bold uppercase tracking-wide text-white/40"
          >
            {session.status === "CANCELLED" ? "Đã huỷ" : "Đã hoàn thành"}
          </button>
        )}
      </div>
    </div>
  );
}

export function SessionsSection({
  script,
  sessions: initialSessions,
}: {
  script: Script;
  sessions: SessionWithCapacity[];
}) {
  const sessions = useSessionUpdates(script, initialSessions);

  return (
    <section id="sessions" className="scroll-mt-24 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-red-600">
          LỊCH TRÌNH
        </p>
        <h2 className="mt-3 font-display text-2xl font-black uppercase tracking-tight text-[#f5f0f0] md:text-3xl">
          Buổi chơi sắp tới
        </h2>

        {sessions.length === 0 ? (
          <p className="mt-8 text-sm text-white/40">
            Chưa có lịch chơi nào được mở cho kịch bản này.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <SessionCard key={session.id} script={script} session={session} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

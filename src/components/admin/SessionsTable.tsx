"use client";

import { Ban, Eye } from "lucide-react";
import type { AdminSessionSummary } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";

interface SessionsTableProps {
  sessions: AdminSessionSummary[];
  page: number;
  totalPages: number;
  totalElements: number;
  onSelect: (sessionId: string) => void;
  onCancel: (sessionId: string) => void;
  onPageChange: (page: number) => void;
}

export function SessionsTable({
  sessions,
  page,
  totalPages,
  totalElements,
  onSelect,
  onCancel,
  onPageChange,
}: SessionsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-red-900/15">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead className="sticky top-0 bg-noir-800 text-[11px] uppercase tracking-wide text-white/60">
            <tr>
              <th className="px-4 py-3 font-medium">Kịch bản</th>
              <th className="px-4 py-3 font-medium">Giờ chiếu</th>
              <th className="px-4 py-3 font-medium">DM phụ trách</th>
              <th className="px-4 py-3 font-medium">Slot</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, i) => {
              const pct = session.totalSlots > 0 ? Math.round((session.bookedSlots / session.totalSlots) * 100) : 0;
              const canCancel = session.status === "OPEN" || session.status === "CONFIRMED";
              return (
                <tr
                  key={session.id}
                  onClick={() => onSelect(session.id)}
                  className={`cursor-pointer border-t border-white/5 transition-colors hover:bg-red-950/20 ${
                    i % 2 === 1 ? "bg-white/[0.02]" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-md bg-gradient-to-br from-noir-700 to-noir-950" />
                      <span className="font-medium text-white/90">
                        {session.scriptTitle}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-white/60">
                    {formatDateTime(session.startTime)}
                  </td>
                  <td className="px-4 py-3 text-white/60">{session.dmName ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-red-600"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-white/50">
                        {session.bookedSlots}/{session.totalSlots}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={session.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-white/40">
                      <button
                        aria-label="Xem"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(session.id);
                        }}
                        className="hover:text-red-500"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        aria-label="Huỷ"
                        disabled={!canCancel}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Huỷ buổi chơi này?")) onCancel(session.id);
                        }}
                        className="hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Ban size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {sessions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-white/40">
                  Chưa có buổi chơi nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-white/5 bg-noir-900 px-4 py-3">
        <span className="font-mono text-xs text-white/40">
          Trang {totalPages === 0 ? 0 : page + 1} / {totalPages} · {totalElements} buổi chơi
        </span>
        <div className="flex items-center gap-1 font-mono text-xs">
          <button
            onClick={() => onPageChange(Math.max(0, page - 1))}
            disabled={page === 0}
            className="rounded px-2 py-1 text-white/40 hover:text-white disabled:opacity-30"
          >
            ‹
          </button>
          <button className="rounded bg-red-700 px-2.5 py-1 text-white">{page + 1}</button>
          <button
            onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
            disabled={page + 1 >= totalPages}
            className="rounded px-2 py-1 text-white/40 hover:text-white disabled:opacity-30"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

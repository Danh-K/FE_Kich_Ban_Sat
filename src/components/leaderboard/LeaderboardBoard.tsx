"use client";

import { useEffect, useState } from "react";
import type { LeaderboardEntry, LeaderboardPeriod } from "@/lib/types";
import { api, ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { PeriodTabs } from "./PeriodTabs";
import { Podium } from "./Podium";
import { LeaderboardList } from "./LeaderboardList";

export function LeaderboardBoard() {
  const { token } = useAuth();
  const [period, setPeriod] = useState<LeaderboardPeriod>("week");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Dat lai loading/error khi doi period - dong bo voi request moi sap goi, khong the derive-during-render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    api
      .get<LeaderboardEntry[]>(`/api/leaderboard?period=${period}`, token)
      .then((data) => {
        if (!cancelled) setEntries(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Không tải được bảng xếp hạng");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [period, token]);

  const currentUser = entries.find((e) => e.isCurrentUser);
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3).filter((e) => !e.isCurrentUser);

  return (
    <div>
      <div className="mb-10 flex justify-center md:justify-start">
        <PeriodTabs active={period} onChange={setPeriod} />
      </div>

      {loading && <p className="text-center text-sm text-white/40">Đang tải...</p>}
      {error && <p className="text-center text-sm text-red-400">{error}</p>}
      {!loading && !error && entries.length === 0 && (
        <p className="text-center text-sm text-white/40">Chưa có dữ liệu xếp hạng cho khoảng thời gian này.</p>
      )}
      {!loading && !error && entries.length > 0 && (
        <>
          <Podium users={top3} />
          <LeaderboardList rest={rest} currentUser={currentUser} />
        </>
      )}
    </div>
  );
}

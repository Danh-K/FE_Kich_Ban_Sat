"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Percent, Timer, Users } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { PlayersChart } from "@/components/admin/PlayersChart";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import type { AdminStats, PlayerCountPoint } from "@/lib/types";

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [players, setPlayers] = useState<PlayerCountPoint[]>([]);

  useEffect(() => {
    api.get<AdminStats>("/api/admin/stats/summary", token).then(setStats);
    api.get<PlayerCountPoint[]>("/api/admin/players?days=7", token).then(setPlayers);
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">
          Tổng quan
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Theo dõi buổi chơi, đặt lịch và số người chơi theo thời gian thực.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Người chơi hôm nay"
          value={stats ? String(stats.todayPlayers) : "—"}
        />
        <StatCard
          icon={CalendarClock}
          label="Buổi chơi đang mở"
          value={stats ? String(stats.openSessionsCount) : "—"}
        />
        <StatCard
          icon={Timer}
          label="Đặt lịch chờ xử lý"
          value={stats ? String(stats.pendingBookingsCount) : "—"}
        />
        <StatCard
          icon={Percent}
          label="Tỷ lệ đủ người chơi"
          value={stats ? `${Math.round(stats.fillRatePercent)}%` : "—"}
        />
      </div>

      <PlayersChart data={players} />
    </div>
  );
}

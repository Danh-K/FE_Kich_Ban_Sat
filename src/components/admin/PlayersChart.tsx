"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PlayerCountPoint } from "@/lib/types";

const WEEKDAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export function PlayersChart({ data }: { data: PlayerCountPoint[] }) {
  const chartData = data.map((point) => ({
    ...point,
    day: WEEKDAY_LABELS[new Date(point.date).getDay()],
  }));

  return (
    <div className="rounded-xl border border-red-900/15 bg-noir-850 p-5">
      <p className="font-mono text-[11px] uppercase tracking-wide text-white/45">
        Số người chơi {data.length} ngày qua
      </p>
      <div className="mt-4 h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ left: 0, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="playersFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DC2626" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#DC2626" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="rgba(255,255,255,0.3)"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              allowDecimals={false}
              width={32}
            />
            <Tooltip
              contentStyle={{
                background: "#150a0a",
                border: "1px solid rgba(220,38,38,0.3)",
                borderLeft: "3px solid #DC2626",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "rgba(255,255,255,0.6)" }}
              formatter={(value) => [`${value} người`, "Người chơi"]}
            />
            <Area
              type="monotone"
              dataKey="playerCount"
              stroke="#DC2626"
              strokeWidth={2}
              fill="url(#playersFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

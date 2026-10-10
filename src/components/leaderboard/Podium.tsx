import { cn } from "@/lib/utils";
import type { LeaderboardEntry } from "@/lib/types";
import { AvatarInitial } from "./AvatarInitial";

const MEDAL_COLORS: Record<number, string> = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32",
};

interface PodiumProps {
  users: LeaderboardEntry[];
}

export function Podium({ users }: PodiumProps) {
  const [first, second, third] = users;
  if (!first || !second || !third) return null;

  return (
    <div className="grid grid-cols-3 items-end gap-4">
      <PodiumCard user={second} place={2} />
      <PodiumCard user={first} place={1} elevated />
      <PodiumCard user={third} place={3} />
    </div>
  );
}

function PodiumCard({
  user,
  place,
  elevated,
}: {
  user: LeaderboardEntry;
  place: number;
  elevated?: boolean;
}) {
  const medal = MEDAL_COLORS[place];

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border bg-noir-900/60 px-4 text-center shadow-[0_0_24px_rgba(0,0,0,0.3)]",
        elevated ? "-translate-y-4 border-2 py-8" : "py-6"
      )}
      style={{ borderColor: elevated ? medal : `${medal}66` }}
    >
      <div className="relative">
        <AvatarInitial name={user.name} seed={place} size={elevated ? "lg" : "md"} />
        <span
          className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-noir-950"
          style={{ backgroundColor: medal }}
        >
          {place}
        </span>
      </div>
      <p className="font-display text-base font-semibold leading-tight text-white">
        {user.name}
      </p>
      <p className="font-mono text-lg font-bold" style={{ color: medal }}>
        {user.score.toLocaleString("vi-VN")}
      </p>
      <p className="text-[11px] text-white/40">điểm</p>
    </div>
  );
}

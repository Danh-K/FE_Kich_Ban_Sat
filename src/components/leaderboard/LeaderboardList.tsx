import { cn } from "@/lib/utils";
import type { LeaderboardEntry } from "@/lib/types";
import { AvatarInitial } from "./AvatarInitial";

interface LeaderboardListProps {
  rest: LeaderboardEntry[];
  currentUser?: LeaderboardEntry;
}

export function LeaderboardList({ rest, currentUser }: LeaderboardListProps) {
  return (
    <div className="mt-8 flex flex-col gap-2">
      {rest.map((user) => (
        <LeaderboardRow key={user.userId} user={user} />
      ))}

      {currentUser && (
        <div className="mt-2 border-t border-white/10 pt-4">
          <LeaderboardRow user={currentUser} highlight />
        </div>
      )}
    </div>
  );
}

function LeaderboardRow({
  user,
  highlight,
}: {
  user: LeaderboardEntry;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3",
        highlight && "border-red-900/40 bg-red-950/10"
      )}
    >
      <span className="w-8 shrink-0 font-mono text-sm text-white/40">
        #{user.rank}
      </span>
      <AvatarInitial name={user.name} seed={user.rank} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white/90">
          {user.name}
          {highlight && (
            <span className="ml-2 rounded-full bg-red-900/40 px-2 py-0.5 font-mono text-[10px] text-red-300">
              Bạn
            </span>
          )}
        </p>
        <p className="truncate text-[11px] text-white/40">
          {user.casesSolved} vụ án đã phá
          {user.hardestScriptTitle && <> · Kịch bản khó nhất: {user.hardestScriptTitle}</>}
        </p>
      </div>
      <span className="font-mono text-sm font-semibold text-white">
        {user.score.toLocaleString("vi-VN")}
      </span>
    </div>
  );
}

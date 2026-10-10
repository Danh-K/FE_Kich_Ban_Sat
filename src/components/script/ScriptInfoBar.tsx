import { Clock, Users } from "lucide-react";
import type { Script } from "@/lib/types";
import { formatVnd } from "@/lib/utils";
import { DifficultyStars } from "@/components/shared/DifficultyStars";

export function ScriptInfoBar({ script }: { script: Script }) {
  return (
    <div className="sticky top-[72px] z-30 border-b border-red-900/20 bg-noir-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-6 py-4 text-sm text-white/70 sm:gap-6">
        <DifficultyStars level={script.difficultyStar} variant="compact" />

        <span className="flex items-center gap-2 border-l border-red-900/20 pl-4 sm:pl-6">
          <Users size={16} className="text-white/50" />
          {script.playerCount} người
        </span>

        <span className="flex items-center gap-2 border-l border-red-900/20 pl-4 sm:pl-6">
          <Clock size={16} className="text-white/50" />
          {script.durationText}
        </span>

        <span className="border-l border-red-900/20 pl-4 font-bold text-red-500 sm:pl-6">
          {formatVnd(script.basePrice)}
        </span>
      </div>
    </div>
  );
}

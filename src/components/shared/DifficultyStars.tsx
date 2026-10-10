import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const LEVEL_LABEL: Record<number, string> = {
  1: "Rất dễ — nhẹ nhàng thư giãn",
  2: "Dễ — phù hợp người mới",
  3: "Trung bình",
  4: "Khó",
  5: "Rất khó — dành cho người có kinh nghiệm",
};

interface DifficultyStarsProps {
  level: number;
  variant?: "compact" | "full";
  className?: string;
}

export function DifficultyStars({
  level,
  variant = "compact",
  className,
}: DifficultyStarsProps) {
  const clamped = Math.min(5, Math.max(1, Math.round(level)));
  const label = LEVEL_LABEL[clamped];
  const starSize = variant === "full" ? 18 : 12;

  const starsRow = (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={starSize}
          className={i < level ? "fill-red-600 text-red-600" : "text-white/15"}
        />
      ))}
    </div>
  );

  if (variant === "full") {
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {starsRow}
        <p className="text-[11px] text-white/50">{label}</p>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {starsRow}
      <span className="text-white/30">·</span>
      <p className="text-[11px] text-white/50">{label}</p>
    </div>
  );
}

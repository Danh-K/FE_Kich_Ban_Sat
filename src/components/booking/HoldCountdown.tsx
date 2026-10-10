import { formatCountdown } from "./countdown";

interface HoldCountdownProps {
  secondsLeft: number | null;
  className?: string;
}

export function HoldCountdown({ secondsLeft, className }: HoldCountdownProps) {
  return (
    <div className={className}>
      <p className="text-center font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
        Thời gian giữ chỗ còn lại
      </p>
      <p className="mt-1 text-center font-mono text-5xl font-black tabular-nums text-red-500 sm:text-6xl">
        {formatCountdown(secondsLeft ?? 0)}
      </p>
    </div>
  );
}

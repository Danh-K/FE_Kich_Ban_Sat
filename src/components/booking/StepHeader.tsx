import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS: { n: 1 | 2 | 3 | 4; label: string }[] = [
  { n: 1, label: "Chọn buổi chơi" },
  { n: 2, label: "Số lượng vé" },
  { n: 3, label: "Xác nhận" },
  { n: 4, label: "Thanh toán" },
];

export function StepHeader({ step }: { step: 1 | 2 | 3 | 4 }) {
  return (
    <div className="mb-10 flex items-center">
      {STEPS.map((s, i) => (
        <div key={s.n} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold",
                step === s.n
                  ? "border-red-600 bg-[#8B0000] text-white"
                  : step > s.n
                    ? "border-red-600/50 bg-red-900/20 text-red-400"
                    : "border-white/15 text-white/40"
              )}
            >
              {step > s.n ? <Check size={14} /> : s.n}
            </div>
            <span
              className={cn(
                "hidden whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide sm:block",
                step >= s.n ? "text-white/70" : "text-white/30"
              )}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                "mx-2 h-px flex-1",
                step > s.n ? "bg-red-600/50" : "bg-white/10"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

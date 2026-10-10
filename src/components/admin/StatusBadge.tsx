import { cn } from "@/lib/utils";
import type { SessionStatus } from "@/lib/types";

const STATUS_STYLES: Record<SessionStatus, string> = {
  OPEN: "border border-green-700 text-green-400 bg-transparent",
  CONFIRMED: "bg-green-900/30 text-green-300",
  CANCELLED: "bg-red-900/30 text-red-400",
  COMPLETED: "bg-white/10 text-white/50",
};

const STATUS_LABEL: Record<SessionStatus, string> = {
  OPEN: "Đang mở",
  CONFIRMED: "Đã xác nhận",
  CANCELLED: "Đã huỷ",
  COMPLETED: "Hoàn thành",
};

export function StatusBadge({ status }: { status: SessionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        STATUS_STYLES[status]
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

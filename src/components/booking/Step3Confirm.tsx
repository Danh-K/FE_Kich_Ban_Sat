import { ArrowLeft, Ticket, Users } from "lucide-react";
import type { BookingResponse, Script, SessionWithCapacity } from "@/lib/types";
import { formatDateTime, formatVnd } from "@/lib/utils";
import { HoldCountdown } from "./HoldCountdown";

interface Step3ConfirmProps {
  script: Script;
  session: SessionWithCapacity;
  booking: BookingResponse;
  secondsLeft: number | null;
  onContinue: () => void;
  onBack: () => void;
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 py-3 last:border-b-0">
      <span className="flex items-center gap-2 text-sm text-white/50">
        {icon}
        {label}
      </span>
      <span className="text-right text-sm font-semibold text-[#f5f0f0]">{value}</span>
    </div>
  );
}

export function Step3Confirm({
  script,
  session,
  booking,
  secondsLeft,
  onContinue,
  onBack,
}: Step3ConfirmProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-red-500"
      >
        <ArrowLeft size={14} />
        Đổi số lượng
      </button>

      <h2 className="mt-4 font-display text-xl font-black uppercase tracking-tight text-[#f5f0f0]">
        Xác nhận đặt lịch
      </h2>

      <HoldCountdown secondsLeft={secondsLeft} className="mt-6" />

      <div className="mx-auto mt-8 max-w-lg rounded-xl border border-red-900/15 bg-noir-850 p-6">
        <p className="font-display text-lg font-bold text-[#f5f0f0]">{script.title}</p>

        <div className="mt-3">
          <SummaryRow
            icon={<Ticket size={14} />}
            label="Buổi chơi"
            value={formatDateTime(session.startTime)}
          />
          <SummaryRow
            icon={<Users size={14} />}
            label="Số lượng vé"
            value={`${booking.sessionSlotIds.length} người`}
          />
          {booking.discountAmount > 0 && (
            <SummaryRow icon={<Ticket size={14} />} label="Đã giảm" value={formatVnd(booking.discountAmount)} />
          )}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-white/40">
          Nhân vật sẽ được chọn trực tiếp tại quán sau khi đặt cọc thành công — admin sẽ liên hệ với bạn để xác nhận.
        </p>

        <div className="mt-4 flex items-center justify-between rounded-lg bg-[#8B0000]/15 px-4 py-3">
          <span className="text-sm font-semibold text-white/70">Tổng tiền</span>
          <span className="font-mono text-xl font-black text-red-500">
            {formatVnd(booking.totalAmount)}
          </span>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={onContinue}
          className="rounded-full bg-[#8B0000] px-10 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-red-600 hover:shadow-[0_0_24px_rgba(220,38,38,0.5)]"
        >
          Tiếp tục thanh toán
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { formatVnd } from "@/lib/utils";
import { api, ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import type { Booking } from "@/lib/types";
import { HoldCountdown } from "./HoldCountdown";

const WALLET_BADGES = ["VNPAY", "MOMO", "ZALOPAY"];
const POLL_ATTEMPTS = 10;
const POLL_INTERVAL_MS = 1200;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface Step4PaymentProps {
  bookingId: string;
  amount: number;
  secondsLeft: number | null;
}

export function Step4Payment({ bookingId, amount, secondsLeft }: Step4PaymentProps) {
  const { token } = useAuth();
  const [status, setStatus] = useState<"idle" | "processing" | "paid" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleConfirmPayment() {
    setStatus("processing");
    setError(null);
    try {
      // Chua tich hop cong thanh toan that: mo phong webhook cong goi ve (giong cach OTP mo phong qua Mailpit).
      await api.post("/api/payments/webhook", {
        transactionId: `SIM-${bookingId}-${Date.now()}`,
        bookingId,
        amount,
      });

      for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt++) {
        const booking = await api.get<Booking>(`/api/bookings/${bookingId}`, token);
        if (booking.status === "PAID") {
          setStatus("paid");
          return;
        }
        await sleep(POLL_INTERVAL_MS);
      }
      setError("Chưa nhận được xác nhận thanh toán, vui lòng thử lại.");
      setStatus("error");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Xác nhận thanh toán thất bại");
      setStatus("error");
    }
  }

  if (status === "paid") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-6 text-center">
        <CheckCircle2 size={48} className="text-green-500" />
        <h2 className="font-display text-2xl font-black uppercase tracking-tight text-[#f5f0f0]">
          Thanh toán thành công
        </h2>
        <p className="text-sm text-white/60">
          Mã đặt chỗ của bạn: <span className="font-mono text-white/80">{bookingId}</span>
        </p>
        <Link
          href="/tai-khoan"
          className="mt-4 rounded-full bg-[#8B0000] px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-red-600"
        >
          Xem lịch sử đặt chỗ
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 py-6">
      <HoldCountdown secondsLeft={secondsLeft} />

      <div className="relative w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-[0_0_60px_rgba(139,0,0,0.25)]">
        {/* Red corner accents */}
        <div className="pointer-events-none absolute left-0 top-0 h-8 w-8 rounded-tl-xl border-l-4 border-t-4 border-red-600" />
        <div className="pointer-events-none absolute right-0 top-0 h-8 w-8 rounded-tr-xl border-r-4 border-t-4 border-red-600" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-8 w-8 rounded-bl-xl border-b-4 border-l-4 border-red-600" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 rounded-br-xl border-b-4 border-r-4 border-red-600" />

        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-black/40">
          Số tiền cần thanh toán
        </p>
        <p className="mt-1 font-mono text-3xl font-black text-black">{formatVnd(amount)}</p>

        <div className="mt-5 flex justify-center">
          <div
            className="h-52 w-52 rounded-md border-2 border-black/10"
            style={{
              backgroundImage:
                "repeating-conic-gradient(#111111 0% 25%, #ffffff 0% 50%)",
              backgroundSize: "18px 18px",
            }}
            aria-label="Mã QR thanh toán (giả lập)"
            role="img"
          />
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          {WALLET_BADGES.map((name) => (
            <span
              key={name}
              className="rounded-md border border-black/10 bg-black/5 px-3 py-1.5 font-mono text-[11px] font-bold tracking-wide text-black/70"
            >
              {name}
            </span>
          ))}
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-black/40">
          Chưa tích hợp cổng thanh toán thật — bấm nút bên dưới để mô phỏng cổng thanh toán xác nhận thành công.
        </p>

        <button
          type="button"
          onClick={handleConfirmPayment}
          disabled={status === "processing"}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#8B0000] py-3 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "processing" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Đang xác nhận...
            </>
          ) : (
            "Xác nhận đã thanh toán (demo)"
          )}
        </button>

        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
      </div>
    </div>
  );
}

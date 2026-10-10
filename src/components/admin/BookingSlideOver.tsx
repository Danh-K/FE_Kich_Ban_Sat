"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import type { AdminBookingDetail } from "@/lib/types";
import { api, ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { formatDateTime, formatVnd } from "@/lib/utils";

interface BookingSlideOverProps {
  sessionId: string | null;
  onClose: () => void;
  onSessionCompleted: () => void;
}

const TIMELINE_LABEL: Record<string, string> = {
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  REFUNDED: "Đã hoàn tiền",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  CANCELLED: "Đã huỷ",
  REFUNDED: "Đã hoàn tiền",
};

function BookingCard({ booking, onRefund }: { booking: AdminBookingDetail; onRefund: (id: string) => void }) {
  return (
    <div className="mt-4 rounded-lg border border-white/10 p-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-white/50">#{booking.id.slice(0, 8)}</p>
        <span className="rounded-full bg-green-900/30 px-2.5 py-1 text-[11px] font-semibold text-green-300">
          {STATUS_LABEL[booking.status] ?? booking.status}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-900/30 font-mono text-sm font-bold text-red-400">
          {booking.player.name.slice(0, 1)}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{booking.player.name}</p>
          <p className="font-mono text-xs text-white/40">
            {booking.player.phone} · {booking.player.email}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-white/60">{booking.quantity} người</p>

      {booking.payment && (
        <div className="mt-3 space-y-1.5 rounded-md border border-white/5 bg-white/[0.02] p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-white/50">Số tiền</span>
            <span className="font-semibold text-white">{formatVnd(booking.payment.amount)}</span>
          </div>
          {booking.payment.transactionId && (
            <div className="flex justify-between">
              <span className="text-white/50">Mã giao dịch</span>
              <span className="font-mono text-xs text-white/70">{booking.payment.transactionId}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-white/50">Cổng thanh toán</span>
            <span className="text-white/70">{booking.payment.gateway}</span>
          </div>
        </div>
      )}

      <ol className="mt-3 space-y-3 border-l border-red-900/30 pl-4">
        {booking.timeline.map((entry) => (
          <li key={entry.label} className="relative">
            <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-red-600" />
            <p className="text-sm text-white/80">{TIMELINE_LABEL[entry.label] ?? entry.label}</p>
            <p className="font-mono text-[11px] text-white/35">{formatDateTime(entry.timestamp)}</p>
          </li>
        ))}
      </ol>

      {booking.status === "PAID" && (
        <button
          onClick={() => onRefund(booking.id)}
          className="mt-4 w-full rounded-md border border-red-700/60 py-2 text-sm font-semibold text-red-400 hover:bg-red-950/30"
        >
          Xác nhận hoàn tiền
        </button>
      )}
    </div>
  );
}

export function BookingSlideOver({ sessionId, onClose, onSessionCompleted }: BookingSlideOverProps) {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<AdminBookingDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    // Dat lai loading/error khi doi sessionId - dong bo voi request moi sap goi.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    api
      .get<AdminBookingDetail[]>(`/api/admin/sessions/${sessionId}/bookings`, token)
      .then(setBookings)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Không tải được dữ liệu booking"))
      .finally(() => setLoading(false));
  }, [sessionId, token]);

  if (!sessionId) return null;

  async function handleRefund(bookingId: string) {
    setActionLoading(true);
    try {
      await api.post(`/api/admin/bookings/${bookingId}/refund`, undefined, token);
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "REFUNDED" } : b)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Hoàn tiền thất bại");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleComplete() {
    if (!sessionId) return;
    setActionLoading(true);
    try {
      await api.post(`/api/admin/sessions/${sessionId}/complete`, undefined, token);
      onSessionCompleted();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không đánh dấu hoàn thành được");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-[420px] flex-col overflow-y-auto border-l border-red-900/20 bg-noir-900 p-6">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-bold text-white">Booking của buổi chơi</p>
          <button onClick={onClose} aria-label="Đóng" className="text-white/50 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {loading && (
          <div className="mt-8 flex justify-center">
            <Loader2 className="animate-spin text-red-500" size={24} />
          </div>
        )}
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        {!loading && !error && bookings.length === 0 && (
          <p className="mt-8 text-center text-sm text-white/40">Chưa có ai đặt buổi chơi này.</p>
        )}

        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} onRefund={handleRefund} />
        ))}

        <div className="mt-auto pt-8">
          <button
            onClick={handleComplete}
            disabled={actionLoading}
            className="w-full rounded-md bg-red-800 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            Đánh dấu buổi chơi hoàn thành
          </button>
        </div>
      </aside>
    </div>
  );
}

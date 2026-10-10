"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Lock, Minus, Plus, Ticket } from "lucide-react";
import type { SessionWithCapacity, VoucherPreview } from "@/lib/types";
import { api, ApiError } from "@/lib/api-client";
import { cn, formatVnd } from "@/lib/utils";
import { formatCountdown } from "./countdown";

interface Step2QuantitySelectProps {
  session: SessionWithCapacity;
  basePrice: number;
  heldQuantity: number | null;
  secondsLeft: number | null;
  isHolding: boolean;
  holdError: string | null;
  isAuthenticated: boolean;
  onHold: (quantity: number, voucherCode: string | null) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function Step2QuantitySelect({
  session,
  basePrice,
  heldQuantity,
  secondsLeft,
  isHolding,
  holdError,
  isAuthenticated,
  onHold,
  onContinue,
  onBack,
}: Step2QuantitySelectProps) {
  const remaining = Math.max(0, session.maxPlayers - session.bookedSlots);
  const [quantity, setQuantity] = useState(1);
  const [voucherCode, setVoucherCode] = useState("");
  const [preview, setPreview] = useState<VoucherPreview | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const isHeld = heldQuantity !== null;

  async function handlePreviewVoucher() {
    if (!voucherCode.trim()) return;
    setPreviewLoading(true);
    setPreviewError(null);
    setPreview(null);
    try {
      const result = await api.get<VoucherPreview>(
        `/api/vouchers/preview?code=${encodeURIComponent(voucherCode.trim())}&orderAmount=${basePrice * quantity}`
      );
      setPreview(result);
    } catch (err) {
      setPreviewError(err instanceof ApiError ? err.message : "Không kiểm tra được mã giảm giá");
    } finally {
      setPreviewLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-red-500"
      >
        <ArrowLeft size={14} />
        Đổi buổi chơi
      </button>

      <h2 className="mt-4 font-display text-xl font-black uppercase tracking-tight text-[#f5f0f0]">
        Chọn số lượng vé
      </h2>
      <p className="mt-1 text-sm text-white/50">
        Chọn số người trong nhóm của bạn — nhân vật sẽ được chọn trực tiếp tại quán sau khi đặt cọc thành công.
      </p>

      <div className="mx-auto mt-8 max-w-sm rounded-xl border border-red-900/15 bg-noir-850 p-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-wide text-white/40">
          Còn trống {remaining} / {session.maxPlayers} chỗ
        </p>

        <div className="mt-4 flex items-center justify-center gap-6">
          <button
            type="button"
            disabled={isHeld || quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-red-600/50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Minus size={16} />
          </button>
          <span className="font-mono text-4xl font-black tabular-nums text-[#f5f0f0]">
            {quantity}
          </span>
          <button
            type="button"
            disabled={isHeld || quantity >= remaining}
            onClick={() => setQuantity((q) => Math.min(remaining, q + 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-red-600/50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Plus size={16} />
          </button>
        </div>

        <p className="mt-3 text-sm text-white/60">{formatVnd(basePrice * quantity)}</p>

        {!isHeld && (
          <div className="mt-5 border-t border-white/5 pt-5">
            <div className="flex items-center gap-2">
              <input
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="Mã giảm giá (nếu có)"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#DC2626]"
              />
              <button
                type="button"
                onClick={handlePreviewVoucher}
                disabled={previewLoading || !voucherCode.trim()}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-red-900/30 px-3 py-2 text-xs font-semibold text-white/70 hover:border-red-600/50 disabled:opacity-40"
              >
                {previewLoading ? <Loader2 size={14} className="animate-spin" /> : <Ticket size={14} />}
                Kiểm tra
              </button>
            </div>
            {previewError && <p className="mt-2 text-xs text-red-400">{previewError}</p>}
            {preview && (
              <p className="mt-2 text-xs text-green-300">
                Giảm {formatVnd(preview.discountAmount)} — còn lại {formatVnd(preview.finalAmount)}
              </p>
            )}
          </div>
        )}

        <div className="mt-6">
          {isHeld ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#8B0000] px-3 py-1.5 font-mono text-[11px] font-bold text-white">
              <Lock size={11} />
              Đang giữ {heldQuantity} chỗ · {formatCountdown(secondsLeft ?? 0)}
            </span>
          ) : !isAuthenticated ? (
            <p className="text-xs text-white/50">
              Vui lòng{" "}
              <Link href="/dang-nhap" className="font-semibold text-red-500 hover:text-red-400">
                đăng nhập
              </Link>{" "}
              để giữ chỗ.
            </p>
          ) : (
            <button
              type="button"
              disabled={remaining === 0 || isHolding}
              onClick={() => onHold(quantity, voucherCode.trim() || null)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold uppercase tracking-wide transition-all",
                remaining > 0
                  ? "bg-[#8B0000] text-white hover:bg-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                  : "cursor-not-allowed bg-white/5 text-white/30"
              )}
            >
              {isHolding && <Loader2 size={14} className="animate-spin" />}
              Giữ chỗ
            </button>
          )}
        </div>
        {holdError && <p className="mt-3 text-xs text-red-400">{holdError}</p>}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          disabled={!isHeld}
          onClick={onContinue}
          className={cn(
            "rounded-full px-8 py-3 text-sm font-bold uppercase tracking-wide transition-all",
            isHeld
              ? "bg-[#8B0000] text-white hover:bg-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
              : "cursor-not-allowed bg-white/5 text-white/30"
          )}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
}

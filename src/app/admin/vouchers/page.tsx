"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { formatDateTime, formatVnd } from "@/lib/utils";
import type { DiscountType, Voucher } from "@/lib/types";

export default function AdminVouchersPage() {
  const { token, user } = useAuth();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("PERCENT");
  const [discountValue, setDiscountValue] = useState(10);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | "">("");
  const [minOrderAmount, setMinOrderAmount] = useState(0);
  const [usageLimit, setUsageLimit] = useState<number | "">("");
  const [validUntil, setValidUntil] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    api
      .get<Voucher[]>("/api/admin/vouchers", token)
      .then(setVouchers)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Không tải được danh sách voucher"));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleExpire(id: string) {
    if (!confirm("Đánh dấu voucher này hết hạn?")) return;
    try {
      await api.patch(`/api/admin/vouchers/${id}/expire`, undefined, token);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không thể đánh dấu hết hạn");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || !validUntil) return;
    setLoading(true);
    setError(null);
    try {
      await api.post(
        "/api/admin/vouchers",
        {
          code: code.trim().toUpperCase(),
          discountType,
          discountValue,
          maxDiscountAmount: maxDiscountAmount === "" ? null : maxDiscountAmount,
          minOrderAmount,
          usageLimit: usageLimit === "" ? null : usageLimit,
          validFrom: null,
          validUntil,
          createdByUserId: user?.id ?? null,
        },
        token
      );
      setCode("");
      setDiscountValue(10);
      setMaxDiscountAmount("");
      setMinOrderAmount(0);
      setUsageLimit("");
      setValidUntil("");
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Tạo voucher thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Voucher</h1>
        <p className="mt-1 text-sm text-white/40">Tạo và quản lý mã giảm giá.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 rounded-xl border border-red-900/15 bg-noir-850 p-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/60">Mã voucher</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="GIAM10"
            required
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#DC2626]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/60">Loại giảm giá</label>
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as DiscountType)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#DC2626]"
          >
            <option value="PERCENT">Phần trăm (%)</option>
            <option value="AMOUNT">Số tiền cố định</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/60">
            Giá trị giảm {discountType === "PERCENT" ? "(%)" : "(đ)"}
          </label>
          <input
            type="number"
            value={discountValue}
            onChange={(e) => setDiscountValue(Number(e.target.value))}
            required
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#DC2626]"
          />
        </div>

        {discountType === "PERCENT" && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/60">Giảm tối đa (đ, để trống = không giới hạn)</label>
            <input
              type="number"
              value={maxDiscountAmount}
              onChange={(e) => setMaxDiscountAmount(e.target.value === "" ? "" : Number(e.target.value))}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#DC2626]"
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/60">Đơn tối thiểu (đ)</label>
          <input
            type="number"
            value={minOrderAmount}
            onChange={(e) => setMinOrderAmount(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#DC2626]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/60">Số lượt dùng (để trống = không giới hạn)</label>
          <input
            type="number"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value === "" ? "" : Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#DC2626]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/60">Hạn sử dụng</label>
          <input
            type="datetime-local"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            required
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#DC2626]"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#8B0000] px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Tạo voucher
          </button>
        </div>
      </form>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="overflow-hidden rounded-xl border border-red-900/15">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead className="bg-noir-800 text-[11px] uppercase tracking-wide text-white/60">
            <tr>
              <th className="px-4 py-3 font-medium">Mã</th>
              <th className="px-4 py-3 font-medium">Giảm giá</th>
              <th className="px-4 py-3 font-medium">Đơn tối thiểu</th>
              <th className="px-4 py-3 font-medium">Đã dùng</th>
              <th className="px-4 py-3 font-medium">Hạn dùng</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((v, i) => (
              <tr key={v.id} className={`border-t border-white/5 ${i % 2 === 1 ? "bg-white/[0.02]" : ""}`}>
                <td className="px-4 py-3 font-mono font-semibold text-white/90">{v.code}</td>
                <td className="px-4 py-3 text-white/70">
                  {v.discountType === "PERCENT" ? `${v.discountValue}%` : formatVnd(v.discountValue)}
                  {v.maxDiscountAmount != null && ` (tối đa ${formatVnd(v.maxDiscountAmount)})`}
                </td>
                <td className="px-4 py-3 text-white/60">{formatVnd(v.minOrderAmount)}</td>
                <td className="px-4 py-3 text-white/60">
                  {v.usedCount}{v.usageLimit != null ? ` / ${v.usageLimit}` : ""}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-white/50">{formatDateTime(v.validUntil)}</td>
                <td className="px-4 py-3">
                  {v.isActive ? (
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-green-900/30 px-2.5 py-1 text-[11px] text-green-300">Đang hoạt động</span>
                      <button
                        onClick={() => handleExpire(v.id)}
                        className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/50 hover:border-red-600/50 hover:text-red-400"
                      >
                        Hết hạn
                      </button>
                    </div>
                  ) : (
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/50">Đã khoá</span>
                  )}
                </td>
              </tr>
            ))}
            {vouchers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-white/40">
                  Chưa có voucher nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

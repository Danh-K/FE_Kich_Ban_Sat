"use client";

import { AlertTriangle } from "lucide-react";

interface ExpiredModalProps {
  onReset: () => void;
}

export function ExpiredModal({ onReset }: ExpiredModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-red-600/30 bg-noir-900 p-6 text-center shadow-[0_0_40px_rgba(139,0,0,0.35)]">
        <AlertTriangle className="mx-auto text-red-500" size={32} />
        <h3 className="mt-3 font-display text-lg font-bold text-[#f5f0f0]">
          Đã hết thời gian giữ chỗ
        </h3>
        <p className="mt-2 text-sm text-white/60">
          Vui lòng chọn lại số lượng vé để tiếp tục đặt lịch.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-5 w-full rounded-full bg-[#8B0000] py-3 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-red-600"
        >
          Chọn lại số lượng
        </button>
      </div>
    </div>
  );
}

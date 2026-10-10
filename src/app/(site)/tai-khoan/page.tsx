"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PlayHistoryTab } from "@/components/profile/PlayHistoryTab";
import { ChangePasswordTab } from "@/components/profile/ChangePasswordTab";
import { RequireAuth } from "@/components/shared/RequireAuth";

type Tab = "history" | "password";

const TABS: { key: Tab; label: string }[] = [
  { key: "history", label: "Lịch sử đã chơi" },
  { key: "password", label: "Đổi mật khẩu" },
];

export default function TaiKhoanPage() {
  const [tab, setTab] = useState<Tab>("history");

  return (
    <RequireAuth>
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-24 md:pt-28">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-red-500/70">
            Tài khoản
          </p>
          <h1 className="mt-2 font-display text-3xl font-black text-white md:text-4xl">
            Hồ sơ điều tra viên
          </h1>
        </div>

        <div className="relative flex gap-8 border-b border-white/10">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "relative pb-3 text-sm font-semibold transition-colors",
                tab === t.key ? "text-red-500" : "text-white/50 hover:text-white/80"
              )}
            >
              {t.label}
              {tab === t.key && (
                <motion.span
                  layoutId="account-tab-underline"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-red-600"
                />
              )}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "history" ? (
            <div data-density="high">
              <PlayHistoryTab />
            </div>
          ) : (
            <ChangePasswordTab />
          )}
        </div>
      </section>
    </RequireAuth>
  );
}

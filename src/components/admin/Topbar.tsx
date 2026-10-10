"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Search } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export function Topbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const initials = user?.fullName?.slice(0, 2).toUpperCase() ?? "AD";

  function handleLogout() {
    logout();
    router.replace("/admin-login");
  }

  useEffect(() => {
    if (!accountOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [accountOpen]);

  return (
    <header className="relative flex items-center justify-between gap-4 border-b border-red-900/10 bg-noir-950 px-6 py-4">
      <div className="relative w-full max-w-sm">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
        />
        <input
          type="text"
          placeholder="Tìm kiếm buổi chơi, mã đặt lịch..."
          className="w-full rounded-full border border-red-900/20 bg-white/5 py-2 pl-9 pr-4 text-sm text-white/80 placeholder:text-white/30 focus:border-red-600/50 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-5">
        {/* Chuong lay du lieu tu /api/notifications (luu DB) — dong trinh duyet khong mat badge. */}
        <NotificationBell />

        <div ref={accountRef} className="relative">
          <button
            onClick={() => setAccountOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full border border-white/10 py-1 pl-1 pr-2 hover:border-red-600/40"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-900/40 font-mono text-xs font-bold text-red-400">
              {initials}
            </div>
            <span className="text-sm text-white/70">{user?.fullName ?? "Admin"}</span>
          </button>

          {accountOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-red-900/20 bg-noir-900 p-2 shadow-2xl">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-white/70 hover:bg-white/[0.05] hover:text-red-500"
              >
                <LogOut size={14} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

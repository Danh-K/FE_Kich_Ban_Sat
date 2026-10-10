"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useNotifications } from "@/lib/use-notifications";
import { isAttentionPriority, timeAgo } from "@/lib/labels";
import type { AppNotification } from "@/lib/types";

/**
 * Chuong thong bao. Badge doc tu `/api/notifications/unread-count` chu khong dem so ban tin
 * WebSocket nhan duoc trong phien nay — nen tai lai trang hay dong trinh duyet deu khong lam
 * mat so dem.
 */
export function NotificationBell({ className }: { className?: string }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { items, unread, loading, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  if (!isAuthenticated) return null;

  const hasAttention = unread.highPriorityCount > 0;

  function handleOpenItem(notification: AppNotification) {
    void markRead(notification.id);
    setOpen(false);
    if (notification.link) router.push(notification.link);
  }

  return (
    <div ref={rootRef} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={
          unread.count > 0 ? `Thông báo (${unread.count} chưa đọc)` : "Thông báo"
        }
        aria-expanded={open}
        className={`relative transition-colors ${
          hasAttention ? "text-amber-400 hover:text-amber-300" : "text-white/60 hover:text-white"
        }`}
      >
        <Bell size={19} />
        {unread.count > 0 && (
          <span
            className={`absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 font-mono text-[10px] font-bold text-white ${
              hasAttention ? "bg-amber-500" : "bg-red-600"
            }`}
          >
            {unread.count > 99 ? "99+" : unread.count}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-3 w-[22rem] max-w-[calc(100vw-2rem)] rounded-xl border border-red-900/20 bg-noir-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
              <p className="font-mono text-[11px] uppercase tracking-wide text-white/40">
                Thông báo
              </p>
              {unread.count > 0 && (
                <button
                  type="button"
                  onClick={() => void markAllRead()}
                  className="flex items-center gap-1 text-[12px] text-white/50 hover:text-white/80"
                >
                  <CheckCheck size={13} />
                  Đọc hết
                </button>
              )}
            </div>

            {loading && items.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-white/40">
                <Loader2 size={15} className="animate-spin" />
                Đang tải...
              </div>
            ) : items.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-white/40">
                Chưa có thông báo nào.
              </p>
            ) : (
              <ul className="max-h-96 overflow-y-auto">
                {items.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => handleOpenItem(n)}
                      className={`flex w-full gap-3 border-b border-white/5 px-4 py-3 text-left transition-colors hover:bg-white/[0.03] ${
                        n.read ? "opacity-60" : ""
                      }`}
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          n.read
                            ? "bg-transparent"
                            : isAttentionPriority(n.priority)
                              ? "bg-amber-400"
                              : "bg-red-600"
                        }`}
                      />
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-sm font-medium ${
                            isAttentionPriority(n.priority) ? "text-amber-200" : "text-white/90"
                          }`}
                        >
                          {n.title}
                        </span>
                        {n.body && (
                          <span className="mt-0.5 block truncate text-[13px] text-white/50">
                            {n.body}
                          </span>
                        )}
                        <span className="mt-1 block font-mono text-[11px] text-white/30">
                          {timeAgo(n.createdAt)}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <Link
              href="/tai-khoan/thong-bao"
              onClick={() => setOpen(false)}
              className="block border-t border-white/5 px-4 py-3 text-center text-[13px] font-semibold text-red-500 hover:text-red-400"
            >
              Xem tất cả thông báo
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

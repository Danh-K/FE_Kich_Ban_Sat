"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { RequireAuth } from "@/components/shared/RequireAuth";
import { api, ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { useStompSubscription } from "@/lib/stomp-provider";
import {
  NOTIFICATION_TYPE_LABEL,
  isAttentionPriority,
  timeAgo,
} from "@/lib/labels";
import type { AppNotification, Page } from "@/lib/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

export default function ThongBaoPage() {
  return (
    <RequireAuth>
      <NotificationList />
    </RequireAuth>
  );
}

function NotificationList() {
  const { token } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Tra ve du lieu thay vi tu setState: effect chi setState trong callback cua promise,
   * khong goi dong bo trong than effect (tranh chuoi render du thua).
   */
  const fetchPage = useCallback(
    async (targetPage: number, onlyUnread: boolean, signal?: AbortSignal) => {
      if (!token) return null;
      try {
        return await api.get<Page<AppNotification>>(
          `/api/notifications?page=${targetPage}&size=${PAGE_SIZE}&unreadOnly=${onlyUnread}`,
          token,
          signal
        );
      } catch (err) {
        if (signal?.aborted) return null;
        throw err;
      }
    },
    [token]
  );

  const applyPage = useCallback((targetPage: number, result: Page<AppNotification> | null) => {
    if (!result) return;
    setItems((prev) => (targetPage === 0 ? result.content : [...prev, ...result.content]));
    setTotalPages(result.totalPages);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchPage(0, unreadOnly, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        applyPage(0, result);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err instanceof ApiError ? err.message : "Không tải được thông báo");
        setLoading(false);
      });
    return () => controller.abort();
  }, [fetchPage, applyPage, unreadOnly]);

  // Thong bao moi den trong luc dang mo trang thi chen thang len dau, khong phai F5
  useStompSubscription<AppNotification>("/user/queue/notifications", (incoming) => {
    setItems((prev) => (prev.some((n) => n.id === incoming.id) ? prev : [incoming, ...prev]));
  });

  async function handleOpen(notification: AppNotification) {
    if (!notification.read && token) {
      setItems((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );
      try {
        await api.patch(`/api/notifications/${notification.id}/read`, undefined, token);
      } catch {
        // Danh dau da doc that bai thi khong chan nguoi dung mo noi dung
      }
    }
    if (notification.link) router.push(notification.link);
  }

  async function handleMarkAll() {
    if (!token) return;
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.post("/api/notifications/read-all", undefined, token);
    } catch {
      // Bo qua: lan tai lai duoi day se dua danh sach ve dung trang thai that
    }
    // Dang loc "chua doc" thi danh sach phai rong lai sau khi doc het
    setPage(0);
    applyPage(0, await fetchPage(0, unreadOnly));
  }

  function selectFilter(onlyUnread: boolean) {
    setPage(0);
    setLoading(true);
    setUnreadOnly(onlyUnread);
  }

  async function loadMore() {
    const next = page + 1;
    setPage(next);
    setLoading(true);
    try {
      applyPage(next, await fetchPage(next, unreadOnly));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không tải được thông báo");
      setLoading(false);
    }
  }

  const hasUnread = items.some((n) => !n.read);

  return (
    <section className="mx-auto max-w-3xl px-6 pb-20 pt-24 md:pt-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-red-500/70">Tài khoản</p>
          <h1 className="mt-2 font-display text-3xl font-black text-white md:text-4xl">
            Thông báo
          </h1>
        </div>
        {hasUnread && (
          <button
            type="button"
            onClick={handleMarkAll}
            className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:border-red-600/40 hover:text-white"
          >
            <CheckCheck size={15} />
            Đánh dấu đã đọc hết
          </button>
        )}
      </div>

      <div className="mb-5 flex gap-2">
        <FilterButton active={!unreadOnly} onClick={() => selectFilter(false)}>
          Tất cả
        </FilterButton>
        <FilterButton active={unreadOnly} onClick={() => selectFilter(true)}>
          Chưa đọc
        </FilterButton>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {items.length === 0 && !loading ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] px-6 py-16 text-center">
          <Bell size={28} className="mx-auto text-white/20" />
          <p className="mt-3 text-sm text-white/50">
            {unreadOnly ? "Bạn đã đọc hết thông báo." : "Chưa có thông báo nào."}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => void handleOpen(n)}
                className={cn(
                  "flex w-full gap-3 rounded-xl border px-4 py-4 text-left transition-colors",
                  n.read
                    ? "border-white/8 bg-transparent hover:bg-white/[0.02]"
                    : isAttentionPriority(n.priority)
                      ? "border-amber-500/30 bg-amber-500/[0.04] hover:bg-amber-500/[0.07]"
                      : "border-red-900/25 bg-white/[0.03] hover:bg-white/[0.05]"
                )}
              >
                <span
                  className={cn(
                    "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                    n.read
                      ? "bg-transparent"
                      : isAttentionPriority(n.priority)
                        ? "bg-amber-400"
                        : "bg-red-600"
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span
                      className={cn(
                        "text-[15px] font-semibold",
                        n.read ? "text-white/60" : "text-white"
                      )}
                    >
                      {n.title}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-wide text-white/30">
                      {NOTIFICATION_TYPE_LABEL[n.type] ?? n.type}
                    </span>
                  </span>
                  {n.body && (
                    <span className="mt-1 block text-sm text-white/55">{n.body}</span>
                  )}
                  <span className="mt-1.5 block font-mono text-[11px] text-white/30">
                    {timeAgo(n.createdAt)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {loading && (
        <div className="mt-6 flex justify-center">
          <Loader2 size={18} className="animate-spin text-white/40" />
        </div>
      )}

      {!loading && page + 1 < totalPages && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => void loadMore()}
            className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-white/70 transition-colors hover:border-red-600/40 hover:text-white"
          >
            Xem thêm
          </button>
        </div>
      )}
    </section>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-1.5 text-sm transition-colors",
        active
          ? "bg-red-900/40 text-red-300"
          : "border border-white/10 text-white/50 hover:text-white/80"
      )}
    >
      {children}
    </button>
  );
}

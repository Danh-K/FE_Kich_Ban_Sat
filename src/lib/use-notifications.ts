"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "./api-client";
import { useAuth } from "./auth-context";
import { useStompSubscription } from "./stomp-provider";
import type { AppNotification, Page, UnreadCount } from "./types";

const EMPTY_COUNT: UnreadCount = { count: 0, highPriorityCount: 0 };

interface NotificationsState {
  items: AppNotification[];
  unread: UnreadCount;
  loading: boolean;
  error: string | null;
}

const INITIAL_STATE: NotificationsState = {
  items: [],
  unread: EMPTY_COUNT,
  loading: true,
  error: null,
};

function isAttention(priority: AppNotification["priority"]) {
  return priority === "HIGH" || priority === "URGENT";
}

/**
 * Thong bao BEN VUNG cua nguoi dang dang nhap.
 *
 * DB la nguon su that, WebSocket chi la kenh giao hang: mo trang la tai lai tu API nen
 * dong trinh duyet luc co thong bao moi khong con lam mat no (loi cua ban chi-broadcast cu).
 */
export function useNotifications(pageSize = 10) {
  const { token, isAuthenticated } = useAuth();
  const [state, setState] = useState<NotificationsState>(INITIAL_STATE);

  /** Tra ve du lieu thay vi tu setState, de effect chi setState trong callback (khong dong bo). */
  const fetchAll = useCallback(
    async (signal?: AbortSignal): Promise<NotificationsState> => {
      if (!token) {
        return { items: [], unread: EMPTY_COUNT, loading: false, error: null };
      }
      try {
        const [page, count] = await Promise.all([
          api.get<Page<AppNotification>>(`/api/notifications?size=${pageSize}`, token, signal),
          api.get<UnreadCount>("/api/notifications/unread-count", token, signal),
        ]);
        return { items: page.content, unread: count, loading: false, error: null };
      } catch (err) {
        return {
          items: [],
          unread: EMPTY_COUNT,
          loading: false,
          error: err instanceof ApiError ? err.message : "Không tải được thông báo",
        };
      }
    },
    [token, pageSize]
  );

  const refresh = useCallback(async () => {
    setState(await fetchAll());
  }, [fetchAll]);

  useEffect(() => {
    const controller = new AbortController();
    void fetchAll(controller.signal).then((next) => {
      if (!controller.signal.aborted) setState(next);
    });
    return () => controller.abort();
  }, [fetchAll]);

  // Thong bao moi day qua hang doi rieng cua tung nguoi (/user/queue/notifications).
  // Chi toi duoc khi frame CONNECT co JWT — xem StompProvider.
  useStompSubscription<AppNotification>(
    isAuthenticated ? "/user/queue/notifications" : null,
    (incoming) => {
      setState((prev) => {
        if (prev.items.some((n) => n.id === incoming.id)) return prev;
        return {
          ...prev,
          items: [incoming, ...prev.items].slice(0, pageSize),
          unread: {
            count: prev.unread.count + 1,
            highPriorityCount: prev.unread.highPriorityCount + (isAttention(incoming.priority) ? 1 : 0),
          },
        };
      });
    }
  );

  const markRead = useCallback(
    async (id: string) => {
      if (!token) return;

      // Cap nhat lac quan: bam vao thong bao thi no phai het dam ngay, khong doi vong API
      let wasUnread = false;
      setState((prev) => {
        const target = prev.items.find((n) => n.id === id);
        if (!target || target.read) return prev;
        wasUnread = true;
        return {
          ...prev,
          items: prev.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
          unread: {
            count: Math.max(0, prev.unread.count - 1),
            highPriorityCount: Math.max(
              0,
              prev.unread.highPriorityCount - (isAttention(target.priority) ? 1 : 0)
            ),
          },
        };
      });
      if (!wasUnread) return;

      try {
        await api.patch(`/api/notifications/${id}/read`, undefined, token);
      } catch {
        void refresh();
      }
    },
    [token, refresh]
  );

  const markAllRead = useCallback(async () => {
    if (!token) return;
    setState((prev) => ({
      ...prev,
      items: prev.items.map((n) => ({ ...n, read: true })),
      unread: EMPTY_COUNT,
    }));
    try {
      await api.post("/api/notifications/read-all", undefined, token);
    } catch {
      void refresh();
    }
  }, [token, refresh]);

  return { ...state, refresh, markRead, markAllRead };
}

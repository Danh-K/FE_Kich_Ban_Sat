"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Client, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_BASE_URL } from "./api-client";
import { MOCK_MODE } from "./mock-data";
import { useAuth } from "./auth-context";

type Handler = (payload: unknown) => void;
type HandlerMap = Map<string, Set<Handler>>;
type SubscriptionMap = Map<string, StompSubscription>;

interface StompContextValue {
  connected: boolean;
  /** Dang ky nhan ban tin cua mot destination. Tra ve ham huy dang ky. */
  subscribe: (destination: string, handler: Handler) => () => void;
}

const StompContext = createContext<StompContextValue | null>(null);

/** Mo mot subscription STOMP that su (neu chua co) va phat ban tin cho moi handler dang cho. */
function bind(
  client: Client,
  destination: string,
  handlers: HandlerMap,
  subscriptions: SubscriptionMap
) {
  if (subscriptions.has(destination)) return;

  const subscription = client.subscribe(destination, (message) => {
    let payload: unknown = message.body;
    try {
      payload = JSON.parse(message.body);
    } catch {
      // Ban tin khong phai JSON: giu nguyen chuoi
    }
    handlers.get(destination)?.forEach((handler) => handler(payload));
  });
  subscriptions.set(destination, subscription);
}

/**
 * MOT ket noi STOMP dung chung cho ca ung dung.
 *
 * Truoc day moi hook (useAdminNotifications, useSessionUpdates) tu mo mot ket noi rieng:
 * mo trang admin va trang kich ban cung luc la 2 socket, moi lan dieu huong lai dung/mo lai
 * tu dau - vua ton, vua tao khe hong mat ban tin trong luc ket noi lai.
 *
 * Ngoai ra day la noi DUY NHAT gui JWT o frame CONNECT. Khong co no, BE khong gan duoc
 * Principal va /user/queue/notifications se khong bao gio toi
 * (xem backend .../security/WebSocketAuthChannelInterceptor.java).
 */
export function StompProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [connected, setConnected] = useState(false);

  const clientRef = useRef<Client | null>(null);
  /** destination -> cac handler dang cho. Giu o ref de doi handler khong phai mo lai socket. */
  const handlersRef = useRef<HandlerMap>(new Map());
  const subscriptionsRef = useRef<SubscriptionMap>(new Map());

  useEffect(() => {
    const handlers = handlersRef.current;
    const subscriptions = subscriptionsRef.current;

    if (MOCK_MODE) {
      setConnected(false);
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws`),
      // Header CONNECT: BE doc o WebSocketAuthChannelInterceptor de biet ai dang ket noi
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      debug: () => {},
    });

    client.onConnect = () => {
      setConnected(true);
      // Dang ky lai tat ca - quan trong khi ket noi bi rot roi noi lai
      subscriptions.clear();
      handlers.forEach((_set, destination) => bind(client, destination, handlers, subscriptions));
    };
    client.onWebSocketClose = () => {
      setConnected(false);
      subscriptions.clear();
    };

    clientRef.current = client;
    client.activate();

    return () => {
      subscriptions.clear();
      clientRef.current = null;
      void client.deactivate();
    };
    // Doi token (dang nhap/dang xuat) -> phai ket noi lai de BE gan dung Principal
  }, [token]);

  // Khong phu thuoc `connected`: giu ham on dinh de component goi khong bi dang ky lai moi lan
  // ket noi thay doi trang thai.
  const subscribe = useCallback((destination: string, handler: Handler) => {
    const handlers = handlersRef.current;
    const subscriptions = subscriptionsRef.current;

    const forDestination = handlers.get(destination) ?? new Set<Handler>();
    forDestination.add(handler);
    handlers.set(destination, forDestination);

    const client = clientRef.current;
    if (client?.connected) {
      bind(client, destination, handlers, subscriptions);
    }

    return () => {
      const current = handlers.get(destination);
      if (!current) return;
      current.delete(handler);
      if (current.size > 0) return;

      handlers.delete(destination);
      subscriptions.get(destination)?.unsubscribe();
      subscriptions.delete(destination);
    };
  }, []);

  const value = useMemo<StompContextValue>(
    () => ({ connected, subscribe }),
    [connected, subscribe]
  );

  return <StompContext.Provider value={value}>{children}</StompContext.Provider>;
}

export function useStomp() {
  const ctx = useContext(StompContext);
  if (!ctx) throw new Error("useStomp phải nằm trong StompProvider");
  return ctx;
}

/**
 * Dang ky mot destination trong suot vong doi component.
 * `handler` duoc giu o ref nen phia goi khong can useCallback.
 */
export function useStompSubscription<T>(
  destination: string | null,
  handler: (payload: T) => void
) {
  const { subscribe, connected } = useStomp();
  const handlerRef = useRef(handler);

  // Cap nhat trong effect (khong phai than render): giu handler moi nhat ma khong phai
  // dang ky lai subscription moi lan component render.
  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!destination) return;
    return subscribe(destination, (payload) => handlerRef.current(payload as T));
    // `connected` co trong deps de sau khi ket noi lai, destination duoc bind lai
  }, [destination, subscribe, connected]);
}

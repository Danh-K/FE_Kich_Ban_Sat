import type {
  ApiErrorCode,
  AppNotification,
  LeaderboardEntry,
  Session,
  SessionSlot,
  Voucher,
} from "./types";
import { MOCK_MODE, MOCK_OPEN_SCRIPT_IDS, MOCK_REVIEWS, MOCK_SCRIPTS, MOCK_STORES } from "./mock-data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/** Than loi thong nhat cua BE (GlobalExceptionHandler). */
interface ApiErrorBody {
  status?: number;
  code?: string;
  message?: string;
  path?: string;
  fieldErrors?: Record<string, string>;
  data?: Record<string, unknown>;
}

/**
 * `code` la hop dong giua BE va FE. LUON bat theo `code`, dung so sanh `message` —
 * message chi de hien thi cho nguoi dung va co the doi bat cu luc nao.
 */
export class ApiError extends Error {
  status: number;
  code: ApiErrorCode | string;
  fieldErrors: Record<string, string>;
  data: Record<string, unknown>;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message ?? `Yêu cầu thất bại (mã ${status})`);
    this.name = "ApiError";
    this.status = status;
    this.code = body.code ?? "UNKNOWN";
    this.fieldErrors = body.fieldErrors ?? {};
    this.data = body.data ?? {};
  }

  is(...codes: (ApiErrorCode | string)[]) {
    return codes.includes(this.code);
  }

  /** Loi cua o nhap nao (neu co) — de gan ngay duoi input thay vi hien mot dong do chung chung. */
  fieldError(field: string): string | undefined {
    return this.fieldErrors[field];
  }

  /** So giay phai doi truoc khi thu lai, cho cac loi 429. */
  get retryAfterSeconds(): number | null {
    const value = this.data.retryAfterSeconds;
    return typeof value === "number" ? value : null;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
}

const mockSessions: Session[] = MOCK_SCRIPTS.map((script, index) => ({
  id: `mock-session-${index + 1}`,
  script,
  startTime: `2026-12-${String((index % 20) + 1).padStart(2, "0")}T19:00:00+07:00`,
  minPlayers: Math.max(3, Math.ceil(script.playerCount * 0.6)),
  maxPlayers: script.playerCount,
  status: "OPEN",
}));

const mockVouchers: Voucher[] = [
  { id: "mock-voucher-1", code: "CHAOMUNG10", discountType: "PERCENT", discountValue: 10, maxDiscountAmount: 50000, minOrderAmount: 100000, usageLimit: 200, usedCount: 0, validFrom: "2026-01-01T00:00:00Z", validUntil: "2026-12-31T23:59:59Z", isActive: true, createdAt: "2026-01-01T00:00:00Z" },
  { id: "mock-voucher-2", code: "GIAM50K", discountType: "AMOUNT", discountValue: 50000, maxDiscountAmount: null, minOrderAmount: 200000, usageLimit: 100, usedCount: 0, validFrom: "2026-01-01T00:00:00Z", validUntil: "2026-12-31T23:59:59Z", isActive: true, createdAt: "2026-01-01T00:00:00Z" },
];

const mockNotifications: AppNotification[] = [
  { id: "mock-notification-1", type: "SESSION_READY", priority: "NORMAL", title: "Lịch chơi đã sẵn sàng", body: "Một buổi chơi đang đủ người tham gia.", payload: {}, link: "/dat-lich/2-12", read: false, createdAt: "2026-10-01T10:00:00Z" },
];

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: "mock-player-1", name: "Minh Anh", casesSolved: 18, hardestScriptTitle: "Lý Luận Hư Cấu", score: 9200, isCurrentUser: false },
  { rank: 2, userId: "mock-player-2", name: "Hoàng Nam", casesSolved: 15, hardestScriptTitle: "Niên Luân", score: 8100, isCurrentUser: false },
  { rank: 3, userId: "mock-player-3", name: "Khách Demo", casesSolved: 12, hardestScriptTitle: "Vụ Nha Quán", score: 7300, isCurrentUser: true },
  { rank: 4, userId: "mock-player-4", name: "Lan Chi", casesSolved: 10, hardestScriptTitle: "Dư Hương", score: 6400, isCurrentUser: false },
  { rank: 5, userId: "mock-player-5", name: "Tuấn Khang", casesSolved: 8, hardestScriptTitle: "Cổ Thụ Ngân Nga", score: 5200, isCurrentUser: false },
  { rank: 6, userId: "mock-player-6", name: "Bảo Ngọc", casesSolved: 6, hardestScriptTitle: "Điểm Danh", score: 4100, isCurrentUser: false },
];

function mockResponse<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}

function mockSessionSlots(sessionId: string): SessionSlot[] {
  const session = mockSessions.find((item) => item.id === sessionId);
  return Array.from({ length: session?.maxPlayers ?? 6 }, (_, index) => ({
    id: `${sessionId}-slot-${index + 1}`,
    status: index < 2 ? "BOOKED" : "AVAILABLE",
  }));
}

function mockRequest<T>(path: string, method: RequestOptions["method"], body?: unknown): Promise<T> {
  const url = new URL(path, "http://mock.local");
  const pathname = url.pathname;
  const parts = pathname.split("/").filter(Boolean);

  if (method === "GET" && pathname === "/api/scripts") return mockResponse(MOCK_SCRIPTS as T);
  if (method === "GET" && parts[1] === "scripts" && parts[2] === "by-slug") {
    return mockResponse((MOCK_SCRIPTS.find((script) => script.slug === parts[3]) ?? null) as T);
  }
  if (method === "GET" && parts[1] === "scripts" && parts[3] === "images") {
    const script = MOCK_SCRIPTS.find((item) => item.id === parts[2]);
    return mockResponse((script ? [{ id: `${script.id}-cover`, imageUrl: script.coverImageUrl, isCover: true }] : []) as T);
  }
  if (method === "GET" && parts[1] === "scripts" && parts[3] === "sessions") {
    return mockResponse(mockSessions.filter((session) => session.script.id === parts[2]) as T);
  }
  if (method === "GET" && parts[1] === "sessions" && parts[3] === "slots") return mockResponse(mockSessionSlots(parts[2]) as T);
  if (method === "GET" && pathname === "/api/sessions") return mockResponse(mockSessions.filter((session) => MOCK_OPEN_SCRIPT_IDS.includes(session.script.id)) as T);
  if (method === "GET" && pathname === "/api/stores") return mockResponse(MOCK_STORES as T);
  if (method === "GET" && pathname === "/api/leaderboard") return mockResponse(mockLeaderboard as T);
  if (method === "GET" && pathname.startsWith("/api/reviews/featured")) return mockResponse(MOCK_REVIEWS as T);
  if (method === "GET" && pathname === "/api/notifications") return mockResponse({ content: mockNotifications, totalElements: mockNotifications.length, totalPages: 1, number: 0, size: 20 } as T);
  if (method === "GET" && pathname === "/api/notifications/unread-count") return mockResponse({ count: mockNotifications.filter((item) => !item.read).length, highPriorityCount: 0 } as T);
  if (method === "GET" && pathname === "/api/admin/stats/summary") return mockResponse({ todayPlayers: 24, openSessionsCount: mockSessions.length, pendingBookingsCount: 3, fillRatePercent: 68 } as T);
  if (method === "GET" && pathname === "/api/admin/players") return mockResponse([{ date: "2026-10-06", playerCount: 8 }, { date: "2026-10-07", playerCount: 14 }, { date: "2026-10-08", playerCount: 19 }, { date: "2026-10-09", playerCount: 24 }] as T);
  if (method === "GET" && pathname === "/api/admin/users/dms") return mockResponse([{ id: "mock-dm-1", fullName: "DM Demo", email: "dm@demo.local", phone: null, role: "DM", emailVerified: true, createdAt: "2026-01-01T00:00:00Z" }] as T);
  if (method === "GET" && pathname === "/api/vouchers") return mockResponse(mockVouchers as T);
  if (method === "GET" && parts[1] === "bookings") return mockResponse({ id: parts[2], session: mockSessions[0], discountAmount: 0, status: "PENDING", totalAmount: mockSessions[0].script.basePrice, expiresAt: new Date(Date.now() + 600000).toISOString(), createdAt: new Date().toISOString() } as T);

  if (method === "POST" && pathname === "/api/auth/login") return mockResponse({ token: "mock-user-token", userId: "mock-user-1", fullName: "Khách Demo", email: (body as { email?: string })?.email ?? "demo@example.com", role: "PLAYER" } as T);
  if (method === "POST" && pathname === "/api/auth/admin/login") return mockResponse({ token: "mock-admin-token", userId: "mock-admin-1", fullName: "Admin Demo", email: "admin@demo.local", role: "ADMIN" } as T);
  if (method === "POST" && pathname === "/api/auth/register") return mockResponse({ email: (body as { email?: string })?.email ?? "demo@example.com", maskedDestination: "d***@example.com", otpExpiresInSeconds: 600, resendAfterSeconds: 60, message: "Mã OTP demo là 123456" } as T);
  if (method === "POST" && (pathname === "/api/auth/verify-otp" || pathname === "/api/auth/forgot-password" || pathname === "/api/auth/resend-otp" || pathname === "/api/auth/reset-password")) return mockResponse({ token: "mock-user-token", userId: "mock-user-1", fullName: "Khách Demo", email: "demo@example.com", role: "PLAYER" } as T);
  if (method === "GET" && pathname.includes("/availability")) return mockResponse({ available: true, reason: null } as T);
  if (method === "GET" && pathname.includes("/voucher")) return mockResponse({ code: (body as { code?: string })?.code ?? "CHAOMUNG10", orderAmount: 300000, discountAmount: 30000, finalAmount: 270000 } as T);
  if (method === "POST" && pathname === "/api/bookings") return mockResponse({ id: "mock-booking-1", sessionId: mockSessions[0].id, status: "PENDING", discountAmount: 0, totalAmount: mockSessions[0].script.basePrice, expiresAt: new Date(Date.now() + 600000).toISOString(), sessionSlotIds: mockSessionSlots(mockSessions[0].id).slice(0, 1).map((slot) => slot.id) } as T);
  if (method === "POST" && pathname.includes("/payments/webhook")) return mockResponse(undefined as T);
  if (method === "PATCH" && pathname.includes("/notifications/")) return mockResponse(undefined as T);
  if (method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE") return mockResponse(undefined as T);

  return mockResponse(undefined as T);
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, signal } = options;

  if (MOCK_MODE) return mockRequest<T>(path, method, body);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal,
  });

  if (!res.ok) {
    let errorBody: ApiErrorBody = {};
    try {
      errorBody = (await res.json()) as ApiErrorBody;
    } catch {
      // BE luon tra JSON qua GlobalExceptionHandler; chi roi vao day khi loi tang duoi (proxy, mat mang).
    }
    throw new ApiError(res.status, errorBody);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const api = {
  get: <T>(path: string, token?: string | null, signal?: AbortSignal) =>
    request<T>(path, { method: "GET", token, signal }),
  post: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: "POST", body, token }),
  put: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: "PUT", body, token }),
  patch: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: "PATCH", body, token }),
  delete: <T>(path: string, token?: string | null) => request<T>(path, { method: "DELETE", token }),
};

export { API_BASE_URL };

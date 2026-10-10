import type { ApiErrorCode } from "./types";

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

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, signal } = options;

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

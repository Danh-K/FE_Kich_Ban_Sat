"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { formatDateTime } from "@/lib/utils";
import type { Page, UserRole, UserSummary } from "@/lib/types";

const ROLES: UserRole[] = ["PLAYER", "DM", "ADMIN"];
const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<Page<UserSummary> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(() => {
    const query = search ? `&search=${encodeURIComponent(search)}` : "";
    api
      .get<Page<UserSummary>>(`/api/admin/users?page=${page}&size=${PAGE_SIZE}${query}`, token)
      .then(setData)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Không tải được danh sách người dùng"));
  }, [page, search, token]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRoleChange(userId: string, role: UserRole) {
    setSavingId(userId);
    try {
      await api.patch(`/api/admin/users/${userId}/role`, { role }, token);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Cập nhật vai trò thất bại");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Người dùng</h1>
        <p className="mt-1 text-sm text-white/40">Quản lý tài khoản và phân quyền.</p>
      </div>

      <input
        value={search}
        onChange={(e) => {
          setPage(0);
          setSearch(e.target.value);
        }}
        placeholder="Tìm theo tên hoặc email..."
        className="w-full max-w-sm rounded-full border border-red-900/20 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-red-600/50"
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="overflow-hidden rounded-xl border border-red-900/15">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-noir-800 text-[11px] uppercase tracking-wide text-white/60">
            <tr>
              <th className="px-4 py-3 font-medium">Họ tên</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">SĐT</th>
              <th className="px-4 py-3 font-medium">Xác thực email</th>
              <th className="px-4 py-3 font-medium">Ngày tạo</th>
              <th className="px-4 py-3 font-medium">Vai trò</th>
            </tr>
          </thead>
          <tbody>
            {data?.content.map((u, i) => (
              <tr key={u.id} className={`border-t border-white/5 ${i % 2 === 1 ? "bg-white/[0.02]" : ""}`}>
                <td className="px-4 py-3 text-white/90">{u.fullName}</td>
                <td className="px-4 py-3 text-white/60">{u.email}</td>
                <td className="px-4 py-3 text-white/60">{u.phone ?? "—"}</td>
                <td className="px-4 py-3">
                  {u.emailVerified ? (
                    <span className="rounded-full bg-green-900/30 px-2.5 py-1 text-[11px] text-green-300">Đã xác thực</span>
                  ) : (
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/50">Chưa xác thực</span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-white/50">{formatDateTime(u.createdAt)}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    disabled={savingId === u.id}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                    className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white outline-none focus:border-[#DC2626]"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  {savingId === u.id && <Loader2 size={14} className="ml-2 inline animate-spin text-white/40" />}
                </td>
              </tr>
            ))}
            {data?.content.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-white/40">
                  Không có người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {data && (
          <div className="flex items-center justify-between border-t border-white/5 bg-noir-900 px-4 py-3">
            <span className="font-mono text-xs text-white/40">
              Trang {data.totalPages === 0 ? 0 : data.number + 1} / {data.totalPages} · {data.totalElements} người dùng
            </span>
            <div className="flex items-center gap-1 font-mono text-xs">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded px-2 py-1 text-white/40 hover:text-white disabled:opacity-30"
              >
                ‹
              </button>
              <button
                onClick={() => setPage((p) => (p + 1 < data.totalPages ? p + 1 : p))}
                disabled={page + 1 >= data.totalPages}
                className="rounded px-2 py-1 text-white/40 hover:text-white disabled:opacity-30"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

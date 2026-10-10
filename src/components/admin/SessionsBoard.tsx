"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminSessionSummary, Page } from "@/lib/types";
import { api, ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { SessionsTable } from "./SessionsTable";
import { BookingSlideOver } from "./BookingSlideOver";

const PAGE_SIZE = 10;

export function SessionsBoard() {
  const { token } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [data, setData] = useState<Page<AdminSessionSummary> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    api
      .get<Page<AdminSessionSummary>>(`/api/admin/sessions?page=${page}&size=${PAGE_SIZE}`, token)
      .then(setData)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Không tải được danh sách buổi chơi"));
  }, [page, token]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCancel(sessionId: string) {
    try {
      await api.post(`/api/admin/sessions/${sessionId}/cancel`, undefined, token);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Huỷ buổi chơi thất bại");
    }
  }

  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!data) return <p className="text-sm text-white/40">Đang tải...</p>;

  return (
    <>
      <SessionsTable
        sessions={data.content}
        page={data.number}
        totalPages={data.totalPages}
        totalElements={data.totalElements}
        onSelect={setSelected}
        onCancel={handleCancel}
        onPageChange={setPage}
      />
      <BookingSlideOver
        sessionId={selected}
        onClose={() => setSelected(null)}
        onSessionCompleted={load}
      />
    </>
  );
}

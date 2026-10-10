"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Star } from "lucide-react";
import type { PlayHistoryEntry } from "@/lib/types";
import { api, ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { formatDateTime } from "@/lib/utils";
import { StarRatingInput } from "./StarRatingInput";

function RatingForm({
  entry,
  onSubmit,
}: {
  entry: PlayHistoryEntry;
  onSubmit: (id: string, rating: number, comment: string) => Promise<void>;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(entry.id, rating, comment);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gửi đánh giá thất bại");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-red-900/20 bg-white/[0.03] p-4">
      <p className="text-sm font-medium text-white/70">Đánh giá kịch bản này</p>
      <div className="mt-2">
        <StarRatingInput value={rating} onChange={setRating} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Cảm nhận của bạn về buổi chơi này (không bắt buộc)..."
        rows={3}
        className="mt-3 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-200 focus:border-[#DC2626] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.15)]"
      />
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      <button
        type="button"
        disabled={rating === 0 || submitting}
        onClick={handleSubmit}
        className="mt-3 flex items-center gap-2 rounded-full bg-[#8B0000] px-5 py-2 text-xs font-bold uppercase tracking-wide text-[#f5f0f0] transition-all hover:bg-red-600 hover:shadow-[0_0_16px_rgba(220,38,38,0.4)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting && <Loader2 size={12} className="animate-spin" />}
        Gửi đánh giá
      </button>
    </div>
  );
}

export function PlayHistoryTab() {
  const { token } = useAuth();
  const [entries, setEntries] = useState<PlayHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<PlayHistoryEntry[]>("/api/profile/play-history", token)
      .then(setEntries)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Không tải được lịch sử chơi"))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleRate(id: string, rating: number, comment: string) {
    const updated = await api.post<PlayHistoryEntry>(
      `/api/profile/play-history/${id}/review`,
      { rating, comment: comment.trim() || null },
      token
    );
    setEntries((prev) => prev.map((entry) => (entry.id === id ? updated : entry)));
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-red-600" size={28} />
      </div>
    );
  }

  if (error) {
    return <p className="py-20 text-center text-sm text-red-400">{error}</p>;
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-sm text-white/50">
          Bạn chưa chơi kịch bản nào. Khám phá các kịch bản đang mở lịch
        </p>
        <Link
          href="/"
          className="rounded-full bg-[#8B0000] px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-[#f5f0f0] transition-all hover:bg-red-600 hover:shadow-[0_0_24px_rgba(220,38,38,0.5)]"
        >
          Khám phá kịch bản
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="rounded-xl border border-red-900/20 bg-[rgba(20,8,8,0.4)] p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-bold text-[#f5f0f0]">
                {entry.scriptTitle}
              </h3>
              <p className="mt-1 text-sm text-white/50">
                {formatDateTime(entry.datePlayed)}
                {entry.dmName && <> · {entry.dmName}</>}
              </p>
            </div>
          </div>

          {entry.rating === null ? (
            <RatingForm entry={entry} onSubmit={handleRate} />
          ) : (
            <div className="mt-4 rounded-lg border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < (entry.rating ?? 0)
                        ? "fill-red-600 text-red-600"
                        : "text-white/15"
                    }
                  />
                ))}
              </div>
              {entry.comment && (
                <p className="mt-2 text-sm text-white/70">{entry.comment}</p>
              )}
              {entry.ratedAt && (
                <p className="mt-2 font-mono text-[10px] text-white/40">
                  Đã đánh giá vào {formatDateTime(entry.ratedAt)}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

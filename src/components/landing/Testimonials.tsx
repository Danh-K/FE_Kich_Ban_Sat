"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { api } from "@/lib/api-client";
import type { Review } from "@/lib/types";
import { MOCK_MODE, MOCK_REVIEWS } from "@/lib/mock-data";

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (MOCK_MODE) {
      setReviews(MOCK_REVIEWS);
      return;
    }

    api
      .get<Review[]>("/api/reviews/featured?limit=3")
      .then(setReviews)
      .catch(() => setReviews([]));
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-red-600">
          LỜI KHAI NHÂN CHỨNG
        </p>
        <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight text-[#f5f0f0] md:text-4xl">
          Đánh giá từ người chơi
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="relative -rotate-1 rounded-sm border border-white/10 bg-noir-850 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.4)] odd:rotate-1"
            >
              {review.verified && (
                <span className="absolute -top-3 right-4 -rotate-6 rounded border border-red-600 bg-noir-950 px-2 py-0.5 font-mono text-[9px] font-bold tracking-wide text-red-500">
                  ĐÃ XÁC MINH
                </span>
              )}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={
                      i < review.rating
                        ? "fill-red-600 text-red-600"
                        : "text-white/15"
                    }
                  />
                ))}
              </div>
              <p className="mt-4 text-sm italic text-white/70">
                “{review.comment}”
              </p>
              <p className="mt-4 font-mono text-[11px] text-white/40">
                {review.userName} · {review.scriptTitle}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

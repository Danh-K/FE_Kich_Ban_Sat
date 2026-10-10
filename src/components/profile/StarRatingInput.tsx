"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        return (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHovered(starValue)}
            onClick={() => onChange(starValue)}
            aria-label={`Đánh giá ${starValue} sao`}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              size={22}
              className={cn(
                "transition-colors",
                starValue <= active ? "fill-red-600 text-red-600" : "text-white/20"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { CalendarClock } from "lucide-react";
import "react-day-picker/style.css";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  /** Chuoi dang "yyyy-MM-ddTHH:mm" (giong input datetime-local), rong = chua chon. */
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function parseValue(value: string): { date: Date | undefined; hour: number; minute: number } {
  if (!value) return { date: undefined, hour: 14, minute: 0 };
  const [datePart, timePart] = value.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [h, min] = (timePart ?? "14:00").split(":").map(Number);
  return { date: new Date(y, m - 1, d), hour: h, minute: min };
}

function toValue(date: Date, hour: number, minute: number) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(hour)}:${pad(minute)}`;
}

function formatDisplay(value: string) {
  if (!value) return "";
  const { date, hour, minute } = parseValue(value);
  if (!date) return "";
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(hour)}:${pad(minute)}`;
}

export function DateTimePicker({ value, onChange, className }: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { date, hour, minute } = parseValue(value);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function selectDate(nextDate: Date | undefined) {
    if (!nextDate) return;
    onChange(toValue(nextDate, hour, minute));
  }

  function selectTime(nextHour: number, nextMinute: number) {
    onChange(toValue(date ?? new Date(), nextHour, nextMinute));
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-black px-3 py-2 text-left text-sm text-white outline-none transition-colors hover:border-red-600/50 focus:border-[#DC2626]"
      >
        <CalendarClock size={14} className="shrink-0 text-white/40" />
        <span className={cn("truncate", !value && "text-white/40")}>
          {value ? formatDisplay(value) : "-- Chọn ngày & giờ --"}
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 rounded-xl border border-white/10 bg-black p-3 shadow-2xl">
          <DayPicker
            mode="single"
            selected={date}
            onSelect={selectDate}
            weekStartsOn={1}
            className="text-white [--rdp-accent-color:#DC2626] [--rdp-today-color:#DC2626]"
          />
          <div className="mt-2 flex items-center justify-center gap-2 border-t border-white/10 pt-3">
            <label className="text-xs text-white/50">Giờ</label>
            <input
              type="number"
              min={0}
              max={23}
              value={hour}
              onChange={(e) => selectTime(Math.min(23, Math.max(0, Number(e.target.value))), minute)}
              className="w-14 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-center text-sm text-white outline-none focus:border-[#DC2626]"
            />
            <span className="text-white/40">:</span>
            <input
              type="number"
              min={0}
              max={59}
              value={minute}
              onChange={(e) => selectTime(hour, Math.min(59, Math.max(0, Number(e.target.value))))}
              className="w-14 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-center text-sm text-white outline-none focus:border-[#DC2626]"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ml-2 rounded-full bg-[#8B0000] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-red-600"
            >
              Xong
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

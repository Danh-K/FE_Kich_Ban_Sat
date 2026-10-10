"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Custom listbox thay cho <select> goc: <option> khong the style hover nhat quan giua cac
 * browser, nen tu dung panel de nen den/chu trang mac dinh va DAO MAU khi hover tren tung option.
 */
export function Select({ value, onChange, options, placeholder = "-- Chọn --", disabled, className }: SelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

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

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-black px-3 py-2 text-left text-sm text-white outline-none transition-colors",
          disabled ? "cursor-not-allowed opacity-40" : "hover:border-red-600/50 focus:border-[#DC2626]"
        )}
      >
        <span className={cn("truncate", !selected && "text-white/40")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={14} className={cn("shrink-0 text-white/40 transition-transform", open && "rotate-180")} />
      </button>

      {open && !disabled && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-white/10 bg-black py-1 shadow-2xl"
        >
          {options.length === 0 && (
            <li className="px-3 py-2 text-sm text-white/40">Không có lựa chọn nào</li>
          )}
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black",
                  isSelected && "font-semibold"
                )}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check size={14} className="shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

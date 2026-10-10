"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  autoComplete?: string;
  required?: boolean;
  className?: string;
}

export function PasswordInput({
  id,
  name,
  label,
  placeholder = "Mật khẩu",
  value,
  onChange,
  error,
  autoComplete,
  required,
  className,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-white/70">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          required={required}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 pr-11 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-200 focus:border-[#DC2626] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.15)]"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white/70"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="text-[12px] text-[#DC2626]">{error}</p>}
    </div>
  );
}

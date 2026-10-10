"use client";

import { useRef, useState } from "react";

interface OtpInputProps {
  length?: number;
  onComplete: (code: string) => void;
}

export function OtpInput({ length = 6, onComplete }: OtpInputProps) {
  const [values, setValues] = useState<string[]>(() => Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...values];
    next[index] = digit;
    setValues(next);

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (next.every((d) => d !== "")) {
      onComplete(next.join(""));
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!text) return;
    e.preventDefault();

    const next = Array(length).fill("");
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setValues(next);

    const focusIndex = Math.min(text.length, length - 1);
    inputsRef.current[focusIndex]?.focus();

    if (next.every((d) => d !== "")) {
      onComplete(next.join(""));
    }
  }

  return (
    <div className="flex justify-between gap-2">
      {values.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          inputMode="numeric"
          maxLength={1}
          aria-label={`Chữ số OTP ${i + 1}`}
          className="h-14 w-12 rounded-lg border border-white/10 bg-white/5 text-center font-mono text-xl text-white outline-none transition-all duration-200 focus:border-[#DC2626] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.15)]"
        />
      ))}
    </div>
  );
}

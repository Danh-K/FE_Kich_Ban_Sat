"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Dem nguoc so giay con lai. Dung cho han cua ma OTP va nut "Gửi lại mã".
 *
 * Moc theo THOI DIEM KET THUC chu khong tru dan mot bien dem: tab bi treo hoac may ngu day
 * thi so giay hien ra van dung, khong bi tre lai.
 *
 * Date.now() chi duoc goi trong effect / event handler — khong bao gio trong than render,
 * de ket qua render luon on dinh.
 */
export function useCountdown(initialSeconds: number) {
  const [remaining, setRemaining] = useState(() => Math.max(0, Math.ceil(initialSeconds)));
  const deadlineRef = useRef<number | null>(null);

  const restart = useCallback((seconds: number) => {
    deadlineRef.current = Date.now() + seconds * 1000;
    setRemaining(Math.max(0, Math.ceil(seconds)));
  }, []);

  useEffect(() => {
    deadlineRef.current = Date.now() + initialSeconds * 1000;

    // Nhip 500ms de con so doi gan nhu ngay khi giay thay doi. Interval chay suot vong doi
    // component (khong dung khi ve 0) vi restart() co the hoi sinh bo dem bat cu luc nao.
    const timer = setInterval(() => {
      const deadline = deadlineRef.current;
      if (deadline === null) return;
      setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    }, 500);

    return () => clearInterval(timer);
  }, [initialSeconds]);

  return { remaining, restart, finished: remaining <= 0 };
}

/** 95 -> "1:35", 42 -> "0:42" */
export function formatCountdown(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

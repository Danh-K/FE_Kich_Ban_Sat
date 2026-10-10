export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (safe % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

/** Giay con lai tinh tu thoi diem het han thuc te (expiresAt) do BE tra ve, khong gia lap tren FE. */
export function secondsUntil(expiresAtIso: string): number {
  const diffMs = new Date(expiresAtIso).getTime() - Date.now();
  return Math.max(0, Math.floor(diffMs / 1000));
}

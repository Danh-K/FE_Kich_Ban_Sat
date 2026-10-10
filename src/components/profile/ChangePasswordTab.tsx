"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { api, ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

export function ChangePasswordTab() {
  const { token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mismatch =
    confirmTouched && confirmPassword.length > 0 && confirmPassword !== newPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || !currentPassword || !newPassword || newPassword !== confirmPassword) {
      return;
    }
    setLoading(true);
    setSuccess(false);
    setError(null);
    try {
      await api.post("/api/profile/change-password", { currentPassword, newPassword }, token);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setConfirmTouched(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <PasswordInput
          id="currentPassword"
          label="Mật khẩu hiện tại"
          value={currentPassword}
          onChange={setCurrentPassword}
          autoComplete="current-password"
        />

        <div>
          <PasswordInput
            id="newPassword"
            label="Mật khẩu mới"
            value={newPassword}
            onChange={setNewPassword}
            autoComplete="new-password"
          />
          <PasswordStrengthMeter password={newPassword} />
        </div>

        <PasswordInput
          id="confirmNewPassword"
          label="Xác nhận mật khẩu mới"
          value={confirmPassword}
          onChange={(v) => {
            setConfirmTouched(true);
            setConfirmPassword(v);
          }}
          error={mismatch ? "Mật khẩu không khớp" : null}
          autoComplete="new-password"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#8B0000] px-7 py-3 text-sm font-bold uppercase tracking-wide text-[#f5f0f0] transition-all hover:bg-red-600 hover:shadow-[0_0_24px_rgba(220,38,38,0.5)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Cập nhật mật khẩu"}
        </button>

        {success && (
          <div className="flex items-center gap-2 rounded-lg border border-green-800/40 bg-green-950/30 px-4 py-3 text-sm text-green-300">
            <CheckCircle2 size={18} />
            Cập nhật mật khẩu thành công.
          </div>
        )}
      </form>
    </div>
  );
}

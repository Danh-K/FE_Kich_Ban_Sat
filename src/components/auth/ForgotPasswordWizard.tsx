"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { OtpInput } from "./OtpInput";
import { PasswordInput } from "./PasswordInput";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import { api, ApiError } from "@/lib/api-client";

type Step = "request" | "otp" | "reset";

export function ForgotPasswordWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [code, setCode] = useState("");
  const [otpKey, setOtpKey] = useState(0);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleRequestSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (requestLoading) return;
    setRequestLoading(true);
    setError(null);
    try {
      await api.post("/api/auth/forgot-password", { email });
      setStep("otp");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không gửi được mã xác nhận");
    } finally {
      setRequestLoading(false);
    }
  }

  function handleOtpComplete(value: string) {
    setCode(value);
    setStep("reset");
  }

  async function handleResend() {
    setError(null);
    try {
      await api.post("/api/auth/forgot-password", { email });
      setOtpKey((k) => k + 1);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không gửi lại được mã");
    }
  }

  const mismatch =
    confirmTouched && confirmPassword.length > 0 && confirmPassword !== newPassword;

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (resetLoading || !newPassword || newPassword !== confirmPassword) return;
    setResetLoading(true);
    setError(null);
    try {
      await api.post("/api/auth/reset-password", { email, code, newPassword });
      setSuccess(true);
      setTimeout(() => {
        router.push("/dang-nhap");
      }, 1500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Đặt lại mật khẩu thất bại");
    } finally {
      setResetLoading(false);
    }
  }

  if (step === "request") {
    return (
      <>
        <h1 className="font-display text-2xl font-black uppercase tracking-tight text-[#f5f0f0]">
          Quên mật khẩu
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Nhập email để nhận mã xác nhận.
        </p>

        <form onSubmit={handleRequestSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-white/70">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ban@email.com"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-200 focus:border-[#DC2626] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.15)]"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={requestLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#8B0000] px-7 py-3 text-sm font-bold uppercase tracking-wide text-[#f5f0f0] transition-all hover:bg-red-600 hover:shadow-[0_0_24px_rgba(220,38,38,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {requestLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Gửi mã xác nhận"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          <Link href="/dang-nhap" className="font-semibold text-red-500 hover:text-red-400">
            Quay lại đăng nhập
          </Link>
        </p>
      </>
    );
  }

  if (step === "otp") {
    return (
      <>
        <h1 className="font-display text-2xl font-black uppercase tracking-tight text-[#f5f0f0]">
          Xác thực OTP
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Mã xác nhận 6 số đã được gửi tới{" "}
          <span className="text-white/80">{email}</span>.
        </p>

        <div className="mt-6">
          <OtpInput key={otpKey} onComplete={handleOtpComplete} />
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <p className="mt-4 text-center text-sm text-white/50">
          <button
            type="button"
            onClick={handleResend}
            className="font-semibold text-red-500 hover:text-red-400"
          >
            Gửi lại mã
          </button>
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="font-display text-2xl font-black uppercase tracking-tight text-[#f5f0f0]">
        Đặt lại mật khẩu
      </h1>
      <p className="mt-1 text-sm text-white/50">
        Tạo mật khẩu mới cho tài khoản của bạn.
      </p>

      {success ? (
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-green-800/40 bg-green-950/30 px-4 py-3 text-sm text-green-300">
          <CheckCircle2 size={18} />
          Đổi mật khẩu thành công, vui lòng đăng nhập lại
        </div>
      ) : (
        <form onSubmit={handleResetSubmit} className="mt-6 flex flex-col gap-4">
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
            disabled={resetLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#8B0000] px-7 py-3 text-sm font-bold uppercase tracking-wide text-[#f5f0f0] transition-all hover:bg-red-600 hover:shadow-[0_0_24px_rgba(220,38,38,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {resetLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Đặt lại mật khẩu"
            )}
          </button>
        </form>
      )}
    </>
  );
}

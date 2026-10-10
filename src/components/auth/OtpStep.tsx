"use client";

import { useState } from "react";
import { AlertTriangle, ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { OtpInput } from "./OtpInput";
import { ApiError } from "@/lib/api-client";
import { formatCountdown, useCountdown } from "@/lib/use-countdown";

export interface OtpIssue {
  expiresInSeconds: number;
  resendAfterSeconds: number;
}

interface OtpStepProps {
  /** Email DA CHUAN HOA do BE tra ve. */
  email: string;
  maskedDestination?: string | null;
  issue: OtpIssue;
  onSubmit: (code: string) => Promise<void>;
  onResend: () => Promise<OtpIssue | void>;
  onBack?: () => void;
  description?: string;
}

/**
 * Buoc nhap OTP, xu ly DAY DU cac ma loi BE co the tra ve.
 *
 * Vi sao phai tach tung ma thay vi hien `message` chung: moi ma dan toi mot HANH DONG khac nhau.
 * "Sai mã" thì xoá ô nhập cho gõ lại; "hết hạn" và "sai quá nhiều lần" thì ô nhập vô nghĩa,
 * phải đẩy người dùng sang nút "Gửi lại mã"; "đang cooldown" thì chính nút đó lại phải bị khoá
 * kèm đếm ngược. Hiện chung một dòng đỏ là để người dùng tự đoán.
 */
export function OtpStep({
  email,
  maskedDestination,
  issue,
  onSubmit,
  onResend,
  onBack,
  description,
}: OtpStepProps) {
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  /** Ma hien tai khong con dung duoc (het han hoac bi khoa) -> phai lay ma moi. */
  const [needsNewCode, setNeedsNewCode] = useState(false);
  const [otpKey, setOtpKey] = useState(0);

  const expiry = useCountdown(issue.expiresInSeconds);
  const resend = useCountdown(issue.resendAfterSeconds);

  const expired = expiry.finished;
  const inputDisabled = loading || needsNewCode || expired;

  async function handleComplete(code: string) {
    if (inputDisabled) return;
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      await onSubmit(code);
    } catch (err) {
      handleApiError(err);
      setOtpKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  }

  function handleApiError(err: unknown) {
    if (!(err instanceof ApiError)) {
      setError("Không kết nối được máy chủ, vui lòng thử lại");
      return;
    }

    switch (err.code) {
      case "OTP_TOO_MANY_ATTEMPTS":
        // Ma nay chet han - o nhap khong con y nghia, day nguoi dung sang nut gui lai
        setNeedsNewCode(true);
        setError(err.message);
        break;
      case "OTP_EXPIRED":
        setNeedsNewCode(true);
        setError(err.message);
        break;
      case "OTP_COOLDOWN":
      case "RATE_LIMITED":
        // Khoa nut gui lai dung bang thoi gian BE yeu cau
        resend.restart(err.retryAfterSeconds ?? 60);
        setError(err.message);
        break;
      case "EMAIL_ALREADY_EXISTS":
        setError("Email này đã được xác thực trước đó, bạn có thể đăng nhập.");
        break;
      case "ACCOUNT_SUSPENDED":
        setError(err.message);
        setNeedsNewCode(true);
        break;
      default:
        setError(err.message);
    }
  }

  async function handleResend() {
    if (!resend.finished || resending) return;
    setResending(true);
    setError(null);
    setNotice(null);
    try {
      const next = await onResend();
      const expiresIn = next?.expiresInSeconds ?? issue.expiresInSeconds;
      const resendIn = next?.resendAfterSeconds ?? issue.resendAfterSeconds;
      expiry.restart(expiresIn);
      resend.restart(resendIn);
      setNeedsNewCode(false);
      setOtpKey((k) => k + 1);
      setNotice("Đã gửi mã mới. Vui lòng kiểm tra hộp thư (kể cả mục Spam).");
    } catch (err) {
      handleApiError(err);
    } finally {
      setResending(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-black uppercase tracking-tight text-[#f5f0f0]">
        Xác thực email
      </h1>
      <p className="mt-1 text-sm text-white/50">
        {description ?? "Mã xác nhận 6 số đã được gửi tới"}{" "}
        <span className="text-white/80">{maskedDestination || email}</span>.
      </p>

      <div className={`mt-6 ${inputDisabled ? "opacity-40" : ""}`}>
        <OtpInput key={otpKey} onComplete={handleComplete} />
      </div>

      <div className="mt-3 flex min-h-5 items-center justify-between text-xs">
        <span className="font-mono text-white/40">
          {expired ? "Mã đã hết hạn" : `Mã hết hạn sau ${formatCountdown(expiry.remaining)}`}
        </span>
        {loading && <Loader2 size={14} className="animate-spin text-white/50" />}
      </div>

      {error && (
        <p className="mt-3 flex items-start gap-2 text-sm text-red-400" role="alert">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
      {notice && (
        <p className="mt-3 flex items-start gap-2 text-sm text-emerald-400" role="status">
          <MailCheck size={15} className="mt-0.5 shrink-0" />
          <span>{notice}</span>
        </p>
      )}

      <div className="mt-5 flex items-center justify-between text-sm">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-white/50 hover:text-white/80"
          >
            <ArrowLeft size={14} />
            Sửa thông tin
          </button>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={handleResend}
          disabled={!resend.finished || resending}
          className="font-semibold text-red-500 hover:text-red-400 disabled:cursor-not-allowed disabled:text-white/30"
        >
          {resending
            ? "Đang gửi..."
            : resend.finished
              ? "Gửi lại mã"
              : `Gửi lại sau ${resend.remaining}s`}
        </button>
      </div>
    </div>
  );
}

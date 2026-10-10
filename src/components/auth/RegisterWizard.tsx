"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthCard } from "./AuthCard";
import { PasswordInput } from "./PasswordInput";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import { OtpStep, type OtpIssue } from "./OtpStep";
import { api, ApiError } from "@/lib/api-client";
import { useAuth, type AuthResponse } from "@/lib/auth-context";
import type { AvailabilityResponse, RegisterResponse } from "@/lib/types";

type Step = "form" | "otp";

const DEFAULT_ISSUE: OtpIssue = { expiresInSeconds: 600, resendAfterSeconds: 60 };

export function RegisterWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();

  // Vao thang buoc OTP tu /dang-ky?step=otp&email=... — trang dang nhap dieu huong sang day
  // khi BE tra EMAIL_NOT_VERIFIED (BE da gui san mot ma moi).
  const initialEmail = searchParams.get("email") ?? "";
  const [step, setStep] = useState<Step>(
    searchParams.get("step") === "otp" && initialEmail ? "otp" : "form"
  );

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  /** Email da chuan hoa do BE tra ve — dung cho verify/resend, khong dung chuoi nguoi dung go. */
  const [verifiedEmail, setVerifiedEmail] = useState(initialEmail);
  const [maskedDestination, setMaskedDestination] = useState<string | null>(null);
  const [issue, setIssue] = useState<OtpIssue>(DEFAULT_ISSUE);

  const mismatch = confirmTouched && confirmPassword.length > 0 && confirmPassword !== password;

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  /**
   * Bao trung ngay khi nguoi dung roi khoi o nhap, thay vi de ho dien het form roi moi bao.
   * Loi mang o day thi im lang — day chi la tien ich, dang ky van kiem tra lai o BE.
   */
  async function checkAvailability(field: "email" | "phone", value: string) {
    if (!value.trim()) return;
    try {
      const result = await api.get<AvailabilityResponse>(
        `/api/auth/check-availability?${field}=${encodeURIComponent(value.trim())}`
      );
      if (!result.available && result.reason) {
        setFieldErrors((prev) => ({ ...prev, [field]: result.reason as string }));
      } else {
        clearFieldError(field);
      }
    } catch (err) {
      // Dinh dang sai thi BE tra 400 kem fieldErrors — van dang hien cho nguoi dung sua som
      if (err instanceof ApiError && err.fieldError(field)) {
        setFieldErrors((prev) => ({ ...prev, [field]: err.fieldError(field) as string }));
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || !agreed || password !== confirmPassword) return;
    setLoading(true);
    setFormError(null);
    setFieldErrors({});
    try {
      const response = await api.post<RegisterResponse>("/api/auth/register", {
        fullName,
        email,
        phone,
        password,
      });
      setVerifiedEmail(response.email);
      setMaskedDestination(response.maskedDestination);
      setIssue({
        expiresInSeconds: response.otpExpiresInSeconds,
        resendAfterSeconds: response.resendAfterSeconds,
      });
      setStep("otp");
    } catch (err) {
      if (err instanceof ApiError) {
        // Loi cua o nhap nao thi gan ngay duoi o do; con lai hien mot dong chung
        setFieldErrors(err.fieldErrors);
        setFormError(Object.keys(err.fieldErrors).length > 0 ? null : err.message);
      } else {
        setFormError("Đăng ký thất bại, vui lòng thử lại");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(code: string) {
    const response = await api.post<AuthResponse>("/api/auth/verify-otp", {
      email: verifiedEmail,
      code,
    });
    auth.login(response);
    router.push("/");
  }

  async function handleResend() {
    await api.post("/api/auth/resend-otp", { email: verifiedEmail });
    return issue;
  }

  if (step === "otp") {
    return (
      <AuthCard>
        <OtpStep
          email={verifiedEmail}
          maskedDestination={maskedDestination}
          issue={issue}
          onSubmit={handleVerify}
          onResend={handleResend}
          onBack={initialEmail ? undefined : () => setStep("form")}
        />
        <p className="mt-6 text-center text-sm text-white/50">
          Sai email?{" "}
          <Link href="/dang-ky" className="font-semibold text-red-500 hover:text-red-400">
            Đăng ký lại
          </Link>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <h1 className="font-display text-2xl font-black uppercase tracking-tight text-[#f5f0f0]">
        Đăng ký
      </h1>
      <p className="mt-1 text-sm text-white/50">Tạo hồ sơ điều tra viên của riêng bạn.</p>

      <ol className="mt-5 flex items-center gap-2 text-[11px] font-mono uppercase tracking-wide">
        <li className="flex items-center gap-1.5 text-red-400">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-red-500/60">
            1
          </span>
          Thông tin
        </li>
        <span className="h-px flex-1 bg-white/10" />
        <li className="flex items-center gap-1.5 text-white/30">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/15">
            2
          </span>
          Xác thực
        </li>
      </ol>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
        <Field
          id="fullName"
          label="Họ và tên"
          value={fullName}
          onChange={setFullName}
          placeholder="Nguyễn Văn A"
          error={fieldErrors.fullName}
          required
        />

        <Field
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(v) => {
            setEmail(v);
            clearFieldError("email");
          }}
          onBlur={() => checkAvailability("email", email)}
          placeholder="ban@email.com"
          error={fieldErrors.email}
          required
        />

        <Field
          id="phone"
          label="Số điện thoại"
          value={phone}
          onChange={(v) => {
            setPhone(v);
            clearFieldError("phone");
          }}
          onBlur={() => checkAvailability("phone", phone)}
          placeholder="0912 345 678"
          hint="Quản trị viên dùng số này để gọi xác nhận buổi chơi."
          error={fieldErrors.phone}
          required
        />

        <div>
          <PasswordInput
            id="password"
            label="Mật khẩu"
            value={password}
            onChange={setPassword}
            error={fieldErrors.password}
            autoComplete="new-password"
          />
          <PasswordStrengthMeter password={password} />
        </div>

        <PasswordInput
          id="confirmPassword"
          label="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(value) => {
            setConfirmTouched(true);
            setConfirmPassword(value);
          }}
          error={mismatch ? "Mật khẩu không khớp" : null}
          autoComplete="new-password"
        />

        <label className="flex items-start gap-2 text-sm text-white/60">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 accent-red-600"
          />
          Tôi đồng ý với <span className="text-red-500">Điều khoản dịch vụ</span>
        </label>

        {formError && (
          <p className="text-sm text-red-400" role="alert">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !agreed}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#8B0000] px-7 py-3 text-sm font-bold uppercase tracking-wide text-[#f5f0f0] transition-all hover:bg-red-600 hover:shadow-[0_0_24px_rgba(220,38,38,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Tiếp tục"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/50">
        Đã có tài khoản?{" "}
        <Link href="/dang-nhap" className="font-semibold text-red-500 hover:text-red-400">
          Đăng nhập
        </Link>
      </p>
    </AuthCard>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

function Field({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  hint,
  error,
  required,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-white/70">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`w-full rounded-lg border bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.15)] ${
          error ? "border-red-500/60 focus:border-red-500" : "border-white/10 focus:border-[#DC2626]"
        }`}
      />
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1 text-xs text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-white/35">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function RegisterWizardFallback() {
  return (
    <AuthCard>
      <div className="flex items-center gap-2 text-sm text-white/50">
        <Loader2 size={16} className="animate-spin" />
        Đang tải biểu mẫu...
      </div>
    </AuthCard>
  );
}

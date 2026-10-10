"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, MailWarning } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { api, ApiError } from "@/lib/api-client";
import { useAuth, type AuthResponse } from "@/lib/auth-context";

export default function DangNhapPage() {
  const router = useRouter();
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<AuthResponse>("/api/auth/login", { email, password });
      auth.login(response);
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError && err.is("EMAIL_NOT_VERIFIED")) {
        // BE da tu gui mot ma moi truoc khi tra loi nay -> dua thang sang man nhap OTP,
        // khong bat nguoi dung go lai email hay tu tim nut "gui lai ma".
        const verifiedEmail = (err.data.email as string | undefined) ?? email;
        setRedirecting(true);
        setError(err.message);
        router.push(`/dang-ky?step=otp&email=${encodeURIComponent(verifiedEmail)}`);
        return;
      }
      setError(err instanceof ApiError ? err.message : "Đăng nhập thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard>
      <h1 className="font-display text-2xl font-black uppercase tracking-tight text-[#f5f0f0]">
        Đăng nhập
      </h1>
      <p className="mt-1 text-sm text-white/50">Quay lại hiện trường vụ án tiếp theo của bạn.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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

        <PasswordInput
          id="password"
          label="Mật khẩu"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-white/60">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 accent-red-600"
            />
            Ghi nhớ đăng nhập
          </label>
          <Link href="/quen-mat-khau" className="text-[13px] text-red-500 hover:text-red-400">
            Quên mật khẩu?
          </Link>
        </div>

        {error && (
          <p
            className={`flex items-start gap-2 text-sm ${redirecting ? "text-amber-400" : "text-red-400"}`}
            role="alert"
          >
            {redirecting && <MailWarning size={15} className="mt-0.5 shrink-0" />}
            <span>{error}</span>
          </p>
        )}

        <button
          type="submit"
          disabled={loading || redirecting}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#8B0000] px-7 py-3 text-sm font-bold uppercase tracking-wide text-[#f5f0f0] transition-all hover:bg-red-600 hover:shadow-[0_0_24px_rgba(220,38,38,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading || redirecting ? <Loader2 size={16} className="animate-spin" /> : "Đăng nhập"}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-white/40">hoặc</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <p className="mt-6 text-center text-sm text-white/50">
        Chưa có tài khoản?{" "}
        <Link href="/dang-ky" className="font-semibold text-red-500 hover:text-red-400">
          Đăng ký ngay
        </Link>
      </p>
    </AuthCard>
  );
}

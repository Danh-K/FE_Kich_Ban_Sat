"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { api, ApiError } from "@/lib/api-client";
import { useAuth, type AuthResponse } from "@/lib/auth-context";

export default function AdminLoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<AuthResponse>("/api/auth/admin/login", { username, password });
      if (response.role !== "ADMIN") {
        setError("Tài khoản này không có quyền quản trị");
        return;
      }
      auth.login(response);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Đăng nhập thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-noir-950 px-6">
      <GrainOverlay />
      <AuthCard>
        <h1 className="font-display text-2xl font-black uppercase tracking-tight text-[#f5f0f0]">
          Đăng nhập quản trị
        </h1>
        <p className="mt-1 text-sm text-white/50">Dành cho quản trị viên hệ thống.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-sm font-medium text-white/70">
              Tên đăng nhập
            </label>
            <input
              id="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
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

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#8B0000] px-7 py-3 text-sm font-bold uppercase tracking-wide text-[#f5f0f0] transition-all hover:bg-red-600 hover:shadow-[0_0_24px_rgba(220,38,38,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Đăng nhập"}
          </button>
        </form>
      </AuthCard>
    </div>
  );
}

"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type UserRole = "PLAYER" | "DM" | "ADMIN";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  ready: boolean;
  login: (response: AuthResponse) => void;
  logout: () => void;
}

const STORAGE_KEY = "kbs_auth";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Hydrat hoa tu localStorage sau khi mount (khong the doc luc SSR, va can giu ready=false
    // truoc do de tranh hydration mismatch) - setState o day la dong bo voi nguon ben ngoai
    // (trinh duyet), khong the thay the bang derive-during-render.
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { token: string; user: AuthUser };
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setToken(parsed.token);
        setUser(parsed.user);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setReady(true);
  }, []);

  const login = (response: AuthResponse) => {
    const nextUser: AuthUser = {
      id: response.userId,
      fullName: response.fullName,
      email: response.email,
      role: response.role,
    };
    setToken(response.token);
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: response.token, user: nextUser }));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      isAdmin: user?.role === "ADMIN",
      ready,
      login,
      logout,
    }),
    [user, token, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

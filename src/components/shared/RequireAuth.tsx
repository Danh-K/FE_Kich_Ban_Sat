"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { ready, isAuthenticated } = useAuth();

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace("/dang-nhap");
    }
  }, [ready, isAuthenticated, router]);

  if (!ready || !isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-red-600" size={28} />
      </div>
    );
  }

  return <>{children}</>;
}

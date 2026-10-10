"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { ready, isAdmin } = useAuth();

  useEffect(() => {
    if (ready && !isAdmin) {
      router.replace("/admin-login");
    }
  }, [ready, isAdmin, router]);

  if (!ready || !isAdmin) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-noir-950">
        <Loader2 className="animate-spin text-red-600" size={28} />
      </div>
    );
  }

  return <>{children}</>;
}

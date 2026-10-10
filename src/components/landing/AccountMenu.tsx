"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

/** Dropdown "tài khoản" o header site: hien ten nguoi dung dang nhap + link ho so + dang xuat. */
export function AccountMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="group flex items-center gap-1.5 text-[15px] text-white/80 transition-colors hover:text-red-500"
      >
        <User size={15} />
        {user?.fullName ?? "TÀI KHOẢN"}
        <ChevronDown size={13} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-52 rounded-xl border border-red-900/20 bg-noir-900 p-2 shadow-2xl">
          <Link
            href="/tai-khoan"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/[0.05] hover:text-white"
          >
            Tài khoản của tôi
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-white/70 hover:bg-white/[0.05] hover:text-red-500"
          >
            <LogOut size={14} />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

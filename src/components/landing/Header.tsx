"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { AccountMenu } from "./AccountMenu";
import { NotificationBell } from "@/components/notifications/NotificationBell";

const BASE_NAV_LINKS = [
  { label: "KỊCH BẢN", href: "/#scripts" },
  { label: "CỬA HÀNG", href: "/cua-hang" },
  { label: "BẢNG XẾP HẠNG", href: "/bang-xep-hang" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "bg-noir-950/90 backdrop-blur-md border-b border-blood-900/20"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          onClick={handleLogoClick}
          className="flex items-center gap-1.5 font-display text-lg font-black tracking-tight text-[#f5f0f0] transition-transform hover:scale-105"
        >
          MURDER NIGHT
          <span className="mb-2 inline-block h-1.5 w-1.5 rounded-full bg-red-600 shadow-[0_0_6px_2px_rgba(220,38,38,0.6)]" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {BASE_NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="group relative text-[15px] text-white/80 transition-colors hover:text-red-500"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-red-600 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <AccountMenu />
            </>
          ) : (
            <Link
              href="/dang-nhap"
              className="group relative text-[15px] text-white/80 transition-colors hover:text-red-500"
            >
              ĐĂNG NHẬP
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-red-600 transition-all duration-300 group-hover:w-full" />
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-5">
          <button
            aria-label="Mở menu"
            onClick={() => setMenuOpen(true)}
            className="text-white/80 md:hidden"
          >
            <Menu size={26} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-noir-950 md:hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,0,0,0.25),transparent_60%)]" />
          <div className="relative flex items-center justify-between px-6 py-4">
            <span className="font-display text-lg font-black text-[#f5f0f0]">
              MURDER NIGHT
            </span>
            <button
              aria-label="Đóng menu"
              onClick={() => setMenuOpen(false)}
              className="text-white/80"
            >
              <X size={26} />
            </button>
          </div>
          <nav className="relative mt-12 flex flex-col items-center gap-8">
            {BASE_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-3xl font-bold text-white/90 hover:text-red-500"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  href="/tai-khoan"
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-3xl font-bold text-white/90 hover:text-red-500"
                >
                  {user?.fullName ?? "TÀI KHOẢN"}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 font-display text-xl font-bold text-white/60 hover:text-red-500"
                >
                  <LogOut size={20} />
                  ĐĂNG XUẤT
                </button>
              </>
            ) : (
              <Link
                href="/dang-nhap"
                onClick={() => setMenuOpen(false)}
                className="font-display text-3xl font-bold text-white/90 hover:text-red-500"
              >
                ĐĂNG NHẬP
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

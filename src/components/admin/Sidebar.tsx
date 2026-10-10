"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CalendarClock,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Store,
  Ticket,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "TỔNG QUAN",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "VẬN HÀNH",
    items: [
      { href: "/admin/sessions", label: "Buổi chơi", icon: CalendarClock },
      { href: "/admin/users", label: "Người dùng", icon: Users },
      { href: "/admin/stores", label: "Cửa hàng", icon: Store },
      { href: "/admin/vouchers", label: "Voucher", icon: Ticket },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-red-900/10 bg-noir-900 transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center justify-between px-4 py-5">
        {!collapsed && (
          <span className="font-display text-base font-black text-[#f5f0f0]">
            MURDER<span className="text-red-600">.</span>ADMIN
          </span>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto text-white/40 hover:text-red-500"
          aria-label="Thu gọn sidebar"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-2 pb-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 pb-2 font-mono text-[10px] tracking-widest text-white/30">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md border-l-2 px-3 py-2 text-sm transition-colors",
                      active
                        ? "border-red-600 bg-red-950/20 text-[#f5f0f0]"
                        : "border-transparent text-white/50 hover:bg-white/5 hover:text-white/80"
                    )}
                  >
                    <item.icon size={18} className="shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

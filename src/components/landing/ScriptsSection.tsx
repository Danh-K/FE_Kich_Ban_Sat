"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { formatVnd, cn } from "@/lib/utils";
import { DifficultyStars } from "@/components/shared/DifficultyStars";
import { getCategoryStyle } from "@/components/script/genreStyles";
import type { Script } from "@/lib/types";

type Tab = "open" | "all";

export function ScriptsSection({
  scripts,
  openScriptIds,
}: {
  scripts: Script[];
  openScriptIds: string[];
}) {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>(searchParams.get("tab") === "all" ? "all" : "open");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const openScriptIdSet = useMemo(() => new Set(openScriptIds), [openScriptIds]);
  const openScripts = useMemo(
    () => scripts.filter((s) => openScriptIdSet.has(s.id)),
    [scripts, openScriptIdSet]
  );

  const baseList = tab === "open" ? openScripts : scripts;

  const categoryList = useMemo(() => {
    const names = new Set<string>();
    scripts.forEach((s) => s.categories.forEach((c) => names.add(c.name)));
    return Array.from(names).sort();
  }, [scripts]);

  const filtered = useMemo(() => {
    if (selected.size === 0) return baseList;
    return baseList.filter((s) => s.categories.some((c) => selected.has(c.name)));
  }, [baseList, selected]);

  function toggleCategory(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "open", label: `Đang mở lịch (${openScripts.length})` },
    { key: "all", label: `Tất cả kịch bản (${scripts.length})` },
  ];

  return (
    <section id="scripts" className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-red-600">
          BỘ SƯU TẬP HỒ SƠ
        </p>
        <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight text-[#f5f0f0] md:text-4xl">
          Kịch bản nổi bật
        </h2>

        <div className="relative mt-8 flex gap-8 border-b border-white/10">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "relative pb-3 text-sm font-semibold transition-colors",
                tab === t.key ? "text-red-500" : "text-white/50 hover:text-white/80"
              )}
            >
              {t.label}
              {tab === t.key && (
                <motion.span
                  layoutId="scripts-tab-underline"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-red-600"
                />
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSelected(new Set())}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all",
              selected.size === 0
                ? "border-transparent bg-[#8B0000] text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                : "border-red-900/30 text-white/60 hover:border-red-600/50"
            )}
          >
            Tất cả
          </button>
          {categoryList.map((name) => (
            <button
              key={name}
              onClick={() => toggleCategory(name)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all",
                selected.has(name)
                  ? "border-transparent bg-[#8B0000] text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                  : "border-red-900/30 text-white/60 hover:border-red-600/50"
              )}
            >
              {name}
            </button>
          ))}
          <span className="ml-auto font-mono text-xs text-white/40">
            {filtered.length} kịch bản
          </span>
        </div>

        <div
          key={`${tab}-${Array.from(selected).sort().join(",")}`}
          className="mt-8 grid animate-[fade-in_0.2s_ease] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((script) => {
            const hasSession = openScriptIdSet.has(script.id);
            return (
              <Link
                key={script.id}
                href={`/kich-ban/${script.slug}`}
                className="group overflow-hidden rounded-xl border border-red-900/15 bg-noir-850 transition-all duration-300 hover:scale-[1.02] hover:border-red-600/40"
              >
                <div className="relative h-[150px] w-full overflow-hidden bg-gradient-to-br from-noir-700 to-noir-950">
                  {script.coverImageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={script.coverImageUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-noir-950/80 via-noir-950/10 to-transparent" />
                  <span className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    {script.categories.slice(0, 2).map((c) => (
                      <span
                        key={c.id}
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getCategoryStyle(c.name)}`}
                      >
                        {c.name}
                      </span>
                    ))}
                  </span>
                  <span
                    className={cn(
                      "absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                      hasSession ? "bg-green-900/40 text-green-300" : "bg-white/10 text-white/50"
                    )}
                  >
                    {hasSession ? "Đang mở lịch" : "Chưa có lịch"}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="truncate font-display text-lg font-bold text-[#f5f0f0]">
                    {script.title}
                  </h3>
                  <DifficultyStars
                    level={script.difficultyStar}
                    variant="compact"
                    className="mt-2"
                  />
                  <div className="mt-3 flex items-center gap-3 font-mono text-[11px] text-white/50">
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {script.playerCount} người
                    </span>
                    <span>{script.durationText}</span>
                  </div>
                  <p className="mt-3 text-sm font-bold text-red-500">
                    {formatVnd(script.basePrice)}
                  </p>
                </div>
              </Link>
            );
          })}
          {filtered.length === 0 && (
            <p className="col-span-full py-12 text-center text-sm text-white/40">
              Không có kịch bản nào khớp bộ lọc hiện tại.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

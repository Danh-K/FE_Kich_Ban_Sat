import type { Script } from "@/lib/types";
import { getCategoryStyle } from "./genreStyles";

export function ScriptHero({ script, coverImageUrl }: { script: Script; coverImageUrl: string | null }) {
  return (
    <section className="relative overflow-hidden pt-24 md:pt-28">
      {coverImageUrl ? (
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center opacity-40 blur-2xl"
          style={{ backgroundImage: `url(${coverImageUrl})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-noir-700 to-noir-950" />
      )}

      {/* Atmospheric glow */}
      <div className="pointer-events-none absolute left-1/2 top-[10%] h-[240px] w-[600px] -translate-x-1/2 rounded-full bg-[#8B0000] opacity-25 blur-[60px]" />

      {/* Darken/fade backdrop for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-noir-950/60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-noir-950" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 pb-10 md:flex-row md:items-end">
        {coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImageUrl}
            alt={script.title}
            className="max-h-[320px] w-auto shrink-0 rounded-lg object-contain shadow-[0_16px_48px_rgba(0,0,0,0.5)] md:max-h-[380px]"
          />
        )}
        <div>
          <h1 className="max-w-3xl font-display text-[32px] font-black uppercase leading-[1.1] tracking-tight text-[#f5f0f0] md:text-[48px]">
            {script.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {script.categories.map((c) => (
              <span
                key={c.id}
                className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${getCategoryStyle(c.name)}`}
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

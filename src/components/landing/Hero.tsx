import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CaseFileCard } from "./CaseFileCard";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-20">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        src="/video/case-room-loop.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0505_85%)]" />
      {/* Bottom blood gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#3a0000] to-transparent opacity-40" />

      {/* Case-board grid lines (desktop only) */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute inset-y-0 left-1/4 w-px bg-white/5" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/5" />
        <div className="absolute inset-y-0 left-3/4 w-px bg-white/5" />
      </div>

      {/* Center glow */}
      <div className="pointer-events-none absolute left-1/2 top-[18%] h-[280px] w-[720px] -translate-x-1/2 rounded-full bg-[#8B0000] opacity-25 blur-[60px]" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <CaseFileCard />

        <p className="mt-8 font-mono text-[11px] font-bold tracking-[0.2em] text-red-600">
          TRẢI NGHIỆM SUY LUẬN ĐỈNH CAO
        </p>

        <h1 className="mt-4 max-w-4xl font-display text-[36px] font-black uppercase leading-[1.05] tracking-tight text-[#f5f0f0] md:text-[68px]">
          Bước vào hiện trường vụ án
          <span className="text-red-600 [text-shadow:0_0_12px_#8B0000]">.</span>
        </h1>

        <p className="mt-6 max-w-[480px] text-sm text-white/60">
          Hóa thân thành nhân vật, thu thập manh mối, và tìm ra hung thủ trước khi
          quá muộn.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#scripts"
            className="group flex items-center gap-2 rounded-full bg-[#8B0000] px-7 py-3 text-sm font-bold uppercase tracking-wide text-[#f5f0f0] transition-all hover:bg-red-600 hover:shadow-[0_0_24px_rgba(220,38,38,0.5)]"
          >
            Đặt Lịch Ngay
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
          <Link
            href="/?tab=all#scripts"
            className="rounded-full border border-red-900/40 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white/70 transition-colors hover:border-red-600/60 hover:text-white"
          >
            Xem Kịch Bản
          </Link>
        </div>
      </div>
    </section>
  );
}

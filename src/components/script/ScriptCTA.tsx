"use client";

interface ScriptCTAProps {
  hasSessions: boolean;
}

function scrollToSessions(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  document.getElementById("sessions")?.scrollIntoView({ behavior: "smooth" });
}

export function ScriptCTA({ hasSessions }: ScriptCTAProps) {
  return (
    <>
      {/* Desktop inline CTA */}
      <div className="hidden justify-center px-6 pb-16 md:flex">
        {hasSessions ? (
          <a
            href="#sessions"
            onClick={scrollToSessions}
            className="rounded-full bg-[#8B0000] px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-[#f5f0f0] transition-all hover:bg-red-600 hover:shadow-[0_0_24px_rgba(220,38,38,0.5)]"
          >
            Đặt Lịch Ngay
          </a>
        ) : (
          <span className="cursor-default rounded-full border border-red-900/40 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white/70">
            Chưa có lịch — theo dõi để nhận thông báo
          </span>
        )}
      </div>

      {/* Mobile sticky bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-red-900/20 bg-noir-950/95 p-4 backdrop-blur md:hidden">
        {hasSessions ? (
          <a
            href="#sessions"
            onClick={scrollToSessions}
            className="block w-full rounded-full bg-[#8B0000] py-3.5 text-center text-sm font-bold uppercase tracking-wide text-[#f5f0f0] transition-all hover:bg-red-600"
          >
            Đặt Lịch Ngay
          </a>
        ) : (
          <span className="block w-full cursor-default rounded-full border border-red-900/40 py-3.5 text-center text-sm font-bold uppercase tracking-wide text-white/70">
            Chưa có lịch — theo dõi để nhận thông báo
          </span>
        )}
      </div>
    </>
  );
}

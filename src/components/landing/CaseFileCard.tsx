import { Pin } from "lucide-react";

export function CaseFileCard() {
  return (
    <div className="relative z-10 mb-[-40px] w-[220px] -rotate-3 rounded-lg border border-red-600/30 bg-[rgba(20,8,8,0.4)] p-4 shadow-[0_0_20px_rgba(139,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-md">
      <Pin className="absolute -left-2 -top-2 h-5 w-5 -rotate-45 text-red-600" />
      <p className="font-mono text-[12px] tracking-widest text-red-500">
        [ HỒ SƠ #001 ]
      </p>
      <p className="mt-2 text-[16px] leading-snug text-[#f5f0f0]">
        Bạn có phải là <span className="font-display italic text-red-400">hung thủ</span>?
      </p>
      <p className="mt-2 font-mono text-[10px] leading-relaxed text-white/50">
        6 nhân vật. 1 sự thật. Ai đang nói dối?
      </p>
    </div>
  );
}

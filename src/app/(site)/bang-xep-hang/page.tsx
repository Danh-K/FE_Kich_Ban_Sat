import { LeaderboardBoard } from "@/components/leaderboard/LeaderboardBoard";

export default function LeaderboardPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-20 pt-24 md:pt-28">
      <div className="mb-8 text-center md:text-left">
        <p className="font-mono text-xs uppercase tracking-widest text-red-500/70">
          Bảng xếp hạng
        </p>
        <h1 className="mt-2 font-display text-3xl font-black text-white md:text-4xl">
          Thám tử lừng danh
        </h1>
        <p className="mt-2 text-white/50">
          Xếp hạng dựa trên số vụ án đã phá và độ khó của những kịch bản đã
          chinh phục.
        </p>
      </div>

      <LeaderboardBoard />
    </section>
  );
}

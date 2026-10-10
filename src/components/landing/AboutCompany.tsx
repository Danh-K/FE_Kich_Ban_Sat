import { MapPin } from "lucide-react";

const STATS = [
  { value: "9+", label: "Kịch bản" },
  { value: "1,000+", label: "Lượt chơi" },
  { value: "4.8/5", label: "Đánh giá trung bình" },
  { value: "10+", label: "DM chuyên nghiệp" },
];

export function AboutCompany() {
  return (
    <section
      id="ve-chung-toi"
      className="relative border-y border-red-900/10 bg-[#0d0707] px-6 py-24"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-red-600">
          VỀ CHÚNG TÔI
        </p>
        <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight text-[#f5f0f0] md:text-4xl">
          Murder Night — Nơi mọi vụ án đều có lời giải
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/60">
          Murder Night ra đời từ niềm đam mê với thể loại kịch bản sát (murder
          mystery) — nơi mỗi người chơi không chỉ xem một câu chuyện mà thực sự
          sống trong nó. Chúng tôi tuyển chọn kỹ lưỡng từng kịch bản và đào tạo
          đội ngũ Quản trò (DM) chuyên nghiệp, để mỗi buổi chơi là một hiện
          trường vụ án trọn vẹn — nơi sự thật chỉ lộ diện khi mọi manh mối được
          ghép lại đúng chỗ.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-mono text-2xl font-bold text-red-500 md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-xs text-white/40">
          <MapPin size={14} className="text-red-500" />
          123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh
        </div>
      </div>
    </section>
  );
}

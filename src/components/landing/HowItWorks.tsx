import { CalendarCheck, Drama, Search, ShieldQuestion } from "lucide-react";

const STEPS = [
  {
    icon: CalendarCheck,
    title: "Chọn buổi chơi",
    desc: "Chọn kịch bản, khung giờ và vai diễn bạn muốn hoá thân.",
  },
  {
    icon: Drama,
    title: "Nhập vai",
    desc: "Nhận hồ sơ nhân vật và bắt đầu diễn xuất tại hiện trường.",
  },
  {
    icon: Search,
    title: "Thu thập manh mối",
    desc: "Lục soát hiện trường, thẩm vấn, ghép nối các mảnh sự thật.",
  },
  {
    icon: ShieldQuestion,
    title: "Vạch mặt hung thủ",
    desc: "Đưa ra suy luận cuối cùng trước khi phiên toà khép lại.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-red-600">
          QUY TRÌNH
        </p>
        <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight text-[#f5f0f0] md:text-4xl">
          Cách thức hoạt động
        </h2>

        <div className="relative mt-14 grid grid-cols-1 gap-8 md:grid-cols-4">
          <svg
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px w-full md:block"
          >
            <line
              x1="12%"
              x2="88%"
              y1="0"
              y2="0"
              stroke="#DC2626"
              strokeOpacity="0.4"
              strokeWidth="2"
              strokeDasharray="6 6"
              className="animate-dash-flow"
            />
          </svg>

          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-xl border border-red-900/15 bg-noir-850 p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-red-600/30 bg-red-900/20 font-mono text-sm font-bold text-red-500">
                {String(i + 1).padStart(2, "0")}
              </div>
              <step.icon className="mt-4 h-6 w-6 text-red-500" />
              <h3 className="mt-3 font-display text-lg font-bold text-[#f5f0f0]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-white/50">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

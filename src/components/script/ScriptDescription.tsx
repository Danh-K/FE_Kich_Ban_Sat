export function ScriptDescription({ description }: { description: string }) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-[720px]">
        <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-red-600">
          HỒ SƠ VỤ ÁN
        </p>
        <h2 className="mt-3 font-display text-2xl font-black uppercase tracking-tight text-[#f5f0f0] md:text-3xl">
          Nội dung kịch bản
        </h2>
        <p className="mt-6 text-[15px] leading-[1.7] text-white/70 first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-5xl first-letter:italic first-letter:leading-none first-letter:text-red-500">
          {description}
        </p>
      </div>
    </section>
  );
}

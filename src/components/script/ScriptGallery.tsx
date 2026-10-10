export function ScriptGallery({ imageUrls }: { imageUrls: string[] }) {
  if (imageUrls.length === 0) return null;

  return (
    <section className="px-6 pb-16">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-red-600">
          THƯ VIỆN HÌNH ẢNH
        </p>
        <h2 className="mt-3 font-display text-2xl font-black uppercase tracking-tight text-[#f5f0f0] md:text-3xl">
          Khoảnh khắc hiện trường
        </h2>

        <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
          {imageUrls.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url + i}
              src={url}
              alt=""
              className="h-28 w-40 shrink-0 rounded-lg border border-transparent object-cover transition-colors hover:border-red-600"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

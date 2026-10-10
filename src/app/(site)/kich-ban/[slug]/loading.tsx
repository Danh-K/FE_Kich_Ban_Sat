export default function ScriptDetailLoading() {
  return (
    <div className="animate-pulse pb-28 md:pb-0">
      <div className="relative overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0 bg-gradient-to-br from-noir-700 to-noir-950" />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 pb-10 md:flex-row md:items-end">
          <div className="h-[320px] w-[220px] shrink-0 rounded-lg bg-white/10 md:h-[380px]" />
          <div className="w-full max-w-xl space-y-4">
            <div className="h-9 w-3/4 rounded bg-white/10" />
            <div className="flex gap-2">
              <div className="h-6 w-20 rounded-full bg-white/10" />
              <div className="h-6 w-24 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="h-4 w-full max-w-2xl rounded bg-white/10" />
        <div className="mt-3 h-4 w-full max-w-xl rounded bg-white/10" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="h-5 w-40 rounded bg-white/10" />
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl border border-white/10 bg-noir-850" />
          ))}
        </div>
      </div>
    </div>
  );
}

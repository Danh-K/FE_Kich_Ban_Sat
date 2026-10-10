import { MapPin, Phone } from "lucide-react";
import { api } from "@/lib/api-client";
import type { StoreBranch } from "@/lib/types";

function formatAddress(store: StoreBranch) {
  return [store.street, store.district, store.province].filter(Boolean).join(", ");
}

export default async function StorePage() {
  const stores = await api.get<StoreBranch[]>("/api/stores");

  return (
    <section className="mx-auto max-w-5xl px-6 pb-20 pt-24 md:pt-28">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-red-500/70">
          Cửa hàng
        </p>
        <h1 className="mt-2 font-display text-3xl font-black text-white md:text-4xl">
          Hệ thống chi nhánh
        </h1>
        <p className="mt-2 max-w-xl text-white/50">
          Các chi nhánh Murder Night đang hoạt động — ghé qua để trải nghiệm trực tiếp
          những hiện trường vụ án.
        </p>
      </div>

      {stores.length === 0 ? (
        <p className="py-12 text-center text-white/40">Chưa có chi nhánh nào được thêm.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {stores.map((store) => (
            <div
              key={store.id}
              className="rounded-xl border border-red-900/20 bg-noir-850 p-6"
            >
              <h2 className="font-display text-xl font-bold text-[#f5f0f0]">{store.name}</h2>

              {formatAddress(store) && (
                <p className="mt-3 flex items-start gap-2 text-sm text-white/60">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-red-500" />
                  {formatAddress(store)}
                </p>
              )}
              {store.phone && (
                <p className="mt-2 flex items-center gap-2 text-sm text-white/60">
                  <Phone size={16} className="shrink-0 text-red-500" />
                  {store.phone}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

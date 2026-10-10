"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { Select } from "@/components/ui/Select";
import { VIETNAM_PROVINCES } from "@/lib/vietnam-provinces";
import type { StoreBranch } from "@/lib/types";

interface StoreFormValues {
  name: string;
  province: string;
  district: string;
  street: string;
  phone: string;
}

function StoreForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: StoreFormValues;
  onSubmit: (values: StoreFormValues) => Promise<void>;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [province, setProvince] = useState(initial?.province ?? "");
  const [district, setDistrict] = useState(initial?.district ?? "");
  const [street, setStreet] = useState(initial?.street ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [loading, setLoading] = useState(false);

  const districts = VIETNAM_PROVINCES.find((p) => p.name === province)?.districts ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), province, district, street: street.trim(), phone: phone.trim() });
      if (!initial) {
        setName("");
        setProvince("");
        setDistrict("");
        setStreet("");
        setPhone("");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên chi nhánh"
        required
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#DC2626]"
      />
      <Select
        value={province}
        onChange={(value) => {
          setProvince(value);
          setDistrict("");
        }}
        placeholder="-- Chọn tỉnh/thành --"
        options={VIETNAM_PROVINCES.map((p) => ({ value: p.name, label: p.name }))}
      />
      <Select
        value={district}
        onChange={setDistrict}
        placeholder={province ? "-- Chọn quận/huyện --" : "-- Chọn tỉnh trước --"}
        disabled={!province}
        options={districts.map((d) => ({ value: d, label: d }))}
      />
      <input
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        placeholder="Số nhà, đường"
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#DC2626]"
      />
      <div className="flex gap-2">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Số điện thoại"
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#DC2626]"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#8B0000] px-4 py-2 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-60"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : initial ? "Lưu" : <Plus size={14} />}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60">
            Huỷ
          </button>
        )}
      </div>
    </form>
  );
}

function formatAddress(store: StoreBranch) {
  return [store.street, store.district, store.province].filter(Boolean).join(", ");
}

export default function AdminStoresPage() {
  const { token } = useAuth();
  const [stores, setStores] = useState<StoreBranch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);

  const load = useCallback(() => {
    api
      .get<StoreBranch[]>("/api/admin/stores", token)
      .then(setStores)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Không tải được danh sách chi nhánh"));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreateStore(values: StoreFormValues) {
    try {
      await api.post("/api/admin/stores", values, token);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Tạo chi nhánh thất bại");
    }
  }

  async function handleUpdateStore(id: string, values: StoreFormValues) {
    try {
      await api.put(`/api/admin/stores/${id}`, values, token);
      setEditingStoreId(null);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Cập nhật chi nhánh thất bại");
    }
  }

  async function handleDeleteStore(id: string) {
    if (!confirm("Xoá chi nhánh này?")) return;
    try {
      await api.delete(`/api/admin/stores/${id}`, token);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Xoá chi nhánh thất bại");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Cửa hàng</h1>
        <p className="mt-1 text-sm text-white/40">Quản lý chi nhánh.</p>
      </div>

      <div className="rounded-xl border border-red-900/15 bg-noir-850 p-5">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-wide text-white/40">Thêm chi nhánh mới</p>
        <StoreForm onSubmit={handleCreateStore} />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="space-y-4">
        {stores.map((store) => (
          <div key={store.id} className="rounded-xl border border-red-900/15 bg-noir-850 p-5">
            {editingStoreId === store.id ? (
              <StoreForm
                initial={{
                  name: store.name,
                  province: store.province ?? "",
                  district: store.district ?? "",
                  street: store.street ?? "",
                  phone: store.phone ?? "",
                }}
                onSubmit={(values) => handleUpdateStore(store.id, values)}
                onCancel={() => setEditingStoreId(null)}
              />
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-white">{store.name}</h2>
                  {formatAddress(store) && <p className="mt-1 text-sm text-white/60">{formatAddress(store)}</p>}
                  {store.phone && <p className="text-sm text-white/60">{store.phone}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-3 text-white/40">
                  <button onClick={() => setEditingStoreId(store.id)} className="hover:text-white">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDeleteStore(store.id)} className="hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

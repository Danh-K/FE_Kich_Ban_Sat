"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { Select } from "@/components/ui/Select";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import type { Script, UserSummary } from "@/lib/types";

interface CreateSessionFormProps {
  onCreated: () => void;
}

export function CreateSessionForm({ onCreated }: CreateSessionFormProps) {
  const { token } = useAuth();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [dms, setDms] = useState<UserSummary[]>([]);

  const [scriptId, setScriptId] = useState("");
  const [dmUserId, setDmUserId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [minPlayers, setMinPlayers] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get<Script[]>("/api/scripts").then(setScripts);
    api.get<UserSummary[]>("/api/admin/users/dms", token).then(setDms);
  }, [token]);

  const selectedScript = scripts.find((s) => s.id === scriptId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!scriptId || !startTime) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.post(
        "/api/admin/sessions",
        {
          scriptId,
          dmUserId: dmUserId || null,
          startTime,
          minPlayers,
        },
        token
      );
      setSuccess(true);
      setScriptId("");
      setDmUserId("");
      setStartTime("");
      setMinPlayers(2);
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Tạo buổi chơi thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 rounded-xl border border-red-900/15 bg-noir-850 p-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-white/60">Kịch bản</label>
        <Select
          value={scriptId}
          onChange={setScriptId}
          placeholder="-- Chọn kịch bản --"
          options={scripts.map((s) => ({ value: s.id, label: `${s.title} (${s.playerCount} người)` }))}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-white/60">Quản trò (không bắt buộc)</label>
        <Select
          value={dmUserId}
          onChange={setDmUserId}
          placeholder="-- Chưa gán --"
          options={dms.map((dm) => ({ value: dm.id, label: dm.fullName }))}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-white/60">Thời gian bắt đầu</label>
        <DateTimePicker value={startTime} onChange={setStartTime} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-white/60">
          Số người tối thiểu {selectedScript && `(tối đa ${selectedScript.playerCount})`}
        </label>
        <input
          type="number"
          min={1}
          max={selectedScript?.playerCount ?? 99}
          value={minPlayers}
          onChange={(e) => setMinPlayers(Number(e.target.value))}
          required
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#DC2626]"
        />
      </div>

      <div className="flex items-end">
        <button
          type="submit"
          disabled={loading || !scriptId || !startTime}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#8B0000] px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-red-600 disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Tạo buổi chơi
        </button>
      </div>

      {error && <p className="sm:col-span-2 lg:col-span-3 text-sm text-red-400">{error}</p>}
      {success && (
        <p className="sm:col-span-2 lg:col-span-3 text-sm text-green-400">
          Đã tạo buổi chơi thành công.
        </p>
      )}
    </form>
  );
}

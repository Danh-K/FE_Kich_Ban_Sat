"use client";

import { useState } from "react";
import { CreateSessionForm } from "@/components/admin/CreateSessionForm";
import { SessionsBoard } from "@/components/admin/SessionsBoard";

export default function AdminSessionsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Buổi chơi</h1>
        <p className="mt-1 text-sm text-white/40">
          Tạo lịch chơi mới và quản lý các buổi chơi hiện có.
        </p>
      </div>

      <CreateSessionForm onCreated={() => setRefreshKey((k) => k + 1)} />

      <SessionsBoard key={refreshKey} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useStompSubscription } from "./stomp-provider";
import type { Script, SessionCreatedEvent, SessionWithCapacity } from "./types";

/**
 * Tu them vao danh sach ngay khi co buoi choi moi cho kich ban nay - nguoi dang xem trang
 * khong can F5 moi thay.
 */
export function useSessionUpdates(script: Script, initialSessions: SessionWithCapacity[]) {
  const [sessions, setSessions] = useState(initialSessions);

  useStompSubscription<SessionCreatedEvent>(`/topic/scripts/${script.id}/sessions`, (event) => {
    setSessions((prev) => {
      if (prev.some((s) => s.id === event.sessionId)) return prev;
      const newSession: SessionWithCapacity = {
        id: event.sessionId,
        script,
        startTime: event.startTime,
        minPlayers: event.minPlayers,
        maxPlayers: event.maxPlayers,
        status: event.status,
        bookedSlots: 0,
      };
      return [...prev, newSession];
    });
  });

  return sessions;
}

import { api } from "@/lib/api-client";
import type { Session, SessionSlot, SessionWithCapacity } from "@/lib/types";

export async function getSessionsWithCapacity(scriptId: string): Promise<SessionWithCapacity[]> {
  const sessions = await api.get<Session[]>(`/api/scripts/${scriptId}/sessions`);
  return Promise.all(
    sessions.map(async (session) => {
      const slots = await api.get<SessionSlot[]>(`/api/sessions/${session.id}/slots`);
      const bookedSlots = slots.filter((s) => s.status === "HOLDING" || s.status === "BOOKED").length;
      return { ...session, bookedSlots };
    })
  );
}

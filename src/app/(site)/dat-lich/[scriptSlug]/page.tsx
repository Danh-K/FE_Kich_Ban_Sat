import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { api, ApiError } from "@/lib/api-client";
import type { Script } from "@/lib/types";
import { getSessionsWithCapacity } from "@/lib/sessions";
import { BookingFlow } from "@/components/booking/BookingFlow";

interface PageProps {
  params: Promise<{ scriptSlug: string }>;
  searchParams: Promise<{ session?: string }>;
}

async function getScript(slug: string): Promise<Script | null> {
  try {
    return await api.get<Script>(`/api/scripts/by-slug/${slug}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { scriptSlug } = await params;
  const script = await getScript(scriptSlug);
  return {
    title: script ? `Đặt lịch — ${script.title} — Murder Night` : "Đặt lịch — Murder Night",
  };
}

export default async function BookingPage({ params, searchParams }: PageProps) {
  const { scriptSlug } = await params;
  const { session } = await searchParams;

  const script = await getScript(scriptSlug);
  if (!script) {
    notFound();
  }

  const sessions = await getSessionsWithCapacity(script.id);

  return <BookingFlow script={script} sessions={sessions} initialSessionId={session} />;
}

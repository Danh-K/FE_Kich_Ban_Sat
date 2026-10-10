import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { api, ApiError } from "@/lib/api-client";
import type { Script, ScriptImage } from "@/lib/types";
import { getSessionsWithCapacity } from "@/lib/sessions";
import { ScriptHero } from "@/components/script/ScriptHero";
import { ScriptInfoBar } from "@/components/script/ScriptInfoBar";
import { ScriptDescription } from "@/components/script/ScriptDescription";
import { ScriptGallery } from "@/components/script/ScriptGallery";
import { SessionsSection } from "@/components/script/SessionsSection";
import { ScriptCTA } from "@/components/script/ScriptCTA";
import { PageFadeIn } from "@/components/script/PageFadeIn";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** cache(): generateMetadata va page component deu goi getScript cho cung 1 request - chi fetch 1 lan. */
const getScript = cache(async (slug: string): Promise<Script | null> => {
  try {
    return await api.get<Script>(`/api/scripts/by-slug/${slug}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const script = await getScript(slug);
  return {
    title: script ? `${script.title} — Murder Night` : "Kịch bản — Murder Night",
    description: script?.description,
  };
}

export default async function ScriptDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const script = await getScript(slug);

  if (!script) {
    notFound();
  }

  const [images, sessionsWithCapacity] = await Promise.all([
    api.get<ScriptImage[]>(`/api/scripts/${script.id}/images`),
    getSessionsWithCapacity(script.id),
  ]);

  const cover = images.find((img) => img.isCover) ?? images[0] ?? null;
  const hasSessions = sessionsWithCapacity.length > 0;

  return (
    <PageFadeIn>
      <div className="pb-28 md:pb-0">
        <ScriptHero script={script} coverImageUrl={cover?.imageUrl ?? null} />
        <ScriptInfoBar script={script} />
        <ScriptDescription description={script.description} />
        <ScriptGallery imageUrls={images.map((img) => img.imageUrl)} />
        <ScriptCTA hasSessions={hasSessions} />
        <SessionsSection script={script} sessions={sessionsWithCapacity} />
      </div>
    </PageFadeIn>
  );
}

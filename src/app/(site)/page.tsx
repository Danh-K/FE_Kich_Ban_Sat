import { Hero } from "@/components/landing/Hero";
import { ScriptsSection } from "@/components/landing/ScriptsSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { AboutCompany } from "@/components/landing/AboutCompany";
import { api } from "@/lib/api-client";
import type { Script, Session } from "@/lib/types";

export default async function HomePage() {
  const [scripts, openSessions] = await Promise.all([
    api.get<Script[]>("/api/scripts"),
    api.get<Session[]>("/api/sessions?status=OPEN,CONFIRMED"),
  ]);
  const openScriptIds = Array.from(new Set(openSessions.map((s) => s.script.id)));

  return (
    <>
      <Hero />
      <ScriptsSection scripts={scripts} openScriptIds={openScriptIds} />
      <HowItWorks />
      <Testimonials />
      <AboutCompany />
    </>
  );
}

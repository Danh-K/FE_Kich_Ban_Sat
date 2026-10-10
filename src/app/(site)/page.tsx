"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/landing/Hero";
import { ScriptsSection } from "@/components/landing/ScriptsSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { AboutCompany } from "@/components/landing/AboutCompany";
import { api } from "@/lib/api-client";
import type { Script, Session } from "@/lib/types";
import { MOCK_MODE, MOCK_OPEN_SCRIPT_IDS, MOCK_SCRIPTS } from "@/lib/mock-data";

export default function HomePage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [openScriptIds, setOpenScriptIds] = useState<string[]>([]);

  useEffect(() => {
    if (MOCK_MODE) {
      setScripts(MOCK_SCRIPTS);
      setOpenScriptIds(MOCK_OPEN_SCRIPT_IDS);
      return;
    }

    Promise.all([
      api.get<Script[]>("/api/scripts"),
      api.get<Session[]>("/api/sessions?status=OPEN,CONFIRMED"),
    ])
      .then(([loadedScripts, openSessions]) => {
        setScripts(loadedScripts);
        setOpenScriptIds(Array.from(new Set(openSessions.map((s) => s.script.id))));
      })
      .catch(() => {
        // GitHub Pages can render the landing page without the optional backend.
      });
  }, []);

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

"use client";

import { useLocale } from "@/contexts/locale-context";
import { getGaineDisclaimer } from "@/data/gaine-copy";

export function GaineDisclaimer() {
  const { locale } = useLocale();

  return (
    <footer className="px-6 py-12 border-t" style={{ borderColor: "var(--gaine-border)" }}>
      <p className="max-w-3xl mx-auto text-center text-xs leading-relaxed" style={{ color: "var(--gaine-muted)" }}>
        {getGaineDisclaimer(locale)}
      </p>
    </footer>
  );
}

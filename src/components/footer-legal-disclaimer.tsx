"use client";

import { useState } from "react";
import { useLocale } from "@/contexts/locale-context";
import { getFooterLegal } from "@/data/legal";

export function FooterLegalDisclaimer() {
  const [expanded, setExpanded] = useState(false);
  const { locale, t } = useLocale();
  const paragraphs = getFooterLegal(locale);

  return (
    <div className="text-sm text-earth/50 leading-relaxed max-w-lg space-y-3">
      <p>
        <strong className="text-earth/70">{t("common.important")}:</strong>{" "}
        <span className="gaine-word gaine-word-sm">GAINE</span> {paragraphs[0]}{" "}
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          className="text-gold hover:text-gold/80 transition-colors"
        >
          ({expanded ? t("common.collapse") : t("common.expand")})
        </button>
      </p>
      {expanded
        ? paragraphs.slice(1).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))
        : null}
    </div>
  );
}

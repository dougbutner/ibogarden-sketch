"use client";

import { useState } from "react";
import { FOOTER_LEGAL_PARAGRAPHS } from "@/data/legal";

export function FooterLegalDisclaimer() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="text-sm text-earth/50 leading-relaxed max-w-lg space-y-3">
      <p>
        <strong className="text-earth/70">Important:</strong>{" "}
        <span className="gaine-word gaine-word-sm">GAINE</span> {FOOTER_LEGAL_PARAGRAPHS[0]}{" "}
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          className="text-gold hover:text-gold/80 transition-colors"
        >
          {expanded ? "(Collapse)" : "(Expand)"}
        </button>
      </p>
      {expanded
        ? FOOTER_LEGAL_PARAGRAPHS.slice(1).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))
        : null}
    </div>
  );
}

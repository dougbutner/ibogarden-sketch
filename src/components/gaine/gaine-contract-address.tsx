"use client";

import { useState } from "react";
import { GAINE_CONTRACT_ADDRESS } from "@/data/gaine";

function truncateAddress(address: string) {
  if (address.length <= 12) return address;
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function GaineContractAddress() {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const hasAddress = GAINE_CONTRACT_ADDRESS.length > 0;

  async function handleCopy() {
    if (!hasAddress) return;
    try {
      await navigator.clipboard.writeText(GAINE_CONTRACT_ADDRESS);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <section className="px-6 pb-20 max-w-2xl mx-auto w-full text-center">
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.22em] mb-4"
        style={{ color: "var(--gaine-accent)" }}
      >
        CONTRACT ADDRESS
      </p>

      {hasAddress ? (
        <button
          type="button"
          onClick={handleCopy}
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
          onFocus={() => setExpanded(true)}
          onBlur={() => setExpanded(false)}
          className="gaine-surface-card w-full px-6 py-4 font-mono text-sm md:text-base transition-all duration-300 hover:bg-white/[0.03] cursor-pointer overflow-hidden"
          style={{ color: "var(--gaine-text)" }}
        >
          <span
            className="inline-block transition-all duration-300 ease-out"
            style={{
              letterSpacing: expanded ? "0.02em" : "0",
              transform: expanded ? "scale(1)" : "scale(1)",
            }}
          >
            {copied ? "Copied!" : expanded ? GAINE_CONTRACT_ADDRESS : truncateAddress(GAINE_CONTRACT_ADDRESS)}
          </span>
        </button>
      ) : (
        <div
          className="gaine-surface-card w-full px-6 py-4 text-sm"
          style={{ color: "var(--gaine-muted)" }}
        >
          Mint address will be published at launch: set{" "}
          <code className="font-mono text-xs" style={{ color: "var(--gaine-accent)" }}>
            VITE_GAINE_MINT
          </code>{" "}
          or paste into <code className="font-mono text-xs">GAINE_CONTRACT_ADDRESS</code>
        </div>
      )}

      {hasAddress && (
        <p className="mt-3 text-xs" style={{ color: "var(--gaine-muted)" }}>
          Hover to reveal · click to copy
        </p>
      )}
    </section>
  );
}

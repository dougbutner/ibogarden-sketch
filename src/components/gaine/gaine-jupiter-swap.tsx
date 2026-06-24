"use client";

import { useEffect, useId } from "react";

import {
  GAINE_CONTRACT_ADDRESS,
  GAINE_JUPITER_TOKEN_URL,
  GAINE_TOKEN_IMAGE,
  SOL_MINT,
} from "@/data/gaine";

const JUPITER_SCRIPT = "https://plugin.jup.ag/plugin-v1.js";

function loadJupiterScript() {
  if (window.Jupiter) return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>(`script[src="${JUPITER_SCRIPT}"]`);
  if (existing) {
    return new Promise<void>((resolve, reject) => {
      if (window.Jupiter) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Jupiter script failed")), { once: true });
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = JUPITER_SCRIPT;
    script.defer = true;
    script.dataset.preload = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Jupiter script failed"));
    document.head.appendChild(script);
  });
}

export function GaineJupiterSwap() {
  const targetId = `gaine-jupiter-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    let cancelled = false;

    loadJupiterScript()
      .then(() => {
        if (cancelled || !window.Jupiter) return;

        window.Jupiter.init({
          displayMode: "integrated",
          integratedTargetId: targetId,
          formProps: {
            initialInputMint: SOL_MINT,
            initialOutputMint: GAINE_CONTRACT_ADDRESS,
            fixedMint: GAINE_CONTRACT_ADDRESS,
          },
          branding: {
            logoUri: GAINE_TOKEN_IMAGE,
            name: "ibo.garden",
          },
          containerStyles: {
            width: "100%",
            height: "100%",
            borderRadius: "16px",
            overflow: "visible",
          },
        });
      })
      .catch(() => {
        /* swap panel falls back to external link */
      });

    return () => {
      cancelled = true;
      window.Jupiter?.close();
    };
  }, [targetId]);

  return (
    <section id="buy-gaine" className="px-6 pb-20 max-w-7xl mx-auto w-full scroll-mt-24">
      <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--gaine-accent)" }}
          >
            Swap on Jupiter
          </span>
          <h2 className="gaine-display text-3xl md:text-4xl mt-3">Buy GAINE</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--gaine-muted)" }}>
            Swap SOL (or other tokens) for verified GAINE on Jupiter. Chart below; swap without leaving
            ibo.garden.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <a
            href={GAINE_JUPITER_TOKEN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors hover:bg-white/5"
            style={{ borderColor: "var(--gaine-border)", color: "var(--gaine-text)" }}
          >
            <img src={GAINE_TOKEN_IMAGE} alt="" className="size-4 rounded-full" width={16} height={16} />
            Research on Jupiter
          </a>
          <a
            href={GAINE_JUPITER_TOKEN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
            style={{ background: "var(--gaine-primary)", color: "var(--gaine-bg)" }}
          >
            Open full swap →
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        <div
          className="gaine-surface-card overflow-hidden flex flex-col min-h-[420px] lg:min-h-[560px]"
          data-no-texture
        >
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 border-b"
            style={{ borderColor: "var(--gaine-border)" }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--gaine-muted)" }}>
              GAINE / USD chart
            </span>
            <a
              href={GAINE_JUPITER_TOKEN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:underline"
              style={{ color: "var(--gaine-accent)" }}
            >
              Verify on Jupiter →
            </a>
          </div>
          <iframe
            title="GAINE price chart"
            src={`https://dexscreener.com/solana/${GAINE_CONTRACT_ADDRESS}?embed=1&theme=dark&trades=0&info=0`}
            className="flex-1 w-full min-h-[360px] border-0"
            allow="clipboard-write"
          />
        </div>

        <div
          className="gaine-surface-card min-h-[420px] lg:min-h-[560px] gaine-jupiter-swap"
          data-no-texture
        >
          <div
            className="px-4 py-3 border-b text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: "var(--gaine-border)", color: "var(--gaine-muted)" }}
          >
            Jupiter swap · output locked to GAINE
          </div>
          <div id={targetId} className="gaine-jupiter-mount h-[min(560px,calc(100vh-12rem))] min-h-[480px]" />
        </div>
      </div>
    </section>
  );
}

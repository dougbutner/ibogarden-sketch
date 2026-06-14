"use client";

import { useState } from "react";
import { GAINE_REFLECTION_DIRECTIONS } from "@/data/gaine";

export function GaineReflection() {
  const [pick, setPick] = useState<string>(GAINE_REFLECTION_DIRECTIONS[0].key);

  return (
    <section className="px-6 py-20 max-w-5xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="gaine-display text-3xl md:text-4xl">Where does your 2% flow?</h2>
        <p className="mt-3 text-sm md:text-base max-w-lg mx-auto" style={{ color: "var(--gaine-muted)" }}>
          Choose where transfer fees convert to USDC and route on-chain.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
        {GAINE_REFLECTION_DIRECTIONS.map((d) => {
          const selected = pick === d.key;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => setPick(d.key)}
              className="gaine-surface-card text-left p-5 md:p-6 transition-all cursor-pointer"
              style={
                selected
                  ? {
                      borderColor: "var(--gaine-primary)",
                      boxShadow: "0 0 0 1px var(--gaine-primary), 0 0 24px color-mix(in srgb, var(--gaine-primary) 25%, transparent)",
                    }
                  : undefined
              }
            >
              <div className="flex justify-between items-start gap-3 mb-2">
                <span className="gaine-display text-lg">{d.key}</span>
                <div
                  className="size-4 rounded-full border-2 shrink-0 mt-1"
                  style={
                    selected
                      ? { borderColor: "var(--gaine-primary)", background: "var(--gaine-primary)" }
                      : { borderColor: "var(--gaine-border)" }
                  }
                />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--gaine-muted)" }}>
                {d.desc}
              </p>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-center text-sm" style={{ color: "var(--gaine-muted)" }}>
        No selection defaults to a balanced project split.
      </p>
    </section>
  );
}

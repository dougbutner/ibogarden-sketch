"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function GaineMoneyModel() {
  return (
    <Collapsible className="mt-8 max-w-2xl w-full mx-auto text-left">
      <div className="flex items-center justify-center gap-3">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.22em]"
          style={{ color: "var(--gaine-accent)" }}
        >
          DeFi money model
        </p>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border transition-transform duration-200 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gaine-accent)] data-[state=open]:rotate-45"
            style={{ borderColor: "var(--gaine-border)", color: "var(--gaine-text)" }}
            aria-label="Expand DeFi money model"
          >
            <span className="text-lg leading-none">+</span>
          </button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
        <ol
          className="mt-4 space-y-3 list-decimal list-outside pl-5 text-sm md:text-base leading-relaxed"
          style={{ color: "var(--gaine-muted)" }}
        >
          <li>
            We provide routes between trusted digitized fiat on Solana: USD, EUR, GBP, CHF, AUD, BRL, and
            physical gold, for a fee we {'"'}Robinhood{'"'} back to the people.
          </li>
          <li>
            As people buy GAINE, dollars flow into ranges from $1 to $10M per GAINE. Buy-to-mint backs routes
            for USD, EUR, GBP, CHF, AUD, BRL, and physical gold in markets where those currencies are
            underserved in DeFi.
          </li>
          <li>
            Every GAINE transfer carries a 2% fee via an audited Solana mechanism, redistributed transparently
            to Ibogabon, market-making exposure, and iboga-focused initiatives, with philanthropic direction
            to exact projects registered on the marketplace and network.
          </li>
        </ol>
      </CollapsibleContent>
    </Collapsible>
  );
}

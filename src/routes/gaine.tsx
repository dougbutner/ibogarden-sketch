import { createFileRoute, Link } from "@tanstack/react-router";
import { GaineContractAddress } from "@/components/gaine/gaine-contract-address";
import { GaineDisclaimer } from "@/components/gaine/gaine-disclaimer";
import { GaineHero } from "@/components/gaine/gaine-hero";
import { GainePanels } from "@/components/gaine/gaine-panels";
import { GaineReflection } from "@/components/gaine/gaine-reflection";
import { GaineStatRow } from "@/components/gaine/gaine-stat-row";
import { GAINE_INFO_PANELS } from "@/data/gaine";

export const Route = createFileRoute("/gaine")({
  head: () => ({
    meta: [
      { title: "GAINE Token on Solana — ibo.garden" },
      {
        name: "description",
        content:
          "GAINE is a reciprocating utility token on Solana. Hold it — 2% of every transfer routes to iboga sourcing and Gabon communities you choose.",
      },
      { property: "og:title", content: "GAINE — Impact you keep. Principal that stays." },
      {
        property: "og:description",
        content: "Reciprocating utility token on Solana. 2% transfer fee → USDC, directed by you.",
      },
    ],
  }),
  component: Gaine,
});

function Gaine() {
  return (
    <div className="gaine-page -mt-12 pb-0">
      <GaineHero />
      <GaineStatRow />
      <GaineContractAddress />
      <GaineReflection />

      <section className="px-6 pb-20 max-w-7xl mx-auto w-full">
        <div className="mb-8 md:mb-10">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--gaine-accent)" }}
          >
            How GAINE is different
          </span>
          <h2 className="gaine-display text-3xl md:text-4xl mt-3">
            Impact without giving up your principal
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed" style={{ color: "var(--gaine-muted)" }}>
            Traditional impact funds ask you to donate or lock capital. GAINE keeps your dollars liquid and backed
            while routing transfer fees to the causes you choose.
          </p>
        </div>
        <GainePanels panels={GAINE_INFO_PANELS} />
      </section>

      <section className="px-6 py-20" style={{ background: "var(--gaine-surface)" }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="gaine-display text-3xl md:text-4xl text-center mb-12">Fund Split Transparency</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { t: "Organization", p: "20%", d: "Platform operations, audits, infrastructure." },
              { t: "Economic Participants", p: "30%", d: "Certified farms, suppliers, holders." },
              { t: "Conservation & Gabon", p: "50%", d: "Reforestation, farmer working capital, benefit-sharing." },
            ].map((c) => (
              <div key={c.t} className="gaine-surface-card p-8" style={{ background: "var(--gaine-bg)" }}>
                <div className="gaine-display text-5xl mb-4" style={{ color: "var(--gaine-accent)" }}>
                  {c.p}
                </div>
                <h3 className="gaine-display text-xl mb-2">{c.t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--gaine-muted)" }}>
                  {c.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 max-w-7xl mx-auto w-full space-y-12">
        <div className="gaine-surface-card p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="gaine-display text-2xl mb-2">Legal framework</h2>
            <p className="text-sm leading-relaxed max-w-xl" style={{ color: "var(--gaine-muted)" }}>
              GAINE operates under Gabon Decree 0239 — supporting traceability, community benefit-sharing, and
              certified export from legal farms.
            </p>
          </div>
          <Link
            to="/decree"
            className="shrink-0 border px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-colors hover:bg-white/5 text-center"
            style={{ borderColor: "var(--gaine-border)", color: "var(--gaine-text)" }}
          >
            Read Decree 0239 →
          </Link>
        </div>

        <div>
          <h2 className="gaine-display text-3xl mb-8">Token Utility</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "Marketplace Settlement",
                body: "Use GAINE to purchase products, treatments, and verified listings on the marketplace.",
              },
              {
                title: "Supplier Rewards",
                body: "Certified farms and suppliers earn GAINE rewards for verified sourcing activity.",
              },
            ].map((item) => (
              <div key={item.title} className="gaine-surface-card p-7">
                <h3 className="gaine-display text-lg mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--gaine-muted)" }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GaineDisclaimer />
    </div>
  );
}

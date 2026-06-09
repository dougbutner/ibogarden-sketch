import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/gaine")({
  head: () => ({
    meta: [
      { title: "GAINE Ecosystem — ibo.garden" },
      { name: "description", content: "GAINE SPL token on Solana. 2% transfer tax converted to USDC and directed by holders to sourcing, tradition, or clinical projects." },
      { property: "og:title", content: "GAINE — the ethical Iboga economy" },
      { property: "og:description", content: "SPL on Solana · 2% reflection redirected to Gabon." },
    ],
  }),
  component: Gaine,
});

const DIRECTIONS = [
  { key: "Sourcing", desc: "Ethical farms, Gabon plantations, traceability." },
  { key: "Tradition", desc: "Bwiti community, cultural preservation, healers." },
  { key: "Clinical", desc: "Research, treatment access, education programs." },
  { key: "Specific Project", desc: "USDC sent directly to an approved project wallet." },
];

function Gaine() {
  const [pick, setPick] = useState("Sourcing");
  return (
    <>
      <PageHeader
        eyebrow="GAINE Ecosystem"
        title="Tokenize reciprocity."
        lead="GAINE is a Solana SPL token with 100% liquidity on Orca, paired with trusted stablecoins (~$1 USD). A 2% transfer tax becomes USDC, and you choose where it goes."
      />

      <section className="px-6 max-w-7xl mx-auto pb-16 grid lg:grid-cols-2 gap-12">
        <div className="bg-white border border-forest/10 rounded-3xl p-8 md:p-10">
          <h2 className="font-serif text-3xl italic text-forest mb-6">Token Mechanics</h2>
          <dl className="space-y-5">
            {[
              ["Network", "Solana · SPL standard"],
              ["Liquidity", "100% on Orca, paired with trusted stablecoins"],
              ["Target peg", "~$1 USD"],
              ["Transfer tax", "2% (representative reflection)"],
              ["Holder rule", "Cannot receive own reflection — must redirect"],
              ["Default", "No selection → balanced project split"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 pb-4 border-b border-forest/10">
                <dt className="text-sm text-forest/55 uppercase tracking-wider font-semibold text-xs">{k}</dt>
                <dd className="text-sm text-forest text-right">{v}</dd>
              </div>
            ))}
          </dl>
          <button className="mt-8 w-full bg-gold text-forest py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gold/90 transition-colors">
            Connect Wallet & Buy on Orca
          </button>
        </div>

        <div>
          <div className="bg-forest text-earth p-8 md:p-10 rounded-3xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">Reflection Direction</span>
            <h2 className="font-serif text-3xl italic mt-3 mb-6">Where should your yield flow?</h2>
            <div className="space-y-3">
              {DIRECTIONS.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setPick(d.key)}
                  className={`w-full text-left p-5 rounded-2xl border transition-colors ${pick === d.key ? "border-gold bg-gold/10" : "border-earth/15 hover:border-earth/30"}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{d.key}</span>
                    <div className={`size-4 rounded-full border-2 ${pick === d.key ? "border-gold bg-gold" : "border-earth/30"}`} />
                  </div>
                  <p className="text-sm text-earth/65">{d.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-bone">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl italic text-forest text-center mb-12">Fund Split Transparency</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { t: "Organization", p: "20%", d: "Platform operations, audits, infrastructure." },
              { t: "Economic Participants", p: "30%", d: "Certified partners, farms, holders." },
              { t: "Philanthropy", p: "50%", d: "Gabon communities, addiction healing, education." },
            ].map((c) => (
              <div key={c.t} className="bg-white p-8 rounded-3xl border border-forest/10">
                <div className="font-serif text-5xl text-gold-deep mb-4">{c.p}</div>
                <h3 className="font-serif text-xl italic text-forest mb-2">{c.t}</h3>
                <p className="text-sm text-forest/65">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 max-w-7xl mx-auto">
        <h2 className="font-serif text-3xl italic text-forest mb-8">Token Utility</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-white border border-forest/10 rounded-3xl p-7">
            <h3 className="font-semibold text-forest mb-2">Gated Knowledge</h3>
            <p className="text-sm text-forest/65">Advanced healing curriculum and exclusive practitioner sections unlock with GAINE.</p>
          </div>
          <div className="bg-white border border-forest/10 rounded-3xl p-7">
            <h3 className="font-semibold text-forest mb-2">Partner Rewards</h3>
            <p className="text-sm text-forest/65">Certified farms and facilitators earn GAINE rewards for verified activity.</p>
          </div>
        </div>
      </section>
    </>
  );
}

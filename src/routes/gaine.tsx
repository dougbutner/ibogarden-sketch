import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { GainePanels } from "@/components/gaine/gaine-panels";
import { RotatingWord } from "@/components/gaine/rotating-word";
import {
  GAINE_INFO_PANELS,
  GAINE_MAX_SUPPLY,
  GAINE_METADATA_URL,
  GAINE_ROTATING_WORDS,
} from "@/data/gaine";
import { formatGainePrice, useGainePrice } from "@/hooks/useGainePrice";

export const Route = createFileRoute("/gaine")({
  head: () => ({
    meta: [
      { title: "GAINE Token on Solana — ibo.garden" },
      {
        name: "description",
        content:
          "GAINE is a Solana SPL token, 100% liquid-backed by trusted stablecoins. A 2% transfer tax becomes USDC — you choose where it goes.",
      },
      { property: "og:title", content: "GAINE Token on Solana" },
      {
        property: "og:description",
        content: "Digitally empowered impact. Liquid-backed SPL on Solana with directed 2% reflection.",
      },
    ],
  }),
  component: Gaine,
});

const DIRECTIONS = [
  { key: "Sourcing", desc: "Ethical farms, Gabon farms, supply chain traceability." },
  { key: "Conservation", desc: "Reforestation, farmer working capital, Gabon smallholder support." },
  { key: "Gabon Communities", desc: "Benefit-sharing with traditional communities under Decree 0239." },
  { key: "Specific Project", desc: "USDC sent directly to an approved project wallet." },
];

function GaineStats() {
  const { data: price, isLoading, isFetching } = useGainePrice();
  const priceLabel = formatGainePrice(price, isLoading || isFetching);

  return (
    <dl className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
      {[
        ["Max Supply", `${GAINE_MAX_SUPPLY} GAINE`],
        ["Initial Price", "$1.00 USD"],
        ["Current Price", priceLabel],
      ].map(([label, value]) => (
        <div key={label} className="bg-bone/80 border border-forest/10 rounded-2xl px-5 py-4">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-forest/45 mb-1">{label}</dt>
          <dd className="font-serif text-xl italic text-forest">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Gaine() {
  const [pick, setPick] = useState("Sourcing");

  return (
    <>
      <PageHeader
        eyebrow="GAINE Token on Solana"
        title={
          <>
            Digitally Empowered <RotatingWord words={GAINE_ROTATING_WORDS} />
          </>
        }
        lead={
          <>
            <span className="gaine-word gaine-word-sm">GAINE</span> is a Solana SPL token 100% liquid-backed by
            trusted stablecoins (~$1 USD). A 2% transfer tax is converted to USDC, and you choose where it goes.
          </>
        }
      >
        <GaineStats />
        <p className="mt-6 text-xs text-forest/45">
          <a
            href={GAINE_METADATA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 decoration-forest/20 hover:text-gold transition-colors"
          >
            On-chain token metadata →
          </a>
        </p>
      </PageHeader>

      <section className="px-6 max-w-7xl mx-auto pb-16 grid lg:grid-cols-2 gap-12">
        <div className="bg-white border border-forest/10 rounded-3xl p-8 md:p-10">
          <h2 className="font-serif text-3xl italic text-forest mb-6">Buy GAINE</h2>
          <dl className="space-y-5">
            {[
              ["Network", "Solana · SPL Token-2022"],
              ["Backing", "100% liquid — paired with trusted stablecoins"],
              ["Launch price", "~$1 USD"],
              ["Transfer tax", "2% → USDC reflection"],
              ["Holder rule", "Cannot receive own reflection — must redirect"],
              ["Default", "No selection → balanced project split"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 pb-4 border-b border-forest/10">
                <dt className="text-sm text-forest/55 uppercase tracking-wider font-semibold text-xs">{k}</dt>
                <dd className="text-sm text-forest text-right">{v}</dd>
              </div>
            ))}
          </dl>
          <button className="btn-gaine mt-8 w-full bg-gold text-forest py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gold/90 transition-colors">
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

      <section className="px-6 pb-20 max-w-7xl mx-auto">
        <div className="mb-8 md:mb-10">
          <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">How GAINE is different</span>
          <h2 className="font-serif text-3xl md:text-4xl italic text-forest mt-3">
            Impact without giving up your principal
          </h2>
          <p className="text-forest/65 mt-4 max-w-2xl leading-relaxed">
            Traditional impact funds ask you to donate or lock capital. GAINE keeps your dollars liquid and backed while
            routing transfer fees to the causes you choose.
          </p>
        </div>
        <GainePanels panels={GAINE_INFO_PANELS} />
      </section>

      <section className="px-6 py-20 bg-bone">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl italic text-forest text-center mb-12">Fund Split Transparency</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { t: "Organization", p: "20%", d: "Platform operations, audits, infrastructure." },
              { t: "Economic Participants", p: "30%", d: "Certified farms, suppliers, holders." },
              { t: "Conservation & Gabon", p: "50%", d: "Reforestation, farmer working capital, benefit-sharing." },
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

      <section className="px-6 py-20 max-w-7xl mx-auto space-y-12">
        <div className="bg-bone border border-forest/10 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl italic text-forest mb-2">Legal framework</h2>
            <p className="text-sm text-forest/70 leading-relaxed max-w-xl">
              GAINE operates under Gabon Decree 0239 — supporting traceability, community benefit-sharing, and
              certified export from legal farms.
            </p>
          </div>
          <Link
            to="/decree"
            className="shrink-0 border border-forest/20 text-forest px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-forest hover:text-earth transition-colors text-center"
          >
            Read Decree 0239 →
          </Link>
        </div>

        <div>
          <h2 className="font-serif text-3xl italic text-forest mb-8">Token Utility</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white border border-forest/10 rounded-3xl p-7">
              <h3 className="font-semibold text-forest mb-2">Marketplace Settlement</h3>
              <p className="text-sm text-forest/65">
                Use <span className="gaine-word gaine-word-sm">GAINE</span> to purchase products, treatments, and
                verified listings on the marketplace.
              </p>
            </div>
            <div className="bg-white border border-forest/10 rounded-3xl p-7">
              <h3 className="font-semibold text-forest mb-2">Supplier Rewards</h3>
              <p className="text-sm text-forest/65">
                Certified farms and suppliers earn <span className="gaine-word gaine-word-sm">GAINE</span> rewards for
                verified sourcing activity.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

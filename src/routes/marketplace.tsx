import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — ibo.garden" },
      { name: "description", content: "Commodity marketplace for ethically sourced Iboga under Gabon Decree 0239. Root bark, forward tree contracts, and GAINE-verified listings." },
      { property: "og:title", content: "ibo.garden Marketplace — Ethical Iboga Commodities" },
      { property: "og:description", content: "Root bark, forward contracts, and Decree 0239-aligned sourcing." },
    ],
  }),
  component: Marketplace,
});

const CATEGORIES = [
  { title: "Products", desc: "Root bark, extracts, lab-tested commodities", icon: "◈", id: undefined },
  { title: "Forward Contracts", desc: "Purchase a tree today · delivery in 6+ years", icon: "🌱", id: "forward-contracts" },
  { title: "Sourcing", desc: "Direct Gabon farms · Decree 0239-aligned", icon: "◉", id: undefined },
  { title: "Training", desc: <>Supplier onboarding · <span className="gaine-word gaine-word-sm">GAINE</span>-verified</>, icon: "❋", id: undefined },
];

const LISTINGS = [
  { title: "Sustainable Root Bark (50g)", cat: "Product", price: "$145", loc: "Direct · Gabon", cert: "Nagoya" },
  { title: "Iboga Tree Forward Contract — 6yr", cat: "Forward Contract", price: "$420", loc: "Gabon · Smallholder", cert: "Decree 0239" },
  { title: "Premium Root Bark (100g)", cat: "Product", price: "$280", loc: "Direct · Gabon", cert: "GAINE" },
  { title: "Iboga Extract — Pharmaceutical Grade", cat: "Product", price: "$1,200", loc: "Lab-tested · Gabon", cert: "Nagoya" },
  { title: "Farm Forward Contract — 8yr", cat: "Forward Contract", price: "$680", loc: "Gabon · Cooperative", cert: "Decree 0239" },
  { title: "Bulk Root Bark (1kg)", cat: "Product", price: "$2,400", loc: "Direct · Gabon", cert: "GAINE" },
];

function Marketplace() {
  return (
    <>
      <PageHeader
        eyebrow="Marketplace"
        title="Ethically sourced. Decree 0239-aligned."
        lead="Commodity marketplace for Iboga root bark, forward tree contracts, and verified Gabonese sourcing. Every transaction supports conservation."
      >
        <div className="mt-8 inline-flex items-center gap-3 text-sm text-forest/60 bg-bone px-4 py-2 rounded-full">
          <span className="size-2 rounded-full bg-gold animate-pulse" /> Impact this month: 1,240 trees · 38 families
        </div>
      </PageHeader>

      <section className="px-6 max-w-7xl mx-auto pb-16">
        <div id="forward-contracts" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12 scroll-mt-24">
          {CATEGORIES.map((c) => (
            <button key={c.title} className="bg-white border border-forest/10 rounded-2xl p-5 text-left hover:border-gold/40 transition-colors">
              <div className="text-gold text-2xl mb-3">{c.icon}</div>
              <div className="font-semibold text-forest text-sm mb-1">{c.title}</div>
              <div className="text-[11px] text-forest/55 leading-snug">{c.desc}</div>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-end mb-6">
          <h2 className="font-serif text-3xl italic text-forest">Featured Listings</h2>
          <div className="text-xs text-forest/50 uppercase tracking-widest">{LISTINGS.length} active</div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {LISTINGS.map((l) => (
            <article key={l.title} className="bg-white border border-forest/10 rounded-2xl p-6 hover:border-gold/40 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-deep">{l.cat}</span>
                <span className="text-[10px] px-2 py-0.5 bg-bone rounded text-forest/70 font-semibold uppercase tracking-wider">
                  {l.cert === "GAINE" ? <span className="gaine-word gaine-word-sm">GAINE</span> : l.cert}
                </span>
              </div>
              <h3 className="font-serif text-xl italic text-forest mb-2 leading-snug">{l.title}</h3>
              <p className="text-[11px] text-forest/50 uppercase tracking-wider mb-5">{l.loc}</p>
              <div className="flex justify-between items-center pt-4 border-t border-forest/10">
                <span className="font-semibold text-forest">{l.price}</span>
                <button className="text-xs font-bold uppercase tracking-widest text-gold hover:text-gold-deep">View →</button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 bg-forest text-earth rounded-3xl p-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-serif text-3xl italic mb-3">List on the Marketplace</h3>
            <p className="text-earth/70">Register your farm or supplier in the Network. All listings are reviewed before publishing.</p>
          </div>
          <div className="md:text-right">
            <Link to="/network" className="inline-block bg-gold text-forest px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold/90 transition-colors">Register in Network</Link>
          </div>
        </div>
      </section>
    </>
  );
}

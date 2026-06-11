import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — ibo.garden" },
      { name: "description", content: "Treatments, ceremonies, training, products, sponsorships. Network-verified, GAINE-certified listings." },
      { property: "og:title", content: "ibo.garden Marketplace" },
      { property: "og:description", content: "Treatments, training, ceremonies, and care sponsorship." },
    ],
  }),
  component: Marketplace,
});

const CATEGORIES = [
  { title: "Treatments", desc: "Clinical programs · nominate funds at checkout", icon: "✦" },
  { title: "Ceremonies", desc: "Traditional Bwiti · in-person and virtual", icon: "◉" },
  { title: "Training", desc: <>Facilitation, certification, <span className="gaine-word gaine-word-sm">GAINE</span>-gated</>, icon: "❋" },
  { title: "Products", desc: "Root bark, extracts, tools, courses", icon: "◈" },
  { title: "Donations", desc: "General, project-specific, recurring", icon: "♢" },
  { title: "Sponsorship", desc: "Sponsor a Treatment · Support a Farm", icon: "✤" },
];

const LISTINGS = [
  { title: "Clinical Iboga Protocol — 10 days", cat: "Treatment", price: "$8,400", loc: "Costa Rica", cert: "GAINE" },
  { title: "Bwiti Initiation Ceremony", cat: "Ceremony", price: "By inquiry", loc: "Gabon", cert: "Bwiti Standard" },
  { title: "Facilitator Training · Level 1", cat: "Training", price: "$1,200", loc: "Online", cert: "GAINE" },
  { title: "Sustainable Root Bark (50g)", cat: "Product", price: "$145", loc: "Direct · Gabon", cert: "Nagoya" },
  { title: "Sponsor Marcus' Recovery", cat: "Sponsorship", price: "$3,200 / $5,000", loc: "Mexico", cert: "Care Fund" },
  { title: "Integration Coaching · 6 sessions", cat: "Treatment", price: "$680", loc: "Remote", cert: "GAINE" },
];

function Marketplace() {
  return (
    <>
      <PageHeader
        eyebrow="Marketplace"
        title="Network-verified, transparently sourced."
        lead="Only Network-registered partners may list. Every transaction plants trees in Gabon."
      >
        <div className="mt-8 inline-flex items-center gap-3 text-sm text-forest/60 bg-bone px-4 py-2 rounded-full">
          <span className="size-2 rounded-full bg-gold animate-pulse" /> Impact this month: 1,240 trees · 38 families
        </div>
      </PageHeader>

      <section className="px-6 max-w-7xl mx-auto pb-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-12">
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
            <p className="text-earth/70">Register your facility, practice, or farm in the Network. All listings are reviewed before publishing.</p>
          </div>
          <div className="md:text-right">
            <Link to="/network" className="inline-block bg-gold text-forest px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold/90 transition-colors">Register in Network</Link>
          </div>
        </div>
      </section>
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace | ibo.garden" },
      { name: "description", content: "Treatments, ceremonies, training, products, and donations. Network-verified, GAINE-certified listings." },
      { property: "og:title", content: "ibo.garden Marketplace" },
      { property: "og:description", content: "Treatments, training, ceremonies, and ethical sourcing." },
    ],
  }),
  component: Marketplace,
});

const CATEGORIES = [
  { title: "Treatments", desc: "Clinical programs · verified facilitators", icon: "✦" },
  { title: "Ceremonies", desc: "Traditional Bwiti · in-person and virtual", icon: "◉" },
  { title: "Training", desc: <>Facilitation, certification, <span className="gaine-word gaine-word-sm">GAINE</span>-gated</>, icon: "❋" },
  { title: "Products", desc: "Root bark, extracts, tools, courses", icon: "◈" },
  { title: "Donations", desc: "General, project-specific, recurring", icon: "♢" },
  { title: "Community", desc: "Share knowledge · Support a Farm", icon: "✤" },
];

const LISTINGS = [
  { title: "Clinical Iboga Protocol: 10 days", cat: "Treatment", price: "$8,400", loc: "Costa Rica", cert: "GAINE" },
  { title: "Bwiti Initiation Ceremony", cat: "Ceremony", price: "By inquiry", loc: "Gabon", cert: "Decree 0239" },
  { title: "Facilitator Training · Level 1", cat: "Training", price: "$1,200", loc: "Online", cert: "GAINE" },
  { title: "Sustainable Root Bark (50g)", cat: "Product", price: "$145", loc: "Direct · Gabon", cert: "Nagoya" },
  { title: "Share the Iboga Library", cat: "Community", price: "Free", loc: "Invite link", cert: "Open" },
  { title: "Integration Coaching · 6 sessions", cat: "Treatment", price: "$680", loc: "Remote", cert: "GAINE" },
];

function Marketplace() {
  return (
    <>
      <PageHeader
        eyebrow="Marketplace"
        title="Network-verified, transparently sourced."
        lead="Only Network-registered partners may list."
      />

      <section className="relative px-6 max-w-7xl mx-auto pb-16">
        <div className="blur-[6px] pointer-events-none select-none" aria-hidden="true">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-12">
            {CATEGORIES.map((c) => (
              <button key={c.title} className="bg-white border border-forest/10 rounded-2xl p-5 text-left">
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
              <article key={l.title} className="bg-white border border-forest/10 rounded-2xl p-6">
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
                  <span className="text-xs font-bold uppercase tracking-widest text-gold">View →</span>
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
              <span className="inline-block bg-gold text-forest px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest">Register in Network</span>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
          <div
            role="dialog"
            aria-labelledby="marketplace-inquiry-title"
            className="w-full max-w-lg rounded-3xl border border-forest/10 bg-earth/95 p-10 text-center shadow-2xl backdrop-blur-md"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">Coming soon</span>
            <h2 id="marketplace-inquiry-title" className="font-serif text-3xl italic text-forest mt-3 mb-4 leading-tight">
              Inquire about sourcing Iboga, investing in a farm, and more.
            </h2>
            <p className="text-sm text-forest/65 leading-relaxed mb-8">
              The marketplace is still being built. Book a sourcing consultation to discuss ethical procurement,
              farm investment, and other opportunities in the network.
            </p>
            <Link
              to="/source"
              className="inline-block bg-forest text-earth px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-moss transition-colors"
            >
              Request consultation →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

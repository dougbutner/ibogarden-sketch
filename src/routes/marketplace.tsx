import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { NetworkApplicationForm } from "@/components/network/network-application-form";

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
  const [showApplication, setShowApplication] = useState(false);

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

        <div className="absolute inset-0 z-10 flex items-start justify-center p-6 overflow-y-auto">
          <div
            role="dialog"
            aria-labelledby="marketplace-inquiry-title"
            className="w-full max-w-3xl rounded-3xl border border-forest/10 bg-earth/95 p-8 md:p-10 shadow-2xl backdrop-blur-md my-auto"
          >
            <div className="text-center mb-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">Coming soon</span>
              <h2 id="marketplace-inquiry-title" className="font-serif text-3xl italic text-forest mt-3 leading-tight">
                Iboga producers + healers
              </h2>
            </div>

            <div className="space-y-6 mb-10 text-left">
              <div>
                <h3 className="font-semibold text-forest mb-2">🇬🇦 Access Markets at scale</h3>
                <p className="text-sm text-forest/65 leading-relaxed">
                  As a marketplace member, you open connections to buyers, pathways to legal export and
                  investment.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-forest mb-2">🇬🇦 Quality inner root bark and derivatives</h3>
                <p className="text-sm text-forest/65 leading-relaxed">
                  As a buyer, you get access to a network of producers, proven sourcing of a high quality product
                  shipped globally, within legal limits.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-forest mb-2">🤝 Shake hands</h3>
                <p className="text-sm text-forest/65 leading-relaxed">
                  We&apos;re hand-selecting merchants able to comply with the order from May 22, 2026. Buyers need not
                  apply, click request consultation for info on legal procurement from our network of farmers, farm
                  investment, and other opportunities in the network.
                </p>
              </div>
            </div>

            {showApplication ? (
              <NetworkApplicationForm className="mb-10 !p-6 md:!p-8" />
            ) : (
              <div className="text-center mb-10">
                <button
                  type="button"
                  onClick={() => setShowApplication(true)}
                  className="inline-block bg-gold text-forest px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold-deep transition-colors"
                >
                  Iboga Market: Request Invite
                </button>
              </div>
            )}

            <div className="text-center border-t border-forest/10 pt-8 space-y-6">
              <p className="text-sm text-forest/65 leading-relaxed">
                Inquire about sourcing Iboga, investing in a farm, listing your iboga offering and more.
              </p>
              <Link
                to="/source"
                className="inline-block bg-forest text-earth px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-moss transition-colors"
              >
                Request consultation →
              </Link>

              <div className="pt-2 space-y-4">
                <p className="text-sm text-forest/65 leading-relaxed">
                  Iboga is closely guarded, and so is our network. Hold{" "}
                  <Link to="/gaine" hash="jupiter" className="gaine-word gaine-word-sm text-gold hover:underline">
                    GAINE
                  </Link>{" "}
                  to access.
                </p>
                <Link
                  to="/community"
                  className="inline-block border border-forest/20 text-forest px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-forest hover:text-earth transition-colors"
                >
                  Enter Community →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

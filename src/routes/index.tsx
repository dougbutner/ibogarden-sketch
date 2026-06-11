import { createFileRoute, Link } from "@tanstack/react-router";
import heroForest from "@/assets/hero-forest.jpg";
import gabonPlantation from "@/assets/gabon-plantation.jpg";
import seedling from "@/assets/seedling.jpg";
import ibogaRoot from "@/assets/iboga-root.jpg";
import { useHoverParallax, useParallax } from "@/hooks/useParallax";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ibo.garden — GAINE Token & Ethical Iboga Marketplace" },
      { name: "description", content: "GAINE SPL token and commodity marketplace for ethically sourced Iboga under Gabon Decree 0239. Nagoya Protocol-aligned sourcing, forward tree contracts, and on-chain traceability." },
      { property: "og:title", content: "ibo.garden — GAINE Token & Ethical Iboga Marketplace" },
      { property: "og:description", content: "GAINE SPL token and commodity marketplace for ethically sourced Iboga under Gabon Decree 0239. Nagoya Protocol-aligned sourcing, forward tree contracts, and on-chain traceability." },
      { property: "og:image", content: heroForest },
      { name: "twitter:image", content: heroForest },
    ],
  }),
  component: Home,
});

function MarketplaceCard({
  title,
  desc,
  to,
  img,
  badge,
  hash,
}: {
  title: string;
  desc: string;
  to: string;
  img: string;
  badge: string;
  hash?: string;
}) {
  const hoverParallax = useHoverParallax(0.12);
  const href = hash ? `${to}#${hash}` : to;

  const inner = (
    <div
      className="relative aspect-[4/5] rounded-3xl overflow-hidden"
      onMouseMove={hoverParallax.onMouseMove}
      onMouseLeave={hoverParallax.onMouseLeave}
    >
      <div
        ref={hoverParallax.imageRef}
        style={hoverParallax.imageStyle}
        data-parallax-speed={hoverParallax["data-parallax-speed"]}
        className="absolute inset-0"
      >
        <img
          src={img}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/30 to-transparent pointer-events-none" />
      <div className="absolute top-4 left-4 pointer-events-none">
        <span className="px-3 py-1 bg-gold text-forest text-[10px] font-bold uppercase tracking-widest rounded-full">{badge}</span>
      </div>
      <div className="absolute bottom-6 left-6 right-6 text-earth pointer-events-none">
        <h3 className="font-serif text-2xl italic mb-2">{title}</h3>
        <p className="text-sm text-earth/80">{desc}</p>
      </div>
    </div>
  );

  if (hash) {
    return (
      <a href={href} className="group block">
        {inner}
      </a>
    );
  }

  return (
    <Link to={to} className="group block">
      {inner}
    </Link>
  );
}

const ECONOMIC_HIGHLIGHTS = [
  {
    theme: "Supply Scarcity",
    copy: "Up to 85% of wild iboga has already disappeared from its natural environment. Good quality iboga is becoming more rare and expensive by the year.",
    source: "Conservation estimates",
  },
  {
    theme: "Smart Money",
    copy: "Catalyst4 — the vehicle funded by Sergey Brin's Tesla stake sale — committed $15M to ibogaine clinical trials in 2024.",
    source: "Catalyst4 · 2024",
  },
  {
    theme: "Policy Tailwinds",
    copy: "The Texas legislature signed a $50M grant for ibogaine drug development, increased to $100M this year. FDA Breakthrough Therapy Designation and a Trump executive order signal accelerating regulatory interest.",
    source: "Texas legislature · FDA · 2024–2026",
  },
  {
    theme: "Neuroscience",
    copy: "A 2024 Stanford TBI study showed an average reduction of 1.37 years in the biological age of brain tissue after a single treatment — in 40 combat veterans with TBI and PTSD.",
    source: "Stanford · 2024",
  },
];

function Home() {
  const heroParallax = useParallax(0.4);
  const impactParallax = useParallax(0.35);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={heroForest}
            alt="Misty Gabon rainforest at golden hour"
            width={1920}
            height={1280}
            ref={heroParallax.ref}
            style={heroParallax.style}
            data-parallax-speed={heroParallax["data-parallax-speed"]}
            className="w-full h-[120%] -top-[10%] absolute object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/70 via-forest/55 to-forest/85" />
        </div>
        <div className="relative z-10 max-w-4xl text-earth">
          <span className="inline-block px-4 py-1 mb-6 rounded-full border border-gold/40 bg-forest/40 backdrop-blur-sm text-gold text-[11px] font-medium tracking-[0.22em] uppercase">
            Gabon Decree 0239 · Nagoya Protocol
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-earth mb-6 leading-[1.05] italic text-balance">
            Ethically Sourced Iboga.<br />
            <span className="text-gold not-italic">Tokenized on Solana.</span>
          </h1>
          <p className="text-base md:text-xl text-earth/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Commodity marketplace and <span className="gaine-word gaine-word-sm">GAINE</span> token platform for
            Decree 0239-aligned Iboga sourcing, forward tree contracts, and on-chain traceability.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/gaine" className="btn-gaine bg-gold text-forest px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold/90 transition-colors">
              Buy GAINE
            </Link>
            <Link to="/marketplace" className="border border-earth/30 text-earth px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-earth/10 transition-colors">
              Explore Marketplace
            </Link>
          </div>
          <Link to="/source" className="mt-10 inline-flex items-center gap-3 text-sm text-gold/90 italic border-b border-gold/30 pb-1 hover:text-gold">
            Sourcing Consultation with Benny Friedmann →
          </Link>
        </div>
      </section>

      {/* ECONOMIC HIGHLIGHTS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="max-w-3xl mb-14">
          <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">Why Now</span>
          <h2 className="font-serif text-4xl md:text-5xl text-forest mt-4 italic leading-tight">The Iboga Supply Story</h2>
          <p className="text-forest/70 mt-5 text-lg leading-relaxed">
            Demand is accelerating. Supply is contracting. Policy and capital are converging on a commodity that grows
            in one forest.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-px bg-forest/10 border border-forest/10 rounded-2xl overflow-hidden">
          {ECONOMIC_HIGHLIGHTS.map((item) => (
            <div key={item.theme} className="bg-earth p-8 flex flex-col gap-4">
              <h3 className="font-serif text-xl italic text-forest">{item.theme}</h3>
              <p className="text-sm text-forest/70 leading-relaxed">{item.copy}</p>
              <p className="text-[10px] text-forest/40 uppercase tracking-widest mt-auto">{item.source}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FORWARD CONTRACTS */}
      <section id="forward-contracts" className="py-24 px-6 bg-forest text-earth">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">Conservation</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-8 italic leading-tight">Plant a Tree. Take Delivery Later.</h2>
            <p className="text-lg leading-relaxed mb-6 text-earth/80">
              Global buyers purchase a future iboga tree today, take delivery in six-plus years, and fund a Gabonese
              farmer's working capital in the meantime.
            </p>
            <p className="text-earth/60 leading-relaxed mb-10">
              Forward contracts tie conservation directly to commerce — replanting wild-harvested stock, financing
              cultivation, and building traceable supply under Gabon Decree 0239.
            </p>
            <a href="/marketplace#forward-contracts" className="inline-flex items-center bg-gold text-forest px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold/90 transition-colors">
              Browse Forward Contracts →
            </a>
          </div>
          <div className="overflow-hidden rounded-3xl">
            <img
              src={seedling}
              alt="Iboga seedling ready for planting in Gabon"
              loading="lazy"
              className="rounded-3xl aspect-[4/3] object-cover w-full"
            />
          </div>
        </div>
      </section>

      {/* GAINE */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-gold/5 rounded-[2.5rem] p-10 md:p-16 border border-gold/15">
          <div className="grid md:grid-cols-2 gap-14 items-start">
            <div>
              <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">The Token</span>
              <h2 className="font-serif text-4xl md:text-5xl mt-4 italic text-forest leading-tight">
                Understand <span className="gaine-word">GAINE</span>
              </h2>
              <p className="text-forest/75 mt-6 leading-relaxed">
                <span className="gaine-word gaine-word-sm">GAINE</span> is the settlement token for this marketplace — an SPL
                token on Solana with 100% liquidity on Orca. A 2% transfer tax converts to USDC and flows to sourcing,
                conservation, and Gabon communities.
              </p>
              <ul className="mt-8 space-y-5">
                {[
                  ["Ethical Sourcing", "Direct relationships with Gabonese growers. Nagoya-compliant traceability."],
                  ["Conservation", "Gabon reforestation and farmer working capital via forward contracts."],
                  ["Decree 0239", "Benefit-sharing aligned with Gabon's regulatory framework (May 22, 2026)."],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-4">
                    <div className="size-2 rounded-full bg-gold mt-2 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-forest">{t}</h4>
                      <p className="text-sm text-forest/60 mt-1">{d}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link to="/gaine" className="btn-gaine bg-forest text-earth px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-moss transition-colors">
                  Buy GAINE
                </Link>
                <Link to="/gaine" className="border border-forest/20 text-forest px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-forest hover:text-earth transition-colors">
                  How GAINE Works
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gold/20">
              <div className="flex justify-between items-center mb-8">
                <h4 className="font-semibold uppercase tracking-[0.2em] text-[10px] text-forest/40">Marketplace Activity</h4>
                <span className="text-[10px] font-mono text-gold flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-gold animate-pulse" />LIVE</span>
              </div>
              <div className="space-y-7">
                {[
                  ["Trees Planted (Gabon)", "14,202", 75],
                  ["Forward Contracts Active", "38", 55],
                  ["USDC to Gabon Farmers", "$84,200", 40],
                ].map(([l, v, p]) => (
                  <div key={l as string}>
                    <div className="flex justify-between text-sm mb-2 font-medium text-forest">
                      <span>{l}</span><span className="text-gold-deep">{v}</span>
                    </div>
                    <div className="w-full h-1 bg-forest/5 rounded-full overflow-hidden">
                      <div className="h-full bg-forest" style={{ width: `${p}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETPLACE TEASER */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">Marketplace</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 italic text-forest leading-tight">From the Garden</h2>
          </div>
          <Link to="/marketplace" className="text-xs font-semibold uppercase tracking-widest text-gold hover:text-gold-deep">Enter the marketplace →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <MarketplaceCard
            title="Root Bark & Extracts"
            desc="Sustainably harvested, lab-tested, Decree 0239-aligned."
            to="/marketplace"
            img={ibogaRoot}
            badge="Products"
          />
          <MarketplaceCard
            title="Forward Tree Contracts"
            desc="Purchase today. Take delivery in 6+ years. Fund farmer working capital."
            to="/marketplace"
            img={seedling}
            badge="Forward"
            hash="forward-contracts"
          />
          <MarketplaceCard
            title="GAINE-Verified Listings"
            desc="Network-verified suppliers with on-chain traceability."
            to="/marketplace"
            img={gabonPlantation}
            badge="Verified"
          />
        </div>
      </section>

      {/* CONSERVATION / GABON */}
      <section className="py-24 px-6 bg-forest text-earth">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">Conservation</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 italic">Rooted in Gabon</h2>
            <p className="text-earth/60 mt-6 max-w-2xl mx-auto leading-relaxed">
              Committed to advancing implementation of Gabon Decree 0239 (May 22, 2026). Every transaction supports
              reforestation and benefit-sharing with Gabonese communities.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              ["14,202", "Trees Planted"],
              ["840", "Families Supported"],
              ["$284K", "USDC to Gabon"],
              ["14", "Partner Farms"],
            ].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="font-serif text-5xl md:text-6xl text-gold mb-3">{n}</div>
                <p className="text-[11px] text-earth/50 uppercase tracking-widest">{l}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="overflow-hidden rounded-3xl">
              <img
                src={gabonPlantation}
                alt="Iboga plantation in Gabon"
                loading="lazy"
                ref={impactParallax.ref}
                style={impactParallax.style}
                data-parallax-speed={impactParallax["data-parallax-speed"]}
                className="rounded-3xl aspect-[4/3] object-cover w-full scale-105"
              />
            </div>
            <div>
              <p className="text-lg text-earth/80 leading-relaxed mb-8">
                For every wild root ethically harvested, new iboga trees are planted in cooperation with Gabonese
                smallholders. Plot coordinates recorded. Verification open.
              </p>
              <Link to="/impact" className="inline-flex items-center text-gold font-semibold tracking-wider uppercase text-sm border-b border-gold/40 pb-1">
                See conservation dashboard →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import heroForest from "@/assets/hero-forest.jpg";
import ibogaRoot from "@/assets/iboga-root.jpg";
import gabonFarm from "@/assets/gabon-farm.jpg";
import seedling from "@/assets/seedling.jpg";
import ceremonySpace from "@/assets/ceremony-space.jpg";
import { useHoverParallax, useParallax } from "@/hooks/useParallax";
import { SacredBroadcastsCarousel } from "@/components/knowledge/sacred-broadcasts-carousel";
import { VIDEO_PLAYLISTS } from "@/data/knowledge-iboga";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ibo.garden — GAINE Token & Ethical Iboga Marketplace" },
      { name: "description", content: "GAINE SPL token and marketplace for ethically sourced Iboga. Nagoya Protocol-aligned sourcing, network-verified listings, and on-chain traceability." },
      { property: "og:title", content: "ibo.garden — GAINE Token & Ethical Iboga Marketplace" },
      { property: "og:description", content: "GAINE SPL token and marketplace for ethically sourced Iboga. Nagoya Protocol-aligned sourcing, network-verified listings, and on-chain traceability." },
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
}: {
  title: string;
  desc: string;
  to: string;
  img: string;
  badge: string;
}) {
  const hoverParallax = useHoverParallax(0.12);

  return (
    <Link to={to} className="group block">
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
    </Link>
  );
}

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
            Gabon First · Nagoya Protocol · Bwiti Respected
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-earth mb-6 leading-[1.05] italic text-balance">
            Ethically Sourced Iboga.<br />
            <span className="text-gold not-italic">Tokenized on Solana.</span>
          </h1>
          <p className="text-base md:text-xl text-earth/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Marketplace and <span className="gaine-word gaine-word-sm">GAINE</span> token platform for ethical Iboga
            sourcing, network-verified listings, and on-chain traceability.
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

      {/* SACRED ROOT */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">The Root of Connection</span>
            <h2 className="font-serif text-4xl md:text-5xl text-forest mt-4 mb-8 italic leading-tight">Iboga Tabernanthe</h2>
            <p className="text-lg leading-relaxed mb-6 text-forest/80">
              Eating pure Tabernanthe Iboga root cleans and prepares the neural network to grow new connections, allowing addicts to heal and become healthy loving family members who uplift their community.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-forest/80">
              There&apos;s a fast layer of receptor binding that lasts hours, and a slow layer of gene-expression and structural change, quieting the circuits worn thin by trauma and habits, flooding pathways that have gone dark.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-forest/80">
              Bringing the Holy Wood to the world is the will of the root according to Mougahenda Mikala, 10th-generation Bwiti Shaman.
            </p>
            <p className="text-lg leading-relaxed mb-8 text-forest/80">
              Designed by renowned coder{' '}
              <a href="https://github.com/dougbutner/web-4" target="_blank" rel="noopener noreferrer" className="text-gold underline hover:text-gold/80">
                Gudasol
              </a>
              , GAINE flows reciprocal rewards back to the people. Ibogarden funnels the world&apos;s attention to the plant, materializing organic interest with rapidly materializing supply chains to heal a planet for a new, more connected age of humanity.
            </p>
            <Link to="/learn" className="inline-flex items-center text-gold font-semibold tracking-wider uppercase text-sm group">
              Learn the Full Story
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={ibogaRoot}
                alt="Iboga root bark in a wooden bowl"
                width={800}
                height={1000}
                loading="lazy"
                className="absolute inset-0 size-full object-cover object-center"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-forest p-8 rounded-2xl text-earth max-w-xs shadow-xl">
              <p className="font-serif italic text-xl mb-2">&ldquo;Iboga carries the grandfather spirit.&rdquo;</p>
              <p className="text-xs uppercase tracking-widest text-gold">Wisdom teaching</p>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO CAROUSEL */}
      <section className="py-20 bg-forest text-earth overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10 flex justify-between items-end">
          <div>
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">Voices of the Garden</span>
            <h3 className="font-serif text-3xl md:text-4xl italic mt-3">Sacred Broadcasts</h3>
          </div>
          <div className="hidden md:block text-xs text-earth/40 uppercase tracking-widest">Three playlists → swipe</div>
        </div>
        <SacredBroadcastsCarousel playlists={VIDEO_PLAYLISTS.slice(0, 3)} />
      </section>

      {/* HEALING PLANETARY ADDICTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="max-w-3xl mb-14">
          <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">Mission</span>
          <h2 className="font-serif text-4xl md:text-5xl text-forest mt-4 italic leading-tight">Healing Planetary Addiction</h2>
          <p className="text-forest/70 mt-5 text-lg leading-relaxed">
            Addiction is not only substances. It is emotion, consumption, and the false stories we tell about ourselves. We work upstream — through research, free access, education, and certification of farms and care.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-px bg-forest/10 border border-forest/10 rounded-2xl overflow-hidden">
          {[
            { n: "01", t: "Research", d: "Open clinical studies on PTSD, addiction, and neuroplasticity." },
            { n: "02", t: "Free Access", d: "Pathways into clinical and traditional care, regardless of means." },
            { n: "03", t: "Free Education", d: "Preparation and integration guides as public goods." },
            { n: "04", t: "Certification", d: "Decree 0239-aligned authorization, traceability, and benefit-sharing for farms and care facilities." },
          ].map((c) => (
            <div key={c.n} className="bg-earth p-8 flex flex-col gap-5">
              <span className="text-gold font-serif text-2xl">{c.n}</span>
              <h4 className="font-serif text-xl italic text-forest">{c.t}</h4>
              <p className="text-sm text-forest/65 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY IBOGA CHANGES EVERYTHING */}
      <section className="py-24 px-6 bg-bone">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5">
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">Why It Matters</span>
            <h2 className="font-serif text-4xl md:text-5xl text-forest mt-4 italic leading-tight">Why Iboga Changes Everything</h2>
            <p className="text-forest/70 mt-5 leading-relaxed">
              From opioid dependency to suicide ideation, the medicine meets people at the root of suffering. Used clinically for recovery, traditionally for initiation, and in community for celebration.
            </p>
          </div>
          <div className="md:col-span-7 space-y-4">
            {[
              { who: "A., 38 · Opioid recovery", q: "Five years of dependency lifted in a single ceremony. The integration since has been the real medicine." },
              { who: "M., 45 · Depression", q: "I came back inside my own life. The forest stayed with me." },
              { who: "S., 29 · PTSD", q: "I stopped running. I started living." },
            ].map((s) => (
              <figure key={s.who} className="bg-earth p-6 rounded-2xl border border-forest/10">
                <blockquote className="font-serif italic text-xl text-forest leading-snug">"{s.q}"</blockquote>
                <figcaption className="mt-3 text-xs uppercase tracking-widest text-gold-deep font-semibold">{s.who}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* GAINE */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-gold/5 rounded-[2.5rem] p-10 md:p-16 border border-gold/15">
          <div className="grid md:grid-cols-2 gap-14 items-start">
            <div>
              <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">Financial Regeneration</span>
              <h2 className="font-serif text-4xl md:text-5xl mt-4 italic text-forest leading-tight">
                The <span className="gaine-word">GAINE</span> Advantage
              </h2>
              <p className="text-forest/75 mt-6 leading-relaxed">
                Our SPL token on Solana powers ethical sourcing. A 2% reflection on every transaction is converted to
                USDC and directed — by you — to Gabon reforestation, traditional communities, or clinical research.
              </p>
              <ul className="mt-8 space-y-5">
                {[
                  ["Certified", <><span className="gaine-word gaine-word-sm">GAINE</span> Certified farms and facilitators are audited and badged.</>],
                  ["Ethical Source", "Direct relationships with Gabonese growers. Nagoya-compliant."],
                  ["Legal Pathways", "Jurisdiction-aware referrals into licensed clinical access."],
                  ["Philanthropy", "Holders redirect their reflection — never receive their own."],
                ].map(([t, d]) => (
                  <li key={t as string} className="flex gap-4">
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
                  Redirect Your Yield
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gold/20">
              <div className="flex justify-between items-center mb-8">
                <h4 className="font-semibold uppercase tracking-[0.2em] text-[10px] text-forest/40">Live Impact Dashboard</h4>
                <span className="text-[10px] font-mono text-gold flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-gold animate-pulse" />LIVE</span>
              </div>
              <div className="space-y-7">
                {[
                  ["Trees Planted (Gabon)", "14,202", 75],
                  ["Funds to Traditional Healers", "$84,200 USDC", 40],
                  ["Clinical Treatments Funded", "62", 55],
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
                <div className="pt-6 border-t border-forest/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-forest/40 uppercase tracking-widest">Spread the Root</span>
                    <span className="text-[10px] font-bold text-moss uppercase">Open knowledge</span>
                  </div>
                  <div className="mt-4 p-4 bg-earth rounded-xl">
                    <p className="text-sm italic text-forest mb-3 leading-snug">
                      "Invite someone to the Iboga library — traditions, science, and ethical pathways."
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-forest">Share & invite</span>
                      <Link to="/share" className="text-xs font-bold text-gold uppercase tracking-wider">
                        Share →
                      </Link>
                    </div>
                  </div>
                </div>
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
            title="Find a Facilitator"
            desc="Clinical, traditional, retreat — verified globally."
            to="/find"
            img={ceremonySpace}
            badge="Directory"
          />
          <MarketplaceCard
            title="Support a Farm"
            desc="Direct Gabonese growers. Reforestation tracked on-chain."
            to="/impact"
            img={gabonFarm}
            badge="Sourcing"
          />
          <MarketplaceCard
            title="Share Iboga Knowledge"
            desc="Invite someone to learn. Copy a link or share to your network."
            to="/share"
            img={seedling}
            badge="Share"
          />
        </div>
        <div className="mt-12 text-center text-sm text-forest/60 italic">
          <span className="text-gold-deep font-semibold not-italic">Live impact counter →</span>
        </div>
      </section>

      {/* IMPACT IN GABON */}
      <section className="py-24 px-6 bg-forest text-earth">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">Live Impact</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 italic">Rooted in Gabon</h2>
            <p className="text-earth/60 mt-6 max-w-2xl mx-auto leading-relaxed">
              Committed to Gabon Presidential Decree 0239 (22 May 2026) — sovereign regulation of Iboga access,
              export certification, community benefit-sharing, and traditional knowledge protection. Every
              transaction supports reforestation and fair returns to Gabonese communities.
            </p>
            <Link
              to="/decree"
              className="inline-flex items-center mt-6 text-gold text-sm font-semibold uppercase tracking-widest border-b border-gold/40 pb-1 hover:text-gold/80"
            >
              Read the decree summary →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              ["14,202", "Trees Planted"],
              ["840", "Families Supported"],
              ["$284K", "USDC to Gabon"],
              ["14", "Farms Certified"],
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
                src={gabonFarm}
                alt="Iboga farm in Gabon"
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
                See the impact dashboard →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* JOIN ON TELEGRAM */}
      <section className="py-28 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-5xl md:text-7xl text-forest italic mb-6 leading-[0.95]">
            Plant a Seed Today.
          </h2>
          <p className="text-lg text-forest/70 mb-10 max-w-xl mx-auto">
            Join the Garden on Telegram. Quarterly impact reports, sourcing updates, and field stories from Gabon.
          </p>
          <a
            href="https://t.me/flextokens"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-forest text-earth px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-moss transition-colors"
          >
            Join on Telegram →
          </a>
        </div>
      </section>
    </>
  );
}

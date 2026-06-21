import { createFileRoute, Link } from "@tanstack/react-router";
import heroForest from "@/assets/hero-forest.jpg";
import ibogaRoot from "@/assets/iboga-root.jpg";
import gabonFarm from "@/assets/gabon-farm.jpg";
import seedling from "@/assets/seedling.jpg";
import ceremonySpace from "@/assets/ceremony-space.jpg";
import { useElementParallax, useHoverParallax, useParallax } from "@/hooks/useParallax";
import { SacredBroadcastsCarousel } from "@/components/knowledge/sacred-broadcasts-carousel";
import { VIDEO_PLAYLISTS } from "@/data/knowledge-iboga";
import { GAINE_JUPITER_TOKEN_URL } from "@/data/gaine";
import { DEFAULT_OG_IMAGE } from "@/lib/site";
import { useLocale } from "@/contexts/locale-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ibo.garden: Gabon Iboga · GAINE Token · Ethical Sourcing" },
      { name: "description", content: "Ethical Iboga sourcing from Gabon. GAINE token, marketplace access, and on-chain traceability under Decree 0239." },
      { property: "og:title", content: "ibo.garden: Gabon Iboga · GAINE Token · Ethical Sourcing" },
      { property: "og:description", content: "Ethical Iboga sourcing from Gabon. GAINE token, marketplace access, and on-chain traceability under Decree 0239." },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
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
  const impactParallax = useElementParallax(0.35);
  const { t } = useLocale();

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
            {t("home.badge")}
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-earth mb-6 leading-[1.05] italic text-balance">
            {t("home.heroTitle")}<br />
            <span className="text-gold not-italic">{t("home.heroSubtitle")}</span>
          </h1>
          <p className="text-base md:text-xl text-earth/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("home.heroLead")}{" "}
            <span className="gaine-word gaine-word-sm">GAINE</span> {t("home.heroLeadTail")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={GAINE_JUPITER_TOKEN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gaine bg-gold text-forest px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold/90 transition-colors"
            >
              {t("home.buyGaine")}
            </a>
            <Link to="/marketplace" className="border border-earth/30 text-earth px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-earth/10 transition-colors">
              {t("home.exploreMarketplace")}
            </Link>
          </div>
          <Link to="/source" className="mt-10 inline-flex items-center gap-3 text-sm text-gold/90 italic border-b border-gold/30 pb-1 hover:text-gold">
            {t("home.bennyConsult")}
          </Link>
        </div>
      </section>

      {/* SACRED ROOT */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">{t("home.sacredLabel")}</span>
            <h2 className="font-serif text-4xl md:text-5xl text-forest mt-4 mb-8 italic leading-tight">{t("home.sacredTitle")}</h2>
            <p className="text-lg leading-relaxed mb-6 text-forest/80">
              Tabernanthe iboga is a shrub of the Apocynaceae family, native to Africa&apos;s equatorial forests. Rich in
              indole-monoterpene alkaloids, chiefly <strong className="font-semibold text-forest">ibogaine</strong>, it has been used in traditional medicine for centuries:
              chewing the root or bark for stimulating, regenerative effect.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-forest/80">
              The plant reaches maturity in <strong className="font-semibold text-forest">five years</strong>, and alkaloid quality increases the longer it grows. Iboga&apos;s
              unique mechanism of action works across a range of brain receptors, with the potential to fundamentally
              change addiction treatment and address the <strong className="font-semibold text-forest">global opioid crisis</strong>.
            </p>
            <p className="text-lg leading-relaxed mb-8 text-forest/80">
              Through the ibo.garden network, this <strong className="font-semibold text-forest">Holy Root</strong> reaches the world with traceable supply, Gabonese
              benefit-sharing, and the reciprocal economics of <span className="gaine-word gaine-word-sm">GAINE</span>.
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

      {/* PARTNERS NETWORK */}
      <section className="py-24 px-6 bg-bone">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-14">
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">Partners Network</span>
            <h2 className="font-serif text-4xl md:text-5xl text-forest mt-4 italic leading-tight">Plant Roots in the Garden</h2>
            <p className="text-forest/70 mt-5 text-lg leading-relaxed">
              Facilities, practitioners, and farms <strong className="font-semibold text-forest">apply once</strong>. Approved partners gain marketplace access,{" "}
              <span className="gaine-word gaine-word-sm">GAINE</span> rewards, and direct community visibility, all
              reviewed under <strong className="font-semibold text-forest">Gabon Decree 0239</strong> and the Nagoya Protocol.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {[
              { t: "Facilities", d: "Clinical centers, retreat centers, and recovery programs seeking verified sourcing and patient pathways." },
              { t: "Practitioners", d: "Facilitators, Bwiti ngangas, integration coaches, and medical staff serving ceremony and clinical care." },
              { t: "Farms", d: "Iboga growers, ethical sourcing operations, and reforestation organizations rooted in Gabon." },
            ].map((c) => (
              <div key={c.t} className="bg-earth border border-forest/10 rounded-3xl p-7">
                <h3 className="font-serif text-2xl italic text-forest mb-2">{c.t}</h3>
                <p className="text-sm text-forest/65 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-forest/10 border border-forest/10 rounded-2xl overflow-hidden mb-10">
            {[
              { t: "Network-verified", d: "Every listing reviewed before publishing. Buyers and healers see certification, jurisdiction, and sourcing lineage." },
              { t: "Marketplace access", d: "Treatments, ceremonies, training, products, and donations: hand-selected merchants aligned with Decree 0239." },
              { t: "GAINE rewards", d: "Partners earn visibility and holder-directed yield from the token economy powering ethical supply." },
              { t: "Community gate", d: "Hold GAINE to access the private community, sourcing intelligence, and quarterly field reports from Gabon." },
            ].map((item) => (
              <div key={item.t} className="bg-earth p-8">
                <h4 className="font-semibold text-forest mb-2">{item.t}</h4>
                <p className="text-sm text-forest/65 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/network" className="bg-forest text-earth px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-moss transition-colors">
              Register in Network →
            </Link>
            <Link to="/marketplace" className="border border-forest/20 text-forest px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-forest hover:text-earth transition-colors">
              Explore Marketplace
            </Link>
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
            Addiction is not only substances. It is the <strong className="font-semibold text-forest">global opioid crisis</strong>, trauma, and the false stories we tell
            about ourselves. Iboga&apos;s unique receptor action offers a path to <strong className="font-semibold text-forest">fundamental change</strong>. We work upstream:
            certified Gabon production, research partnerships, and access pathways for those who need it.
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
              {
                id: "lotsof",
                who: "Howard Lotsof · Heroin dependence",
                q: "Where previously I had viewed heroin as a drug which gave me comfort, I now viewed heroin as a drug which emulated death. The very next thought into my mind was, 'I prefer life to death.'",
                source: "Rolling Stone",
                href: "https://qc.rollingstone.com/en/culture/he-took-a-psychedelic-to-cure-his-addiction-it-was-his-last-trip/",
              },
              {
                id: "jesse",
                who: "Jesse · Depression",
                q: "After 10 years of battling depression and cycling through treatments that never worked, I finally found someone who truly listened — and it saved my life.",
                source: "The Ibogaine Institute",
                href: "https://theibogainstitute.org/success-stories/",
              },
              {
                id: "flatley",
                who: "Patrick Flatley · Green Beret veteran · PTSD",
                q: "I went from being constantly angry and feeling alone, burdened by the trauma of war and the loss of 12 friends to suicide, to finding a renewed sense of hope and peace.",
                source: "VETS",
                href: "https://vetsolutions.org/news/veterans-exploring-treatment-solutions-vets-grant-recipients-participate-in-groundbreaking-stanford-study-on-ibogaine-treatment-for-ptsd-and-tbi/",
              },
            ].map((s) => (
              <figure key={s.id} className="bg-earth p-6 rounded-2xl border border-forest/10">
                <blockquote className="font-serif italic text-xl text-forest leading-snug">"{s.q}"</blockquote>
                <figcaption className="mt-3 space-y-1">
                  <div className="text-xs uppercase tracking-widest text-gold-deep font-semibold">{s.who}</div>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-forest/55 hover:text-gold transition-colors underline underline-offset-2"
                  >
                    Source: {s.source}
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* GAINE */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-gold/5 rounded-[2.5rem] p-10 md:p-16 border border-gold/15">
          <div className="max-w-2xl">
              <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">Financial Regeneration</span>
              <h2 className="font-serif text-4xl md:text-5xl mt-4 italic text-forest leading-tight">
                The <span className="gaine-word">GAINE</span> Advantage
              </h2>
              <p className="text-forest/75 mt-6 leading-relaxed">
                Our SPL token on Solana powers ethical sourcing. A <strong className="font-semibold text-forest">2% reflection</strong> on every transaction is converted to
                USDC and directed, <strong className="font-semibold text-forest">by you</strong>, to Gabon reforestation, traditional communities, or clinical research.
              </p>
              <ul className="mt-8 space-y-5">
                {[
                  ["Certified", <><span className="gaine-word gaine-word-sm">GAINE</span> Certified farms and facilitators are audited and badged.</>],
                  ["Ethical Source", "Direct relationships with Gabonese growers. Nagoya-compliant."],
                  ["Legal Pathways", "Jurisdiction-aware referrals into licensed clinical access."],
                  ["Philanthropy", "Holders redirect their reflection: never receive their own."],
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
                <a
                  href={GAINE_JUPITER_TOKEN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gaine bg-forest text-earth px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-moss transition-colors"
                >
                  Buy GAINE
                </a>
                <Link to="/gaine" className="border border-forest/20 text-forest px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-forest hover:text-earth transition-colors">
                  Redirect Your Yield
                </Link>
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
            desc="Clinical, traditional, retreat: verified globally."
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
      </section>

      {/* IMPACT IN GABON */}
      <section className="py-24 px-6 bg-forest text-earth">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">Impact in Gabon</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 italic">Rooted in Gabon</h2>
            <p className="text-earth/60 mt-6 max-w-2xl mx-auto leading-relaxed">
              The network operates under <strong className="font-semibold text-earth">Gabon Presidential Decree 0239</strong>: sovereign regulation, export certification,
              community benefit-sharing, and traditional knowledge protection. Every{" "}
              <span className="gaine-word gaine-word-sm">GAINE</span> transaction supports reforestation and fair
              returns to Gabonese communities.
            </p>
            <Link
              to="/decree"
              className="inline-flex items-center mt-6 text-gold text-sm font-semibold uppercase tracking-widest border-b border-gold/40 pb-1 hover:text-gold/80"
            >
              Read the decree summary →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="overflow-hidden rounded-3xl aspect-[4/3] relative">
              <img
                src={gabonFarm}
                alt="Iboga farm in Gabon"
                loading="lazy"
                ref={impactParallax.ref}
                style={impactParallax.style}
                data-parallax-speed={impactParallax["data-parallax-speed"]}
                className="absolute inset-x-0 w-full h-[220%] object-cover object-center"
              />
            </div>
            <div>
              <p className="text-lg text-earth/80 leading-relaxed mb-8">
                For every root <strong className="font-semibold text-earth">ethically harvested</strong>, new iboga trees are planted in cooperation with Gabonese smallholders
                and partner nursery networks across the region. Plot coordinates recorded. <strong className="font-semibold text-earth">Verification open</strong>.
              </p>
              <Link to="/network" className="inline-flex items-center text-gold font-semibold tracking-wider uppercase text-sm border-b border-gold/40 pb-1 mr-6">
                Join the network →
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

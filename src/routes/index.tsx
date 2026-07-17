import { createFileRoute, Link } from "@tanstack/react-router";
import heroForest from "@/assets/hero-forest.jpg";
import ibogaRoot from "@/assets/iboga-root.jpg";
import gabonFarm from "@/assets/gabon-farm.jpg";
import seedling from "@/assets/seedling.jpg";
import ceremonySpace from "@/assets/ceremony-space.jpg";
import { useElementParallax, useHoverParallax, useParallax } from "@/hooks/useParallax";
import { SacredBroadcastsCarousel } from "@/components/knowledge/sacred-broadcasts-carousel";
import { getVideoPlaylists } from "@/data/knowledge-iboga";
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
  const { t, locale } = useLocale();
  const broadcastPlaylists = getVideoPlaylists(locale).slice(0, 3);

  const partnerCards = [
    { t: t("home.partnerFacilities"), d: t("home.partnerFacilitiesDesc") },
    { t: t("home.partnerPractitioners"), d: t("home.partnerPractitionersDesc") },
    { t: t("home.partnerFarms"), d: t("home.partnerFarmsDesc") },
  ];
  const benefits = [
    { t: t("home.benefitNetwork"), d: t("home.benefitNetworkDesc") },
    { t: t("home.benefitMarketplace"), d: t("home.benefitMarketplaceDesc") },
    { t: t("home.benefitRewards"), d: t("home.benefitRewardsDesc") },
    { t: t("home.benefitCommunity"), d: t("home.benefitCommunityDesc") },
  ];
  const missionCards = [
    { n: "01", t: t("home.mission01"), d: t("home.mission01Desc") },
    { n: "02", t: t("home.mission02"), d: t("home.mission02Desc") },
    { n: "03", t: t("home.mission03"), d: t("home.mission03Desc") },
    { n: "04", t: t("home.mission04"), d: t("home.mission04Desc") },
  ];
  const testimonials = [
    {
      id: "lotsof",
      who: t("home.testimonialLotsofWho"),
      q: t("home.testimonialLotsofQ"),
      source: "Rolling Stone",
      href: "https://qc.rollingstone.com/en/culture/he-took-a-psychedelic-to-cure-his-addiction-it-was-his-last-trip/",
    },
    {
      id: "jesse",
      who: t("home.testimonialJesseWho"),
      q: t("home.testimonialJesseQ"),
      source: "The Ibogaine Institute",
      href: "https://theibogainstitute.org/success-stories/",
    },
    {
      id: "flatley",
      who: t("home.testimonialFlatleyWho"),
      q: t("home.testimonialFlatleyQ"),
      source: "VETS",
      href: "https://vetsolutions.org/news/veterans-exploring-treatment-solutions-vets-grant-recipients-participate-in-groundbreaking-stanford-study-on-ibogaine-treatment-for-ptsd-and-tbi/",
    },
  ];
  const gaineBenefits = [
    { title: t("home.gaineCertified"), desc: t("home.gaineCertifiedDesc") },
    { title: t("home.gaineEthical"), desc: t("home.gaineEthicalDesc") },
    { title: t("home.gaineLegal"), desc: t("home.gaineLegalDesc") },
    { title: t("home.gainePhilanthropy"), desc: t("home.gainePhilanthropyDesc") },
  ];

  return (
    <>
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={heroForest}
            alt={t("home.altHero")}
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
            {t("home.heroTitle")}
            <br />
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
            <Link
              to="/marketplace"
              className="border border-earth/30 text-earth px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-earth/10 transition-colors"
            >
              {t("home.exploreMarketplace")}
            </Link>
          </div>
          <Link
            to="/source"
            className="mt-10 inline-flex items-center gap-3 text-sm text-gold/90 italic border-b border-gold/30 pb-1 hover:text-gold"
          >
            {t("home.bennyConsult")}
          </Link>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">
              {t("home.sacredLabel")}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-forest mt-4 mb-8 italic leading-tight">
              {t("home.sacredTitle")}
            </h2>
            <p className="text-lg leading-relaxed mb-6 text-forest/80">{t("home.sacredP1")}</p>
            <p className="text-lg leading-relaxed mb-6 text-forest/80">{t("home.sacredP2")}</p>
            <p className="text-lg leading-relaxed mb-8 text-forest/80">{t("home.sacredP3")}</p>
            <Link
              to="/learn"
              className="inline-flex items-center text-gold font-semibold tracking-wider uppercase text-sm group"
            >
              {t("home.learnFullStory")}
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={ibogaRoot}
                alt={t("home.altRoot")}
                width={800}
                height={1000}
                loading="lazy"
                className="absolute inset-0 size-full object-cover object-center"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-forest p-8 rounded-2xl text-earth max-w-xs shadow-xl">
              <p className="font-serif italic text-xl mb-2">&ldquo;{t("home.quote")}&rdquo;</p>
              <p className="text-xs uppercase tracking-widest text-gold">{t("home.quoteAttr")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-bone">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-14">
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">
              {t("home.partnersEyebrow")}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-forest mt-4 italic leading-tight">
              {t("home.partnersTitle")}
            </h2>
            <p className="text-forest/70 mt-5 text-lg leading-relaxed">{t("home.partnersLead")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {partnerCards.map((c) => (
              <div key={c.t} className="bg-earth border border-forest/10 rounded-3xl p-7">
                <h3 className="font-serif text-2xl italic text-forest mb-2">{c.t}</h3>
                <p className="text-sm text-forest/65 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-forest/10 border border-forest/10 rounded-2xl overflow-hidden mb-10">
            {benefits.map((item) => (
              <div key={item.t} className="bg-earth p-8">
                <h4 className="font-semibold text-forest mb-2">{item.t}</h4>
                <p className="text-sm text-forest/65 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/network"
              className="bg-forest text-earth px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-moss transition-colors"
            >
              {t("home.registerNetwork")}
            </Link>
            <Link
              to="/marketplace"
              className="border border-forest/20 text-forest px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-forest hover:text-earth transition-colors"
            >
              {t("home.exploreMarketplaceCta")}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-forest text-earth overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10 flex justify-between items-end">
          <div>
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">
              {t("home.voicesEyebrow")}
            </span>
            <h3 className="font-serif text-3xl md:text-4xl italic mt-3">{t("home.voicesTitle")}</h3>
          </div>
          <div className="hidden md:block text-xs text-earth/40 uppercase tracking-widest">
            {t("home.voicesSwipe")}
          </div>
        </div>
        <SacredBroadcastsCarousel playlists={broadcastPlaylists} />
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="max-w-3xl mb-14">
          <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">
            {t("home.missionEyebrow")}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-forest mt-4 italic leading-tight">
            {t("home.missionTitle")}
          </h2>
          <p className="text-forest/70 mt-5 text-lg leading-relaxed">{t("home.missionLead")}</p>
        </div>
        <div className="grid md:grid-cols-4 gap-px bg-forest/10 border border-forest/10 rounded-2xl overflow-hidden">
          {missionCards.map((c) => (
            <div key={c.n} className="bg-earth p-8 flex flex-col gap-5">
              <span className="text-gold font-serif text-2xl">{c.n}</span>
              <h4 className="font-serif text-xl italic text-forest">{c.t}</h4>
              <p className="text-sm text-forest/65 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 bg-bone">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5">
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">
              {t("home.whyEyebrow")}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-forest mt-4 italic leading-tight">
              {t("home.whyTitle")}
            </h2>
            <p className="text-forest/70 mt-5 leading-relaxed">{t("home.whyLead")}</p>
          </div>
          <div className="md:col-span-7 space-y-4">
            {testimonials.map((s) => (
              <figure key={s.id} className="bg-earth p-6 rounded-2xl border border-forest/10">
                <blockquote className="font-serif italic text-xl text-forest leading-snug">&ldquo;{s.q}&rdquo;</blockquote>
                <figcaption className="mt-3 space-y-1">
                  <div className="text-xs uppercase tracking-widest text-gold-deep font-semibold">{s.who}</div>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-forest/55 hover:text-gold transition-colors underline underline-offset-2"
                  >
                    {t("home.sourcePrefix")} {s.source}
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-gold/5 rounded-[2.5rem] p-10 md:p-16 border border-gold/15">
          <div className="max-w-2xl">
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">
              {t("home.gaineEyebrow")}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 italic text-forest leading-tight">
              {t("home.gaineTitle")}
            </h2>
            <p className="text-forest/75 mt-6 leading-relaxed">{t("home.gaineLead")}</p>
            <ul className="mt-8 space-y-5">
              {gaineBenefits.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <div className="size-2 rounded-full bg-gold mt-2 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-forest">{item.title}</h4>
                    <p className="text-sm text-forest/60 mt-1">{item.desc}</p>
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
                {t("home.buyGaine")}
              </a>
              <Link
                to="/gaine"
                className="border border-forest/20 text-forest px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-forest hover:text-earth transition-colors"
              >
                {t("home.redirectYield")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">
              {t("home.marketEyebrow")}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 italic text-forest leading-tight">
              {t("home.marketTitle")}
            </h2>
          </div>
          <Link to="/marketplace" className="text-xs font-semibold uppercase tracking-widest text-gold hover:text-gold-deep">
            {t("home.enterMarketplace")}
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <MarketplaceCard
            title={t("home.cardFindTitle")}
            desc={t("home.cardFindDesc")}
            to="/find"
            img={ceremonySpace}
            badge={t("home.cardFindBadge")}
          />
          <MarketplaceCard
            title={t("home.cardFarmTitle")}
            desc={t("home.cardFarmDesc")}
            to="/impact"
            img={gabonFarm}
            badge={t("home.cardFarmBadge")}
          />
          <MarketplaceCard
            title={t("home.cardShareTitle")}
            desc={t("home.cardShareDesc")}
            to="/share"
            img={seedling}
            badge={t("home.cardShareBadge")}
          />
        </div>
      </section>

      <section className="py-24 px-6 bg-forest text-earth">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">
              {t("home.impactEyebrow")}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 italic">{t("home.impactTitle")}</h2>
            <p className="text-earth/60 mt-6 max-w-2xl mx-auto leading-relaxed">{t("home.impactLead")}</p>
            <Link
              to="/decree"
              className="inline-flex items-center mt-6 text-gold text-sm font-semibold uppercase tracking-widest border-b border-gold/40 pb-1 hover:text-gold/80"
            >
              {t("home.readDecree")}
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="overflow-hidden rounded-3xl aspect-[4/3] relative">
              <img
                src={gabonFarm}
                alt={t("home.altFarm")}
                loading="lazy"
                ref={impactParallax.ref}
                style={impactParallax.style}
                data-parallax-speed={impactParallax["data-parallax-speed"]}
                className="absolute inset-x-0 w-full h-[220%] object-cover object-center"
              />
            </div>
            <div>
              <p className="text-lg text-earth/80 leading-relaxed mb-8">{t("home.impactBody")}</p>
              <Link
                to="/network"
                className="inline-flex items-center text-gold font-semibold tracking-wider uppercase text-sm border-b border-gold/40 pb-1 mr-6"
              >
                {t("home.joinNetwork")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-5xl md:text-7xl text-forest italic mb-6 leading-[0.95]">
            {t("home.plantSeed")}
          </h2>
          <p className="text-lg text-forest/70 mb-10 max-w-xl mx-auto">{t("home.plantSeedLead")}</p>
          <a
            href="https://t.me/flextokens"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-forest text-earth px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-moss transition-colors"
          >
            {t("home.joinTelegram")}
          </a>
        </div>
      </section>
    </>
  );
}

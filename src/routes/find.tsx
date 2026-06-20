import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import {
  FIND_CATEGORIES,
  FIND_CENTERS,
  FIND_REGIONS,
  FIND_CENTER_COUNT,
  FIND_TOP_TIER_COUNT,
  FIND_REGION_COUNT,
  type CenterCategory,
  type CenterRegion,
} from "@/data/find-centers";

export const Route = createFileRoute("/find")({
  head: () => ({
    meta: [
      { title: "Find a Facilitator | ibo.garden" },
      {
        name: "description",
        content: `Verified Iboga and Ibogaine specialists worldwide: ${FIND_CENTER_COUNT} centers across Gabon, Mexico, Europe, Caribbean, Asia, South America, and Canada.`,
      },
      { property: "og:title", content: "Find an Iboga Facilitator | ibo.garden" },
      {
        property: "og:description",
        content: `${FIND_CENTER_COUNT} verified Iboga/Ibogaine centers globally — traditional Bwiti, clinical, and retreat.`,
      },
    ],
  }),
  component: Find,
});

const CATEGORY_STYLES: Record<CenterCategory, string> = {
  clinical: "bg-forest text-earth",
  traditional: "bg-gold/20 text-gold-deep",
  retreat: "bg-clay/15 text-clay",
};

function categoryLabel(category: CenterCategory) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function CenterCard({ center }: { center: (typeof FIND_CENTERS)[number] }) {
  return (
    <article className="bg-white border border-forest/10 p-7 rounded-3xl hover:border-gold/40 transition-colors flex flex-col">
      <div className="flex justify-between items-start gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          <span
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${CATEGORY_STYLES[center.category]}`}
          >
            {categoryLabel(center.category)}
          </span>
          {center.tier === "top" ? (
            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-gold/15 text-gold-deep">
              Top tier
            </span>
          ) : null}
        </div>
        <span className="text-[10px] text-forest/40 uppercase tracking-wider text-right shrink-0">
          {center.regionLabel}
        </span>
      </div>

      <h3 className="font-serif text-2xl italic text-forest mb-1 leading-snug">{center.name}</h3>
      <p className="text-[11px] text-forest/50 uppercase tracking-wider mb-4">{center.location}</p>

      {center.leader ? (
        <p className="text-xs text-forest/55 mb-3">
          <span className="font-semibold text-forest/70">Leader:</span> {center.leader}
        </p>
      ) : null}

      <p className="text-sm text-forest/65 mb-4 flex-1 leading-relaxed">{center.services}</p>

      {center.medical ? (
        <p className="text-xs text-forest/60 mb-3 leading-relaxed">
          <span className="font-semibold text-forest/75">Medical:</span> {center.medical}
        </p>
      ) : null}

      <p className="text-xs text-forest/60 mb-4 leading-relaxed">
        <span className="font-semibold text-forest/75">Verified:</span> {center.verification}
      </p>

      {center.note ? (
        <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200/80 rounded-lg px-3 py-2 mb-4 leading-relaxed">
          {center.note}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 mb-5">
        {center.cost ? (
          <span className="text-[10px] px-2 py-1 bg-bone rounded font-semibold text-forest/70 uppercase tracking-wider">
            {center.cost}
          </span>
        ) : null}
        {center.phone ? (
          <a
            href={`tel:${center.phone.replace(/\s/g, "")}`}
            className="text-[10px] px-2 py-1 bg-bone rounded font-semibold text-forest/70 uppercase tracking-wider hover:text-gold"
          >
            {center.phone}
          </a>
        ) : null}
        {center.contact && !center.phone ? (
          <span className="text-[10px] px-2 py-1 bg-bone rounded font-semibold text-forest/70 uppercase tracking-wider">
            {center.contact}
          </span>
        ) : null}
      </div>

      {center.website ? (
        <a
          href={center.website}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-xl border border-forest/15 text-sm font-semibold hover:bg-forest hover:text-earth transition-colors inline-flex items-center justify-center gap-2"
        >
          Visit website
          <ExternalLink className="size-3.5 opacity-60" />
        </a>
      ) : (
        <p className="w-full py-3 rounded-xl border border-dashed border-forest/15 text-sm text-center text-forest/45">
          Contact via directories
        </p>
      )}
    </article>
  );
}

function Find() {
  const [region, setRegion] = useState<CenterRegion | "all">("all");
  const [category, setCategory] = useState<CenterCategory | "all">("all");

  const filtered = useMemo(() => {
    return FIND_CENTERS.filter((center) => {
      if (region !== "all" && center.region !== region) return false;
      if (category !== "all" && center.category !== category) return false;
      return true;
    });
  }, [region, category]);

  return (
    <>
      <PageHeader
        eyebrow="Find a Facilitator"
        title="Verified Iboga & Ibogaine specialists."
        lead={
          <>
            {FIND_CENTER_COUNT} verified centers globally — Gabon Bwiti roots, Mexico clinical clinics, and
            retreat programs across Europe, the Caribbean, Asia, and Canada. Due diligence is always yours; we
            surface documented protocols, reviews, and operational status as of 2026.
          </>
        }
      />

      <section className="px-6 max-w-7xl mx-auto pb-24">
        <div className="mb-10 grid md:grid-cols-3 gap-3 text-center">
          {[
            { n: String(FIND_CENTER_COUNT), l: "Verified centers" },
            { n: String(FIND_TOP_TIER_COUNT), l: "Top-tier picks" },
            { n: String(FIND_REGION_COUNT), l: "Regions" },
          ].map((stat) => (
            <div key={stat.l} className="bg-bone border border-forest/10 rounded-2xl px-4 py-5">
              <p className="font-serif text-3xl italic text-forest">{stat.n}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-forest/45 mt-1">{stat.l}</p>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-forest/45 mb-3">Region</p>
          <div className="flex flex-wrap gap-2">
            {FIND_REGIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRegion(r.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-colors ${
                  region === r.id
                    ? "bg-forest text-earth"
                    : "border border-forest/20 text-forest hover:bg-forest hover:text-earth"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-forest/45 w-full sm:w-auto sm:mb-0">
            Type
          </p>
          {FIND_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-colors ${
                category === c.id
                  ? "bg-forest text-earth"
                  : "border border-forest/20 text-forest hover:bg-forest hover:text-earth"
              }`}
            >
              {c.label}
            </button>
          ))}
          <span className="sm:ml-auto text-xs text-forest/50 uppercase tracking-widest">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((center) => (
              <CenterCard key={center.id} center={center} />
            ))}
          </div>
        ) : (
          <p className="text-center text-forest/55 py-16">No centers match these filters.</p>
        )}

        <div className="mt-16 bg-bone border border-forest/10 rounded-3xl p-8 md:p-10">
          <h3 className="font-serif text-2xl italic text-forest mb-3 text-center">Safety baseline</h3>
          <p className="text-sm text-forest/65 text-center max-w-2xl mx-auto mb-6 leading-relaxed">
            Centers listed here explicitly specialize in Iboga or Ibogaine with documented medical protocols.
            Top-tier picks meet additional verification thresholds: recent reviews, licensed medical oversight, and
            established operational history.
          </p>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-forest/70 max-w-4xl mx-auto">
            {[
              "Pre-treatment screening (ECG, electrolytes, liver panel)",
              "Continuous cardiac monitoring during dosing",
              "Licensed medical doctors on-site",
              "24/7 nursing or staff coverage",
              "Emergency response protocol",
              "Hospital partnerships or advanced life support",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-gold shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 bg-white border border-forest/10 rounded-3xl p-8 md:p-10 text-center">
          <h3 className="font-serif text-2xl italic text-forest mb-2">Can&apos;t find the right fit?</h3>
          <p className="text-forest/70 mb-6 max-w-xl mx-auto">
            We hand-match seekers with vetted facilitators based on need, language, and location.
          </p>
          <Link
            to="/source"
            className="inline-block bg-forest text-earth px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-moss transition-colors"
          >
            Request a consultation →
          </Link>
        </div>
      </section>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/find")({
  head: () => ({
    meta: [
      { title: "Find a Facilitator — ibo.garden" },
      { name: "description", content: "Verified clinical, traditional Bwiti, and retreat facilitators. Filter by certification, location, and language." },
      { property: "og:title", content: "Find an Iboga Facilitator — ibo.garden" },
      { property: "og:description", content: "Clinical, Traditional, Retreat — verified globally." },
    ],
  }),
  component: Find,
});

type Cat = "All" | "Clinical" | "Traditional" | "Retreat";

const FACILITATORS = [
  { name: "The Vitality Center", cat: "Clinical", loc: "Costa Rica", lang: "EN/ES", certs: ["GAINE Certified", "Nagoya"], desc: "Rapid opioid detox with 24/7 medical supervision and integration coaching." },
  { name: "Ebando Association", cat: "Traditional", loc: "Libreville, Gabon", lang: "FR", certs: ["Bwiti Standard"], desc: "Authentic Bwiti initiation led by recognized traditional ngangas." },
  { name: "Rooted Horizon", cat: "Retreat", loc: "Alentejo, Portugal", lang: "EN/PT", certs: ["GAINE Certified"], desc: "Group retreats focused on emotional processing and holistic integration." },
  { name: "Iboga House Mexico", cat: "Clinical", loc: "Tijuana, Mexico", lang: "EN/ES", certs: ["GAINE Certified", "Nagoya"], desc: "Licensed clinical addiction protocol with medical staff on site." },
  { name: "Maison Ngonde", cat: "Traditional", loc: "Lambaréné, Gabon", lang: "FR", certs: ["Bwiti Standard", "Nagoya"], desc: "Lineage-rooted ceremonial work and ancestral healing." },
  { name: "Wild Path Retreats", cat: "Retreat", loc: "Costa Rica", lang: "EN", certs: ["Pending"], desc: "Small-group rites of passage with preparation and integration." },
] as const;

function Find() {
  const [cat, setCat] = useState<Cat>("All");
  const filtered = cat === "All" ? FACILITATORS : FACILITATORS.filter((f) => f.cat === cat);

  return (
    <>
      <PageHeader
        eyebrow="Find a Facilitator"
        title="Verified care, traditional and clinical."
        lead={<>A directory of certified facilities, Bwiti practitioners, and retreat centers. Bwiti Standard, Nagoya-compliant, <span className="gaine-word gaine-word-sm">GAINE</span> Certified.</>}
      />

      <section className="px-6 max-w-7xl mx-auto pb-24">
        <div className="flex flex-wrap items-center gap-3 mb-10">
          {(["All", "Clinical", "Traditional", "Retreat"] as Cat[]).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-colors ${cat === c ? "bg-forest text-earth" : "border border-forest/20 text-forest hover:bg-forest hover:text-earth"}`}
            >
              {c}
            </button>
          ))}
          <span className="ml-auto text-xs text-forest/50 uppercase tracking-widest">{filtered.length} results</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((f) => (
            <article key={f.name} className="bg-white border border-forest/10 p-7 rounded-3xl hover:border-gold/40 transition-colors flex flex-col">
              <div className="flex justify-between items-start mb-5">
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${f.cat === "Clinical" ? "bg-forest text-earth" : f.cat === "Traditional" ? "bg-gold/20 text-gold-deep" : "bg-clay/15 text-clay"}`}>{f.cat}</span>
                <span className="text-[10px] text-forest/40 uppercase tracking-wider">{f.loc}</span>
              </div>
              <h3 className="font-serif text-2xl italic text-forest mb-3">{f.name}</h3>
              <p className="text-sm text-forest/65 mb-6 flex-1">{f.desc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {f.certs.map((c) => (
                  <span key={c} className="text-[10px] px-2 py-1 bg-bone rounded font-semibold text-forest/70 uppercase tracking-wider">
                    {c.startsWith("GAINE") ? <><span className="gaine-word gaine-word-sm">GAINE</span>{c.slice(5)}</> : c}
                  </span>
                ))}
                <span className="text-[10px] px-2 py-1 bg-bone rounded font-semibold text-forest/70 uppercase tracking-wider">{f.lang}</span>
              </div>
              <button className="w-full py-3 rounded-xl border border-forest/15 text-sm font-semibold hover:bg-forest hover:text-earth transition-colors">
                View Profile
              </button>
            </article>
          ))}
        </div>

        <div className="mt-16 bg-bone border border-forest/10 rounded-3xl p-8 md:p-10 text-center">
          <h3 className="font-serif text-2xl italic text-forest mb-2">Can't find the right fit?</h3>
          <p className="text-forest/70 mb-6 max-w-xl mx-auto">We hand-match seekers with vetted facilitators based on need, language, and location.</p>
          <button className="bg-forest text-earth px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-moss transition-colors">Request a match</button>
        </div>
      </section>
    </>
  );
}

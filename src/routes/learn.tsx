import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn — ibo.garden" },
      { name: "description", content: "Iboga education, facilitator videos, healing stories, and ongoing research. Free preparation and integration guides." },
      { property: "og:title", content: "Learn about Iboga — ibo.garden" },
      { property: "og:description", content: "Education, videos, healing stories, and research." },
    ],
  }),
  component: Learn,
});

const SECTIONS = [
  {
    title: "Iboga Education",
    items: [
      ["Preparation Guide (PDF)", "Free · 32 pages · diet, mindset, medical screening"],
      ["Integration Support", "Free + paid coaching · groups and 1:1"],
      ["Healing Planetary Addiction", "Long-form essay · emotional attachment & the false self"],
    ],
  },
  {
    title: "Research",
    items: [
      ["Ongoing Clinical Studies", "PTSD, opioid dependency, depression"],
      ["Decree 0239 Alignment", "Sourcing criteria · Nagoya-aligned"],
      ["Sourcing Transparency", "Quarterly reports · on-chain proofs"],
      ["Quarterly Impact Report", "PDF · published every March, June, Sept, Dec"],
    ],
  },
];

function Learn() {
  return (
    <>
      <PageHeader
        eyebrow="Learn"
        title="Preparation is the medicine."
        lead="What you carry into the ceremony shapes what you carry out. Free guides, facilitator interviews, and ongoing clinical research."
      />

      <section className="px-6 max-w-7xl mx-auto pb-16">
        <h2 className="font-serif text-3xl italic text-forest mb-8">Video Library</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {["About Iboga", "Iboga Facilitators", "Healing Stories"].map((t) => (
            <div key={t} className="aspect-video rounded-2xl bg-forest text-earth relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 grid place-items-center">
                <div className="size-16 rounded-full bg-gold/90 text-forest grid place-items-center group-hover:scale-110 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-[10px] uppercase tracking-widest text-gold mb-1">Playlist</div>
                <div className="font-serif italic text-xl">{t}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 max-w-7xl mx-auto pb-24 grid md:grid-cols-2 gap-12">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h2 className="font-serif text-3xl italic text-forest mb-6">{s.title}</h2>
            <div className="space-y-3">
              {s.items.map(([t, d]) => (
                <button key={t} className="w-full text-left bg-white p-5 rounded-2xl border border-forest/10 hover:border-gold/40 transition-colors flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-semibold text-forest mb-1">{t}</h4>
                    <p className="text-sm text-forest/60">{d}</p>
                  </div>
                  <span className="text-gold text-xl shrink-0">→</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

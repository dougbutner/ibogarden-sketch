import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — ibo.garden" },
      { name: "description", content: "Recovery stories, forum, volunteer and ambassador programs. Get involved with ibo.garden." },
      { property: "og:title", content: "ibo.garden Community" },
      { property: "og:description", content: "Stories, forum, ambassadors, and ways to get involved." },
    ],
  }),
  component: Community,
});

function Community() {
  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="A forest of voices."
        lead="Recovery stories, ongoing dialogue, and the people building the Garden."
      />

      <section className="px-6 max-w-7xl mx-auto pb-16 grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-forest/10 rounded-3xl p-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">Stories</span>
          <h3 className="font-serif text-2xl italic text-forest mt-3 mb-4">Recovery narratives</h3>
          <p className="text-sm text-forest/65 mb-6">First-person accounts from facilitators, integration coaches, and people who walked the path.</p>
          <button className="text-xs font-bold uppercase tracking-widest text-forest border-b border-gold pb-1">Read the blog →</button>
        </div>
        <div className="bg-white border border-forest/10 rounded-3xl p-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">Discord</span>
          <h3 className="font-serif text-2xl italic text-forest mt-3 mb-4">Talk with the Garden</h3>
          <p className="text-sm text-forest/65 mb-6">Practitioners, GAINE holders, researchers, and seekers in ongoing conversation.</p>
          <button className="text-xs font-bold uppercase tracking-widest text-forest border-b border-gold pb-1">Join Discord →</button>
        </div>
        <div className="bg-white border border-forest/10 rounded-3xl p-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">Ambassadors</span>
          <h3 className="font-serif text-2xl italic text-forest mt-3 mb-4">Volunteer & Ambassador program</h3>
          <p className="text-sm text-forest/65 mb-6">Carry the work into your region. Translation, outreach, harm reduction.</p>
          <button className="text-xs font-bold uppercase tracking-widest text-forest border-b border-gold pb-1">Apply →</button>
        </div>
        <div className="bg-forest text-earth border border-forest rounded-3xl p-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">Get Involved</span>
          <h3 className="font-serif text-2xl italic mt-3 mb-4">Three ways in</h3>
          <ul className="space-y-3 text-sm text-earth/80">
            <li>· Donate to the general or project fund</li>
            <li>· Apply to the Partners Network</li>
            <li>· Share your story (with consent)</li>
          </ul>
        </div>
      </section>
    </>
  );
}

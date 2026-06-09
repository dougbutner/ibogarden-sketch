import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/nominate")({
  head: () => ({
    meta: [
      { title: "Nominate for Care — ibo.garden" },
      { name: "description", content: "Nominate yourself or another for funded Iboga treatment. Escrow wallet, public progress, treatment booked when goal is reached." },
      { property: "og:title", content: "Nominate for Care — ibo.garden" },
      { property: "og:description", content: "Fund a life-changing treatment. Transparent escrow, on-chain." },
    ],
  }),
  component: Nominate,
});

const ACTIVE = [
  { name: "Marcus", story: "10 years of opioid dependency. Ready for clinical protocol in Costa Rica.", raised: 3200, goal: 5000 },
  { name: "Lia", story: "Veteran with chronic PTSD. Approved for traditional ceremony with integration support.", raised: 1800, goal: 4200 },
  { name: "Anonymous", story: "Severe depression. Requested anonymity. Treatment scheduled for Q2.", raised: 4800, goal: 6000 },
];

function Nominate() {
  return (
    <>
      <PageHeader
        eyebrow="Nominate for Care"
        title="Funded by community. Held in escrow. Public progress."
        lead="Nominate yourself or another for treatment. A Solana escrow sub-wallet is created. When the goal is reached, the treatment is booked through the marketplace."
      />

      <section className="px-6 max-w-7xl mx-auto pb-16">
        <h2 className="font-serif text-3xl italic text-forest mb-8">Active Nominations</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {ACTIVE.map((p) => {
            const pct = Math.round((p.raised / p.goal) * 100);
            return (
              <article key={p.name} className="bg-white border border-forest/10 rounded-3xl p-7 flex flex-col">
                <h3 className="font-serif text-2xl italic text-forest mb-3">{p.name}</h3>
                <p className="text-sm text-forest/65 mb-6 flex-1">{p.story}</p>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold text-forest">${p.raised.toLocaleString()}</span>
                  <span className="text-forest/50">/ ${p.goal.toLocaleString()}</span>
                </div>
                <div className="w-full h-1.5 bg-forest/10 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-gold" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] uppercase tracking-widest text-gold-deep font-semibold">{pct}% funded</span>
                  <button className="text-xs font-bold uppercase tracking-widest text-forest hover:text-gold">Contribute →</button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="bg-forest text-earth rounded-3xl p-10 md:p-14 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif text-4xl italic mb-6">Nominate someone</h2>
            <ol className="space-y-5 text-earth/80">
              {[
                "Submit nomination (self or another, with consent)",
                "Council review for safety and fit",
                "Escrow sub-wallet created on Solana",
                "Public profile with story and progress bar",
                "Goal reached → treatment booked",
              ].map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span className="size-7 rounded-full border border-gold text-gold grid place-items-center text-xs font-bold shrink-0">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Nominee name (or 'Anonymous')" className="w-full bg-earth/10 border border-earth/15 rounded-xl px-4 py-3 text-sm text-earth placeholder:text-earth/40 focus:outline-none focus:border-gold" />
            <input type="email" placeholder="Contact email" className="w-full bg-earth/10 border border-earth/15 rounded-xl px-4 py-3 text-sm text-earth placeholder:text-earth/40 focus:outline-none focus:border-gold" />
            <textarea rows={5} placeholder="Their story (with consent)" className="w-full bg-earth/10 border border-earth/15 rounded-xl px-4 py-3 text-sm text-earth placeholder:text-earth/40 focus:outline-none focus:border-gold" />
            <input placeholder="Goal in USDC" type="number" className="w-full bg-earth/10 border border-earth/15 rounded-xl px-4 py-3 text-sm text-earth placeholder:text-earth/40 focus:outline-none focus:border-gold" />
            <button className="w-full bg-gold text-forest py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold/90 transition-colors">Submit nomination</button>
          </form>
        </div>
      </section>
    </>
  );
}

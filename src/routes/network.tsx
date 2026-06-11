import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/network")({
  head: () => ({
    meta: [
      { title: "Partners Network — ibo.garden" },
      { name: "description", content: "Register your facility, practice, or farm. Decree 0239-aligned and GAINE Certified partners earn visibility and marketplace access." },
      { property: "og:title", content: "Join the ibo.garden Partners Network" },
      { property: "og:description", content: "Facilities, Practitioners, Farms — register for marketplace access." },
    ],
  }),
  component: Network,
});

const STEPS = ["Basic info", "Category & credentials", "Ethics alignment", "Wallet (USDC payouts)", "Submit"];

function Network() {
  const [step, setStep] = useState(0);
  return (
    <>
      <PageHeader
        eyebrow="Partners Network"
        title="Plant roots in the Garden."
        lead="Facilities, practitioners, and farms apply once. Approved partners gain marketplace access, GAINE rewards, and direct community visibility."
      />

      <section className="px-6 max-w-7xl mx-auto pb-16">
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {[
            { t: "Facilities", d: "Clinical centers, retreat centers, recovery programs." },
            { t: "Practitioners", d: "Facilitators, Bwiti ngangas, integration coaches, medical staff." },
            { t: "Farms", d: "Iboga growers, ethical sourcing, reforestation orgs." },
          ].map((c) => (
            <div key={c.t} className="bg-white border border-forest/10 rounded-3xl p-7">
              <h3 className="font-serif text-2xl italic text-forest mb-2">{c.t}</h3>
              <p className="text-sm text-forest/65">{c.d}</p>
            </div>
          ))}
        </div>

        <div className="bg-bone border border-forest/10 rounded-3xl p-8 md:p-12">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">Application</span>
            <span className="text-xs text-forest/50">Step {step + 1} of {STEPS.length}</span>
          </div>
          <h2 className="font-serif text-3xl italic text-forest mb-8">{STEPS[step]}</h2>

          <div className="flex gap-1.5 mb-10">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-gold" : "bg-forest/10"}`} />
            ))}
          </div>

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setStep((s) => Math.min(STEPS.length - 1, s + 1)); }}>
            {step === 0 && (
              <>
                <Field label="Organization or full name" />
                <Field label="Email" type="email" />
                <Field label="Country / region" />
              </>
            )}
            {step === 1 && (
              <>
                <Field label="Category" placeholder="Facility · Practitioner · Farm" />
                <Field label="Credentials / lineage / licenses" textarea />
              </>
            )}
            {step === 2 && (
              <>
                <Field label="How does your practice honor Bwiti tradition?" textarea />
                <Field label="Benefit-sharing approach (Nagoya alignment)" textarea />
              </>
            )}
            {step === 3 && (
              <>
                <Field label="Solana wallet address (for USDC payouts)" placeholder="So1ana..." />
              </>
            )}
            {step === 4 && (
              <div className="text-center py-8">
                <div className="text-gold text-5xl mb-4">◆</div>
                <h3 className="font-serif text-2xl italic text-forest mb-2">Ready to submit</h3>
                <p className="text-forest/65 mb-8">Our council reviews applications within 14 days.</p>
              </div>
            )}
            <div className="flex justify-between items-center pt-4">
              <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="text-xs font-semibold uppercase tracking-widest text-forest/60 disabled:opacity-30">← Back</button>
              <button type="submit" className="bg-forest text-earth px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-moss transition-colors">
                {step === STEPS.length - 1 ? "Submit application" : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

function Field({ label, type = "text", placeholder, textarea }: { label: string; type?: string; placeholder?: string; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-forest/60 block mb-2">{label}</span>
      {textarea ? (
        <textarea rows={4} placeholder={placeholder} className="w-full bg-white border border-forest/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
      ) : (
        <input type={type} placeholder={placeholder} className="w-full bg-white border border-forest/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
      )}
    </label>
  );
}

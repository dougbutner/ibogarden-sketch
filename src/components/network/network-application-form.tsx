import { useState } from "react";

const STEPS = ["Basic info", "Category & credentials", "Gabon-first alignment", "Wallet (USDC payouts)", "Submit"];

export function NetworkApplicationForm({ className = "" }: { className?: string }) {
  const [step, setStep] = useState(0);

  return (
    <div className={`bg-bone border border-forest/10 rounded-3xl p-8 md:p-12 ${className}`.trim()}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">Application</span>
        <span className="text-xs text-forest/50">
          Step {step + 1} of {STEPS.length}
        </span>
      </div>
      <h2 className="font-serif text-3xl italic text-forest mb-8">{STEPS[step]}</h2>

      <div className="flex gap-1.5 mb-10">
        {STEPS.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-gold" : "bg-forest/10"}`} />
        ))}
      </div>

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setStep((s) => Math.min(STEPS.length - 1, s + 1));
        }}
      >
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
            <p className="text-sm text-forest/65 -mt-2 mb-2">
              ibo.garden partners with Gabon-first compliant iboga sourcing options operating in Southeast Africa.
            </p>
            <YesNoField label="Do you offer Gabon-first compliant iboga sourcing?" />
            <YesNoField label="Do you operate in Southeast Africa?" />
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
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-xs font-semibold uppercase tracking-widest text-forest/60 disabled:opacity-30"
          >
            ← Back
          </button>
          <button
            type="submit"
            className="bg-forest text-earth px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-moss transition-colors"
          >
            {step === STEPS.length - 1 ? "Submit application" : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
  textarea,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-forest/60 block mb-2">{label}</span>
      {textarea ? (
        <textarea
          rows={4}
          placeholder={placeholder}
          className="w-full bg-white border border-forest/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-white border border-forest/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
        />
      )}
    </label>
  );
}

function YesNoField({ label }: { label: string }) {
  const [value, setValue] = useState<"yes" | "no" | null>(null);
  const id = label.replace(/\W+/g, "-").toLowerCase();

  return (
    <fieldset className="block">
      <legend className="text-[11px] font-semibold uppercase tracking-widest text-forest/60 block mb-3">{label}</legend>
      <div className="flex gap-3">
        {(["yes", "no"] as const).map((option) => (
          <label
            key={option}
            htmlFor={`${id}-${option}`}
            className={`flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
              value === option
                ? "border-gold bg-gold/10 text-forest"
                : "border-forest/15 bg-white text-forest/70 hover:border-forest/30"
            }`}
          >
            <input
              id={`${id}-${option}`}
              type="checkbox"
              checked={value === option}
              onChange={() => setValue(option)}
              className="size-4 rounded border-forest/30 accent-gold focus:ring-gold"
            />
            {option === "yes" ? "Yes" : "No"}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

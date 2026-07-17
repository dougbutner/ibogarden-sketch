"use client";

import { useEffect, useMemo, useState } from "react";

import { useLocale } from "@/contexts/locale-context";
import { getPartnerTypes, submitNetworkApplicationFn } from "@/lib/api/network.functions";

const STEP_KEYS = ["stepProfile", "stepType", "stepAlignment", "stepWallet", "stepReview"] as const;

type PartnerType = { slug: string; label: string };

type FormState = {
  organizationName: string;
  email: string;
  country: string;
  partnerTypeSlug: string;
  credentials: string;
  gabonFirstSourcing: boolean | null;
  southeastAfrica: boolean | null;
  solanaWallet: string;
};

const INITIAL: FormState = {
  organizationName: "",
  email: "",
  country: "",
  partnerTypeSlug: "",
  credentials: "",
  gabonFirstSourcing: null,
  southeastAfrica: null,
  solanaWallet: "",
};

export function NetworkApplicationForm({ className = "" }: { className?: string }) {
  const { t } = useLocale();
  const steps = useMemo(() => STEP_KEYS.map((key) => t(`formsNetwork.${key}`)), [t]);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [partnerTypes, setPartnerTypes] = useState<PartnerType[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getPartnerTypes().then(setPartnerTypes).catch(() => undefined);
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function canAdvance(): boolean {
    if (step === 0) return Boolean(form.organizationName.trim() && form.email.trim() && form.country.trim());
    if (step === 1) return Boolean(form.partnerTypeSlug);
    if (step === 2) return form.gabonFirstSourcing !== null && form.southeastAfrica !== null;
    return true;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canAdvance()) return;

    if (step < steps.length - 1) {
      setStep((s) => Math.min(steps.length - 1, s + 1));
      return;
    }

    if (form.gabonFirstSourcing === null || form.southeastAfrica === null || !form.partnerTypeSlug) return;

    setSubmitting(true);
    setError(null);
    try {
      await submitNetworkApplicationFn({
        data: {
          organizationName: form.organizationName.trim(),
          email: form.email.trim(),
          country: form.country.trim(),
          partnerTypeSlug: form.partnerTypeSlug as "facility" | "practitioner" | "farm",
          credentials: form.credentials.trim() || undefined,
          gabonFirstSourcing: form.gabonFirstSourcing,
          southeastAfrica: form.southeastAfrica,
          solanaWallet: (() => {
            const wallet = form.solanaWallet.trim();
            return wallet.length >= 32 && wallet.length <= 44 ? wallet : undefined;
          })(),
        },
      });
      setSubmitted(true);
    } catch {
      setError(t("formsNetwork.submitError"));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className={`bg-bone border border-forest/10 rounded-3xl p-8 md:p-12 text-center ${className}`.trim()}>
        <div className="text-gold text-5xl mb-4">◆</div>
        <h2 className="font-serif text-3xl italic text-forest mb-3">{t("formsNetwork.receivedTitle")}</h2>
        <p className="text-forest/65 max-w-md mx-auto">
          {t("formsNetwork.receivedBody")}{" "}
          <strong className="text-forest">{form.email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-bone border border-forest/10 rounded-3xl p-8 md:p-12 ${className}`.trim()}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">
          {t("formsNetwork.applicationEyebrow")}
        </span>
        <span className="text-xs text-forest/50">
          {t("formsNetwork.stepOf", { current: step + 1, total: steps.length })}
        </span>
      </div>
      <h2 className="font-serif text-3xl italic text-forest mb-8">{steps[step]}</h2>

      <div className="flex gap-1.5 mb-10">
        {steps.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-gold" : "bg-forest/10"}`} />
        ))}
      </div>

      <form className="space-y-5" onSubmit={(e) => void handleSubmit(e)}>
        {step === 0 && (
          <>
            <Field
              label={t("formsNetwork.orgFullName")}
              value={form.organizationName}
              onChange={(v) => update("organizationName", v)}
              required
            />
            <Field
              label={t("formsNetwork.email")}
              type="email"
              value={form.email}
              onChange={(v) => update("email", v)}
              required
            />
            <Field
              label={t("formsNetwork.countryRegion")}
              value={form.country}
              onChange={(v) => update("country", v)}
              required
            />
          </>
        )}
        {step === 1 && (
          <>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-forest/60 block mb-2">
                {t("formsNetwork.category")}
              </span>
              <select
                required
                value={form.partnerTypeSlug}
                onChange={(e) => update("partnerTypeSlug", e.target.value)}
                className="w-full bg-white border border-forest/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
              >
                <option value="">{t("formsNetwork.selectPlaceholder")}</option>
                {partnerTypes.map((type) => (
                  <option key={type.slug} value={type.slug}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label={t("formsNetwork.credentials")}
              textarea
              value={form.credentials}
              onChange={(v) => update("credentials", v)}
            />
          </>
        )}
        {step === 2 && (
          <>
            <p className="text-sm text-forest/65 -mt-2 mb-2">{t("formsNetwork.alignmentIntro")}</p>
            <YesNoField
              label={t("formsNetwork.gabonFirstQ")}
              value={form.gabonFirstSourcing}
              onChange={(v) => update("gabonFirstSourcing", v)}
              yesLabel={t("common.yes")}
              noLabel={t("common.no")}
            />
            <YesNoField
              label={t("formsNetwork.southeastAfricaQ")}
              value={form.southeastAfrica}
              onChange={(v) => update("southeastAfrica", v)}
              yesLabel={t("common.yes")}
              noLabel={t("common.no")}
            />
          </>
        )}
        {step === 3 && (
          <Field
            label={t("formsNetwork.walletPayout")}
            placeholder={t("formsNetwork.walletPlaceholder")}
            value={form.solanaWallet}
            onChange={(v) => update("solanaWallet", v)}
          />
        )}
        {step === 4 && (
          <div className="text-center py-8">
            <div className="text-gold text-5xl mb-4">◆</div>
            <h3 className="font-serif text-2xl italic text-forest mb-2">{t("formsNetwork.readySubmit")}</h3>
            <p className="text-forest/65 mb-8">{t("formsNetwork.reviewTimeline")}</p>
          </div>
        )}

        {error ? <p className="text-sm text-red-700">{error}</p> : null}

        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || submitting}
            className="text-xs font-semibold uppercase tracking-widest text-forest/60 disabled:opacity-30"
          >
            ← {t("common.back")}
          </button>
          <button
            type="submit"
            disabled={!canAdvance() || submitting}
            className="bg-forest text-earth px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-moss transition-colors disabled:opacity-40"
          >
            {submitting
              ? t("common.submitting")
              : step === steps.length - 1
                ? t("formsNetwork.submitApplication")
                : t("common.continue")}
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
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-forest/60 block mb-2">{label}</span>
      {textarea ? (
        <textarea
          rows={4}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-forest/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-forest/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
        />
      )}
    </label>
  );
}

function YesNoField({
  label,
  value,
  onChange,
  yesLabel,
  noLabel,
}: {
  label: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
  yesLabel: string;
  noLabel: string;
}) {
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
              value === (option === "yes")
                ? "border-gold bg-gold/10 text-forest"
                : "border-forest/15 bg-white text-forest/70 hover:border-forest/30"
            }`}
          >
            <input
              id={`${id}-${option}`}
              type="radio"
              name={id}
              checked={value === (option === "yes")}
              onChange={() => onChange(option === "yes")}
              className="size-4 rounded-full border-forest/30 accent-gold focus:ring-gold"
            />
            {option === "yes" ? yesLabel : noLabel}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

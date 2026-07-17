import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { PageHeader } from "@/components/page-header";
import { useLocale } from "@/contexts/locale-context";
import gabonFarm from "@/assets/gabon-farm.jpg";

export const Route = createFileRoute("/source")({
  head: () => ({
    meta: [
      { title: "Direct Sourcing Consultation | ibo.garden" },
      { name: "description", content: "Direct sourcing consultation with Benny Friedmann, $250 USD. Ethical, Gabon-rooted Iboga procurement guidance." },
      { property: "og:title", content: "Source Iboga: Consultation with Benny Friedmann" },
      { property: "og:description", content: "$250 consultation for ethical Gabonese sourcing." },
    ],
  }),
  component: Source,
});

const BOOKING_WHATSAPP = "24160197640";
const CONSULTATION_AREA_KEYS = ["area1", "area2", "area3", "area4", "area5", "area6", "area7", "area8", "area9"] as const;
const BULK_PRODUCT_KEYS = ["product1", "product2", "product3", "product4", "product5", "product6"] as const;
const FEATURE_KEYS = [
  { title: "feature1Title", desc: "feature1Desc" },
  { title: "feature2Title", desc: "feature2Desc" },
  { title: "feature3Title", desc: "feature3Desc" },
] as const;

function buildWhatsAppUrl(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function Source() {
  const { t } = useLocale();
  const [consultSubmitted, setConsultSubmitted] = useState(false);
  const [bulkSubmitted, setBulkSubmitted] = useState(false);

  const consultationAreas = CONSULTATION_AREA_KEYS.map((key) => t(`source.${key}`));
  const bulkProducts = BULK_PRODUCT_KEYS.map((key) => t(`source.${key}`));

  function handleConsult(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get("name")?.toString().trim() ?? "";
    const email = data.get("email")?.toString().trim() ?? "";
    const org = data.get("org")?.toString().trim() ?? "";
    const interest = data.get("interest")?.toString().trim() ?? "";
    const goals = data.get("goals")?.toString().trim() ?? "";

    const lines = [t("source.waConsultIntro"), "", `${t("source.waName")} ${name}`, `${t("source.waEmail")} ${email}`];
    if (org) lines.push(`${t("source.waOrg")} ${org}`);
    lines.push(`${t("source.waInterest")} ${interest}`);
    if (goals) lines.push(`${t("source.waGoals")} ${goals}`);

    window.open(buildWhatsAppUrl(BOOKING_WHATSAPP, lines.join("\n")), "_blank", "noopener,noreferrer");
    setConsultSubmitted(true);
  }

  function handleBulk(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get("bulk-name")?.toString().trim() ?? "";
    const email = data.get("bulk-email")?.toString().trim() ?? "";
    const company = data.get("bulk-company")?.toString().trim() ?? "";
    const product = data.get("product")?.toString().trim() ?? "";
    const quantity = data.get("quantity")?.toString().trim() ?? "";
    const country = data.get("country")?.toString().trim() ?? "";
    const compliance = data.get("compliance")?.toString().trim() ?? "";

    const lines = [t("source.waBulkIntro"), "", `${t("source.waContact")} ${name}`, `${t("source.waEmail")} ${email}`];
    if (company) lines.push(`${t("source.waCompany")} ${company}`);
    lines.push(`${t("source.waProduct")} ${product}`);
    lines.push(`${t("source.waQuantity")} ${quantity}`);
    lines.push(`${t("source.waCountry")} ${country}`);
    if (compliance) lines.push(`${t("source.waCompliance")} ${compliance}`);

    window.open(buildWhatsAppUrl(BOOKING_WHATSAPP, lines.join("\n")), "_blank", "noopener,noreferrer");
    setBulkSubmitted(true);
  }

  return (
    <>
      <PageHeader eyebrow={t("source.eyebrow")} title={t("source.title")} lead={t("source.lead")} />

      <section className="px-6 pb-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-start">
          <div>
            <div className="bg-forest text-earth rounded-3xl overflow-hidden">
              <div className="relative h-44 md:h-52">
                <img src={gabonFarm} alt="" className="size-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-3xl md:text-4xl italic">{t("source.consultTitle")}</h2>
                    <p className="text-sm text-earth/65 mt-1">{t("source.consultDuration")}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-serif text-4xl text-gold">$250</div>
                    <p className="text-[10px] uppercase tracking-widest text-earth/45">{t("source.consultPriceUsd")}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-10">
                <p className="text-sm text-earth/75 leading-relaxed mb-8">{t("source.consultBio")}</p>
                <ul className="space-y-3.5">
                  {consultationAreas.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-earth/90">
                      <span className="text-gold mt-0.5 shrink-0" aria-hidden>
                        ◆
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-6 text-sm text-forest/55 leading-relaxed">
              {t("source.registerFacilityLead").split("{link}")[0]}
              <Link to="/network" className="text-gold underline underline-offset-2">
                {t("source.registerFacility")}
              </Link>
              {t("source.registerFacilityLead").split("{link}")[1]}
            </p>
          </div>

          <div className="bg-white border border-forest/10 rounded-3xl p-8 md:p-10 shadow-sm">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">
              {t("source.bookSession")}
            </span>
            <h3 className="font-serif text-2xl italic text-forest mt-2 mb-8">{t("source.requestConsultationTitle")}</h3>

            {consultSubmitted ? (
              <div className="text-center py-12">
                <div className="text-gold text-4xl mb-4" aria-hidden>
                  ◆
                </div>
                <h4 className="font-serif text-2xl italic text-forest mb-2">{t("source.requestReceived")}</h4>
                <p className="text-sm text-forest/65 max-w-xs mx-auto">{t("source.requestReceivedBody")}</p>
              </div>
            ) : (
              <form className="space-y-7" onSubmit={handleConsult}>
                <FloatingField label={t("source.formFullName")} name="name" required />
                <FloatingField label={t("source.formEmail")} name="email" type="email" required />
                <FloatingField label={t("source.formOrg")} name="org" />
                <FloatingSelect label={t("source.formInterest")} name="interest" required>
                  <option value="" disabled>
                    {t("source.formInterestPh")}
                  </option>
                  {consultationAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </FloatingSelect>
                <FloatingTextarea label={t("source.formGoals")} name="goals" rows={3} />
                <button
                  type="submit"
                  className="group w-full bg-forest text-earth py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-moss transition-colors flex items-center justify-center gap-3"
                >
                  {t("source.bookWithBenny")}
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden>
                    →
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 bg-bone">
        <div className="max-w-7xl mx-auto pt-16">
          <div className="max-w-2xl mb-12">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">
              {t("source.bulkEyebrow")}
            </span>
            <h2 className="font-serif text-4xl italic text-forest mt-3 mb-4">{t("source.bulkReadyTitle")}</h2>
            <p className="text-forest/70 leading-relaxed">{t("source.bulkReadyLead")}</p>
          </div>

          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-start">
            <div className="bg-white border border-forest/10 rounded-3xl p-8 md:p-10 shadow-sm order-2 lg:order-1">
              <h3 className="font-serif text-2xl italic text-forest mb-8">{t("source.bulkTitle")}</h3>

              {bulkSubmitted ? (
                <div className="text-center py-12">
                  <div className="text-gold text-4xl mb-4" aria-hidden>
                    ◆
                  </div>
                  <h4 className="font-serif text-2xl italic text-forest mb-2">{t("source.quoteRequestSent")}</h4>
                  <p className="text-sm text-forest/65 max-w-xs mx-auto">{t("source.quoteRequestBody")}</p>
                </div>
              ) : (
                <form className="space-y-7" onSubmit={handleBulk}>
                  <FloatingField label={t("source.bulkName")} name="bulk-name" required />
                  <FloatingField label={t("source.bulkEmail")} name="bulk-email" type="email" required />
                  <FloatingField label={t("source.bulkCompany")} name="bulk-company" />
                  <FloatingSelect label={t("source.bulkProduct")} name="product" required>
                    <option value="" disabled>
                      {t("source.bulkProductPh")}
                    </option>
                    {bulkProducts.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </FloatingSelect>
                  <div className="grid sm:grid-cols-2 gap-7">
                    <FloatingField label={t("source.bulkQuantity")} name="quantity" required />
                    <FloatingField label={t("source.bulkCountry")} name="country" required />
                  </div>
                  <FloatingTextarea label={t("source.bulkCompliance")} name="compliance" rows={3} />
                  <button
                    type="submit"
                    className="group w-full bg-gold text-forest py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gold/90 transition-colors flex items-center justify-center gap-3"
                  >
                    {t("source.submitQuote")}
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden>
                      →
                    </span>
                  </button>
                </form>
              )}
            </div>

            <div className="order-1 lg:order-2 space-y-5">
              {FEATURE_KEYS.map((card) => (
                <div key={card.title} className="bg-white border border-forest/10 rounded-2xl p-6">
                  <h4 className="font-semibold text-forest mb-2">{t(`source.${card.title}`)}</h4>
                  <p className="text-sm text-forest/65 leading-relaxed">{t(`source.${card.desc}`)}</p>
                </div>
              ))}

              <Link
                to="/marketplace"
                className="flex items-center justify-between bg-forest text-earth rounded-2xl p-6 hover:bg-moss transition-colors group"
              >
                <div>
                  <div className="font-serif text-xl italic mb-1">{t("source.browseMarketplace")}</div>
                  <p className="text-sm text-earth/60">{t("source.browseMarketplaceDesc")}</p>
                </div>
                <span className="text-gold text-xl transition-transform group-hover:translate-x-1" aria-hidden>
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FloatingField({
  label,
  name,
  type = "text",
  required,
  placeholder = " ",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="relative border-b border-forest/15 focus-within:border-gold transition-colors">
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="peer w-full bg-transparent pt-6 pb-2.5 text-sm text-forest placeholder-transparent focus:outline-none"
      />
      <label
        htmlFor={name}
        className="absolute left-0 top-5 text-sm text-forest/45 pointer-events-none transition-all duration-200
          peer-focus:top-0 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-gold
          peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.18em] peer-[:not(:placeholder-shown)]:text-forest/55"
      >
        {label}
      </label>
    </div>
  );
}

function FloatingTextarea({
  label,
  name,
  rows = 3,
  required,
  placeholder = " ",
}: {
  label: string;
  name: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="relative border-b border-forest/15 focus-within:border-gold transition-colors">
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className="peer w-full bg-transparent pt-6 pb-2.5 text-sm text-forest placeholder-transparent focus:outline-none resize-none"
      />
      <label
        htmlFor={name}
        className="absolute left-0 top-5 text-sm text-forest/45 pointer-events-none transition-all duration-200
          peer-focus:top-0 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-gold
          peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.18em] peer-[:not(:placeholder-shown)]:text-forest/55"
      >
        {label}
      </label>
    </div>
  );
}

function FloatingSelect({
  label,
  name,
  required,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  children: ReactNode;
}) {
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative border-b border-forest/15 focus-within:border-gold transition-colors">
      <select
        id={name}
        name={name}
        required={required}
        onChange={(e) => setHasValue(e.target.value !== "")}
        className={`w-full bg-transparent pt-6 pb-2.5 text-sm text-forest focus:outline-none appearance-none cursor-pointer ${hasValue ? "" : "text-transparent"}`}
      >
        {children}
      </select>
      <label
        htmlFor={name}
        className={`absolute left-0 pointer-events-none transition-all duration-200 ${
          hasValue
            ? "top-0 text-[10px] uppercase tracking-[0.18em] text-forest/55"
            : "top-5 text-sm text-forest/45"
        }`}
      >
        {label}
      </label>
      <span className="absolute right-0 top-6 text-forest/30 text-xs pointer-events-none" aria-hidden>
        ▾
      </span>
    </div>
  );
}

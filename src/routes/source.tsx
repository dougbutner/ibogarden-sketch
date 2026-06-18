import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { PageHeader } from "@/components/page-header";
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

const CONSULTATION_AREAS = [
  "Iboga Farming & Cultivation Consulting",
  "Iboga Harvesting & Processing Best Practices",
  "Gabon Agricultural Development",
  "Sustainable Iboga Supply Chains",
  "Iboga Nursery & Farm Planning",
  "Conservation and Cultivation Strategies",
  "Community-Based Iboga Projects",
  "Sourcing and Production Advisory",
  "Gabon Market & Regulatory Guidance",
];

const BULK_PRODUCTS = [
  "Root bark (raw)",
  "Root bark (processed)",
  "Extract / TA",
  "Seedlings & nursery stock",
  "Farm partnership",
  "Other: describe below",
];

const BOOKING_WHATSAPP = "24160197640";

function buildWhatsAppUrl(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function Source() {
  const [consultSubmitted, setConsultSubmitted] = useState(false);
  const [bulkSubmitted, setBulkSubmitted] = useState(false);

  function handleConsult(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get("name")?.toString().trim() ?? "";
    const email = data.get("email")?.toString().trim() ?? "";
    const org = data.get("org")?.toString().trim() ?? "";
    const interest = data.get("interest")?.toString().trim() ?? "";
    const goals = data.get("goals")?.toString().trim() ?? "";

    const lines = [
      "Hi, I'd like to book a consultation with Benny Friedmann ($250 USD).",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
    ];
    if (org) lines.push(`Organization: ${org}`);
    lines.push(`Primary interest: ${interest}`);
    if (goals) lines.push(`Goals: ${goals}`);

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

    const lines = [
      "Hi, I'd like to request a bulk quote.",
      "",
      `Contact name: ${name}`,
      `Email: ${email}`,
    ];
    if (company) lines.push(`Company / project: ${company}`);
    lines.push(`Product type: ${product}`);
    lines.push(`Estimated quantity: ${quantity}`);
    lines.push(`Destination country: ${country}`);
    if (compliance) lines.push(`Compliance or certification needs: ${compliance}`);

    window.open(buildWhatsAppUrl(BOOKING_WHATSAPP, lines.join("\n")), "_blank", "noopener,noreferrer");
    setBulkSubmitted(true);
  }

  return (
    <>
      <PageHeader
        eyebrow="Source Iboga"
        title="Source Iboga, Invest, Inspect quality, Comply with Gabon's latest laws"
        lead="Direct sourcing, compliance, testing, and investing in farms is not straightforward or easy. You're going to find help, or you're going to find frustration. You could take years to build relationships as Benny has, or get his one-on-one guidance at an incredible value."
      />

      <section className="px-6 pb-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-start">
          {/* Consultation details */}
          <div>
            <div className="bg-forest text-earth rounded-3xl overflow-hidden">
              <div className="relative h-44 md:h-52">
                <img src={gabonFarm} alt="" className="size-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-3xl md:text-4xl italic">Consultation</h2>
                    <p className="text-sm text-earth/65 mt-1">60 minutes · video call · written summary</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-serif text-4xl text-gold">$250</div>
                    <p className="text-[10px] uppercase tracking-widest text-earth/45">USD</p>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-10">
                <p className="text-sm text-earth/75 leading-relaxed mb-8">
                  Benny was in finance in his former life; now he&apos;s frequently on the ground in Gabon, with
                  relationships with dozens of Gabonese growers, Bwiti shaman including Moughenda, Cameroon
                  connections, and large-scale corporate sourcing options in accordance with Gabon Decree 0239: no
                  intermediaries, fastest turnaround.
                </p>
                <ul className="space-y-3.5">
                  {CONSULTATION_AREAS.map((item) => (
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
              Or{" "}
              <Link to="/network" className="text-gold underline underline-offset-2">
                register your facility
              </Link>{" "}
              for ongoing sourcing partnerships.
            </p>
          </div>

          {/* Booking form: floating-label pattern (CodePen / lbebber style) */}
          <div className="bg-white border border-forest/10 rounded-3xl p-8 md:p-10 shadow-sm">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">
              Book a session
            </span>
            <h3 className="font-serif text-2xl italic text-forest mt-2 mb-8">Request consultation</h3>

            {consultSubmitted ? (
              <div className="text-center py-12">
                <div className="text-gold text-4xl mb-4" aria-hidden>
                  ◆
                </div>
                <h4 className="font-serif text-2xl italic text-forest mb-2">Request received</h4>
                <p className="text-sm text-forest/65 max-w-xs mx-auto">
                  Benny will confirm your session within 2 business days.
                </p>
              </div>
            ) : (
              <form className="space-y-7" onSubmit={handleConsult}>
                <FloatingField label="Full name" name="name" required />
                <FloatingField label="Email" name="email" type="email" required />
                <FloatingField label="Organization (optional)" name="org" />
                <FloatingSelect label="Primary interest" name="interest" required>
                  <option value="" disabled>
                    Select a focus area
                  </option>
                  {CONSULTATION_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </FloatingSelect>
                <FloatingTextarea label="What are you hoping to accomplish?" name="goals" rows={3} />
                <button
                  type="submit"
                  className="group w-full bg-forest text-earth py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-moss transition-colors flex items-center justify-center gap-3"
                >
                  Book with Benny Friedmann
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden>
                    →
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Bulk order */}
      <section className="px-6 pb-24 bg-bone">
        <div className="max-w-7xl mx-auto pt-16">
          <div className="max-w-2xl mb-12">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">
              Bulk orders
            </span>
            <h2 className="font-serif text-4xl italic text-forest mt-3 mb-4">Ready to buy?</h2>
            <p className="text-forest/70 leading-relaxed">
              Request a quote for bulk iboga root bark, extracts, and verified products: or browse live listings on
              the marketplace.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-start">
            <div className="bg-white border border-forest/10 rounded-3xl p-8 md:p-10 shadow-sm order-2 lg:order-1">
              <h3 className="font-serif text-2xl italic text-forest mb-8">Request a bulk quote</h3>

              {bulkSubmitted ? (
                <div className="text-center py-12">
                  <div className="text-gold text-4xl mb-4" aria-hidden>
                    ◆
                  </div>
                  <h4 className="font-serif text-2xl italic text-forest mb-2">Quote request sent</h4>
                  <p className="text-sm text-forest/65 max-w-xs mx-auto">
                    We&apos;ll match you with verified suppliers and respond within 5 business days.
                  </p>
                </div>
              ) : (
                <form className="space-y-7" onSubmit={handleBulk}>
                  <FloatingField label="Contact name" name="bulk-name" required />
                  <FloatingField label="Email" name="bulk-email" type="email" required />
                  <FloatingField label="Company / project" name="bulk-company" />
                  <FloatingSelect label="Product type" name="product" required>
                    <option value="" disabled>
                      Select product
                    </option>
                    {BULK_PRODUCTS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </FloatingSelect>
                  <div className="grid sm:grid-cols-2 gap-7">
                    <FloatingField label="Estimated quantity" name="quantity" required />
                    <FloatingField label="Destination country" name="country" required />
                  </div>
                  <FloatingTextarea label="Compliance or certification needs" name="compliance" rows={3} />
                  <button
                    type="submit"
                    className="group w-full bg-gold text-forest py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gold/90 transition-colors flex items-center justify-center gap-3"
                  >
                    Submit quote request
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden>
                      →
                    </span>
                  </button>
                </form>
              )}
            </div>

            <div className="order-1 lg:order-2 space-y-5">
              {[
                {
                  t: "Traceable supply",
                  d: "Every bulk listing ties back to certified Gabonese farms with export documentation.",
                },
                {
                  t: "Compliance support",
                  d: "Decree 0239 authorization, benefit-sharing in accordance with Gabonese law, and customs guidance included in sourcing.",
                },
                {
                  t: "Marketplace access",
                  d: "Browse live inventory from network-verified farms and cooperatives.",
                },
              ].map((card) => (
                <div key={card.t} className="bg-white border border-forest/10 rounded-2xl p-6">
                  <h4 className="font-semibold text-forest mb-2">{card.t}</h4>
                  <p className="text-sm text-forest/65 leading-relaxed">{card.d}</p>
                </div>
              ))}

              <Link
                to="/marketplace"
                className="flex items-center justify-between bg-forest text-earth rounded-2xl p-6 hover:bg-moss transition-colors group"
              >
                <div>
                  <div className="font-serif text-xl italic mb-1">Browse marketplace</div>
                  <p className="text-sm text-earth/60">Buy bulk iboga · verified listings</p>
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

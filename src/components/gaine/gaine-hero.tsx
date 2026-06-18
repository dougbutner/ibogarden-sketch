import { GAINE_ORCA_URL, GAINE_TOKEN_IMAGE } from "@/data/gaine";
import { GaineMoneyModel } from "./gaine-money-model";

export function GaineHero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 py-24 text-center">
      <span
        className="inline-block mb-8 px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.22em]"
        style={{ background: "color-mix(in srgb, var(--gaine-accent) 18%, transparent)", color: "var(--gaine-accent)" }}
      >
        Audited · Solana SPL-2022
      </span>

      <div className="relative mb-6">
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-40 scale-125"
          style={{ background: "var(--gaine-accent)" }}
          aria-hidden
        />
        <img
          src={GAINE_TOKEN_IMAGE}
          alt="GAINE token"
          width={220}
          height={220}
          className="relative size-[220px] rounded-full object-cover ring-1 ring-[var(--gaine-border)]"
        />
      </div>

      <p
        className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: "var(--gaine-accent)" }}
      >
        GAINE token
      </p>

      <h1 className="gaine-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] max-w-4xl text-balance">
        Impact that stays.
        <br />
        Investment that grows.
      </h1>

      <GaineMoneyModel />

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <a
          href={GAINE_ORCA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-widest transition-opacity hover:opacity-90"
          style={{ background: "var(--gaine-primary)", color: "var(--gaine-bg)" }}
        >
          <img
            src={GAINE_TOKEN_IMAGE}
            alt=""
            className="size-5 rounded-full object-cover"
            width={20}
            height={20}
          />
          Buy GAINE
        </a>
        <a
          href="#what-is-gaine"
          className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-widest border transition-colors hover:bg-white/5"
          style={{ borderColor: "var(--gaine-border)", color: "var(--gaine-text)" }}
        >
          What is GAINE?
        </a>
      </div>
    </section>
  );
}

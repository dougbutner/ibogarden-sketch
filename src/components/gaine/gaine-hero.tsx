import { GAINE_ORCA_URL, GAINE_TOKEN_IMAGE, GAINE_WHITEPAPER_URL } from "@/data/gaine";

export function GaineHero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 py-24 text-center">
      <span
        className="inline-block mb-8 px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.22em]"
        style={{ background: "color-mix(in srgb, var(--gaine-accent) 18%, transparent)", color: "var(--gaine-accent)" }}
      >
        Solana · Token-2022
      </span>

      <div className="relative mb-10">
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

      <h1 className="gaine-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] max-w-4xl text-balance">
        Impact you keep.
        <br />
        Principal that stays.
      </h1>

      <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed" style={{ color: "var(--gaine-muted)" }}>
        GAINE is a reciprocating utility token. Hold it, and 2% of every transfer routes to iboga sourcing and Gabon
        communities you choose.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <a
          href={GAINE_ORCA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-widest transition-opacity hover:opacity-90"
          style={{ background: "var(--gaine-primary)", color: "var(--gaine-bg)" }}
        >
          Buy on Orca
        </a>
        <a
          href={GAINE_WHITEPAPER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-widest border transition-colors hover:bg-white/5"
          style={{ borderColor: "var(--gaine-border)", color: "var(--gaine-text)" }}
        >
          Read the Whitepaper
        </a>
      </div>
    </section>
  );
}

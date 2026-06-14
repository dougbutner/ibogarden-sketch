import { GAINE_DISCLAIMER } from "@/data/gaine";

export function GaineDisclaimer() {
  return (
    <footer
      className="px-6 py-12 border-t"
      style={{ borderColor: "var(--gaine-border)" }}
    >
      <p className="max-w-3xl mx-auto text-center text-xs leading-relaxed" style={{ color: "var(--gaine-muted)" }}>
        {GAINE_DISCLAIMER}
      </p>
    </footer>
  );
}

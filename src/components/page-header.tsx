import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, lead, children }: { eyebrow?: ReactNode; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <section className="px-6 pt-20 pb-16 max-w-7xl mx-auto">
      <div className="max-w-3xl">
        {eyebrow && (
          <span className="inline-block text-gold text-[11px] font-semibold uppercase tracking-[0.25em] mb-5">{eyebrow}</span>
        )}
        <h1 className="font-serif text-5xl md:text-6xl italic text-forest leading-[1.05] text-balance mb-6">{title}</h1>
        {lead && <div className="text-lg md:text-xl text-forest/70 leading-relaxed max-w-2xl">{lead}</div>}
        {children}
      </div>
    </section>
  );
}

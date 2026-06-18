"use client";

import { useState, type CSSProperties } from "react";
import type { GainePanel } from "@/data/gaine";
import gaineToken from "@/assets/gaine-token.png";
import ibogaRoot from "@/assets/iboga-root.jpg";
import gabonFarm from "@/assets/gabon-farm.jpg";

const PANEL_IMAGES: Record<string, string> = {
  "gaine-token": gaineToken,
  "iboga-root": ibogaRoot,
  "gabon-farm": gabonFarm,
};

function PanelTag({ label, href }: { label: string; href?: string }) {
  const className =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] border";
  const style = {
    borderColor: "color-mix(in srgb, var(--gaine-accent) 35%, transparent)",
    color: "var(--gaine-accent)",
    background: "color-mix(in srgb, var(--gaine-accent) 12%, transparent)",
  };

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} transition-opacity hover:opacity-80`}
        style={style}
      >
        {label}
      </a>
    );
  }

  return (
    <span className={className} style={style}>
      {label}
    </span>
  );
}

function PanelParagraph({ paragraph }: { paragraph: GainePanel["paragraphs"][number] }) {
  if (typeof paragraph === "string") {
    return (
      <p className="text-sm md:text-base leading-relaxed" style={{ color: "color-mix(in srgb, var(--gaine-text) 75%, transparent)" }}>
        {paragraph}
      </p>
    );
  }

  if (paragraph.type === "person") {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="gaine-display text-lg" style={{ color: "var(--gaine-text)" }}>
            {paragraph.name}
          </h4>
          {paragraph.tags.map((tag) => (
            <PanelTag key={tag.label} label={tag.label} href={tag.href} />
          ))}
        </div>
        <p className="text-sm md:text-base leading-relaxed" style={{ color: "color-mix(in srgb, var(--gaine-text) 75%, transparent)" }}>
          {paragraph.bio}
        </p>
      </div>
    );
  }

  return (
    <p className="text-sm md:text-base leading-relaxed" style={{ color: "color-mix(in srgb, var(--gaine-text) 75%, transparent)" }}>
      <a
        href={paragraph.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 transition-colors hover:opacity-80"
        style={{ color: "var(--gaine-accent)" }}
      >
        {paragraph.text}
      </a>
      {paragraph.suffix}
    </p>
  );
}

function GainePanelCard({
  panel,
  open,
  onSelect,
}: {
  panel: GainePanel;
  open: boolean;
  onSelect: () => void;
}) {
  const image = PANEL_IMAGES[panel.image] ?? gaineToken;

  return (
    <div
      className={`relative min-w-0 h-full overflow-hidden rounded-2xl ring-1 transition-[flex] duration-500 ease-[cubic-bezier(0.55,0,0.1,1)] ${
        open ? "flex-[4]" : "flex-[0.55] cursor-pointer"
      }`}
      style={{ "--tw-ring-color": "color-mix(in srgb, var(--gaine-accent) 35%, transparent)" } as CSSProperties}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-expanded={open}
        className={`absolute inset-0 z-10 ${open ? "pointer-events-none" : ""}`}
      >
        <span className="sr-only">{open ? panel.title : `Expand ${panel.title}`}</span>
      </button>

      <div className="absolute inset-0">
        <img src={image} alt="" className="size-full object-cover" />
        <div
          className="absolute inset-0 transition-colors duration-500"
          style={{
            background: open
              ? "color-mix(in srgb, var(--gaine-bg) 92%, transparent)"
              : "color-mix(in srgb, var(--gaine-bg) 78%, transparent)",
          }}
        />
      </div>

      <div
        className={`absolute inset-0 z-[1] flex flex-col justify-between p-4 transition-opacity duration-300 ${
          open ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--gaine-accent)" }}>
          GAINE
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div
            className="size-12 rounded-full grid place-items-center shadow-lg"
            style={{ background: "var(--gaine-accent)", color: "var(--gaine-bg)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <h3
          className="gaine-display text-lg md:text-xl leading-tight [writing-mode:vertical-rl] rotate-180 self-end max-h-[14rem]"
          style={{ color: "var(--gaine-text)" }}
          aria-hidden
        >
          {panel.title}
        </h3>
      </div>

      <div
        className={`absolute inset-0 z-[2] flex flex-col transition-opacity duration-300 delay-100 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="shrink-0 border-b px-5 py-4" style={{ borderColor: "var(--gaine-border)" }}>
          <div className="text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: "var(--gaine-accent)" }}>
            GAINE
          </div>
          <h3 className="gaine-display text-2xl" style={{ color: "var(--gaine-text)" }}>
            {panel.title}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-4">
          {panel.paragraphs.map((paragraph, i) => (
            <PanelParagraph key={i} paragraph={paragraph} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function GainePanels({ panels }: { panels: GainePanel[] }) {
  const [openId, setOpenId] = useState<string | null>(panels[0]?.id ?? null);

  return (
    <div className="flex gap-2 md:gap-3 h-[min(520px,calc(100dvh-10rem))] overflow-hidden">
      {panels.map((panel) => (
        <GainePanelCard
          key={panel.id}
          panel={panel}
          open={openId === panel.id}
          onSelect={() => setOpenId((current) => (current === panel.id ? current : panel.id))}
        />
      ))}
    </div>
  );
}

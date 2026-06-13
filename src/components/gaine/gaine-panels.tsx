"use client";

import { useState } from "react";
import type { GainePanel } from "@/data/gaine";
import gaineToken from "@/assets/gaine-token.png";
import ibogaRoot from "@/assets/iboga-root.jpg";
import gabonFarm from "@/assets/gabon-farm.jpg";

const PANEL_IMAGES: Record<string, string> = {
  "gaine-token": gaineToken,
  "iboga-root": ibogaRoot,
  "gabon-farm": gabonFarm,
};

function PanelParagraph({ paragraph }: { paragraph: GainePanel["paragraphs"][number] }) {
  if (typeof paragraph === "string") {
    return <p className="text-sm md:text-base text-earth/75 leading-relaxed">{paragraph}</p>;
  }

  return (
    <p className="text-sm md:text-base text-earth/75 leading-relaxed">
      <a
        href={paragraph.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gold underline underline-offset-4 decoration-gold/40 hover:text-gold/80 transition-colors"
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
      className={`relative min-w-0 h-full overflow-hidden rounded-2xl ring-1 ring-gold/20 transition-[flex] duration-500 ease-[cubic-bezier(0.55,0,0.1,1)] ${
        open ? "flex-[4]" : "flex-[0.55] cursor-pointer"
      }`}
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
          className={`absolute inset-0 transition-colors duration-500 ${
            open ? "bg-forest/92" : "bg-forest/78"
          }`}
        />
      </div>

      <div
        className={`absolute inset-0 z-[1] flex flex-col justify-between p-4 transition-opacity duration-300 ${
          open ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div className="text-[10px] uppercase tracking-[0.25em] text-gold/80">GAINE</div>
        <div className="flex flex-1 items-center justify-center">
          <div className="size-12 rounded-full bg-gold/90 text-forest grid place-items-center shadow-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <h3
          className="font-serif italic text-earth text-lg md:text-xl leading-tight [writing-mode:vertical-rl] rotate-180 self-end max-h-[14rem]"
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
        <div className="shrink-0 border-b border-earth/10 px-5 py-4">
          <div className="text-[10px] uppercase tracking-[0.25em] text-gold mb-1">GAINE</div>
          <h3 className="font-serif italic text-2xl text-earth">{panel.title}</h3>
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
    <div className="flex gap-2 md:gap-3 h-[min(480px,calc(100dvh-10rem))] overflow-hidden">
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

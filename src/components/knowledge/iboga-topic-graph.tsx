"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  GAINE_ICON,
  TOPIC_MAP,
  TOPIC_ROOT,
  TRUNK_COLORS,
  type NodeShape,
  type TopicLeaf,
  type TopicMapSelection,
  type TopicTrunk,
} from "@/data/knowledge-iboga";

const FOREST = "#0a2418";
const EARTH = "#fdfaf3";
const GOLD = "#c5a059";

type PlacedNode =
  | { kind: "root"; x: number; y: number; r: number }
  | { kind: "trunk"; trunk: TopicTrunk; x: number; y: number; r: number }
  | { kind: "leaf"; leaf: TopicLeaf; trunk: TopicTrunk; x: number; y: number; r: number };

type PlacedLink = { x1: number; y1: number; x2: number; y2: number; tier: "root" | "branch" };

function hexPoints(r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${r * Math.cos(a)},${r * Math.sin(a)}`;
  }).join(" ");
}

function diamondPoints(r: number): string {
  return `0,${-r} ${r},0 0,${r} ${-r},0`;
}

function layoutMap(width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;
  const rootR = 38;
  const trunkDist = Math.min(width, height) * 0.22;
  const leafDist = Math.min(width, height) * 0.38;

  const trunkAngles: Record<string, number> = {
    lineage: -Math.PI / 2,
    exchange: 0,
    medicine: Math.PI / 2,
    land: Math.PI,
  };

  const nodes: PlacedNode[] = [{ kind: "root", x: cx, y: cy, r: rootR }];
  const links: PlacedLink[] = [];

  for (const trunk of TOPIC_MAP) {
    const angle = trunkAngles[trunk.id] ?? 0;
    const tx = cx + Math.cos(angle) * trunkDist;
    const ty = cy + Math.sin(angle) * trunkDist;
    const trunkR = trunk.useGaineIcon ? 32 : 36;

    nodes.push({ kind: "trunk", trunk, x: tx, y: ty, r: trunkR });
    links.push({ x1: cx, y1: cy, x2: tx, y2: ty, tier: "root" });

    const count = trunk.leaves.length;
    const spread = count <= 2 ? 0.45 : count <= 3 ? 0.55 : 0.72;
    const start = angle - spread / 2;

    trunk.leaves.forEach((leaf, i) => {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const leafAngle = start + t * spread;
      const lx = cx + Math.cos(leafAngle) * leafDist;
      const ly = cy + Math.sin(leafAngle) * leafDist;
      const leafR = leaf.shape === "gaine" ? 18 : 16;

      nodes.push({ kind: "leaf", leaf, trunk, x: lx, y: ly, r: leafR });
      links.push({ x1: tx, y1: ty, x2: lx, y2: ly, tier: "branch" });
    });
  }

  return { nodes, links, cx, cy };
}

function drawNodeShape(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  d: PlacedNode,
  activeId: string | null,
) {
  const colors =
    d.kind === "trunk"
      ? TRUNK_COLORS[d.trunk.id]
      : d.kind === "leaf"
        ? TRUNK_COLORS[d.trunk.id]
        : { fill: FOREST, stroke: GOLD, leaf: FOREST };

  const nodeId = d.kind === "root" ? "root" : d.kind === "trunk" ? d.trunk.id : d.leaf.id;
  const isActive = activeId === nodeId;
  const stroke = isActive ? GOLD : colors.stroke;
  const strokeW = isActive ? 3 : 2;

  if (d.kind === "root") {
    g.append("circle")
      .attr("r", d.r)
      .attr("fill", FOREST)
      .attr("stroke", GOLD)
      .attr("stroke-width", isActive ? 3.5 : 2.5);
    return;
  }

  if (d.kind === "trunk" && d.trunk.useGaineIcon) {
    g.append("circle")
      .attr("r", d.r + 4)
      .attr("fill", EARTH)
      .attr("stroke", stroke)
      .attr("stroke-width", strokeW);
    g.append("image")
      .attr("href", GAINE_ICON)
      .attr("x", -d.r)
      .attr("y", -d.r)
      .attr("width", d.r * 2)
      .attr("height", d.r * 2);
    return;
  }

  const shape: NodeShape =
    d.kind === "trunk"
      ? d.trunk.id === "land"
        ? "hexagon"
        : d.trunk.id === "medicine"
          ? "diamond"
          : "circle"
      : d.leaf.shape;

  const fill = d.kind === "trunk" ? colors.fill : colors.leaf;

  if (shape === "gaine") {
    g.append("circle")
      .attr("r", d.r + 3)
      .attr("fill", EARTH)
      .attr("stroke", stroke)
      .attr("stroke-width", strokeW);
    g.append("image")
      .attr("href", GAINE_ICON)
      .attr("x", -d.r)
      .attr("y", -d.r)
      .attr("width", d.r * 2)
      .attr("height", d.r * 2);
    return;
  }

  if (shape === "hexagon") {
    g.append("polygon")
      .attr("points", hexPoints(d.r))
      .attr("fill", fill)
      .attr("stroke", stroke)
      .attr("stroke-width", strokeW);
    return;
  }

  if (shape === "diamond") {
    g.append("polygon")
      .attr("points", diamondPoints(d.r))
      .attr("fill", fill)
      .attr("stroke", stroke)
      .attr("stroke-width", strokeW);
    return;
  }

  if (shape === "rect") {
    g.append("rect")
      .attr("x", -d.r)
      .attr("y", -d.r * 0.75)
      .attr("width", d.r * 2)
      .attr("height", d.r * 1.5)
      .attr("rx", 4)
      .attr("fill", fill)
      .attr("stroke", stroke)
      .attr("stroke-width", strokeW);
    return;
  }

  g.append("circle")
    .attr("r", d.r)
    .attr("fill", fill)
    .attr("stroke", stroke)
    .attr("stroke-width", strokeW);
}

function labelFor(d: PlacedNode): { primary: string; secondary?: string } {
  if (d.kind === "root") return { primary: TOPIC_ROOT.label, secondary: TOPIC_ROOT.tagline };
  if (d.kind === "trunk") return { primary: d.trunk.label, secondary: d.trunk.tagline };
  return { primary: d.leaf.label };
}

function SelectionPanel({ selection }: { selection: TopicMapSelection }) {
  if (selection.kind === "root") {
    return (
      <div className="rounded-xl border border-forest/15 bg-white px-5 py-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-gold-deep font-semibold mb-1">Center</p>
        <h4 className="font-serif text-xl italic text-forest">{TOPIC_ROOT.label}</h4>
        <p className="text-sm text-forest/70 mt-2 leading-relaxed">{TOPIC_ROOT.description}</p>
      </div>
    );
  }

  if (selection.kind === "trunk") {
    return (
      <div className="rounded-xl border border-forest/15 bg-white px-5 py-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-gold-deep font-semibold mb-1">Trunk</p>
        <h4 className="font-serif text-xl italic text-forest">{selection.trunk.label}</h4>
        <p className="text-xs text-forest/55 mt-1">{selection.trunk.tagline}</p>
        <p className="text-sm text-forest/75 mt-3 leading-relaxed">{selection.trunk.description}</p>
        <p className="text-xs text-forest/50 mt-3">
          {selection.trunk.leaves.length} topics · click a leaf to open its article
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-forest/15 bg-white px-5 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold-deep font-semibold">
            {selection.trunk.label}
          </p>
          <h4 className="font-serif text-xl italic text-forest">{selection.leaf.label}</h4>
        </div>
        <a
          href={selection.leaf.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] uppercase tracking-widest text-gold-deep font-semibold hover:text-gold"
        >
          Open article →
        </a>
      </div>
      <p className="text-sm text-forest/75 leading-relaxed">{selection.leaf.description}</p>
    </div>
  );
}

const LEGEND = [
  { shape: "circle" as const, label: "Lineage" },
  { shape: "hexagon" as const, label: "Land" },
  { shape: "diamond" as const, label: "Medicine" },
  { shape: "gaine" as const, label: "Exchange / GAINE" },
  { shape: "rect" as const, label: "Law & policy" },
];

function LegendIcon({ shape }: { shape: NodeShape | "circle" }) {
  const size = 14;
  if (shape === "gaine") {
    return (
      <span className="inline-flex size-5 items-center justify-center rounded-full bg-earth border border-forest/20">
        <img src={GAINE_ICON} alt="" className="size-3.5" />
      </span>
    );
  }
  if (shape === "hexagon") {
    return (
      <svg width={size} height={size} viewBox={`-${size} -${size} ${size * 2} ${size * 2}`} aria-hidden>
        <polygon points={hexPoints(size * 0.85)} fill="#2d4a22" stroke={FOREST} strokeWidth={1.5} />
      </svg>
    );
  }
  if (shape === "diamond") {
    return (
      <svg width={size} height={size} viewBox={`-${size} -${size} ${size * 2} ${size * 2}`} aria-hidden>
        <polygon points={diamondPoints(size * 0.85)} fill={FOREST} stroke="#2d4a22" strokeWidth={1.5} />
      </svg>
    );
  }
  if (shape === "rect") {
    return (
      <span
        className="inline-block size-3.5 rounded-sm border border-forest/30"
        style={{ background: "#b66a3e" }}
        aria-hidden
      />
    );
  }
  return (
    <span
      className="inline-block size-3.5 rounded-full border border-forest/30"
      style={{ background: "#8a6e35" }}
      aria-hidden
    />
  );
}

export function IbogaTopicGraph() {
  const [selection, setSelection] = useState<TopicMapSelection>({ kind: "root" });
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const setSelectionRef = useRef(setSelection);
  setSelectionRef.current = setSelection;

  useEffect(() => {
    const container = containerRef.current;
    const svgEl = svgRef.current;
    if (!container || !svgEl) return;

    let activeId: string | null = "root";

    function render() {
      if (!container || !svgEl) return;

      const width = container.clientWidth;
      const height = Math.max(520, Math.min(640, width * 0.72));
      const { nodes, links } = layoutMap(width, height);

      const svg = d3.select(svgEl);
      svg.selectAll("*").remove();
      svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", width).attr("height", height);

      const g = d3.select(svgEl).append("g");

      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.75, 2.2])
        .on("zoom", (event) => g.attr("transform", event.transform));

      svg.call(zoom);

      g.selectAll("path.link")
        .data(links)
        .join("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", (l) => (l.tier === "root" ? "rgba(10,36,24,0.22)" : "rgba(10,36,24,0.12)"))
        .attr("stroke-width", (l) => (l.tier === "root" ? 2.5 : 1.5))
        .attr("d", (l) => {
          const mx = (l.x1 + l.x2) / 2;
          const my = (l.y1 + l.y2) / 2;
          return `M${l.x1},${l.y1} Q${mx},${my} ${l.x2},${l.y2}`;
        });

      const nodeG = g
        .selectAll<SVGGElement, PlacedNode>("g.node")
        .data(nodes)
        .join("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.x},${d.y})`)
        .attr("cursor", (d) => (d.kind === "trunk" ? "default" : "pointer"))
        .on("mouseenter", function (_, d) {
          activeId = d.kind === "root" ? "root" : d.kind === "trunk" ? d.trunk.id : d.leaf.id;
          d3.select(this).raise();
          redrawNodes();
          if (d.kind === "root") setSelectionRef.current({ kind: "root" });
          else if (d.kind === "trunk") setSelectionRef.current({ kind: "trunk", trunk: d.trunk });
          else setSelectionRef.current({ kind: "leaf", leaf: d.leaf, trunk: d.trunk });
        })
        .on("click", (_, d) => {
          if (d.kind === "leaf") window.open(d.leaf.href, "_blank", "noopener,noreferrer");
        });

      function redrawNodes() {
        nodeG.each(function (d) {
          const sel = d3.select(this);
          sel.selectAll("g.shape, circle, polygon, rect, image").remove();
          const shapeLayer = sel.insert("g", ":first-child").attr("class", "shape");
          drawNodeShape(shapeLayer, d, activeId);
        });
      }

      redrawNodes();

      nodeG.each(function (d) {
        const { primary, secondary } = labelFor(d);
        const labelOffset = d.r + (d.kind === "trunk" ? 18 : 14);
        const textG = d3.select(this).append("g").attr("transform", `translate(0,${labelOffset})`);

        textG
          .append("text")
          .attr("text-anchor", "middle")
          .attr("fill", FOREST)
          .attr("font-size", d.kind === "trunk" ? 13 : 11)
          .attr("font-weight", 700)
          .attr("font-family", d.kind === "trunk" ? "Crimson Pro, Georgia, serif" : "Inter, sans-serif")
          .attr("font-style", d.kind === "trunk" ? "italic" : "normal")
          .style("paint-order", "stroke")
          .style("stroke", EARTH)
          .style("stroke-width", "4px")
          .style("stroke-linejoin", "round")
          .text(primary);

        if (secondary) {
          textG
            .append("text")
            .attr("y", 14)
            .attr("text-anchor", "middle")
            .attr("fill", "#3d5244")
            .attr("font-size", 9)
            .attr("font-weight", 500)
            .style("paint-order", "stroke")
            .style("stroke", EARTH)
            .style("stroke-width", "3px")
            .text(secondary);
        }
      });
    }

    render();

    const ro = new ResizeObserver(render);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  return (
    <section className="w-full rounded-3xl border border-forest/10 bg-white overflow-hidden">
      <div className="px-6 py-5 md:px-8 md:py-6 border-b border-forest/10 bg-bone/40">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">
          Before the articles
        </span>
        <h3 className="font-serif text-2xl md:text-3xl italic text-forest mt-2">Explore Iboga by topic</h3>
        <p className="text-sm text-forest/70 mt-2 max-w-3xl leading-relaxed">
          Four trunks branch from the root: <strong className="font-semibold text-forest">Lineage</strong>,{" "}
          <strong className="font-semibold text-forest">Land</strong>,{" "}
          <strong className="font-semibold text-forest">Medicine</strong>, and{" "}
          <strong className="font-semibold text-forest">Exchange</strong>. Shape tells you which trunk; the GAINE coin
          marks trade and tokenized reciprocity.
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
          {LEGEND.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-xs text-forest/80">
              <LegendIcon shape={item.shape} />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div ref={containerRef} className="bg-[#f4eedd] px-2 pt-4 pb-2">
        <svg ref={svgRef} className="mx-auto w-full block" role="img" aria-label="Iboga topic map" />
      </div>

      <div className="px-4 md:px-6 pb-5 pt-2 border-t border-forest/10 bg-earth/50">
        <SelectionPanel selection={selection} />
        <p className="text-center text-[10px] text-forest/50 uppercase tracking-widest mt-4">
          Hover a node · scroll to zoom · click a leaf to open its article
        </p>
      </div>
    </section>
  );
}

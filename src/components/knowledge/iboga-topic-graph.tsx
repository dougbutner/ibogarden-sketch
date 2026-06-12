"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { GROUP_COLORS, TOPIC_EDGES, TOPIC_NODES, type TopicNode } from "@/data/knowledge-iboga";

type SimNode = d3.SimulationNodeDatum & TopicNode;
type SimLink = d3.SimulationLinkDatum<SimNode>;

export function IbogaTopicGraph() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<TopicNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const setActiveRef = useRef(setActive);
  setActiveRef.current = setActive;

  useEffect(() => {
    if (!open || !containerRef.current || !svgRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = Math.min(520, Math.max(360, width * 0.55));

    const nodes: SimNode[] = TOPIC_NODES.map((n) => ({ ...n }));
    const nodeById = new Map(nodes.map((n) => [n.id, n]));
    const links: SimLink[] = TOPIC_EDGES.map(([source, target]) => ({
      source: nodeById.get(source)!,
      target: nodeById.get(target)!,
    }));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", width).attr("height", height);

    const g = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.6, 2.5])
      .on("zoom", (event) => g.attr("transform", event.transform));

    svg.call(zoom);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance(90)
          .strength(0.45),
      )
      .force("charge", d3.forceManyBody().strength(-280))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(42));

    const link = g
      .append("g")
      .attr("stroke", "rgba(10, 36, 24, 0.15)")
      .attr("stroke-width", 1.5)
      .selectAll("line")
      .data(links)
      .join("line");

    const node = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(
        d3
          .drag<SVGGElement, SimNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }),
      );

    node
      .append("circle")
      .attr("r", 28)
      .attr("fill", (d) => GROUP_COLORS[d.group])
      .attr("stroke", "#fdfaf3")
      .attr("stroke-width", 2)
      .attr("opacity", 0.92);

    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "#fdfaf3")
      .attr("font-size", "9px")
      .attr("font-weight", 600)
      .attr("pointer-events", "none")
      .each(function (d) {
        const el = d3.select(this);
        const words = d.label.split(/\s+/);
        if (words.length <= 2) {
          el.text(d.label);
          return;
        }
        el.append("tspan").attr("x", 0).attr("dy", "-0.4em").text(words.slice(0, Math.ceil(words.length / 2)).join(" "));
        el.append("tspan").attr("x", 0).attr("dy", "1.1em").text(words.slice(Math.ceil(words.length / 2)).join(" "));
      });

    node
      .on("mouseenter", (_event, d) => setActiveRef.current(d))
      .on("click", (_event, d) => {
        setActiveRef.current(d);
        window.open(d.href, "_blank", "noopener,noreferrer");
      });

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as SimNode).x ?? 0)
        .attr("y1", (d) => (d.source as SimNode).y ?? 0)
        .attr("x2", (d) => (d.target as SimNode).x ?? 0)
        .attr("y2", (d) => (d.target as SimNode).y ?? 0);

      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [open]);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <div className="rounded-3xl border border-forest/10 bg-white overflow-hidden">
        <CollapsibleTrigger className="w-full px-6 py-5 md:px-8 md:py-6 flex justify-between items-center gap-4 text-left hover:bg-bone/50 transition-colors">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">
              Before the articles
            </span>
            <h3 className="font-serif text-2xl md:text-3xl italic text-forest mt-2">
              Explore Iboga by topic
            </h3>
            <p className="text-sm text-forest/60 mt-2 max-w-2xl">
              A force-directed map of history, geography, markets, regulations, ecology, pharmacology, tradition, and
              research. Each node opens its source article.
            </p>
          </div>
          <span className={`text-gold text-2xl shrink-0 transition-transform ${open ? "rotate-90" : ""}`} aria-hidden>
            →
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div ref={containerRef} className="border-t border-forest/10 bg-bone/30 px-2 pb-4">
            <svg ref={svgRef} className="mx-auto w-full" role="img" aria-label="Iboga topic force graph" />
            {active && (
              <div className="mx-4 mb-3 rounded-xl border border-forest/10 bg-white px-4 py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                  <span className="font-serif italic text-forest">{active.label}</span>
                  <a
                    href={active.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] uppercase tracking-widest text-gold hover:text-gold-deep"
                  >
                    Open article →
                  </a>
                </div>
                <p className="text-sm text-forest/65 leading-relaxed">{active.description}</p>
              </div>
            )}
            <p className="text-center text-[10px] text-forest/45 uppercase tracking-widest px-4 pb-2">
              Drag nodes · scroll to zoom · hover for description · click to open
            </p>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

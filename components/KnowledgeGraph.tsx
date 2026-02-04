
import React, { useEffect, useRef } from 'react';
import { Note } from '../types';
import * as d3 from 'd3';

interface KnowledgeGraphProps {
  notes: Note[];
  onSelectNote: (id: string) => void;
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ notes, onSelectNote }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || notes.length === 0) return;

    const width = svgRef.current.clientWidth || 800;
    const height = svgRef.current.clientHeight || 600;

    const linkCounts = new Map<string, number>();
    const nodeData = notes.map(n => {
      linkCounts.set(n.id, 0);
      return { id: n.id, title: n.title, group: n.folder };
    });
    
    const links: any[] = [];
    notes.forEach(note => {
      const regex = /\[\[(.*?)\]\]/g;
      let match;
      while ((match = regex.exec(note.content)) !== null) {
        const target = notes.find(n => n.title === match![1]);
        if (target) {
          links.push({ source: note.id, target: target.id });
          linkCounts.set(note.id, (linkCounts.get(note.id) || 0) + 1);
          linkCounts.set(target.id, (linkCounts.get(target.id) || 0) + 1);
        }
      }
    });

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoom as any);

    const simulation = d3.forceSimulation(nodeData as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    const link = g.append("g")
      .attr("stroke", "#f1f1f0")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.3);

    const node = g.append("g")
      .selectAll("g")
      .data(nodeData)
      .join("g")
      .on("click", (e, d: any) => onSelectNote(d.id))
      .style("cursor", "pointer")
      .call(d3.drag<SVGGElement, any>()
        .on("start", (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on("end", (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }) as any);

    node.append("circle")
      .attr("r", (d: any) => 6 + (linkCounts.get(d.id) || 0) * 2)
      .attr("fill", (d: any) => {
        if (d.group === 'Engineering') return '#0f766e';
        if (d.group === 'Product') return '#2383e2';
        return '#f7f7f5';
      })
      .attr("stroke", (d: any) => d.group === 'General' ? '#e9e9e7' : 'white')
      .attr("stroke-width", 2)
      .attr("class", "transition-all duration-300 hover:scale-125");

    node.append("text")
      .attr("dy", (d: any) => 18 + (linkCounts.get(d.id) || 0) * 2)
      .attr("text-anchor", "middle")
      .text((d: any) => d.title)
      .attr("fill", "#37352f")
      .attr("font-size", "10px")
      .attr("font-weight", "800")
      .attr("class", "uppercase tracking-tighter pointer-events-none")
      .attr("filter", "drop-shadow(0 2px 2px rgba(255,255,255,1))");

    simulation.on("tick", () => {
      link.attr("x1", (d: any) => d.source.x).attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x).attr("y2", (d: any) => d.target.y);
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [notes]);

  return (
    <div className="w-full h-full bg-white relative overflow-hidden animate-in fade-in duration-1000">
      <svg ref={svgRef} className="w-full h-full" />
      <div className="absolute top-12 left-12 space-y-2">
         <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#d3d1cb]">Knowledge Map</h4>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#0f766e]" />
              <span className="text-[9px] font-bold uppercase text-[#838170]">Engineering</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#2383e2]" />
              <span className="text-[9px] font-bold uppercase text-[#838170]">Product</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default KnowledgeGraph;

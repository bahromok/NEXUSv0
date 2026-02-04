
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { MindMapNode } from '../types';

interface MindMapProps {
  data: MindMapNode;
}

const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 20, right: 120, bottom: 20, left: 120 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
      g.attr("transform", event.transform);
    });
    svg.call(zoom as any);

    const tree = d3.tree<MindMapNode>().size([2 * Math.PI, Math.min(width, height) / 2 - 100]);
    const root = d3.hierarchy(data);
    tree(root);

    const link = g.append("g")
      .attr("fill", "none")
      .attr("stroke", "#e9e9e7")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr("d", d3.linkRadial<any, any>()
        .angle(d => d.x)
        .radius(d => d.y));

    const node = g.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `);

    node.append("circle")
      .attr("fill", d => d.children ? "#37352f" : "#2383e2")
      .attr("r", d => d.children ? 6 : 4);

    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI ? 10 : -10)
      .attr("text-anchor", d => d.x < Math.PI ? "start" : "end")
      .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
      .text(d => d.data.name)
      .attr("fill", "#37352f")
      .attr("font-size", d => d.depth === 0 ? "16px" : "12px")
      .attr("font-weight", d => d.depth === 0 ? "800" : "500")
      .clone(true).lower()
      .attr("stroke", "white");

  }, [data]);

  return (
    <div className="w-full h-full bg-[#fcfcfb] cursor-grab active:cursor-grabbing">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default MindMap;

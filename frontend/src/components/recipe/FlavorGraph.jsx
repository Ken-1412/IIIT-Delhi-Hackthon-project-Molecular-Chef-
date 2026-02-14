import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import clsx from 'clsx';
import { useRecipeStore } from '../../store/recipeStore';

export default function FlavorGraph({ width = 600, height = 500 }) {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const { state } = useRecipeStore();
    const { recipeData, isAnalyzing } = state;
    const [tooltip, setTooltip] = useState(null);

    // Parse nodes/links from recipeData or empty
    const nodes = recipeData?.graph?.nodes || [];
    const links = recipeData?.graph?.links || [];

    useEffect(() => {
        if (!svgRef.current || !containerRef.current) return;

        // Responsive width
        const { width: currentWidth, height: currentHeight } = containerRef.current.getBoundingClientRect();

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous

        if (nodes.length === 0) return;

        // Setup Simulation
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(100).strength(0.3))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(currentWidth / 2, currentHeight / 2))
            .force('collide', d3.forceCollide(35));

        // Render Links
        const link = svg.append("g")
            .attr("stroke", "var(--border-bright)")
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", d => Math.max(1, d.weight * 2))
            .attr("stroke-opacity", 0.6);

        // Render Nodes (Groups)
        const node = svg.append("g")
            .selectAll("g")
            .data(nodes)
            .join("g")
            .call(drag(simulation));

        // Node: Glow Circle (Outer)
        node.append("circle")
            .attr("r", d => 24 + (d.connections || 0))
            .attr("fill", "none")
            .attr("stroke", d => getNodeColor(d.category))
            .attr("stroke-opacity", 0.2)
            .attr("stroke-width", 1);

        // Node: Main Circle
        node.append("circle")
            .attr("r", d => 12 + (d.connections || 0) * 2)
            .attr("fill", d => getNodeColor(d.category))
            .attr("stroke", "var(--bg-primary)")
            .attr("stroke-width", 2)
            .attr("class", "cursor-pointer transition-all duration-300");

        // Node: Label
        node.append("text")
            .text(d => d.id)
            .attr("y", d => 28 + (d.connections || 0) * 2)
            .attr("text-anchor", "middle")
            .attr("fill", "var(--text-secondary)")
            .attr("font-family", "var(--font-mono)")
            .attr("font-size", 11)
            .attr("pointer-events", "none");

        // Animation: Scale in
        node.attr("opacity", 0)
            .attr("transform", "scale(0)")
            .transition().duration(400).ease(d3.easeBackOut)
            .attr("opacity", 1)
            .attr("transform", "scale(1)");

        // Interactions
        node.on("mouseover", (event, d) => {
            // Highlight links
            link.attr("stroke", l => (l.source === d || l.target === d) ? "var(--accent-amber)" : "var(--border-bright)")
                .attr("stroke-opacity", l => (l.source === d || l.target === d) ? 1 : 0.1);

            // Highlight node
            d3.select(event.currentTarget).select("circle:nth-child(2)")
                .attr("stroke", "var(--text-primary)");

            // Tooltip
            setTooltip({
                x: event.pageX,
                y: event.pageY,
                data: d
            });
        })
            .on("mouseout", (event, d) => {
                link.attr("stroke", "var(--border-bright)").attr("stroke-opacity", 0.6);
                d3.select(event.currentTarget).select("circle:nth-child(2)")
                    .attr("stroke", "var(--bg-primary)");
                setTooltip(null);
            });

        // Tick
        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("transform", d => `translate(${d.x},${d.y})`);
        });

        // Cleanup
        return () => simulation.stop();

    }, [recipeData, nodes.length]); // Re-run when data changes

    // Helper: Drag behavior
    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }
        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }
        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }
        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    // Helper: Colors
    function getNodeColor(category) {
        const map = {
            herb: '#4caf7d',
            spice: '#b06adc',
            fruit: '#e87840',
            vegetable: '#4caf7d',
            protein: '#e06040',
            meet: '#e06040',
            dairy: '#e8c848',
            fungus: '#90a060',
            flower: '#e890b0',
            nut: '#c8a050',
            grain: '#c8a050',
        };
        return map[category?.toLowerCase()] || '#a09070';
    }

    return (
        <div ref={containerRef} className="relative w-full h-full min-h-[500px] bg-bg-surface/30 rounded-xl border border-border overflow-hidden">
            {/* Empty State */}
            {nodes.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-60">
                    <svg className="w-24 h-24 text-border opacity-20 mb-4" viewBox="0 0 100 100">
                        <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                        <circle cx="50" cy="50" r="4" fill="currentColor" />
                        <line x1="50" y1="50" x2="50" y2="10" stroke="currentColor" />
                        <line x1="50" y1="50" x2="90" y2="70" stroke="currentColor" />
                        <line x1="50" y1="50" x2="10" y2="70" stroke="currentColor" />
                    </svg>
                    <p className="font-body italic text-text-muted">
                        Add ingredients to map their connections
                    </p>
                </div>
            )}

            {/* Loading overlay */}
            {isAnalyzing && (
                <div className="absolute top-4 right-4 flex items-center gap-2 pb-1 px-3 rounded-full bg-accent-amber/10 border border-accent-amber/30 text-accent-amber text-[10px] font-mono uppercase animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-amber" />
                    Analyzing Chemistry...
                </div>
            )}

            <svg ref={svgRef} className="w-full h-full block" />

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="fixed pointer-events-none z-50 bg-bg-elevated border border-border-bright rounded-lg p-3 shadow-xl w-48 animate-scaleIn"
                    style={{ top: tooltip.y + 16, left: tooltip.x - 96 }}
                >
                    <div className="font-display italic text-lg leading-none mb-1 text-text-primary">
                        {tooltip.data.id}
                    </div>
                    <div className="text-[10px] font-mono uppercase text-text-muted mb-2 tracking-wider">
                        {tooltip.data.category}
                    </div>
                    <div className="text-xs text-text-secondary border-t border-border pt-2">
                        Top pairing: <span className="text-accent-teal">{tooltip.data.topPair || 'None loaded'}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

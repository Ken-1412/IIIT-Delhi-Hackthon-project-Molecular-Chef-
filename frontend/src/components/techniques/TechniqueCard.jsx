import { useState, useEffect } from 'react';
import clsx from 'clsx';
import CostBadge from '../shared/CostBadge';
import { getPairings } from '../../api/client';

export default function TechniqueCard({ technique }) {
    const [expanded, setExpanded] = useState(false);
    const [tipData, setTipData] = useState(null);
    const [loadingTip, setLoadingTip] = useState(false);

    const {
        id, name, difficulty, cost_level, description,
        equipment, steps, key_ingredient, flavor_tip_intro
    } = technique;

    // Load flavor tip on mount
    useEffect(() => {
        async function loadTip() {
            if (!key_ingredient) return;
            setLoadingTip(true);
            const { data } = await getPairings(key_ingredient, 1);
            setTipData(data);
            setLoadingTip(false);
        }
        loadTip();
    }, [key_ingredient]);

    // Difficulty badge colors
    const diffColors = {
        Beginner: 'bg-accent-teal/10 text-accent-teal border-accent-teal/20',
        Intermediate: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
        Advanced: 'bg-accent-coral/10 text-accent-coral border-accent-coral/20',
    };

    return (
        <div className="bg-bg-surface border border-border rounded-lg p-7 transition-all duration-300 hover:border-border-bright hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">

            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-display italic text-2xl text-text-primary">{name}</h3>
                <span className={clsx(
                    "text-[10px] font-mono uppercase px-2 py-1 rounded-full border",
                    diffColors[difficulty] || diffColors.Beginner
                )}>
                    {difficulty}
                </span>
            </div>

            <p className="font-body text-sm text-text-secondary mb-4 leading-relaxed">
                {description}
            </p>

            {/* Cost & Equipment */}
            <div className="mb-6 space-y-3">
                <div className="flex items-center gap-3">
                    <CostBadge tier={cost_level.includes('Low') ? 'low' : cost_level.includes('Medium') ? 'medium' : 'high'} />
                    <span className="text-[10px] font-mono text-text-muted uppercase">
                        Est. Cost: {cost_level}
                    </span>
                </div>

                <div className="pl-3 border-l-2 border-accent-teal space-y-1">
                    {equipment.slice(0, 3).map((eq, idx) => ( // Show max 3 in preview
                        <div key={idx} className="text-xs font-body text-text-secondary">
                            <span className="text-text-primary mr-1">✦ {eq.name}</span>
                            <span className="italic text-text-muted">or {eq.budget_alternative}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Steps (Collapsible) */}
            <div className="flex-1">
                <div className={clsx(
                    "space-y-4 overflow-hidden transition-all duration-500 relative",
                    expanded ? "max-h-[800px]" : "max-h-[120px]"
                )}>
                    {!expanded && (
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-surface z-10 pointer-events-none" />
                    )}

                    <ol className="space-y-4">
                        {steps.map((step, idx) => (
                            <li key={idx} className="flex gap-3 text-sm font-body text-text-secondary leading-relaxed">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-amber text-bg-primary text-[10px] font-mono font-bold flex items-center justify-center mt-0.5">
                                    {idx + 1}
                                </span>
                                <span>{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-2 text-xs font-mono text-accent-amber uppercase tracking-wider hover:underline underline-offset-4"
                >
                    {expanded ? "Show Less ▴" : `Show All ${steps.length} Steps ▾`}
                </button>
            </div>

            {/* Dynamic Flavor Tip */}
            <div className="mt-6 bg-bg-elevated border border-border rounded p-4 relative overflow-hidden">
                <h4 className="font-mono text-[10px] uppercase text-accent-amber mb-2 tracking-widest relative z-10">
                    ✦ Flavor Chemistry Tip
                </h4>

                {loadingTip ? (
                    <div className="skeleton h-4 w-3/4 rounded" />
                ) : (
                    <p className="text-xs font-body italic text-text-secondary leading-relaxed relative z-10">
                        {tipData && tipData.pairings && tipData.pairings.length > 0 ? (
                            <>
                                <strong className="text-text-primary">{key_ingredient}</strong> pairs beautifully with <strong className="text-text-primary">{tipData.pairings[0].name}</strong> — they share {tipData.pairings[0].shared_compounds} compounds like {tipData.pairings[0].common_compounds?.[0] || 'limonene'}, which enhances the {name.toLowerCase()} process.
                            </>
                        ) : (
                            // Fallback
                            <>{flavor_tip_intro} Fits well with {key_ingredient}.</>
                        )}
                    </p>
                )}

                {/* Decorative background element */}
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-text-primary pointer-events-none">
                    <svg width="60" height="60" viewBox="0 0 100 100" fill="currentColor">
                        <polygon points="50 5 95 27.5 95 72.5 50 95 5 72.5 5 27.5" />
                    </svg>
                </div>
            </div>

        </div>
    );
}

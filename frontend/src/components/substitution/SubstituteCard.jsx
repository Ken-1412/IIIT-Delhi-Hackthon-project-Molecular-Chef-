import { useState } from 'react';
import clsx from 'clsx';
import CostBadge from '../shared/CostBadge';
import NutriScoreBadge from '../shared/NutriScoreBadge';
import { getPairings } from '../../api/client';

export default function SubstituteCard({ substitute, rank, onAddToRecipe }) {
  const [added, setAdded] = useState(false);
  const [showPairings, setShowPairings] = useState(false);
  const [pairings, setPairings] = useState(null);
  const [loadingPairings, setLoadingPairings] = useState(false);

  const {
    name, similarity_score, cost_tier, nutri_score_delta,
    explanation, best_for
  } = substitute;

  const handleAdd = () => {
    onAddToRecipe(name);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShowPairings = async () => {
    setShowPairings(true);
    if (!pairings) {
      setLoadingPairings(true);
      const { data } = await getPairings(name);
      setPairings(data);
      setLoadingPairings(false);
    }
  };

  const scorePct = Math.round(similarity_score * 100);
  const isTopRank = rank === 1;

  // Animation delay based on rank
  const delayStyle = { animationDelay: `${rank * 80}ms` };

  return (
    <>
      <div
        className={clsx(
          "relative bg-bg-surface border rounded-lg p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg animate-fadeUp",
          isTopRank
            ? "border-l-4 border-l-accent-amber border-y-border border-r-border bg-gradient-to-br from-bg-surface to-accent-amber/5"
            : "border-border hover:border-border-bright"
        )}
        style={delayStyle}
      >
        {isTopRank && (
          <div className="absolute top-0 right-0 bg-accent-amber text-bg-primary text-[10px] uppercase font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
            Best Match
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl text-accent-amber">#{rank}</span>
            <div>
              <h3 className="font-display italic text-lg leading-tight">{name}</h3>
              {best_for && (
                <span className="inline-block mt-1 text-[10px] font-mono bg-bg-elevated border border-border px-1.5 py-0.5 rounded text-text-secondary">
                  Best for: {best_for}
                </span>
              )}
            </div>
          </div>
          <CostBadge tier={cost_tier} />
        </div>

        {/* Similarity Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] font-mono uppercase text-text-muted mb-1">
            <span>Flavor Match</span>
            <span>{scorePct}%</span>
          </div>
          <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-teal via-accent-amber to-accent-coral"
              style={{ width: `${scorePct}%` }}
            />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-[auto_1fr] gap-4 mb-4">
          <div className="flex flex-col items-center gap-1 min-w-[60px]">
            <NutriScoreBadge score={75} size="sm" />
            <span className={clsx(
              "text-[9px] font-mono",
              nutri_score_delta > 0 ? "text-accent-teal" : "text-accent-coral"
            )}>
              {nutri_score_delta > 0 ? '+' : ''}{nutri_score_delta} score
            </span>
          </div>
          <p className="text-sm font-body italic text-text-secondary line-clamp-2 leading-relaxed">
            {explanation}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <button
            onClick={handleShowPairings}
            className="text-xs font-mono text-accent-amber hover:underline underline-offset-4"
          >
            View Pairings →
          </button>

          <button
            onClick={handleAdd}
            disabled={added}
            className={clsx(
              "px-4 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all",
              added
                ? "bg-accent-teal text-bg-primary border border-transparent"
                : "bg-transparent border border-accent-amber text-accent-amber hover:bg-accent-amber hover:text-bg-primary"
            )}
          >
            {added ? "✓ Added" : "Add to Recipe"}
          </button>
        </div>
      </div>

      {/* Pairings Modal */}
      {showPairings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-bg-primary/85 backdrop-blur-sm animate-fadeUp">
          <div className="bg-bg-surface border border-border rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-border flex justify-between items-center bg-bg-elevated">
              <h3 className="font-display italic text-xl">Pairings for {name}</h3>
              <button onClick={() => setShowPairings(false)} className="text-2xl hover:text-accent-coral">&times;</button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {loadingPairings ? (
                <div className="space-y-3">
                  <div className="skeleton h-8 w-full rounded" />
                  <div className="skeleton h-8 w-full rounded" />
                  <div className="skeleton h-8 w-full rounded" />
                </div>
              ) : (
                <ul className="space-y-2">
                  {pairings?.pairings?.map((p, i) => (
                    <li key={i} className="flex justify-between text-sm py-2 border-b border-border/30 last:border-0">
                      <span className="font-body italic text-text-primary">{p.name}</span>
                      <span className="text-xs font-mono text-accent-teal">{p.shared_compounds} shared</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {/* Close on backdrop click */}
          <div className="absolute inset-0 -z-10" onClick={() => setShowPairings(false)} />
        </div>
      )}
    </>
  );
}

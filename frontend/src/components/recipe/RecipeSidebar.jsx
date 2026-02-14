import SkeletonCard from '../shared/SkeletonCard';
import NutriScoreBadge from '../shared/NutriScoreBadge';
import { useRecipeStore } from '../../store/recipeStore';

export default function RecipeSidebar({ onAddBridge }) {
    const { state } = useRecipeStore();
    const { recipeData, isAnalyzing, ingredients, nutritionData } = state;
    const count = ingredients.length;

    if (count < 2) {
        return (
            <div className="mt-8 text-center px-4 animate-fadeUp">
                <svg className="w-16 h-16 mx-auto mb-4 text-border-bright opacity-50" viewBox="0 0 100 100">
                    <circle cx="30" cy="30" r="6" fill="currentColor" />
                    <circle cx="70" cy="30" r="6" fill="currentColor" />
                    <circle cx="50" cy="70" r="6" fill="currentColor" />
                    <path d="M30 30 L50 70 L70 30" stroke="currentColor" strokeWidth="1" fill="none" />
                </svg>
                <p className="font-body italic text-text-muted text-sm">
                    Add 2 or more ingredients to see their flavor chemistry.
                </p>
            </div>
        );
    }

    if (isAnalyzing || !recipeData) {
        return (
            <div className="space-y-4 mt-6">
                <SkeletonCard height={140} />
                <SkeletonCard height={100} />
            </div>
        );
    }

    // Derived data
    const { cohesion_score, power_pairs, conflicts, bridge_ingredient } = recipeData;
    const score = Math.round(cohesion_score * 100) || 0;

    let scoreLabel = "Weak";
    if (score > 40) scoreLabel = "Moderate";
    if (score > 70) scoreLabel = "Strong";
    if (score > 90) scoreLabel = "Excellent";

    return (
        <div className="space-y-8 mt-6 pb-20 animate-fadeUp stagger-1">
            {/* SECTION 1: COHESION SCORE */}
            <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90">
                        <circle cx="40" cy="40" r="36" fill="none" stroke="var(--bg-elevated)" strokeWidth="4" />
                        <circle
                            cx="40" cy="40" r="36"
                            fill="none" stroke="var(--accent-amber)" strokeWidth="4"
                            strokeDasharray="226"
                            strokeDashoffset={226 - (226 * (score / 100))}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-display text-2xl">
                        {score}
                    </div>
                </div>
                <div>
                    <h4 className="font-mono text-[10px] uppercase text-accent-amber tracking-widest mb-1">
                        Flavor Cohesion
                    </h4>
                    <div className="text-xl font-display italic">{scoreLabel}</div>
                    <p className="font-body text-xs text-text-secondary mt-1 leading-relaxed">
                        {score > 60
                            ? "These ingredients share many key molecular compounds."
                            : "A contrasting mix with few shared compounds."}
                    </p>
                </div>
            </div>

            {/* SECTION 2: POWER PAIRS */}
            {power_pairs && power_pairs.length > 0 && (
                <div className="animate-fadeUp stagger-2">
                    <h4 className="font-mono text-[10px] uppercase text-accent-teal tracking-widest mb-3 border-b border-border-bright pb-2">
                        ⚡ Power Pairs
                    </h4>
                    <ul className="space-y-3">
                        {power_pairs.slice(0, 2).map((pair, idx) => (
                            <li key={idx} className="flex items-center justify-between text-sm">
                                <span className="font-body italic text-text-primary">
                                    {pair.ingredient_a} <span className="text-text-muted px-1">↔</span> {pair.ingredient_b}
                                </span>
                                <span className="bg-accent-teal/10 text-accent-teal text-[10px] font-mono px-2 py-0.5 rounded-full border border-accent-teal/20">
                                    {pair.shared_compounds} shared
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* SECTION 3: CONFLICTS */}
            {conflicts && conflicts.length > 0 && (
                <div className="animate-fadeUp stagger-3">
                    <h4 className="font-mono text-[10px] uppercase text-accent-coral tracking-widest mb-3 border-b border-border-bright pb-2">
                        ⚠ Flavor Tension
                    </h4>
                    <ul className="space-y-2">
                        {conflicts.map((c, idx) => (
                            <li key={idx} className="text-sm font-body italic text-text-secondary flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent-coral" />
                                {c.message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* SECTION 4: BRIDGE SUGGESTION */}
            {bridge_ingredient && (
                <div className="bg-bg-elevated border border-border p-4 rounded-lg animate-fadeUp stagger-4">
                    <h4 className="font-mono text-[10px] uppercase text-accent-amber tracking-widest mb-2">
                        ✦ Suggested Addition
                    </h4>
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-display italic text-lg">{bridge_ingredient.name}</span>
                        <button
                            onClick={() => onAddBridge(bridge_ingredient.name)}
                            className="text-[10px] font-mono border border-accent-amber text-accent-amber px-2 py-1 rounded hover:bg-accent-amber hover:text-bg-primary transition-colors"
                        >
                            ADD +
                        </button>
                    </div>
                    <p className="font-body text-xs text-text-secondary leading-relaxed">
                        {bridge_ingredient.reason}
                    </p>
                </div>
            )}

            {/* SECTION 5: NUTRITION */}
            {nutritionData && (
                <div className="animate-fadeUp stagger-5 border-t border-border mt-6 pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-mono text-[10px] uppercase text-text-muted tracking-widest">
                            Nutrition Analysis
                        </h4>
                        <NutriScoreBadge score={nutritionData.total_score} size="lg" />
                    </div>

                    {/* Macro bar */}
                    <div className="flex h-2 rounded overflow-hidden mb-2">
                        <div style={{ width: `${nutritionData.protein_pct}%` }} className="bg-accent-teal" />
                        <div style={{ width: `${nutritionData.fat_pct}%` }} className="bg-accent-amber" />
                        <div style={{ width: `${nutritionData.carb_pct}%` }} className="bg-accent-coral" />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-text-secondary uppercase">
                        <span>Protein {nutritionData.protein_g}g</span>
                        <span>Fat {nutritionData.fat_g}g</span>
                        <span>Carbs {nutritionData.carb_g}g</span>
                    </div>
                </div>
            )}
        </div>
    );
}

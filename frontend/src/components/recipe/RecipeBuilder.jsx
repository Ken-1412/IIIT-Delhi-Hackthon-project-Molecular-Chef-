import { useRef, useState } from 'react';
import { useRecipeStore } from '../../store/recipeStore';
import { useRecipe } from '../../hooks/useRecipe';
import IngredientTag from './IngredientTag';
import RecipeSidebar from './RecipeSidebar';
import FlavorGraph from './FlavorGraph';
import clsx from 'clsx';

export default function RecipeBuilder() {
    const { addIngredient, removeIngredient, ingredients } = useRecipe();
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        addIngredient(inputValue);
        setInputValue('');
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Hero Intro */}
            <div className="mb-12 text-center animate-fadeUp opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                <div className="inline-block mb-3">
                    <div className="flex items-center gap-2 text-accent-amber">
                        <div className="w-8 h-[1px] bg-accent-amber/40" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">AI-Powered Flavor Science</span>
                        <div className="w-8 h-[1px] bg-accent-amber/40" />
                    </div>
                </div>
                <h1 className="font-display italic text-5xl mb-4 text-text-primary bg-gradient-to-r from-text-primary via-accent-amber to-text-primary bg-clip-text" style={{ WebkitBackgroundClip: 'text' }}>
                    Flavor Network Builder
                </h1>
                <p className="font-body text-text-secondary text-base max-w-2xl mx-auto leading-relaxed">
                    Discover the hidden molecular chemistry between your ingredients.
                    Build recipes based on shared flavor compounds, not guesswork.
                </p>
            </div>

            {/* Divider */}
            <div className="mb-10 flex items-center gap-4 opacity-0 animate-fadeUp" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-border to-border" />
                <div className="w-2 h-2 rotate-45 border border-accent-amber/40" />
                <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-border to-border" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* LEFT PANEL: CONTROLS */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-amber/0 via-accent-amber/20 to-accent-amber/0 rounded-lg opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-500" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Add an ingredient (e.g. 'Basil')..."
                            className={clsx(
                                "relative w-full bg-bg-elevated border border-border px-4 py-3.5 rounded-lg text-text-primary outline-none transition-all duration-300",
                                "focus:border-accent-amber focus:ring-2 focus:ring-accent-amber/30 focus:bg-bg-surface",
                                "placeholder:italic placeholder:text-text-muted font-body",
                                "hover:border-border-bright"
                            )}
                        />
                        <div className="absolute right-3 top-3.5 text-border-bright group-focus-within:text-accent-amber transition-all duration-300 group-focus-within:scale-110">
                            ↵
                        </div>
                    </form>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 min-h-[40px]">
                        {ingredients.map((ing, idx) => (
                            <div
                                key={ing}
                                className="animate-scaleIn"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <IngredientTag
                                    name={ing}
                                    onRemove={removeIngredient}
                                />
                            </div>
                        ))}
                        {ingredients.length === 0 && (
                            <span className="text-sm font-body italic text-text-muted py-1.5 pl-2">
                                Start by adding an ingredient...
                            </span>
                        )}
                    </div>

                    <div className="border-t border-border my-6" />

                    {/* Sidebar Analysis */}
                    <RecipeSidebar onAddBridge={addIngredient} />

                </div>

                {/* RIGHT PANEL: GRAPH */}
                <div className="lg:col-span-8 h-[600px] sticky top-24">
                    <FlavorGraph />

                    {/* Legend */}
                    <div className="mt-4 flex flex-wrap gap-4 text-[10px] font-mono text-text-muted uppercase tracking-wider justify-center opacity-70">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-node-herb" /> Herb/Veg
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-node-protein" /> Protein
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-node-fruit" /> Fruit
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-node-dairy" /> Dairy
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-8 h-[1px] bg-border-bright" /> Weak Link
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-8 h-[3px] bg-border-bright" /> Strong Link
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useRecipe } from '../../hooks/useRecipe';
import { getSubstitutes } from '../../api/client';
import SearchFilters from './SearchFilters';
import SubstituteCard from './SubstituteCard';
import SkeletonCard from '../shared/SkeletonCard';
import clsx from 'clsx';

export default function SubstituteFinder() {
    const { addIngredient } = useRecipe();
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 500);

    const [budget, setBudget] = useState('any');
    const [cuisine, setCuisine] = useState('any');

    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;
        async function fetchSubstitutes() {
            if (!debouncedQuery || debouncedQuery.trim() === '') {
                if (!ignore) setResults(null);
                return;
            }

            if (!ignore) {
                setLoading(true);
                setError(null);
            }

            const { data, error: apiError } = await getSubstitutes(debouncedQuery, budget, cuisine);

            if (!ignore) {
                setLoading(false);
                if (apiError) {
                    setError(apiError);
                    setResults(null);
                } else {
                    setResults(data);
                }
            }
        }

        fetchSubstitutes();
        return () => { ignore = true; };
    }, [debouncedQuery, budget, cuisine]);

    const startSearch = (term) => setQuery(term);

    return (
        <div className="max-w-4xl mx-auto min-h-[600px] pb-20">

            {/* Header */}
            <div className="text-center py-10">
                <h1 className="font-display italic text-4xl mb-3 text-text-primary">Ingredient Substitution</h1>
                <p className="font-body text-text-secondary text-base">
                    Find flavor-compatible swaps optimized for your budget.
                </p>

                {/* Search Bar */}
                <div className="relative max-w-lg mx-auto mt-8 group">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="What ingredient do you want to replace?"
                        className={clsx(
                            "w-full bg-transparent border-b border-border py-3 pl-10 pr-12 text-lg font-body italic text-text-primary",
                            "placeholder:text-text-muted focus:border-accent-amber focus:outline-none transition-colors"
                        )}
                    />
                    <div className="absolute left-0 top-3.5 text-text-muted">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" strokeWidth="2" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
                        </svg>
                    </div>
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="absolute right-3 top-3.5 text-text-muted hover:text-accent-coral transition-colors"
                        >
                            &times;
                        </button>
                    )}
                </div>

                <SearchFilters
                    budget={budget} onBudgetChange={setBudget} // Pass setters directly
                    cuisine={cuisine} onCuisineChange={setCuisine}
                />
            </div>

            {/* Results Area */}
            <div className="mt-8 px-4">

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                        <SkeletonCard height={180} />
                        <SkeletonCard height={180} />
                        <SkeletonCard height={180} />
                        <SkeletonCard height={180} />
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="text-center py-10 animate-fadeUp">
                        <p className="text-accent-coral font-mono text-xs mb-2 uppercase tracking-widest">Server Error</p>
                        <p className="text-text-secondary font-body italic">{error}</p>
                    </div>
                )}

                {/* Empty State / Suggestions */}
                {!results && !loading && !error && !query && (
                    <div className="text-center pt-8 animate-fadeUp">
                        <h4 className="font-mono text-[10px] uppercase text-accent-amber mb-6 tracking-widest">
                            Popular Searches
                        </h4>
                        <div className="flex flex-wrap justify-center gap-4">
                            {['Saffron', 'Truffle', 'Vanilla'].map(item => (
                                <button
                                    key={item}
                                    onClick={() => startSearch(item)}
                                    className="px-8 py-4 border border-border border-dashed rounded-lg hover:border-accent-amber hover:bg-bg-elevated/50 transition-all group"
                                >
                                    <span className="font-display italic text-lg text-text-secondary group-hover:text-text-primary transition-colors">
                                        {item}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* No Results Found */}
                {results && results.substitutes.length === 0 && !loading && !error && (
                    <div className="text-center py-12 text-text-muted italic font-body animate-fadeUp">
                        No substitutes found for "{query}". <br />
                        Try adjusting filters or checking spelling.
                    </div>
                )}

                {/* Results Grid */}
                {results && results.substitutes.length > 0 && !loading && (
                    <div className="animate-fadeUp">
                        <p className="mb-6 text-center text-xs font-mono text-text-muted uppercase tracking-widest">
                            {results.substitutes.length} Substitutes found for {results.ingredient}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {results.substitutes.map((item, idx) => (
                                <SubstituteCard
                                    key={idx} // key by index if duplicates or unique ids missing
                                    substitute={item}
                                    rank={idx + 1}
                                    onAddToRecipe={addIngredient}
                                />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

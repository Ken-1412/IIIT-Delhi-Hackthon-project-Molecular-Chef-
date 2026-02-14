import clsx from 'clsx';

export default function SearchFilters({ budget, cuisine, onBudgetChange, onCuisineChange }) {

    const budgets = [
        { value: 'any', label: 'Any Budget' },
        { value: 'low', label: '$ Low' },
        { value: 'medium', label: '$$ Medium' },
        { value: 'high', label: '$$$ High' }
    ];

    const cuisines = [
        { value: 'any', label: 'Any Cuisine' },
        { value: 'italian', label: 'Italian' },
        { value: 'french', label: 'French' },
        { value: 'asian', label: 'Asian' },
        { value: 'mexican', label: 'Mexican' },
        { value: 'indian', label: 'Indian' },
        { value: 'mediterranean', label: 'Mediterranean' }
    ];

    return (
        <div className="flex gap-4 w-full max-w-lg mx-auto mt-6 animate-fadeUp stagger-2">
            <div className="relative flex-1">
                <select
                    value={budget}
                    onChange={(e) => onBudgetChange(e.target.value)}
                    className={clsx(
                        "w-full appearance-none bg-bg-elevated border border-border px-4 py-2.5 rounded-md text-xs font-mono uppercase text-text-primary outline-none focus:border-accent-amber transition-colors cursor-pointer",
                        budget !== 'any' && "bg-accent-amber/5 border-accent-amber/50"
                    )}
                >
                    {budgets.map(b => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-3 pointer-events-none text-text-muted text-[8px]">▼</div>
            </div>

            <div className="relative flex-1">
                <select
                    value={cuisine}
                    onChange={(e) => onCuisineChange(e.target.value)}
                    className={clsx(
                        "w-full appearance-none bg-bg-elevated border border-border px-4 py-2.5 rounded-md text-xs font-mono uppercase text-text-primary outline-none focus:border-accent-amber transition-colors cursor-pointer",
                        cuisine !== 'any' && "bg-accent-amber/5 border-accent-amber/50"
                    )}
                >
                    {cuisines.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-3 pointer-events-none text-text-muted text-[8px]">▼</div>
            </div>
        </div>
    );
}

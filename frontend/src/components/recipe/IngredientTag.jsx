import clsx from 'clsx';
import { useState } from 'react';

// Map categories to colors (from CSS vars)
const CATEGORY_COLORS = {
    herb: 'var(--node-herb)',
    spice: 'var(--node-spice)',
    fruit: 'var(--node-fruit)',
    vegetable: 'var(--node-herb)', // default green
    protein: 'var(--node-protein)',
    meat: 'var(--node-protein)',
    dairy: 'var(--node-dairy)',
    fungus: 'var(--node-fungus)',
    flower: 'var(--node-sweetener)',
    nut: 'var(--node-grain)',
    grain: 'var(--node-grain)',
    // fallback
    default: 'var(--text-secondary)'
};

export default function IngredientTag({ name, category = 'default', onRemove }) {
    const [isExiting, setIsExiting] = useState(false);

    const handleRemove = () => {
        setIsExiting(true); // Trigger exit animation
        setTimeout(() => onRemove(name), 200); // Wait for animation
    };

    const dotColor = CATEGORY_COLORS[category.toLowerCase()] || CATEGORY_COLORS.default;

    return (
        <div
            className={clsx(
                "group relative flex items-center gap-2 pl-2 pr-2 py-1.5 rounded-full border transition-all duration-300",
                "bg-bg-elevated border-border text-text-secondary hover:text-text-primary hover:border-border-bright",
                "animate-scaleIn origin-center cursor-default",
                isExiting && "opacity-0 scale-75"
            )}
        >
            {/* Category dot */}
            <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: dotColor }}
            />

            {/* Name */}
            <span className="font-body italic text-sm leading-none pt-0.5">
                {name}
            </span>

            {/* Remove button (visible on hover or always on touch) */}
            <button
                onClick={handleRemove}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-bg-surface hover:text-accent-coral transition-colors ml-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label={`Remove ${name}`}
            >
                &times;
            </button>
        </div>
    );
}

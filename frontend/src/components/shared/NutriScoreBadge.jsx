import clsx from 'clsx';

export default function NutriScoreBadge({ score, size = 'sm' }) {
    // Determine color
    let colorClass = 'text-accent-coral border-accent-coral';
    if (score >= 80) colorClass = 'text-accent-teal border-accent-teal';
    else if (score >= 60) colorClass = 'text-accent-amber border-accent-amber';
    else if (score >= 40) colorClass = 'text-orange-500 border-orange-500';

    const sizeClass = size === 'lg' ? 'w-[52px] h-[52px] text-xl' : 'w-[32px] h-[32px] text-xs';

    return (
        <div className="flex flex-col items-center">
            <div className={clsx(
                "rounded-full border-2 flex items-center justify-center font-display font-bold",
                colorClass,
                sizeClass
            )}>
                {score}
            </div>
            {size === 'sm' && (
                <span className="text-[8px] font-mono text-text-muted mt-1 uppercase tracking-wide">
                    NUTRI
                </span>
            )}
        </div>
    );
}

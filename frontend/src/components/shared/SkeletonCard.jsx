import clsx from 'clsx';

export default function SkeletonCard({ lines = 3, height = 120, className = '' }) {
    return (
        <div
            className={clsx(
                "bg-bg-surface border border-border rounded-lg p-4",
                className
            )}
            style={{ minHeight: height }}
        >
            <div className="skeleton h-4 w-3/4 mb-4 rounded" />
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="skeleton h-3 mb-2 rounded"
                    style={{ width: `${85 - (i * 15)}%` }}
                />
            ))}
        </div>
    );
}

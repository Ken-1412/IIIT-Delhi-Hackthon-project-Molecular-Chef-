import clsx from 'clsx';

export default function CostBadge({ tier }) {
    let styles = '';
    let label = '';

    switch (tier) {
        case 'low':
            styles = 'text-accent-teal border-accent-teal';
            label = '$ Low';
            break;
        case 'medium':
            styles = 'text-accent-amber border-accent-amber';
            label = '$$ Mid';
            break;
        case 'high':
            styles = 'text-accent-coral border-accent-coral';
            label = '$$$ High';
            break;
        default:
            styles = 'text-text-muted border-text-muted';
            label = '?';
    }

    return (
        <span className={clsx(
            "border rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
            styles
        )}>
            {label}
        </span>
    );
}

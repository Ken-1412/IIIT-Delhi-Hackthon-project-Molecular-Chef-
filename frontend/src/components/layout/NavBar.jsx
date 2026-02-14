import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { checkHealth } from '../../api/client';

export default function NavBar({ activeTab, onTabChange }) {
    const [health, setHealth] = useState('loading'); // loading, ok, error

    useEffect(() => {
        checkHealth().then(({ error }) => {
            setHealth(error ? 'error' : 'ok');
        });
    }, []);

    const tabs = [
        { id: 'recipe', label: 'Recipe Builder', icon: '☍' },
        { id: 'substitution', label: 'Substitution Finder', icon: '⇄' },
        { id: 'techniques', label: 'Technique Guides', icon: '⌬' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 h-14 bg-bg-surface/90 backdrop-blur border-b border-border z-50 flex items-center justify-between px-6">
            {/* Branding */}
            <div className="flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 100 100" className="text-accent-amber fill-current">
                    <polygon points="50 5 95 27.5 95 72.5 50 95 5 72.5 5 27.5" />
                </svg>
                <span className="font-display italic text-lg text-text-primary">
                    MolecularChef
                </span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-transparent h-full">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={clsx(
                                "h-full px-6 flex items-center gap-2 transition-all duration-200",
                                "font-mono text-xs uppercase tracking-widest border-b-2",
                                isActive
                                    ? "text-accent-amber border-accent-amber bg-accent-amber/5"
                                    : "text-text-muted border-transparent hover:text-text-secondary hover:border-border-bright"
                            )}
                        >
                            <span className="text-base">{tab.icon}</span>
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Health Status */}
            <div className="flex items-center gap-2" title={health === 'ok' ? "API Connected" : "API Error"}>
                <div className={clsx(
                    "w-2 h-2 rounded-full transition-colors duration-500",
                    health === 'loading' && "bg-text-muted animate-pulse",
                    health === 'ok' && "bg-accent-teal shadow-[0_0_8px_rgba(45,212,160,0.6)]",
                    health === 'error' && "bg-accent-coral"
                )} />
            </div>
        </nav>
    );
}

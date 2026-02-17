import { useState } from 'react';
import NavBar from './NavBar';
import ErrorToast from '../shared/ErrorToast';

// Views
import RecipeBuilder from '../recipe/RecipeBuilder';
import SubstituteFinder from '../substitution/SubstituteFinder';
import TechniqueGuide from '../techniques/TechniqueGuide';

import TechniqueSlider3D from '../shared/TechniqueSlider3D';

export default function AppShell() {
    const [activeTab, setActiveTab] = useState('techniques');

    return (
        <div className="min-h-screen bg-bg-primary relative overflow-x-hidden text-text-primary selection:bg-accent-amber selection:text-bg-primary">

            <NavBar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Decorative top-left logic gate / aesthetic element */}
            <svg
                className="fixed top-20 left-6 opacity-[0.08] pointer-events-none z-0"
                width="120" height="120" viewBox="0 0 100 100"
            >
                <circle cx="20" cy="20" r="4" fill="#e8a030" />
                <circle cx="80" cy="50" r="4" fill="#e8a030" />
                <circle cx="20" cy="80" r="4" fill="#e8a030" />
                <path d="M20 20 L50 35 L80 50 L50 65 L20 80" stroke="#e8a030" fill="none" strokeWidth="1" />
            </svg>

            <main className="pt-24 px-6 max-w-screen-xl mx-auto pb-20 relative z-10 min-h-[calc(100vh-60px)]">
                {activeTab === 'recipe' && (
                    <div className="animate-fadeUp">
                        <TechniqueSlider3D />
                        <RecipeBuilder />
                    </div>
                )}
                {activeTab === 'substitution' && (
                    <div className="animate-fadeUp">
                        <SubstituteFinder />
                    </div>
                )}
                {activeTab === 'techniques' && (
                    <div className="animate-fadeUp">
                        <TechniqueGuide />
                    </div>
                )}
            </main>

            <div className="fixed bottom-6 right-6 font-mono text-[10px] text-border-bright pointer-events-none select-none">
                v0.1.0 — MVP
            </div>

            <ErrorToast />
        </div>
    );
}

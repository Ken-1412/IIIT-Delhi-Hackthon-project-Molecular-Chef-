import { useState } from 'react';
import TechniqueCard from './TechniqueCard';
import clsx from 'clsx';

const TECHNIQUES = [
    {
        id: 1,
        name: "Spherification",
        difficulty: "Beginner",
        cost_level: "Low ($8-15)",
        description: "Turn any liquid into caviar-like pearls with a thin gel membrane.",
        equipment: [
            { name: "Sodium alginate 1g", budget_alternative: "baking supplier / Amazon" },
            { name: "Calcium chloride 5g", budget_alternative: "food-grade, same sources" },
            { name: "Immersion blender", budget_alternative: "fork + patience (1 min)" },
            { name: "Pipette or syringe", budget_alternative: "teaspoon drops" }
        ],
        steps: [
            "Blend 1g sodium alginate into 500ml juice until fully dissolved (no lumps)",
            "Let mixture rest 30 min to remove air bubbles",
            "Dissolve 5g calcium chloride in 1L cold water in a wide bowl",
            "Using pipette, drop alginate mixture into calcium bath one drop at a time",
            "Watch pearls form instantly — leave in bath for exactly 90 seconds",
            "Remove with slotted spoon, rinse in clean cold water",
            "Serve immediately — pearls continue to gel over time"
        ],
        key_ingredient: "lemon",
        flavor_tip_intro: "The best spherification liquids are acidic and flavorful."
    },
    {
        id: 2,
        name: "Foaming & Emulsification",
        difficulty: "Beginner",
        cost_level: "Low ($5-12)",
        description: "Create airy, flavorful foams that deliver intense taste in tiny amounts.",
        equipment: [
            { name: "Soy lecithin powder 2g", budget_alternative: "sunflower lecithin" },
            { name: "Hand blender", budget_alternative: "whisk vigorously for 2 min" },
            { name: "Wide shallow bowl", budget_alternative: "container 3cm+ deep" }
        ],
        steps: [
            "Prepare your flavored liquid: stock, juice, or infusion (at least 200ml)",
            "Add 2g soy lecithin per 200ml liquid — whisk until dissolved",
            "Tilt container 45° and blend at surface only — you want air, not mixing",
            "Foam forms in 20-30 seconds — skim off top layer with large spoon",
            "Use immediately — foam deflates within 5-10 minutes",
            "For more stable foam: add 0.3g xanthan gum to base liquid before foaming"
        ],
        key_ingredient: "basil",
        flavor_tip_intro: "Foams concentrate flavor — use your most aromatic ingredients."
    },
    {
        id: 3,
        name: "Gelation",
        difficulty: "Beginner",
        cost_level: "Low ($4-10)",
        description: "Form gels, noodles, and sheets using natural hydrocolloids.",
        equipment: [
            { name: "Agar-agar powder 2g", budget_alternative: "Asian supermarkets" },
            { name: "Small saucepan", budget_alternative: "microwave safe bowl" },
            { name: "Molds or sheet pan", budget_alternative: "shallow tray" }
        ],
        steps: [
            "Measure 2g agar per 500ml liquid (adjust for firmness as needed)",
            "Whisk agar into COLD liquid before heating",
            "Bring to full boil for 2 minutes, stirring — must reach 85°C to activate",
            "Pour into molds immediately — agar sets at room temperature",
            "Allow 20 minutes to set — do not disturb",
            "Unmold gently — agar gels are heat-stable up to 80°C",
            "For noodles: pour thin layer onto sheet pan, roll when set, slice into strips"
        ],
        key_ingredient: "vanilla",
        flavor_tip_intro: "Unlike gelatin, agar gels can be heated and re-melted."
    },
    {
        id: 4,
        name: "Vacuum Infusion",
        difficulty: "Intermediate",
        cost_level: "Low-Medium ($0-40)",
        description: "Force flavors deep into solid ingredients using pressure differentials.",
        equipment: [
            { name: "Vacuum sealer", budget_alternative: "wine saver pump + jar" },
            { name: "Vacuum bags", budget_alternative: "zip-locks (water displacement)" },
            { name: "Flavorful liquid", budget_alternative: "herb oil, juice, stock" }
        ],
        steps: [
            "Cut ingredient into uniform pieces (max 2cm thick)",
            "Prepare infusion liquid — ensure it is room temperature",
            "Submerge ingredient fully in liquid in vacuum bag",
            "Seal bag, removing as much air as possible",
            "Apply vacuum — low pressure opens ingredient's cells",
            "Release vacuum — atmospheric pressure forces liquid in",
            "Repeat cycle 3-5 times for maximum penetration",
            "Rest 30 minutes in liquid before using"
        ],
        key_ingredient: "rosemary",
        flavor_tip_intro: "Works best with porous ingredients like cucumber or melon."
    },
    {
        id: 5,
        name: "Sous-Vide / Precision",
        difficulty: "Intermediate",
        cost_level: "Medium ($30-100)",
        description: "Cook at exact temperatures for textures impossible with conventional heat.",
        equipment: [
            { name: "Immersion circulator", budget_alternative: "pot + thermometer + watching" },
            { name: "Vacuum bags", budget_alternative: "zip-lock bags" },
            { name: "Large pot/cooler", budget_alternative: "insulated cooler" }
        ],
        steps: [
            "Set water bath to target temperature (e.g. 63°C for eggs)",
            "Season ingredient and add aromatics to bag before sealing",
            "Seal bag removing all air — air pockets cause uneven cooking",
            "Submerge bag fully — use a weight if needed",
            "Cook for specified time (e.g. 63°C egg: 45 min)",
            "Remove and pat dry completely",
            "Optional: quick sear in very hot pan 30s per side for crust"
        ],
        key_ingredient: "thyme",
        flavor_tip_intro: "Lower temp = different texture, not just doneness."
    }
];

export default function TechniqueGuide() {
    const [filter, setFilter] = useState('All');

    const filteredTechniques = filter === 'All'
        ? TECHNIQUES
        : TECHNIQUES.filter(t => t.difficulty === filter);

    return (
        <div className="max-w-6xl mx-auto pb-20">

            {/* Header */}
            <div className="text-center py-10 mb-8 border-b border-border/50">
                <h1 className="font-display italic text-4xl mb-3 text-text-primary">Molecular Techniques</h1>
                <p className="font-body text-text-secondary text-base">
                    Lab-grade cooking methods for any kitchen and any budget.
                </p>

                {/* Filters */}
                <div className="flex justify-center gap-2 mt-8">
                    {['All', 'Beginner', 'Intermediate', 'Advanced'].map(btn => (
                        <button
                            key={btn}
                            onClick={() => setFilter(btn)}
                            className={clsx(
                                "px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border transition-all",
                                filter === btn
                                    ? "bg-accent-amber text-bg-primary border-accent-amber font-bold"
                                    : "bg-transparent text-text-muted border-border hover:border-border-bright hover:text-text-secondary"
                            )}
                        >
                            {btn}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Video Demos ── */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-[1px] bg-accent-amber" />
                    <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-amber">
                        Watch &amp; Learn
                    </h2>
                    <div className="flex-1 h-[1px] bg-border" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { id: 'psSkthG_2Pw', label: 'Spherification' },
                        { id: 'Elbzl5I2HTA', label: 'Foaming' },
                        { id: 'E3kxcWHyTg8', label: 'Gel Noodles' },
                        { id: 's3mAuX3mZnY', label: 'Plating' },
                    ].map((vid) => (
                        <div key={vid.id} className="group">
                            <div className="relative aspect-[9/16] rounded-xl overflow-hidden border border-border bg-bg-elevated transition-all duration-300 group-hover:border-accent-amber/40 group-hover:shadow-[0_0_20px_rgba(232,160,48,0.1)]">
                                <iframe
                                    src={`https://www.youtube.com/embed/${vid.id}?rel=0`}
                                    title={vid.label}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full"
                                    style={{ border: 'none' }}
                                />
                            </div>
                            <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-widest text-text-muted group-hover:text-accent-amber transition-colors">
                                {vid.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredTechniques.map((tech, idx) => (
                    <div
                        key={tech.id}
                        className={clsx(
                            "animate-fadeUp",
                            // Make the last item full width if odd number and currently showing all
                            (idx === filteredTechniques.length - 1 && filteredTechniques.length % 2 !== 0) ? "md:col-span-2 md:max-w-2xl md:mx-auto w-full" : ""
                        )}
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        <TechniqueCard technique={tech} />
                    </div>
                ))}
            </div>

            {filteredTechniques.length === 0 && (
                <div className="text-center py-20 text-text-muted italic">
                    No techniques found for this filter.
                </div>
            )}

        </div>
    );
}

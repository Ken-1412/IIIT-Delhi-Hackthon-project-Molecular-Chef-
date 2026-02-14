import './slider3d.css';

/**
 * CSS-Only 3D Slider — MolecularChef Techniques
 * Pure CSS autoRun infinite rotation with perspective transforms.
 * Uses --position and --quantity CSS variables for item placement.
 */

const SLIDES = [
    {
        title: 'Spherification',
        tag: 'Calcium · Alginate',
        img: 'https://images.unsplash.com/photo-1635321593217-40050ad13c74?w=400&h=520&fit=crop&q=80',
    },
    {
        title: 'Herb Foams',
        tag: 'Lecithin · Air',
        img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=520&fit=crop&q=80',
    },
    {
        title: 'Agar Gelation',
        tag: 'Hydrocolloid · Heat-stable',
        img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=520&fit=crop&q=80',
    },
    {
        title: 'Sous-Vide',
        tag: 'Precision · 0.1°C',
        img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=520&fit=crop&q=80',
    },
    {
        title: 'Flavor Pairing',
        tag: 'Compounds · Synergy',
        img: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=520&fit=crop&q=80',
    },
    {
        title: 'Emulsification',
        tag: 'Oil · Water · Stable',
        img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=520&fit=crop&q=80',
    },
    {
        title: 'Fat Powdering',
        tag: 'Maltodextrin · Texture',
        img: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=520&fit=crop&q=80',
    },
    {
        title: 'Cryo-Cooking',
        tag: 'Nitrogen · Instant',
        img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=520&fit=crop&q=80',
    },
    {
        title: 'Dehydration',
        tag: 'Concentrate · Crisp',
        img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=520&fit=crop&q=80',
    },
    {
        title: 'Infusion',
        tag: 'Extraction · Essence',
        img: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=520&fit=crop&q=80',
    },
];

const QUANTITY = SLIDES.length;

export default function TechniqueSlider3D() {
    return (
        <div className="slider-banner">
            {/* 3D Slider — CSS only rotation */}
            <div className="slider3d" style={{ '--quantity': QUANTITY }}>
                {SLIDES.map((slide, idx) => (
                    <div
                        key={idx}
                        className="slide-item"
                        style={{ '--position': idx + 1 }}
                    >
                        <div className="slide-card">
                            <img
                                src={slide.img}
                                alt={slide.title}
                                loading="lazy"
                            />
                            <div className="slide-overlay" />
                            <div className="slide-label">
                                <div className="slide-num">0{idx + 1}</div>
                                <h4>{slide.title}</h4>
                                <p>{slide.tag}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content below */}
            <div className="slider-content">
                <div className="slider-title">MOLECULAR CHEF</div>
                <div className="slider-subtitle">
                    Democratising Gastronomy Through AI &amp; Flavour Science
                </div>
            </div>
        </div>
    );
}

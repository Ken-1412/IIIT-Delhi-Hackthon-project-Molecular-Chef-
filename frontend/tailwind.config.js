/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            fontFamily: {
                display: ['"Playfair Display"', 'serif'],
                mono: ['"DM Mono"', 'monospace'],
                body: ['Lora', 'serif'],
            },
            colors: {
                bg: {
                    primary: '#0f0e0c',
                    surface: '#1a1815',
                    elevated: '#242018',
                },
                amber: { DEFAULT: '#e8a030', muted: '#8b7355' },
                teal: { DEFAULT: '#2dd4a0' },
                coral: { DEFAULT: '#e8604a' },
                border: { DEFAULT: '#2e2a22', bright: '#4a4235' },
                text: {
                    primary: '#f0ead8',
                    secondary: '#a09070',
                    muted: '#5a5040',
                },
                accent: {
                    amber: '#e8a030',
                    teal: '#2dd4a0',
                    coral: '#e8604a',
                    muted: '#8b7355',
                },
                node: {
                    herb: '#4caf7d',
                    protein: '#e06040',
                    fruit: '#e87840',
                    dairy: '#e8c848',
                    spice: '#b06adc',
                    fat: '#40b8c8',
                    grain: '#c8a050',
                    fungus: '#90a060',
                    sweetener: '#e890b0',
                },
            },
            animation: {
                shimmer: 'shimmer 1.5s infinite',
                fadeUp: 'fadeUp 0.4s ease forwards',
                scaleIn: 'scaleIn 0.3s ease forwards',
                glow: 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                fadeUp: {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    from: { opacity: '0', transform: 'scale(0.85)' },
                    to: { opacity: '1', transform: 'scale(1)' },
                },
                glow: {
                    from: { boxShadow: '0 0 4px rgba(232,160,48,0.2)' },
                    to: { boxShadow: '0 0 16px rgba(232,160,48,0.5)' },
                },
            },
        },
    },
    plugins: [],
}

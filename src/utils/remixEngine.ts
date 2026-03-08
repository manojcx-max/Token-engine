export interface RemixTheme {
    id: string;
    name: string;
    description: string;
    hueShift?: number;
    saturationMultiplier?: number;
    targetHue?: number;
    radiusOverride?: number;
    modePreference?: 'dark' | 'light' | 'original';
    contrastBoost?: number;
    fontHeading?: string;
    fontSans?: string;
    letterSpacing?: string;
}

export const PROFESSIONAL_THEMES: RemixTheme[] = [
    {
        id: 'modern-saas',
        name: 'Vanguard Modern',
        description: 'Indigo-focused, highly rounded, precise motion. Optimized for modern SaaS.',
        targetHue: 245,
        radiusOverride: 12,
        modePreference: 'dark',
        saturationMultiplier: 1.1,
        fontHeading: "'Outfit', sans-serif",
        fontSans: "'Inter', sans-serif",
        letterSpacing: '-0.02em'
    },
    {
        id: 'fintech-trust',
        name: 'Capital Fintech',
        description: 'Teal/Green accents, medium-high radius. Conveys security and trust.',
        targetHue: 165,
        radiusOverride: 10,
        modePreference: 'light',
        saturationMultiplier: 0.85,
        fontHeading: "'Inter', sans-serif",
        fontSans: "'Inter', sans-serif",
        letterSpacing: '-0.01em'
    },
    {
        id: 'global-enterprise',
        name: 'Global Enterprise',
        description: 'Structured monochrome, sharp 4px corners. Built for complex data-heavy apps.',
        targetHue: 215,
        saturationMultiplier: 0.1,
        radiusOverride: 4,
        modePreference: 'light',
        fontHeading: "system-ui, sans-serif",
        fontSans: "system-ui, sans-serif",
        letterSpacing: '0'
    },
    {
        id: 'obsidian-night',
        name: 'Obsidian Night',
        description: 'Deep black canvas, vibrant electric accents. The ultimate dark-mode preview.',
        targetHue: 320,
        radiusOverride: 8,
        modePreference: 'dark',
        saturationMultiplier: 1.6,
        fontHeading: "'Outfit', sans-serif",
        fontSans: "'Inter', sans-serif",
        letterSpacing: '-0.03em'
    },
    {
        id: 'artisanal-creative',
        name: 'Artisanal Creative',
        description: 'Warm, organic amber tones. Serif-friendly, high-end boutique aesthetic.',
        targetHue: 32,
        radiusOverride: 2,
        modePreference: 'original',
        saturationMultiplier: 0.9,
        fontHeading: "Georgia, serif",
        fontSans: "'Inter', sans-serif",
        letterSpacing: '0.01em'
    }
];

// Helper to convert hex to HSL
function hexToHSL(hex: string) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, l * 100];
}

export function generateRemixCSS(theme: RemixTheme, originalTokens: any) {
    const brandColor = originalTokens.colors.brand['500'] || '#000';
    let [h, s, l] = hexToHSL(brandColor);

    // Apply Transformation
    if (theme.targetHue !== undefined) {
        h = theme.targetHue;
    } else if (theme.hueShift !== undefined) {
        h = (h + theme.hueShift) % 360;
    }

    if (theme.saturationMultiplier !== undefined) {
        s = Math.min(100, s * theme.saturationMultiplier);
    }

    // Radius overrides
    const r_sm = theme.radiusOverride !== undefined ? theme.radiusOverride / 2 : null;
    const r_md = theme.radiusOverride !== undefined ? theme.radiusOverride : null;
    const r_lg = theme.radiusOverride !== undefined ? theme.radiusOverride * 2 : null;

    let css = `
        #tokenengine-results-view {
            --color-brand-500: hsl(${h}, ${s}%, ${l}%);
            --color-brand-600: hsl(${h}, ${s}%, ${Math.max(0, l - 10)}%);
            ${r_sm !== null ? `--radius-sm: ${r_sm}px;` : ''}
            ${r_md !== null ? `--radius-md: ${r_md}px;` : ''}
            ${r_lg !== null ? `--radius-lg: ${r_lg}px;` : ''}
            ${theme.fontHeading ? `--font-heading: ${theme.fontHeading};` : ''}
            ${theme.fontSans ? `--font-sans: ${theme.fontSans};` : '--font-sans: "Inter", sans-serif;'}
            ${theme.letterSpacing ? `letter-spacing: ${theme.letterSpacing};` : ''}
    `;

    if (theme.modePreference === 'dark') {
        css += `
            --bg-primary: #0a0a0a;
            --bg-surface: #111111;
            --bg-app: #050505;
            --text-primary: #ffffff;
            --text-secondary: #a0a0a0;
            --border-default: #222222;
        `;
    } else if (theme.modePreference === 'light') {
        css += `
            --bg-primary: #ffffff;
            --bg-surface: #f9f9f9;
            --bg-app: #f1f1f1;
            --text-primary: #111111;
            --text-secondary: #666666;
            --border-default: #e5e5e5;
        `;
    }

    css += `}`;
    return css;
}

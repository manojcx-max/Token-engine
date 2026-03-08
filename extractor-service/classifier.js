import tinycolor from 'tinycolor2';

export function classifyColors(samples) {
    const allColors = new Map();
    const interactiveColors = new Map();
    const borderColors = new Map();

    // ── Aggregate all color sources ──────────────────────────────────────────
    samples.text.forEach(s => {
        addColor(allColors, s.color);
    });

    samples.interactive.forEach(s => {
        addColor(allColors, s.backgroundColor, 1);
        addColor(allColors, s.color, 1);
        addColor(allColors, s.borderColor, 1);
        addColor(interactiveColors, s.backgroundColor, 3); // Triple weight — highest intent signal
        addColor(interactiveColors, s.borderColor, 2);
    });

    samples.containers.forEach(s => {
        addColor(allColors, s.backgroundColor, 1);
    });

    // Border colors are high-signal for design systems
    if (samples.borders) {
        samples.borders.forEach(s => {
            addColor(allColors, s.color, 0.5);
            addColor(borderColors, s.color, 1);
        });
    }

    // ── CSS Custom Properties — direct design token source ───────────────────
    const cssVarColors = {};
    if (samples.cssVars) {
        Object.entries(samples.cssVars).forEach(([key, val]) => {
            const normalized = normalize(val);
            if (normalized) {
                cssVarColors[key] = normalized;
                addColor(allColors, val, 2); // High weight — explicitly defined token
            }
        });
    }

    // ── Build color metadata ──────────────────────────────────────────────────
    const colorList = Array.from(allColors.entries()).map(([hex, count]) => {
        const meta = getScoringMetadata(hex);
        const hsl = meta.hsl;
        const lux = meta.lux;
        const interactiveWeight = interactiveColors.get(hex) || 0;
        const borderWeight = borderColors.get(hex) || 0;

        // Brand Score: saturation + log frequency + interactive signal + border signal
        let score = (hsl.s * 60) + (Math.log10(count + 1) * 15) + (interactiveWeight * 12) + (borderWeight * 5);

        // Penalty for standard "browser blue" links
        if (hex === '#0000ee' || hex === '#0000ff' || hex === '#0000cc') score -= 30;

        return {
            hex,
            hsl,
            lux,
            count,
            score,
            isNeutral: hsl.s < 0.08,              // Tighter: very close to gray
            isExtreme: lux > 0.97 || lux < 0.02,  // Only truly pure white/black
            isInteractive: interactiveWeight > 0
        };
    });

    // ── 1. Neutrals — expanded to 8, by luminance ─────────────────────────
    const neutrals = colorList
        .filter(c => c.isNeutral && !c.isExtreme)
        .sort((a, b) => b.lux - a.lux)
        .slice(0, 8)
        .map(c => c.hex);

    // ── 2. Brand Colors — non-neutral, non-pure-extreme ────────────────────
    const brandPool = colorList
        .filter(c => !c.isNeutral && !c.isExtreme)
        .sort((a, b) => b.score - a.score);

    // If we couldn't find brand colors, look in interactive-only pool 
    const fallbackPool = colorList
        .filter(c => c.isInteractive)
        .sort((a, b) => b.score - a.score);

    const brand = brandPool[0]?.hex || fallbackPool[0]?.hex || null;
    const secondary = brandPool[1]?.hex || fallbackPool[1]?.hex || brand;

    // ── 3. Text — by frequency (most common text color) ────────────────────
    const textColorCounts = new Map();
    samples.text.forEach(s => {
        const h = normalize(s.color);
        if (h) textColorCounts.set(h, (textColorCounts.get(h) || 0) + 1);
    });
    const sortedTextColors = [...textColorCounts.entries()].sort((a, b) => b[1] - a[1]);
    const textPrimary = sortedTextColors[0]?.[0] || null;
    const textSecondary = sortedTextColors[1]?.[0] || null;

    // ── 4. Backgrounds — from containers ────────────────────────────────────
    const bgColorCounts = new Map();
    samples.containers.forEach(s => {
        const h = normalize(s.backgroundColor);
        if (h) bgColorCounts.set(h, (bgColorCounts.get(h) || 0) + 1);
    });
    const sortedBgColors = [...bgColorCounts.entries()].sort((a, b) => b[1] - a[1]);

    // Exclude near-duplicates of brand from background list
    const bgPrimary = sortedBgColors[0]?.[0] || null;
    const bgSurface = sortedBgColors.find(([hex]) => hex !== bgPrimary)?.[0] || null;

    return {
        brand: { primary: brand, secondary },
        accents: brandPool.slice(0, 6).map(c => c.hex).filter(Boolean),
        neutrals,
        text: { primary: textPrimary, secondary: textSecondary },
        background: { primary: bgPrimary, surface: bgSurface },
        cssVarColors: Object.keys(cssVarColors).length > 0 ? cssVarColors : null
    };
}

function addColor(map, colorStr, weight = 1) {
    if (!colorStr) return;
    const hex = normalize(colorStr);
    if (hex) map.set(hex, (map.get(hex) || 0) + weight);
}

function normalize(c) {
    if (!c || c === 'transparent' || c === 'rgba(0, 0, 0, 0)') return null;

    // Support modern color spaces (oklch, oklab, etc)
    if (c.includes('oklch')) {
        const parts = c.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.%]+))?\)/);
        if (parts) {
            const l = parseFloat(parts[1]);
            const alpha = parts[4] ? (parts[4].endsWith('%') ? parseFloat(parts[4]) / 100 : parseFloat(parts[4])) : 1;
            if (alpha < 0.5) return null;
            // Approximate luminance as 'l' and saturation as 'c' (parts[2])
            // Return raw string but allow tinycolor dummy for categorization
            return c.toLowerCase();
        }
    }

    const color = tinycolor(c);
    if (!color.isValid()) return null;
    if (color.getAlpha() < 0.5) return null;
    return color.toHexString().toLowerCase();
}

/**
 * Enhanced tinycolor wrapper that handles modern colors for scoring.
 */
function getScoringMetadata(hexOrModern) {
    if (hexOrModern.startsWith('oklch')) {
        const parts = hexOrModern.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
        if (parts) {
            const l = parseFloat(parts[1]);
            const c = parseFloat(parts[2]);
            return {
                lux: l,
                hsl: { s: c * 2, l }, // Proxy chroma to saturation, lightness remains L
                isValid: true
            };
        }
    }
    const color = tinycolor(hexOrModern);
    return {
        lux: color.getLuminance(),
        hsl: color.toHsl(),
        isValid: color.isValid()
    };
}

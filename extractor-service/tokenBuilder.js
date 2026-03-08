import { generatePrompts } from './promptBuilder.js';

export function buildTokens(data) {
    const { colors, typography, radius, spacing, shadows = [], gradients = [], zIndices = [], motion = { durations: [], easings: [] }, stats } = data;

    // 1. Z-Index Semantic Clustering (Frequency-Weighted)
    const ziRaw = [...new Set(zIndices.map(z => z.value))].sort((a, b) => a - b);
    // Name z-index slots by their actual detected values in order
    const ziNames = ['base', 'raised', 'dropdown', 'sticky', 'overlay', 'modal'];
    const zIndicesTokens = {};
    ziRaw.slice(0, 6).forEach((val, i) => {
        zIndicesTokens[ziNames[i]] = val;
    });
    // Ensure at least one key exists
    if (Object.keys(zIndicesTokens).length === 0) {
        zIndicesTokens.base = 0;
        zIndicesTokens.overlay = 10;
        zIndicesTokens.modal = 100;
    }

    // 2. Shadow Semantic Hierarchy (Decomposed)
    const shadowTokens = {};
    const getRaw = (s) => (typeof s === 'object' ? s.raw : s);
    const getBlur = (s) => (typeof s === 'object' ? (parseInt(s.blur) || 0) : (parseInt(s.match(/(\d+)px/)?.[1]) || 0));

    const sortedShadows = [...shadows].sort((a, b) => getBlur(a) - getBlur(b));

    if (sortedShadows.length > 0) shadowTokens.subtle = getRaw(sortedShadows[0]);
    if (sortedShadows.length > 1) shadowTokens.medium = getRaw(sortedShadows[Math.floor(sortedShadows.length / 2)]);
    if (sortedShadows.length > 2) shadowTokens.deep = getRaw(sortedShadows[sortedShadows.length - 1]);

    // 3. System Traits Detection (Non-Audit)
    const avgRadius = radius.scale.length > 0 ? radius.scale.reduce((a, b) => a + b, 0) / radius.scale.length : 0;
    const systemTraits = {
        radiusBias: avgRadius > 12 ? "rounded" : avgRadius > 4 ? "soft" : "sharp",
        shadowDepth: shadows.length > 5 ? "expressive" : shadows.length > 0 ? "minimal" : "flat",
        colorStrategy: colors.accents.length > 1 ? "multi-brand" : "single-accent",
        typographyDensity: (typography.meta.scaleRatioAverage || 1) > 1.3 ? "expressive" : "minimal"
    };

    const tokens = {
        colors: {
            // Only emit brand block if we actually detected brand colors
            ...(colors.brand.primary ? {
                brand: {
                    500: colors.brand.primary,
                    ...(colors.brand.secondary && colors.brand.secondary !== colors.brand.primary ? { 600: colors.brand.secondary } : {})
                }
            } : {}),
            neutral: colors.neutrals.reduce((acc, hex, i) => {
                acc[(i + 1) * 100] = hex;
                return acc;
            }, {}),
            text: {
                primary: colors.text.primary,
                ...(colors.text.secondary ? { secondary: colors.text.secondary } : {})
            },
            background: {
                ...(colors.background?.primary ? { primary: colors.background.primary } : {}),
                ...(colors.background?.surface ? { surface: colors.background.surface } : {})
            },
            ...(colors.accents?.length > 0 ? { accents: colors.accents } : {}),
            ...(colors.cssVarColors ? { cssVars: colors.cssVarColors } : {})
        },
        typography: {
            fontFamily: {
                heading: typography.heading,
                body: typography.body,
                ui: typography.ui
            },
            fontSize: typography.fontSizeScale || {},
            meta: typography.meta
        },
        radius: {
            sm: `${radius.scale[0] || 4}px`,
            md: `${radius.scale[1] || radius.scale[0] || 8}px`,
            lg: `${radius.scale[2] || radius.scale[1] || 16}px`
        },
        spacing: spacing.scale.reduce((acc, val, i) => {
            acc[i + 1] = `${val}px`;
            return acc;
        }, {}),
        shadow: shadowTokens,
        zIndices: zIndicesTokens,
        gradients: gradients,
        motion: motion.durations.length > 0 ? {
            duration: (() => {
                const d = motion.durations;
                const obj = {};
                if (d[0]) obj.fast = `${Math.round(d[0])}ms`;
                if (d.length > 1) obj.normal = `${Math.round(d[Math.floor(d.length / 2)])}ms`;
                if (d.length > 2) obj.slow = `${Math.round(d[d.length - 1])}ms`;
                return obj;
            })(),
            easing: {
                standard: motion.easings.find(e => e && e.includes('cubic-bezier')) || motion.easings[0] || 'ease',
                in: motion.easings.find(e => e && e.includes('ease-in')) || 'ease-in',
                out: motion.easings.find(e => e && e.includes('ease-out')) || 'ease-out'
            },
            detectedCount: motion.durations.length
        } : null,

        systemTraits,

        // REPLICATION META
        extractionMeta: {
            confidence: (stats?.healthScore || 100) > 80 ? "high" : (stats?.healthScore || 100) > 50 ? "medium" : "low",
            coveragePercentage: Math.min(100, Math.round(((stats?.tokensFound || 0) / 25) * 100)),
            nodesSampled: stats?.nodesSampled || 0
        },
        clusteringMeta: {
            spacing: spacing.meta,
            radius: radius.meta
        }
    };

    const tailwindConfig = {
        theme: {
            extend: {
                colors: {
                    brand: tokens.colors.brand,
                    neutral: tokens.colors.neutral
                },
                fontFamily: {
                    sans: [tokens.typography.fontFamily.body, 'sans-serif'],
                    heading: [tokens.typography.fontFamily.heading, 'sans-serif']
                },
                borderRadius: tokens.radius,
                spacing: tokens.spacing,
                boxShadow: tokens.shadow,
                zIndex: tokens.zIndices,
                transitionDuration: tokens.motion.duration,
                transitionTimingFunction: tokens.motion.easing,
                ...(tokens.gradients.length > 0 && {
                    backgroundImage: {
                        'brand-gradient': tokens.gradients[0]
                    }
                })
            }
        }
    };

    // CSS Variable Generation
    let cssVars = ':root {\n';
    if (tokens.colors.brand) {
        Object.entries(tokens.colors.brand).forEach(([k, v]) => cssVars += `  --color-brand-${k}: ${v};\n`);
    }
    if (tokens.colors.neutral) {
        Object.entries(tokens.colors.neutral).forEach(([k, v]) => cssVars += `  --color-neutral-${k}: ${v};\n`);
    }
    cssVars += `  --font-heading: "${tokens.typography.fontFamily.heading}";\n`;
    cssVars += `  --font-body: "${tokens.typography.fontFamily.body}";\n`;
    Object.entries(tokens.typography.fontSize).forEach(([k, v]) => cssVars += `  --font-size-${k.toLowerCase()}: ${v};\n`);
    Object.entries(tokens.radius).forEach(([k, v]) => cssVars += `  --radius-${k}: ${v};\n`);
    Object.entries(tokens.spacing).forEach(([k, v]) => cssVars += `  --spacing-${k}: ${v};\n`);
    Object.entries(tokens.zIndices).forEach(([k, v]) => cssVars += `  --z-${k}: ${v};\n`);
    Object.entries(tokens.shadow).forEach(([k, v]) => cssVars += `  --shadow-${k}: ${v};\n`);
    Object.entries(tokens.motion.duration).forEach(([k, v]) => cssVars += `  --motion-duration-${k}: ${v};\n`);
    Object.entries(tokens.motion.easing).forEach(([k, v]) => cssVars += `  --motion-easing-${k}: ${v};\n`);
    cssVars += '}\n';

    const prompts = generatePrompts(tokens, tailwindConfig);

    return {
        ...tokens,
        exports: {
            css: cssVars,
            tailwind: tailwindConfig,
            json: tokens,
            prompts
        }
    };
}

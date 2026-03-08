import tinycolor from 'tinycolor2';

/**
 * Calculates design system violations across multiple pages compared to a "primary" (canonical) set of tokens.
 */
export function calculateDrift(pagesData, primaryTokens) {
    const violations = [];

    // primaryTokens is the result of the first (root) page analysis
    // pagesData is an array of { url, tokens } for all subsequent pages

    pagesData.forEach(page => {
        const { url, tokens } = page;
        if (!tokens) return;

        // 1. Color Drift Analysis
        const primaryBrand = primaryTokens.colors.brand?.['500'];
        const pageBrand = tokens.colors.brand?.['500'];

        if (primaryBrand && pageBrand && primaryBrand.toLowerCase() !== pageBrand.toLowerCase()) {
            const readable = tinycolor.readability(primaryBrand, pageBrand);
            // If they are very close (readability near 1.0), it's likely a mistake/ghost variant
            if (readable < 1.05) {
                violations.push({
                    id: `drift-clr-${Math.random().toString(36).substr(2, 5)}`,
                    type: 'color',
                    severity: 'medium',
                    description: 'Ghost Color Variant. This sub-page uses a primary hex that is mathematically similar to your brand primary but not an exact match.',
                    expected: primaryBrand,
                    actual: pageBrand,
                    page: url
                });
            } else {
                violations.push({
                    id: `drift-clr-${Math.random().toString(36).substr(2, 5)}`,
                    type: 'color',
                    severity: 'high',
                    description: 'Cross-page Identity Mismatch. A different primary color is being prioritized on this page.',
                    expected: primaryBrand,
                    actual: pageBrand,
                    page: url
                });
            }
        }

        // 2. Typography Drift Analysis
        const primaryHeading = primaryTokens.typography?.fontFamily?.heading;
        const pageHeading = tokens.typography?.fontFamily?.heading;

        if (primaryHeading && pageHeading && primaryHeading !== pageHeading) {
            violations.push({
                id: `drift-font-${Math.random().toString(36).substr(2, 5)}`,
                type: 'typography',
                severity: 'high',
                description: 'Structural Font Drift. Typography hierarchy on this page deviates from the main identity.',
                expected: primaryHeading,
                actual: pageHeading,
                page: url
            });
        }

        // 3. Spacing Rhythm Analysis
        const primarySpacingArr = Object.values(primaryTokens.spacing || {});
        const pageSpacingArr = Object.values(tokens.spacing || {});

        // Check if the sub-page introduced weird spacing units not in the primary list
        const uniqueToPage = pageSpacingArr.filter(s => !primarySpacingArr.includes(s));
        if (uniqueToPage.length > 2) {
            violations.push({
                id: `drift-spc-${Math.random().toString(36).substr(2, 5)}`,
                type: 'spacing',
                severity: 'low',
                description: 'Spatial Cadence Noise. This page introduces 3 or more spacing increments that do not exist in the primary system.',
                expected: primarySpacingArr.slice(0, 3).join(', ') + '...',
                actual: uniqueToPage.slice(0, 3).join(', ') + '...',
                page: url
            });
        }

        // 4. Corner Radius Analysis
        const primaryRad = primaryTokens.radius?.md;
        const pageRad = tokens.radius?.md;

        if (primaryRad && pageRad && primaryRad !== pageRad) {
            violations.push({
                id: `drift-rad-${Math.random().toString(36).substr(2, 5)}`,
                type: 'radius',
                severity: 'medium',
                description: 'Interactive Radius Shift. Components on this page are rounded differently than the primary system (inconsistent affordances).',
                expected: primaryRad,
                actual: pageRad,
                page: url
            });
        }
    });

    return violations;
}

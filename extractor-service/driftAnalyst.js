/**
 * Measures replication drift between original sampled data and reconstructed tokens.
 * High fidelity target: 95%+
 */
export function compareReconstruction(samples, tokens) {
    const report = {
        colorMatch: 0,
        spacingMatch: 0,
        radiusMatch: 0,
        typographyMatch: 0,
        shadowMatch: 0,
        zIndexMatch: 0,
        overall: 0
    };

    // 1. Color Match (Brand + Text)
    const brandColors = [tokens.colors.brand[500].toLowerCase(), tokens.colors.brand[600].toLowerCase()];
    const brandMatches = samples.interactive.filter(s => {
        const hex = s.backgroundColor.toLowerCase();
        return brandColors.includes(hex);
    }).length;
    report.colorMatch = Math.round((brandMatches / (samples.interactive.length || 1)) * 100);

    // 2. Spacing Match
    const spacingTokens = Object.values(tokens.spacing).map(v => parseInt(v));
    const rawSpacing = samples.spacing.map(s => s.value);
    const spacingMatches = rawSpacing.filter(s => spacingTokens.includes(s)).length;
    report.spacingMatch = Math.round((spacingMatches / (rawSpacing.length || 1)) * 100);

    // 3. Radius Match
    const radiusTokens = Object.values(tokens.radius).map(v => parseInt(v));
    const rawRadii = samples.interactive.map(s => parseInt(s.borderRadius)).filter(v => v > 0);
    const radiusMatches = rawRadii.filter(r => radiusTokens.includes(r)).length;
    report.radiusMatch = Math.round((radiusMatches / (rawRadii.length || 1)) * 100);

    // 4. Typography Match (Scale)
    const fontSizeTokens = Object.values(tokens.typography.fontSize).map(v => parseInt(v));
    const rawSizes = samples.text.map(t => parseInt(t.fontSize)).filter(s => s > 0);
    const sizeMatches = rawSizes.filter(s => fontSizeTokens.includes(s)).length;
    report.typographyMatch = Math.round((sizeMatches / (rawSizes.length || 1)) * 100);

    // 5. Shadow Match (Fuzzy blur match)
    const shadowTokens = Object.values(tokens.shadow);
    const shadowMatches = samples.shadows.filter(s => {
        return shadowTokens.some(t => {
            if (typeof t !== 'string') return false;
            const tBlur = parseInt(t.match(/(\d+)px/)?.[1] || 0);
            return Math.abs(tBlur - (s.blur || 0)) <= 2;
        });
    }).length;
    report.shadowMatch = Math.round((shadowMatches / (samples.shadows.length || 1)) * 100);

    // 6. Z-Index Match
    const ziTokens = Object.values(tokens.zIndices);
    const ziMatches = samples.zIndices.filter(z => ziTokens.includes(z.value)).length;
    report.zIndexMatch = Math.round((ziMatches / (samples.zIndices.length || 1)) * 100);

    // Overall drift average
    report.overall = Math.round((report.colorMatch + report.spacingMatch + report.radiusMatch + report.typographyMatch + report.shadowMatch + report.zIndexMatch) / 6);

    return {
        metricPercentages: report,
        driftStatus: report.overall >= 95 ? "TARGET_MET" : (report.overall >= 85 ? "STABLE" : "IMPROVEMENT_NEEDED"),
        hotspots: Object.entries(report).filter(([_, v]) => v < 80).map(([k]) => k)
    };
}

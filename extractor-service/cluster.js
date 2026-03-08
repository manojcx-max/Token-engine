/**
 * Computes the stability weight for a value.
 * weight = (occurrenceCount * 0.6) + (uniqueNodeCount * 0.3) + (1 / domDepthAverage * 0.1)
 */
function computeStabilityWeight(stats) {
    const { occurrenceCount, uniqueNodes, avgDepth } = stats;
    const depthWeight = avgDepth > 0 ? (1 / avgDepth) * 0.1 : 0.1;
    return (occurrenceCount * 0.6) + (uniqueNodes.size * 0.3) + depthWeight;
}

/**
 * Detects the dominant base unit using pairwise differences.
 */
function detectDynamicGrid(values) {
    if (!values || values.length < 5) return { baseUnit: 4, confidence: 0.1 };

    const uniqueSorted = [...new Set(values)].sort((a, b) => a - b);
    const diffs = [];
    for (let i = 0; i < uniqueSorted.length; i++) {
        for (let j = i + 1; j < uniqueSorted.length; j++) {
            const di = uniqueSorted[j] - uniqueSorted[i];
            if (di > 1 && di <= 20) diffs.push(di);
        }
    }

    if (diffs.length === 0) return { baseUnit: 4, confidence: 0.1 };

    const counts = {};
    diffs.forEach(d => counts[d] = (counts[d] || 0) + 1);

    const sortedDiffs = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const dominantDiff = parseInt(sortedDiffs[0][0]);
    const frequency = sortedDiffs[0][1];
    const total = diffs.length;

    // Reliability Check: Must be a common divisor or a clean unit
    const commonBases = [4, 5, 8, 10, 12, 16];
    let baseUnit = dominantDiff;

    // If dominant diff is prime or unusual, find closest common base
    if (!commonBases.includes(dominantDiff)) {
        baseUnit = commonBases.reduce((prev, curr) =>
            Math.abs(curr - dominantDiff) < Math.abs(prev - dominantDiff) ? curr : prev
        );
    }

    return {
        baseUnit,
        confidence: Math.round((frequency / total) * 100) / 100
    };
}

/**
 * Deterministic Clustering with Stability Weighting and Outlier Separation.
 */
export function clusterDeterministic(rawItems, mode = 'spacing', keepers = 8) {
    if (!rawItems || rawItems.length === 0) return { core: [], outliers: [], meta: {} };

    // 1. Uniform Data Access
    const rawValues = rawItems.map(item => (typeof item === 'object' ? (item.value ?? item.val) : item));
    const validValues = rawValues.filter(v => typeof v === 'number' && !isNaN(v) && v > 0);

    // 2. Deterministic Pre-processing
    const sortedValues = [...validValues].sort((a, b) => a - b);

    // 3. Grid Detection (only for spacing)
    let gridInfo = { baseUnit: 1, confidence: 1 };
    if (mode === 'spacing') {
        gridInfo = detectDynamicGrid(validValues);
    } else if (mode === 'radius') {
        gridInfo.baseUnit = 1; // Radius is often 1px granular
    }

    // 4. Grouping with Stability Weighting
    const tolerance = mode === 'motion' ? 10 : (mode === 'radius' ? 1 : 1);
    const statsMap = new Map();

    rawItems.forEach((item, idx) => {
        const val = typeof item === 'object' ? (item.value ?? item.val) : item;
        if (typeof val !== 'number' || isNaN(val) || val <= 0) return;

        // Rounding logic depends on detected base
        const target = mode === 'spacing'
            ? Math.round(val / gridInfo.baseUnit) * gridInfo.baseUnit
            : Math.round(val);

        if (!statsMap.has(target)) {
            statsMap.set(target, { occurrenceCount: 0, uniqueNodes: new Set(), totalDepth: 0 });
        }
        const s = statsMap.get(target);
        s.occurrenceCount++;
        s.uniqueNodes.add(idx); // Use index as proxy for unique node ID from sampler
        s.totalDepth += (item.depth || 10);
    });

    // 5. Compute Weights & Deterministic Sorting
    const clusters = Array.from(statsMap.entries()).map(([val, stats]) => {
        const avgDepth = stats.totalDepth / stats.occurrenceCount;
        const weight = computeStabilityWeight({ ...stats, avgDepth });
        return { val, weight, stats };
    });

    // Sort by weight (desc) then value (asc) for deterministic tie-breaking
    clusters.sort((a, b) => b.weight - a.weight || a.val - b.val);

    if (clusters.length === 0) return { core: [], outliers: [], meta: {} };

    // 6. Core vs Outlier Separation
    const maxWeight = clusters[0].weight;
    const core = [];
    const outliers = [];

    clusters.forEach(c => {
        if (c.weight >= maxWeight * 0.20 || core.length < 3) {
            core.push(c.val);
        } else {
            outliers.push(c.val);
        }
    });

    // 7. Final Deterministic Formatting
    const finalCore = [...new Set(core)].sort((a, b) => a - b).slice(0, keepers);
    const finalOutliers = [...new Set(outliers)].filter(v => !finalCore.includes(v)).sort((a, b) => a - b).slice(0, 10);

    return {
        core: finalCore,
        outliers: finalOutliers,
        meta: {
            detectedBaseUnit: gridInfo.baseUnit,
            gridConfidence: gridInfo.confidence,
            totalValues: rawItems.length,
            dominantValues: finalCore.length,
            outlierValues: finalOutliers.length,
            stabilityMeta: {
                maxWeight: Math.round(maxWeight * 100) / 100,
                clustersFormed: clusters.length
            }
        }
    };
}

export function analyzeMotionRelations(motionSamples) {
    if (!motionSamples || motionSamples.length === 0) return { durations: [], easings: [] };

    // Get unique durations and easings
    const durations = [...new Set(motionSamples.map(m => m.duration))].sort((a, b) => a - b);
    const easings = [...new Set(motionSamples.map(m => m.easing))];

    return {
        durations,
        easings
    };
}

/**
 * Typography Relational Extraction.
 */
export function analyzeTypographyRelations(textSamples) {
    if (!textSamples || textSamples.length < 2) return { scale: [], meta: { scaleRatioAverage: 1 } };

    const sizes = [...new Set(textSamples.map(t => parseInt(t.fontSize)).filter(s => s > 0))].sort((a, b) => a - b);

    const ratios = [];
    for (let i = 1; i < sizes.length; i++) {
        ratios.push(sizes[i] / sizes[i - 1]);
    }

    const avgRatio = ratios.length > 0 ? ratios.reduce((a, b) => a + b, 0) / ratios.length : 1;
    const variance = ratios.length > 0 ?
        ratios.reduce((a, b) => a + Math.pow(b - avgRatio, 2), 0) / ratios.length : 0;

    // Weight distribution
    const weights = {};
    textSamples.forEach(t => weights[t.fontWeight] = (weights[t.fontWeight] || 0) + 1);

    return {
        scale: sizes,
        meta: {
            scaleRatioAverage: Math.round(avgRatio * 100) / 100,
            ratioVariance: Math.round(variance * 1000) / 1000,
            weightDistribution: weights,
            hierarchyConsistency: sizes.length >= 4 ? 1 : 0.5
        }
    };
}

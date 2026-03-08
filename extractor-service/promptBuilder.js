export function generatePrompts(tokens, tailwindConfig) {
    const { colors, typography, radius, spacing, shadow, zIndices, motion, gradients, systemTraits } = tokens;

    const themeObject = {
        colors,
        typography,
        spacing,
        radius,
        shadow,
        zIndices,
        motion,
        gradients: gradients?.slice(0, 2), // Top 2 gradients to keep prompt concise
        systemTraits
    };

    const spacingKeys = Object.keys(spacing || {}).join(', ');
    const fontSizeKeys = Object.keys(typography?.fontSize || {}).join(', ');
    const zIndexKeys = Object.entries(zIndices || {}).map(([k, v]) => `${k}:${v}`).join(', ');
    const motionDurations = Object.entries(motion?.duration || {}).map(([k, v]) => `${k}:${v}`).join(', ');
    const shadowKeys = Object.keys(shadow || {}).join(', ');
    const radiusKeys = Object.entries(radius || {}).map(([k, v]) => `${k}:${v}`).join(', ');
    const topGradient = gradients?.[0] ? `\nBrand Gradient: \`${gradients[0]}\`` : '';

    const replicationContract = `
# 🔷 SYSTEM CONTRACT: REPLICATION MODE
## OBJECTIVE
You are reconstructing a design system EXACTLY as defined below. Your goal is deterministic fidelity, not creative improvement.

## EXTRACTED DESIGN TOKENS
### Colors
- Brand Primary: \`${colors?.brand?.[500] || 'N/A'}\`
- Brand Secondary: \`${colors?.brand?.[600] || 'N/A'}\`
- Text Primary: \`${colors?.text?.primary || 'N/A'}\`
- Neutrals: ${Object.values(colors?.neutral || {}).join(', ')}${topGradient}

### Typography
- Heading Font: \`${typography?.fontFamily?.heading || 'system-ui'}\`
- Body Font: \`${typography?.fontFamily?.body || 'system-ui'}\`
- Size Scale: [${fontSizeKeys}]

### Spacing & Layout
- Spacing Scale: [${spacingKeys}]
- Radius: [${radiusKeys}]

### Elevation & Depth
- Shadows: [${shadowKeys}]
- Layer Stacking (Z-Index): ${zIndexKeys ? `[${zIndexKeys}]` : 'Standard default (base:0, overlay:10, modal:100)'}

### Motion
- Durations: [${motionDurations}]
- Standard Easing: \`${motion?.easing?.standard || 'ease'}\`

## STRICT RULES
1. **No Invention**: Do not introduce hex codes, spacing increments, colors, or radii not explicitly present in the theme.
2. **Value Substitution**: If a required style is not present, reuse the *closest defined token*. Do not guess or fallback to browser defaults.
3. **No Arbitrary Values**: NEVER use \`w-[34px]\` or \`bg-[#1a1a1a]\`. Every property must map to a named variable/utility.
4. **Deterministic Scaling**: 
   - All layout rhythm must follow the spacing scale: [${spacingKeys}].
   - All typography must follow the size scale: [${fontSizeKeys}].
   - All transitions must use the motion scale: [${motionDurations}].
5. **Trait Alignment**: ${JSON.stringify(systemTraits)}.

## VALIDATION BEFORE OUTPUT
- [ ] No raw hex values?
- [ ] No arbitrary px values?
- [ ] All spacing maps to defined scale?
- [ ] All typography matches defined scale?
- [ ] All transitions use the motion token?
- [ ] No fallback browser defaults used?
`;

    // 1. UNIVERSAL IMPLEMENTATION
    const universal = `# 🔷 UNIVERSAL FIDELITY PROMPT
${replicationContract}
## FULL THEME DATA
\`\`\`ts
const designSystem = ${JSON.stringify(themeObject, null, 2)}
\`\`\`
## EXECUTION
Implement the requested UI component using raw CSS Variables (\`var(--spacing-X)\`) or this TypeScript theme object. Reference all tokens by name, never by raw value.`;

    // 2. V0 IMPLEMENTATION
    const v0 = `# 🔷 V0 DETERMINISTIC PROMPT
${replicationContract}
## TAILWIND CONFIG
\`\`\`json
${JSON.stringify(tailwindConfig, null, 2)}
\`\`\`
## EXECUTION
Build high-fidelity components optimized for v0.dev. Use only the utility classes defined in this Tailwind configuration. For motion, use \`duration-[fast]\`, \`duration-[normal]\` and \`ease-[standard]\`. Ensure 1:1 visual parity with the reference design system.`;

    // 3. CLAUDE IMPLEMENTATION
    const claude = `# 🔷 CLAUDE STRUCTURAL PROMPT
${replicationContract}
## DESIGN SYSTEM
\`\`\`json
${JSON.stringify(themeObject, null, 2)}
\`\`\`
## EXECUTION
Build modular, clean React components. Use absolute token fidelity for all padding, margins, colors, and shadows. Implement all hover states using the \`motion.duration.fast\` (${motion?.duration?.fast || '150ms'}) and \`motion.easing.standard\` curve. Maintain the ${systemTraits?.typographyDensity} typography rhythm detected.`;

    // 4. ANTIGRAVITY IMPLEMENTATION
    const antigravity = `# 🔷 ANTIGRAVITY AGENTIC CONTRACT
${replicationContract}
## SYSTEM PAYLOAD
${JSON.stringify(themeObject)}

## EXECUTION
Generate code optimized for agentic execution. Focus on deterministic logic and property mapping. For every style property applied, assert its token source. No hallucinations allowed. Validate all values against the token manifest before emitting code.`;

    return {
        universal,
        v0,
        claude,
        antigravity
    };
}

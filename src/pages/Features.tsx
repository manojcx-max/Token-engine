import { Layout, Palette, Type, Code, Sparkles, Database, Scan, Cpu, Layers } from 'lucide-react';

export default function Features() {

    const FeatureCard = ({ icon: Icon, title, content, meta }: any) => (
        <section style={{
            padding: '48px 56px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            position: 'relative',
            overflow: 'hidden',
        }} className="hover-lift">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-default)', paddingBottom: '24px' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-app)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-default)'
                }}>
                    <Icon size={24} />
                </div>
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{title}</h2>
                    <span style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{meta}</span>
                </div>
            </div>

            <div style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {content}
            </div>
        </section>
    );

    return (
        <main style={{ padding: '80px 24px 120px 24px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }} className="animate-in">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '100px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px' }}>
                    <Database size={14} /> Engine Architecture
                </div>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--text-primary)', margin: '0 0 24px 0', lineHeight: 1.1 }}>
                    Features.
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                    A structured technical breakdown of the heuristics and algorithms powering the TokenEngine v3 Headless Extractor.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }} className="animate-in delay-2">

                <FeatureCard
                    icon={Palette}
                    title="Color Intelligence Subsystem"
                    meta="MOD: CLR_INT_V3 | ALGO: HSL_SCORE"
                    content={
                        <>
                            <p>
                                The engine samples rendered elements directly from the DOM using a headless browser context. Instead of just scraping raw CSS values, which are often bloated with dead code, TokenEngine captures computed styles directly from interactive states (buttons, links) and structural containers.
                            </p>
                            <p>
                                We utilize <code>tinycolor2</code> to transition raw RGB/RGBA vectors into normalized HSL arrays. From there, a proprietary scoring heuristic isolates the true "Brand Primary" by evaluating spatial usage, interaction density, and perceptual saturation levels, discarding grayscales or anomalous extremes. Finally, the system algorithms geometrically generate a 50-900 color scale to construct a complete usable Tailwind map.
                            </p>
                        </>
                    }
                />

                <FeatureCard
                    icon={Type}
                    title="Typographic Extractor"
                    meta="MOD: TYPO_PARSE | ALGO: DOM_HIERARCHY"
                    content={
                        <>
                            <p>
                                Standard web scraping tools fail to differentiate between core typography and one-off stylistic choices. TokenEngine strictly interrogates standard semantic hierarchical tags (<code>H1-H6</code>) against standard body elements (<code>p, span</code>).
                            </p>
                            <p>
                                By counting occurrences across the DOM Tree and prioritizing elements that hold structural weight, the engine contextually isolates the primary "Heading", "Body", and "UI" font families. It dynamically strips fallback arrays like <code>sans-serif</code> during JSON serialization to ensure your new configuration uses only the explicit target families.
                            </p>
                        </>
                    }
                />

                <FeatureCard
                    icon={Layout}
                    title="Geometrical Clustering"
                    meta="MOD: RAD_SPC | ALGO: NORMALIZE_TENSOR"
                    content={
                        <>
                            <p>
                                Layout and structural measurements (`padding`, `margin`, `gap`, `border-radius`) are quantified globally to map the target domain's baseline spatial cadence. Rather than generating 50 random spacing values based on arbitrary design choices, the values are clustered and mathematically normalized.
                            </p>
                            <div className="bg-surface rounded-md p-4 overflow-auto text-sm font-mono mt-2" style={{ backgroundColor: 'var(--bg-app)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
                                {`// Spatial normalization rounds arbitrary values into cohesive arrays\nconst normalizeSpace = (val, roundingGrid = 4) => {\n    return Math.round(val / roundingGrid) * roundingGrid;\n}`}
                            </div>
                        </>
                    }
                />

                <FeatureCard
                    icon={Cpu}
                    title="Headless Puppeteer Context"
                    meta="MOD: ENGINE_CORE | ALGO: CHROMIUM_BIDI"
                    content={
                        <>
                            <p>
                                Modern SaaS architectures are built on CSR (Client-Side Rendering) or dynamic hydration (Next.js/Nuxt). Simply parsing HTML tags natively fails on 90% of targets. TokenEngine utilizes Puppeteer alongside Stealth modules.
                            </p>
                            <p>
                                The engine launches a complete Chromium wrapper, waits for <code>networkidle2</code>, and force-injects CSS AST (Abstract Syntax Tree) payloads that disable <code>transitions</code> and <code>animations</code>. This ensures calculated layout metrics are locked at a rest state, yielding exactly reproducible coordinate parameters without layout shift interference.
                            </p>
                        </>
                    }
                />

                <FeatureCard
                    icon={Sparkles}
                    title="Design Evolution (Remix Core)"
                    meta="MOD: OVERRIDE_STATE | ALGO: THEMATIC_SWAP"
                    content={
                        <>
                            <p>
                                Extracting tokens is only part of the pipeline. The Design Evolution engine maps extracted structural constraints (padding, gaps, layout flows) and mathematically overlaps them with curated, professional SaaS themes.
                            </p>
                            <p>
                                By overriding root color hexes, typography stacks, and scaling logic on the fly within an isolated iframe-like context, you instantly prototype entirely different branding identities without editing a single line of your target's CSS.
                            </p>
                        </>
                    }
                />

                <FeatureCard
                    icon={Layers}
                    title="W3C Figma JSON Translation"
                    meta="MOD: AST_EXPORT | ALGO: FIGMA_BRIDGE"
                    content={
                        <>
                            <p>
                                While Tailwind is the primary driver for AI, designers need visual access. TokenEngine translates the extracted geometry and color nodes directly into the official <strong>W3C Design Tokens</strong> JSON schema.
                            </p>
                            <p>
                                This strict format can be directly ingested by tools like Figma Tokens Studio. It prevents mapping loss by correctly assigning <code>$value</code> and <code>$type</code> attributes (e.g. <code>color</code> vs <code>dimension</code>) to automatically construct complex variable scopes in Figma.
                            </p>
                        </>
                    }
                />

            </div>
        </main>
    );
}

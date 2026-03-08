import { BookOpen, Braces, Terminal, Zap } from 'lucide-react';

export default function Docs() {

    const DocCard = ({ icon: Icon, title, content }: any) => (
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
                    <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0' }}>{title}</h2>
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
                    <BookOpen size={14} /> Documentation
                </div>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--text-primary)', margin: '0 0 24px 0', lineHeight: 1.1 }}>
                    Reference.
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                    Technical documentation covering the TokenEngine API extraction JSON formats and endpoints.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }} className="animate-in delay-2">

                <DocCard
                    icon={Terminal}
                    title="API Endpoint Configuration"
                    content={
                        <>
                            <p>
                                The TokenEngine extractor service is designed to run asynchronously alongside your front-end. It spins up an independent Express server that bridges standard HTTP protocols into our internal Headless Chromium orchestration pipeline.
                            </p>
                            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '8px' }}>POST /api/extract</p>
                            <div className="bg-surface rounded-md p-4 overflow-auto text-sm font-mono" style={{ backgroundColor: 'var(--bg-app)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
                                {`// Request Body Structure\n{\n    "url": "https://stripe.com"\n}`}
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0 0', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
                                <li><strong>Validations:</strong> Cannot access localhost or 192.168.0.0 local IP addresses for security.</li>
                                <li><strong>Rate Limit:</strong> Dependent on the cluster availability. Base API allows concurrent 2 requests.</li>
                            </ul>
                        </>
                    }
                />

                <DocCard
                    icon={Braces}
                    title="JSON Export Representation"
                    content={
                        <>
                            <p>
                                The output of the endpoint is a perfectly formatted, deterministic JSON structure that ensures frontend engineers and AI build bots do not have to guess which design variables correlate to their components.
                            </p>
                            <div className="bg-surface rounded-md p-4 overflow-auto text-sm font-mono mt-2" style={{ backgroundColor: 'var(--bg-app)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
                                {`interface TokenExtraction {\n    colors: {\n        brand: {\n            50: string; // Hexadecimal\n            /* ... */\n            900: string;\n        };\n        neutral: { ... };\n        text: { primary: string; secondary: string; };\n        background: { primary: string; surface: string; };\n    };\n    typography: {\n        fontFamily: { heading: string; body: string; ui: string; };\n    };\n    radius: { sm: string; md: string; lg: string; };\n    spacing: Record<number, string>; // Maps base intervals\n    exports: { css: string; tailwind: string; prompts: Record<string, string>; };\n}`}
                            </div>
                        </>
                    }
                />

                <DocCard
                    icon={Zap}
                    title="Engine Subroutine Execution Array"
                    content={
                        <>
                            <p>
                                Every request sent to the API executes through specific subroutines. Understanding the timing of these subroutines allows you to utilize the engine correctly. The extraction runs 8 unique processing cycles covering 500 nodes per cycle limit.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginTop: '16px' }}>
                                <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-default)', borderRadius: '12px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>1. Chromium Stealth Orchestration</span>
                                    <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>Bypasses 403 Forbidden screens and WAFs using puppeteer-extra-plugin-stealth.</p>
                                </div>
                                <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-default)', borderRadius: '12px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>2. NetworkIdle2 Await Cycle</span>
                                    <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>Blocks token extraction until internal framework hydration finishes (e.g. Next.js payload injections). Times out cleanly at 12 seconds.</p>
                                </div>
                                <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-default)', borderRadius: '12px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>3. Animation Injection Suppression</span>
                                    <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>Forces absolute calculation resting states via <code>transition: none !important</code> AST injections to stop hover/load shifts during sampling.</p>
                                </div>
                            </div>
                        </>
                    }
                />

            </div>
        </main>
    );
}

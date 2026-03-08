import React, { useState } from 'react';
import { ArrowRight, Palette, Type, Box, Code2, FileJson, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Hardcoded Stripe.com extraction data ---
const STRIPE_DEMO = {
    domain: 'stripe.com',
    colors: {
        brand: [
            { name: 'Brand Primary', hex: '#635BFF' },
            { name: 'Brand Dark', hex: '#4B44CC' },
            { name: 'Accent Cyan', hex: '#00D4FF' },
        ],
        neutral: [
            { name: 'Surface', hex: '#F6F9FC' },
            { name: 'Border', hex: '#E3E8EE' },
            { name: 'Text Primary', hex: '#0A2540' },
            { name: 'Text Secondary', hex: '#425466' },
        ]
    },
    typography: {
        heading: 'Sohne',
        body: '-apple-system, BlinkMacSystemFont',
        sizes: ['13px', '15px', '18px', '24px', '32px', '48px', '64px'],
        weights: ['400', '500', '600', '700'],
    },
    spacing: ['4px', '8px', '12px', '16px', '24px', '32px', '48px', '64px', '96px'],
    radius: { sm: '4px', md: '8px', lg: '20px', full: '100px' },
    css: `:root {
  --color-brand-500: #635BFF;
  --color-brand-600: #4B44CC;
  --color-accent: #00D4FF;
  --font-heading: 'Sohne', system-ui, sans-serif;
  --font-body: -apple-system, BlinkMacSystemFont, sans-serif;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 20px;
  --spacing-base: 8px;
}`
};

function ContrastBadge({ hex, bg }: { hex: string; bg: string }) {
    // Simple luminance check
    const hexToRgb = (h: string) => {
        const r = parseInt(h.slice(1, 3), 16) / 255;
        const g = parseInt(h.slice(3, 5), 16) / 255;
        const b = parseInt(h.slice(5, 7), 16) / 255;
        return [r, g, b].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    };
    const lum = (rgb: number[]) => 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    const ratio = (a: string, b: string) => {
        const la = lum(hexToRgb(a)), lb = lum(hexToRgb(b));
        return ((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)).toFixed(1);
    };
    const r = parseFloat(ratio(hex, bg));
    const pass = r >= 4.5;
    return (
        <span style={{
            fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
            backgroundColor: pass ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)',
            color: pass ? '#10b981' : '#ef4444',
            border: `1px solid ${pass ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.2)'}`,
            letterSpacing: '0.04em'
        }}>
            {r}:1 {pass ? 'AA ✓' : 'Fail'}
        </span>
    );
}

const TABS = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'type', label: 'Typography', icon: Type },
    { id: 'spacing', label: 'Spacing', icon: Box },
    { id: 'code', label: 'CSS Output', icon: Code2 },
];

export function LiveDemo() {
    const [activeTab, setActiveTab] = useState('colors');
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    const handleCopy = () => {
        navigator.clipboard.writeText(STRIPE_DEMO.css);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section style={{
            padding: '80px 0 40px 0',
            maxWidth: '1200px',
            margin: '0 auto',
        }}>
            {/* Section header */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '5px 14px', borderRadius: '100px',
                    backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                    fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)',
                    marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.1em'
                }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
                    Live Preview — stripe.com
                </div>
                <h2 style={{
                    fontSize: '2.25rem', fontWeight: 600, letterSpacing: '-0.03em',
                    color: 'var(--text-primary)', margin: '0 0 16px 0'
                }}>
                    Here's what you get — instantly.
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', margin: 0 }}>
                    Real extraction result from Stripe's production website. Every token, one click.
                </p>
            </div>

            {/* Demo Card */}
            <div style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
            }}>
                {/* Window chrome */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 24px', borderBottom: '1px solid var(--border-default)',
                    backgroundColor: 'var(--bg-app)'
                }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                        <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                        <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                    </div>
                    <div style={{
                        fontSize: '12px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        <span style={{ color: '#10b981' }}>✓</span> stripe.com — 94 tokens extracted
                    </div>
                    <div style={{ width: '60px' }} />
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex', borderBottom: '1px solid var(--border-default)',
                    backgroundColor: 'var(--bg-app)', padding: '0 8px'
                }}>
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '7px',
                                padding: '14px 20px', background: 'none', border: 'none',
                                borderBottom: activeTab === id ? '2px solid var(--text-primary)' : '2px solid transparent',
                                color: activeTab === id ? 'var(--text-primary)' : 'var(--text-secondary)',
                                fontWeight: activeTab === id ? 700 : 500,
                                fontSize: '13px', cursor: 'pointer',
                                transition: 'all 0.2s ease', borderRadius: 0,
                                marginBottom: '-1px'
                            }}
                        >
                            <Icon size={14} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div style={{ padding: '32px', minHeight: '320px' }}>

                    {activeTab === 'colors' && (
                        <div>
                            <div style={{ marginBottom: '24px', fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                                Brand Palette
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                                {[...STRIPE_DEMO.colors.brand, ...STRIPE_DEMO.colors.neutral].map((c, i) => (
                                    <div key={i} style={{
                                        backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-default)',
                                        borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px'
                                    }}>
                                        <div style={{
                                            height: '72px', backgroundColor: c.hex, borderRadius: '10px',
                                            border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'flex-end', padding: '8px'
                                        }}>
                                            <span style={{
                                                fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)',
                                                backgroundColor: 'rgba(0,0,0,0.35)', color: '#fff',
                                                padding: '3px 7px', borderRadius: '4px'
                                            }}>{c.hex.toUpperCase()}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</span>
                                            <ContrastBadge hex={c.hex} bg="#ffffff" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'type' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '16px' }}>
                                    Extracted Typefaces
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-default)', borderRadius: '14px', padding: '20px' }}>
                                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Heading</div>
                                        <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{STRIPE_DEMO.typography.heading}</div>
                                    </div>
                                    <div style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-default)', borderRadius: '14px', padding: '20px' }}>
                                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Body</div>
                                        <div style={{ fontSize: '15px', fontWeight: 400, color: 'var(--text-primary)' }}>{STRIPE_DEMO.typography.body}</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '16px' }}>
                                    Type Scale
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {[
                                        { label: 'Display', size: '64px', sample: 'The fastest way to build payments.' },
                                        { label: 'H1', size: '48px', sample: 'Revenue growth at scale' },
                                        { label: 'H2', size: '32px', sample: 'Developer friendly from day one' },
                                        { label: 'H3', size: '24px', sample: 'Everything you need to launch' },
                                        { label: 'Body Lg', size: '18px', sample: 'Millions of businesses trust Stripe.' },
                                        { label: 'Body', size: '15px', sample: 'Stripe is a payments infrastructure company.' },
                                        { label: 'Caption', size: '13px', sample: 'Read the documentation — stripe.com/docs' },
                                    ].map(({ label, size, sample }) => (
                                        <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: '16px', padding: '10px 0', borderBottom: '1px solid var(--border-default)' }}>
                                            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', width: '80px', flexShrink: 0 }}>{size} / {label}</div>
                                            <div style={{ fontSize: size, color: 'var(--text-primary)', lineHeight: 1.2, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', minWidth: 0 }}>{sample}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'spacing' && (
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '24px' }}>
                                Spatial System — 4pt Grid
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {STRIPE_DEMO.spacing.map((s, i) => {
                                    const px = parseInt(s);
                                    return (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '64px', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textAlign: 'right' }}>{s}</div>
                                            <div style={{ flex: 1, height: '28px', display: 'flex', alignItems: 'center' }}>
                                                <div style={{
                                                    width: `${Math.min(px * 3.5, 600)}px`, height: '22px',
                                                    backgroundColor: `hsl(${245 + i * 8}, 70%, ${50 + i * 3}%)`,
                                                    borderRadius: '6px', opacity: 0.85,
                                                    transition: 'width 0.5s ease'
                                                }} />
                                            </div>
                                            <div style={{ width: '80px', fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                                                --space-{px}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div style={{ marginTop: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, width: '100%' }}>Border Radius</div>
                                {Object.entries(STRIPE_DEMO.radius).map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            width: '56px', height: '56px',
                                            border: '2px solid var(--border-hover)',
                                            borderRadius: v, backgroundColor: 'var(--bg-app)'
                                        }} />
                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
                                            {k}<br /><span style={{ color: 'var(--text-primary)' }}>{v}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'code' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                                    CSS Variables — Ready to ship
                                </div>
                                <button
                                    onClick={handleCopy}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-default)',
                                        backgroundColor: 'var(--bg-app)', color: 'var(--text-secondary)',
                                        fontSize: '12px', cursor: 'pointer', fontWeight: 600
                                    }}
                                >
                                    {copied ? <><Check size={13} style={{ color: '#10b981' }} /> Copied!</> : <><Code2 size={13} /> Copy CSS</>}
                                </button>
                            </div>
                            <div style={{
                                backgroundColor: '#0a0a0a', borderRadius: '16px',
                                padding: '28px', border: '1px solid #222',
                                fontFamily: 'var(--font-mono)', fontSize: '13px',
                                lineHeight: 1.8, color: '#aaa', overflow: 'auto'
                            }}>
                                <pre style={{ margin: 0 }}>
                                    {STRIPE_DEMO.css.split('\n').map((line, i) => {
                                        const isComment = line.trim().startsWith('/*');
                                        const isProperty = line.includes(':') && !line.includes('{');
                                        const isSelector = line.includes('{') || line.includes('}');
                                        return (
                                            <div key={i} style={{
                                                color: isComment ? '#555' : isProperty ? '#aaa' : isSelector ? '#ddd' : 'inherit'
                                            }}>
                                                {line.replace(/--[\w-]+/g, (match) => `\u001b[35m${match}\u001b[0m`).split(/(#[0-9a-fA-F]{3,6}|'[^']+')/).map((seg, j) =>
                                                    /^#[0-9a-fA-F]/.test(seg) ? <span key={j} style={{ color: '#98c379' }}>{seg}</span> :
                                                        /^'/.test(seg) ? <span key={j} style={{ color: '#e5c07b' }}>{seg}</span> :
                                                            /^--/.test(seg) ? <span key={j} style={{ color: '#61afef' }}>{seg}</span> :
                                                                <span key={j}>{seg}</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>

                {/* CTA footer */}
                <div style={{
                    borderTop: '1px solid var(--border-default)',
                    padding: '20px 32px',
                    backgroundColor: 'var(--bg-app)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FileJson size={16} style={{ color: 'var(--text-tertiary)' }} />
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            Also exports: <strong style={{ color: 'var(--text-primary)' }}>tailwind.config.js</strong>, <strong style={{ color: 'var(--text-primary)' }}>figma-tokens.json</strong>, <strong style={{ color: 'var(--text-primary)' }}>AI Prompts</strong>
                        </span>
                    </div>
                    <button
                        className="primary hover-lift"
                        onClick={() => {
                            const el = document.getElementById('analyzer');
                            el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        style={{
                            height: '40px', padding: '0 24px', borderRadius: '10px',
                            fontWeight: 700, fontSize: '14px', border: 'none',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        Try with your URL <ArrowRight size={15} />
                    </button>
                </div>
            </div>
        </section>
    );
}

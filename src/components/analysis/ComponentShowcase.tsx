import { Tokens } from '../../types/tokens';
import { Card } from '../Card';
import { MousePointer2, Layout as LayoutIcon, CreditCard, Sparkles } from 'lucide-react';

export function ComponentShowcase({ tokens }: { tokens: Tokens }) {
    return (
        <Card title="Live Evolution Preview" icon={<LayoutIcon size={18} />} fullWidth>
            <div style={{ backgroundColor: 'var(--bg-app)', borderRadius: '24px', padding: '64px 32px', border: '1px solid var(--border-default)', overflow: 'hidden' }}>

                {/* 1. SaaS Hero Section */}
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '4px 12px',
                        borderRadius: '100px',
                        backgroundColor: 'var(--accent-ghost)',
                        color: 'var(--color-brand-500)',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: '1px solid var(--color-brand-500)',
                        marginBottom: '24px'
                    }}>
                        <Sparkles size={12} /> Live: Designing in Real-Time
                    </div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 24px 0', lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
                        Build your <span style={{ color: 'var(--color-brand-500)' }}>Digital Identity</span> instantly.
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 40px auto', fontFamily: 'var(--font-sans)' }}>
                        Precision-engineered tokens, production-ready exports. Extract the soul of any design system and evolve it with AI.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button className="primary hover-lift" style={{ borderRadius: 'var(--radius-md)', padding: '16px 32px', height: 'auto', fontSize: '16px' }}>
                            Start Evolution
                        </button>
                        <button className="secondary hover-lift" style={{ borderRadius: 'var(--radius-md)', padding: '16px 32px', height: 'auto', fontSize: '16px', backgroundColor: 'var(--bg-primary)' }}>
                            View Examples
                        </button>
                    </div>
                </div>

                {/* 2. Feature Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '80px' }}>
                    {[
                        { title: 'Neural Extraction', desc: 'Deep-learning styling extraction for production apps.' },
                        { title: 'Remix Engine', desc: 'Instant architectural transformation into professional vibes.' },
                        { title: 'Atomic Tokens', desc: 'W3C compliant design tokens for Tailwind and Figma.' }
                    ].map((f, i) => (
                        <div key={i} className="card-v2" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--color-brand-500)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                <MousePointer2 size={18} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', fontFamily: 'var(--font-heading)' }}>{f.title}</h3>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, fontFamily: 'var(--font-sans)' }}>{f.desc}</p>
                        </div>
                    ))}
                </div>

                {/* 3. Pricing Card Mini */}
                <div style={{ maxWidth: '400px', margin: '0 auto', padding: '40px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-primary)', border: '2px solid var(--color-brand-500)', boxShadow: 'var(--shadow-xl)', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-brand-500)', textTransform: 'uppercase', marginBottom: '8px' }}>Pro Transformation</div>
                    <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>$49<span style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>/mo</span></div>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px', fontFamily: 'var(--font-sans)' }}>Unlimited extractions and custom design evolution tokens.</p>
                    <button className="primary" style={{ width: '100%', borderRadius: 'var(--radius-md)', justifyContent: 'center' }}>
                        <CreditCard size={18} /> Purchase Access
                    </button>
                </div>
            </div>
        </Card>
    );
}

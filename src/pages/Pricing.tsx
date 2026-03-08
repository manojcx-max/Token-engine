import React, { useState } from 'react';
import { Check, Sparkles, Terminal, Zap, ArrowRight, Stars } from 'lucide-react';
import { PreMonetization, PricingSurveyGrid } from '../components/PreMonetization';
import { submitSurvey } from '../utils/analytics';
import { WaitlistModal } from '../components/WaitlistModal';

export default function Pricing() {
    const [selectedTier, setSelectedTier] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleTierSelect = (tier: string) => {
        setSelectedTier(tier);
        submitSurvey(tier);
    };

    return (
        <main style={{ padding: '80px 24px 120px 24px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }} className="animate-in">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '100px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px' }}>
                    <Sparkles size={14} /> Open Beta
                </div>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--text-primary)', margin: '0 0 24px 0', lineHeight: 1.1 }}>
                    Deterministic extraction.<br />Free for early builders.
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                    TokenEngine is currently in its public validation phase. <br />
                    All core features are 100% free while we reach our 95% fidelity goal.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 450px))', gap: '24px', marginBottom: '80px', justifyContent: 'center' }}>
                {/* Free Plan */}
                <div style={{ padding: '48px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }}>
                            <Terminal size={20} />
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Community Beta</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '8px 0 0 0' }}>Perfect for individual AI builders.</p>
                    </div>

                    <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text-primary)' }}>$0</div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                        {["Unlimited Extractions", "Tailwind Config Export", "Waitlist for Pro Tiers", "95% Fidelity Engine", "AI Prompt Generation"].map((f, i) => (
                            <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                <Check size={14} style={{ color: '#10b981' }} /> {f}
                            </li>
                        ))}
                    </ul>

                    <button className="secondary" style={{ width: '100%', height: '48px', borderRadius: '12px', fontWeight: 600 }}>Get Started Now</button>
                </div>

                {/* Pro Feature Teaser */}
                <div style={{ padding: '48px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--text-primary)', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'var(--text-primary)', color: 'var(--bg-app)', padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 800 }}>COMING SOON</div>

                    <div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--bg-app)' }}>
                            <Zap size={20} />
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Pro Engine</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '8px 0 0 0' }}>Advanced structural intelligence.</p>
                    </div>

                    <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, marginBottom: '16px', textTransform: 'uppercase' }}>Reasonable monthly price?</p>
                        <PricingSurveyGrid selectedTier={selectedTier} onSelect={handleTierSelect} />
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                        {["SVG & Canvas Parsing", "Multiple Viewport Analysis", "Figma Variable Sync", "Private Stacking Context", "Team Collaborations"].map((f, i) => (
                            <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                <Stars size={14} style={{ color: 'var(--text-primary)' }} /> {f}
                            </li>
                        ))}
                    </ul>

                    <button className="primary" onClick={() => setShowModal(true)} style={{ width: '100%', height: '48px', borderRadius: '12px', fontWeight: 600 }}>Join Priority Waitlist</button>
                </div>
            </div>

            <WaitlistModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </main>
    );
}

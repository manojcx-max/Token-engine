import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { submitSurvey, trackEvent } from '../utils/analytics';
import { WaitlistModal } from './WaitlistModal';

export const PRICING_TIERS = [
    "$9/mo",
    "$19/mo",
    "$29/mo",
    "$49+/mo",
    "I wouldn’t pay 🫠"
];

export function PricingSurveyGrid({ selectedTier, onSelect }: { selectedTier: string | null, onSelect: (tier: string) => void }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            {PRICING_TIERS.map((tier) => (
                <button
                    key={tier}
                    onClick={() => onSelect(tier)}
                    style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: selectedTier === tier ? 'var(--text-primary)' : 'var(--border-default)',
                        backgroundColor: selectedTier === tier ? 'var(--bg-primary)' : 'transparent',
                        color: selectedTier === tier ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                    }}
                >
                    {selectedTier === tier && <Check size={14} />}
                    {tier}
                </button>
            ))}
        </div>
    );
}

export function PreMonetization() {
    const [selectedTier, setSelectedTier] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleTierSelect = (tier: string) => {
        setSelectedTier(tier);
        submitSurvey(tier);
    };

    return (
        <section id="pre-monetization-section" style={{
            marginTop: '64px',
            padding: '48px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: '24px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, var(--text-primary), transparent)' }} />

            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '100px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-default)', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>
                    <Sparkles size={12} /> Beta Roadmap
                </div>

                <h2 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '-0.03em' }}>
                    The Future of TokenEngine.
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: '40px', lineHeight: 1.6 }}>
                    TokenEngine is currently in free validation phase. <br />
                    We're building the <b>Vanguard UX Robot</b> for deep technical audits.
                </p>

                <div style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-default)', borderRadius: '20px', padding: '32px', textAlign: 'left', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px' }}>
                        If our "Design Evolution" system was available today, what would it be worth to your team?
                    </h3>

                    <PricingSurveyGrid selectedTier={selectedTier} onSelect={handleTierSelect} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <button
                        className="primary hover-lift"
                        onClick={() => {
                            if (!selectedTier) return;
                            trackEvent('interested_click');
                            setShowModal(true);
                        }}
                        disabled={!selectedTier}
                        style={{
                            padding: '16px 32px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            opacity: selectedTier ? 1 : 0.4,
                            cursor: selectedTier ? 'pointer' : 'not-allowed',
                            filter: selectedTier ? 'none' : 'grayscale(1)'
                        }}
                    >
                        {selectedTier ? "I'm Interested" : "Select a Plan to Continue"} <ArrowRight size={18} />
                    </button>
                    {!selectedTier && (
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', marginTop: '8px' }}>
                            Selection is required to help us validate market fit.
                        </p>
                    )}
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', marginTop: selectedTier ? '16px' : '4px' }}>
                        Early interest supporters receive priority lifetime access.
                    </p>
                </div>
            </div>

            <WaitlistModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </section>
    );
}

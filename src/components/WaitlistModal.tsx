import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Send, Check, X, Loader2 } from 'lucide-react';
import { joinWaitlist } from '../utils/analytics';

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [price, setPrice] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isJoined, setIsJoined] = useState(false);

    const handleJoinWaitlist = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !name || !price) {
            alert("All fields including pricing preference are mandatory.");
            return;
        }

        setIsSubmitting(true);
        // We sync the price with the survey API first, then join waitlist
        const success = await joinWaitlist(email, name, role, price);
        if (success) {
            setIsJoined(true);
            setTimeout(() => {
                onClose();
                setTimeout(() => {
                    setIsJoined(false);
                    setName('');
                    setEmail('');
                    setRole('');
                    setPrice('');
                }, 500);
            }, 2000);
        }
        setIsSubmitting(false);
    };

    if (!isOpen) return null;

    const PRICING_OPTIONS = ["$9/mo", "$19/mo", "$29/mo", "$49+/mo", "I wouldn't pay"];

    return createPortal(
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(12px)',
            padding: '24px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '520px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '8px' }}
                >
                    <X size={20} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: 'var(--text-primary)' }}>
                        <Send size={24} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Interested?</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Help us build the right tools. We'll reach out when we're ready.</p>
                </div>

                {isJoined ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ padding: '32px', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: '24px', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '24px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 20px auto' }}>
                                <Check size={24} />
                            </div>
                            <h3 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Greatly Appreciated!</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '0' }}>
                                Your interest helps us build the right tools. We'll be in touch as soon as the advanced intelligence layer is ready.
                            </p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleJoinWaitlist} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Manoj"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{ width: '100%', height: '48px', borderRadius: '12px', border: '1px solid var(--border-default)', backgroundColor: 'var(--bg-app)', padding: '0 16px', color: 'var(--text-primary)', outline: 'none' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Work Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ width: '100%', height: '48px', borderRadius: '12px', border: '1px solid var(--border-default)', backgroundColor: 'var(--bg-app)', padding: '0 16px', color: 'var(--text-primary)', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>Expected Monthly Price (Mandatory)</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                {PRICING_OPTIONS.map((opt) => (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => setPrice(opt)}
                                        style={{
                                            padding: '8px 4px',
                                            borderRadius: '8px',
                                            border: '1px solid',
                                            borderColor: price === opt ? 'var(--text-primary)' : 'var(--border-default)',
                                            backgroundColor: price === opt ? 'var(--bg-primary)' : 'transparent',
                                            color: 'var(--text-primary)',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Primary Use Case</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                style={{ width: '100%', height: '48px', borderRadius: '12px', border: '1px solid var(--border-default)', backgroundColor: 'var(--bg-app)', padding: '0 16px', color: 'var(--text-primary)', outline: 'none', appearance: 'none' }}
                            >
                                <option value="">Select your need...</option>
                                <option value="Design Audit">Professional Design Audit</option>
                                <option value="Token Export">Design System Extraction</option>
                                <option value="AI Integration">AI Agent Integration</option>
                                <option value="Corporate Branding">Global Brand Consistency</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <button
                            className="primary"
                            type="submit"
                            disabled={isSubmitting}
                            style={{ height: '52px', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }}
                        >
                            {isSubmitting ? <Loader2 className="spin" size={20} /> : 'I am Interested'}
                        </button>
                    </form>
                )}
            </div>
        </div>,
        document.body
    );
}

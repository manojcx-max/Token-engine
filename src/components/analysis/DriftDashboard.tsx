import React from 'react';
import { AlertCircle, CheckCircle, ShieldAlert, Zap, Search } from 'lucide-react';
import { Tokens, DriftViolation } from '../../types/tokens';
import { Card } from '../Card';

export function DriftDashboard({ tokens }: { tokens: Tokens }) {
    const data = tokens.crawlData;
    if (!data) return null;

    const SeverityBadge = ({ severity }: { severity: DriftViolation['severity'] }) => {
        const colors = {
            high: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.2)' },
            medium: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.2)' },
            low: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.2)' }
        };
        const config = colors[severity];
        return (
            <span style={{
                fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '5px',
                backgroundColor: config.bg, color: config.text, border: `1px solid ${config.border}`,
                textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
                {severity}
            </span>
        );
    };

    return (
        <section id="drift" style={{ marginBottom: '80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                    <ShieldAlert size={20} style={{ color: data.violations.length > 0 ? '#ef4444' : '#10b981' }} />
                </div>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Site-wide Drift Analysis</h2>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>{data.summary}</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '32px', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {data.violations.length === 0 ? (
                        <div style={{ padding: '48px', textAlign: 'center', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: '24px' }}>
                            <CheckCircle size={48} style={{ color: '#10b981', margin: '0 auto 16px auto', opacity: 0.5 }} />
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>Perfect Brand Alignment</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px', margin: '8px auto 0 auto' }}>
                                All analyzed sub-pages follow the canonical design system detected on the root domain.
                            </p>
                        </div>
                    ) : (
                        data.violations.map((v) => (
                            <div key={v.id} style={{
                                padding: '24px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                                borderRadius: '20px', display: 'flex', gap: '20px'
                            }} className="hover-lift">
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--bg-app)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    color: v.severity === 'high' ? '#ef4444' : '#f59e0b'
                                }}>
                                    <AlertCircle size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{v.description}</div>
                                        <SeverityBadge severity={v.severity} />
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
                                        Found on: <span style={{ color: 'var(--text-secondary)' }}>{v.page}</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-default)' }}>
                                            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Expected (Root)</div>
                                            <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.expected}</div>
                                        </div>
                                        <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-default)' }}>
                                            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Actual (Sub-page)</div>
                                            <div style={{ fontSize: '13px', color: v.severity === 'high' ? '#ef4444' : 'var(--text-primary)', fontWeight: 600, fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.actual}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ padding: '24px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: '24px' }}>
                        <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>Pages Scanned</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {data.pagesAnalyzed.map((p, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: i === 0 ? 'var(--color-brand-500)' : '#10b981' }} />
                                    <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.replace(/https?:\/\/(www\.)?/, '')}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ padding: '24px', backgroundColor: 'rgba(99, 91, 255, 0.05)', border: '1px solid rgba(99, 91, 255, 0.2)', borderRadius: '24px' }}>
                        <Zap size={18} style={{ color: 'var(--color-brand-500)', marginBottom: '12px' }} />
                        <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Intelligence Note</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                            Drift reflects non-deterministic design decisions where sub-pages deviate from the global system established at the root domain.
                        </p>
                    </div>
                </aside>
            </div>
        </section>
    );
}

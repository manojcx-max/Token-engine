import React from 'react';
import { Maximize } from 'lucide-react';
import { Tokens } from '../../types/tokens';

export function Geometry({ tokens }: { tokens: Tokens }) {
    return (
        <section className="card flex flex-col h-full" style={{ display: 'flex', flexDirection: 'column', padding: '32px', gridColumn: '1 / -1' }}>
            <div className="code-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Maximize size={14} style={{ color: 'var(--text-secondary)' }} />
                <h3 className="font-semibold m-0" style={{ fontWeight: 500, margin: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Geometry & Spatial System</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
                {/* Radius */}
                {tokens.radius && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', margin: '0 0 16px 0' }}>Corner Radius</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', flex: 1 }}>
                            {Object.entries(tokens.radius).filter(([_, v]) => typeof v === 'string').map(([key, value]) => (
                                <div key={key} style={{ padding: '64px 24px 32px 24px', border: '1px solid var(--border-default)', borderRadius: '12px', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '48px', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ position: 'relative', width: '120px', height: '120px', overflow: 'hidden', backgroundColor: 'transparent' }}>
                                        {/* Background accent circles (Scaled 5x for visual clarity) */}
                                        <div style={{ position: 'absolute', width: `calc(${value} * 2 * 5)`, height: `calc(${value} * 2 * 5)`, top: 0, left: 0, borderRadius: '50%', backgroundColor: 'var(--brand-500, #8b5cf6)', opacity: 0.1 }}></div>
                                        <div style={{ position: 'absolute', width: `calc(${value} * 3 * 5)`, height: `calc(${value} * 3 * 5)`, top: `calc(-${value} * 0.5 * 5)`, left: `calc(-${value} * 0.5 * 5)`, borderRadius: '50%', backgroundColor: 'var(--brand-500, #8b5cf6)', opacity: 0.05 }}></div>

                                        {/* Dashed measurement box (Scaled 5x) - represents the theoretical sharp corner */}
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: `calc(${value} * 5)`, height: `calc(${value} * 5)`, border: '1px dotted var(--text-tertiary)' }}></div>

                                        {/* The main shape with the radius (Scaled 5x) */}
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderTopLeftRadius: `calc(${value} * 5)`, borderTop: '3px solid var(--text-primary)', borderLeft: '3px solid var(--text-primary)' }}></div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase' }}>{key}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>{value as string}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Spacing */}
                {tokens.spacing && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', margin: '0 0 16px 0' }}>Layout Spacing</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', padding: '32px', border: '1px solid var(--border-default)', borderRadius: '12px', backgroundColor: 'var(--bg-primary)', flex: 1 }}>
                            {Object.entries(tokens.spacing).slice(0, 5).map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                    <div style={{ width: '80px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', lineHeight: 1.5 }}>
                                        <div>SP-SPACE-</div>
                                        <div>{k.toUpperCase()}</div>
                                    </div>
                                    <div style={{ width: '40px', fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{v as string}</div>
                                    <div style={{ height: '16px', width: v as string, backgroundColor: 'var(--text-primary)', borderRadius: '8px', minWidth: '4px' }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Shadows */}
                {tokens.shadow && (
                    <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1', marginTop: '16px' }}>
                        <h4 style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', margin: '0 0 16px 0' }}>Elevation Shadows</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', flex: 1 }}>
                            {Object.entries(tokens.shadow).filter(([_, v]) => typeof v === 'string' && v !== 'none').slice(0, 3).map(([key, value]) => (
                                <div key={key} style={{ padding: '32px', border: '1px solid var(--border-default)', borderRadius: '12px', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-default)', boxShadow: value as string }}></div>
                                    <div style={{ textAlign: 'center', width: '100%' }}>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase' }}>{key.replace('shadow-', '')}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: '8px', wordBreak: 'break-word', padding: '0 8px', lineHeight: 1.5 }}>{value as string}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

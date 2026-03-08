import React from 'react';
import { Layers, Box, Maximize, Zap, Palette } from 'lucide-react';
import { Tokens } from '../../types/tokens';
import { Card } from '../Card';

export function LayerSystem({ tokens }: { tokens: Tokens }) {
    const hasZIndex = tokens.zIndices && Object.keys(tokens.zIndices).length > 0;
    const hasGradients = tokens.gradients && tokens.gradients.length > 0;

    if (!hasZIndex && !hasGradients) return null;

    return (
        <Card title="Depth & Visual Layers" icon={<Layers size={18} />} fullWidth>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
                {/* Z-Index Stacking */}
                {hasZIndex && (
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.1em' }}>
                            <Box size={14} /> Stacking Context (Z-Index)
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {Object.entries(tokens.zIndices!).sort((a, b) => a[1] - b[1]).map(([name, val], i) => (
                                <div key={name} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '16px 20px',
                                    backgroundColor: 'var(--bg-app)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: '16px',
                                    position: 'relative',
                                    transition: 'all 0.3s ease',
                                    cursor: 'default'
                                }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '8px',
                                        backgroundColor: 'var(--text-primary)',
                                        color: 'var(--bg-app)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '13px',
                                        fontWeight: 800,
                                        boxShadow: 'var(--shadow-sm)',
                                        flexShrink: 0
                                    }}>
                                        {val}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{name}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 500 }}>System Token Level {i + 1}</div>
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', opacity: 0.5 }}>
                                        v:{val}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Gradients */}
                {hasGradients && (
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.1em' }}>
                            <Palette size={14} /> Design Gradients
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                            {tokens.gradients?.map((grad, i) => (
                                <div key={i} style={{
                                    padding: '20px',
                                    backgroundColor: 'var(--bg-app)',
                                    border: '1px solid var(--border-default)',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        height: '100px',
                                        borderRadius: '10px',
                                        backgroundImage: grad,
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: 'var(--shadow-md)'
                                    }}></div>
                                    <div style={{
                                        fontSize: '11px',
                                        color: 'var(--text-secondary)',
                                        fontFamily: 'var(--font-mono)',
                                        wordBreak: 'break-all',
                                        backgroundColor: 'var(--bg-primary)',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        maxHeight: '80px',
                                        overflow: 'auto',
                                        lineHeight: 1.5,
                                        border: '1px solid var(--border-default)'
                                    }}>
                                        {grad}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}

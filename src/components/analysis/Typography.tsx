import React from 'react';
import { Type } from 'lucide-react';
import { Tokens } from '../../types/tokens';
import { Card } from '../Card';

export function Typography({ tokens }: { tokens: Tokens }) {
    if (!tokens.typography) return null;

    return (
        <Card title="Typography Architecture" icon={<Type size={18} />} fullWidth>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px' }}>
                {/* Families */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)', margin: 0 }}>Core Font Families</h4>
                    {tokens.typography.fontFamily && Object.entries(tokens.typography.fontFamily).map(([key, value]) => (
                        <div key={key} style={{ padding: '32px', border: '1px solid var(--border-default)', borderRadius: '20px', backgroundColor: 'var(--bg-app)', transition: 'all 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '4px' }}>{key}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{String(value).split(',')[0].replace(/['"]/g, '')}</div>
                                </div>
                                <div style={{ fontSize: '48px', fontWeight: 500, color: 'var(--text-primary)', fontFamily: value as string, lineHeight: 1 }}>Aa</div>
                            </div>
                            <div style={{
                                fontSize: '20px',
                                color: 'var(--text-primary)',
                                fontFamily: value as string,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                backgroundColor: 'var(--bg-primary)',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1px solid var(--border-default)'
                            }}>
                                Pack my box with five dozen liquor jugs.
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sizes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)', margin: 0 }}>Hierarchical Scale</h4>
                    <div style={{
                        padding: '32px',
                        border: '1px solid var(--border-default)',
                        borderRadius: '20px',
                        backgroundColor: 'var(--bg-app)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px'
                    }}>
                        {tokens.typography.fontSize && Object.entries(tokens.typography.fontSize).map(([k, v]) => (
                            <div key={k} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid var(--border-default)',
                                paddingBottom: '16px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', width: '60px', textTransform: 'uppercase' }}>{k}</span>
                                    <span style={{
                                        fontSize: v as string,
                                        fontWeight: (k === 'Display' || k.startsWith('h')) ? 700 : 400,
                                        color: 'var(--text-primary)',
                                        fontFamily: tokens.typography.fontFamily?.heading as string || 'inherit',
                                        lineHeight: 1.1,
                                        letterSpacing: (k === 'Display' || k.startsWith('h')) ? '-0.02em' : 'normal'
                                    }}>
                                        System Glyph
                                    </span>
                                </div>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{v as string}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
}

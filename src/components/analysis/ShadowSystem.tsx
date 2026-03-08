import React from 'react';
import { BoxSelect } from 'lucide-react';
import { Tokens } from '../../types/tokens';
import { Card } from '../Card';

export function ShadowSystem({ tokens }: { tokens: Tokens }) {
    if (!tokens.shadow) return null;

    const validShadows = Object.entries(tokens.shadow).filter(([_, v]) => typeof v === 'string' && v !== 'none');
    if (validShadows.length === 0) return null;

    return (
        <Card title="Surface Elevation" icon={<BoxSelect size={18} />} fullWidth>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                {validShadows.map(([key, value]) => (
                    <div key={key} style={{
                        padding: '48px 32px',
                        border: '1px solid var(--border-default)',
                        borderRadius: '24px',
                        backgroundColor: 'var(--bg-app)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '32px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: 'var(--bg-primary)',
                            borderRadius: '16px',
                            border: '1px solid var(--border-default)',
                            boxShadow: value as string,
                            transition: 'transform 0.3s ease'
                        }} className="hover-lift"></div>
                        <div style={{ textAlign: 'center', width: '100%' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                                {key.replace('shadow-', '')}
                            </div>
                            <div style={{
                                fontSize: '11px',
                                color: 'var(--text-secondary)',
                                fontFamily: 'var(--font-mono)',
                                backgroundColor: 'var(--bg-primary)',
                                padding: '12px',
                                borderRadius: '10px',
                                border: '1px solid var(--border-default)',
                                wordBreak: 'break-all',
                                lineHeight: 1.5,
                                maxHeight: '60px',
                                overflow: 'auto'
                            }}>
                                {value as string}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

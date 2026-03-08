import React from 'react';
import { Maximize } from 'lucide-react';
import { Tokens } from '../../types/tokens';
import { Card } from '../Card';

export function RadiusSystem({ tokens }: { tokens: Tokens }) {
    if (!tokens.radius) return null;

    return (
        <Card title="Corner Radius System" icon={<Maximize size={18} />} fullWidth>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {Object.entries(tokens.radius).filter(([_, v]) => typeof v === 'string').map(([key, value]) => (
                    <div key={key} style={{
                        padding: '48px 24px',
                        border: '1px solid var(--border-default)',
                        borderRadius: '20px',
                        backgroundColor: 'var(--bg-app)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '40px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto' }}>
                            {/* 1. Underlying Dashed Box */}
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                border: '1px dashed var(--border-hover)',
                                borderTopLeftRadius: `calc(${value} * 2)`,
                                opacity: 0.3
                            }}></div>

                            {/* 2. Overlaid Solid Corner Guide */}
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                borderTopLeftRadius: `calc(${value} * 2)`,
                                borderTop: '4px solid var(--text-primary)',
                                borderLeft: '4px solid var(--text-primary)',
                                zIndex: 2
                            }}></div>

                            {/* 3. Subtle Corner Glow/Fill */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: `calc(${value} * 3)`,
                                height: `calc(${value} * 3)`,
                                backgroundColor: 'var(--text-primary)',
                                borderTopLeftRadius: `calc(${value} * 2)`,
                                opacity: 0.08,
                                zIndex: 1
                            }}></div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{key}</div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{value as string}</div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

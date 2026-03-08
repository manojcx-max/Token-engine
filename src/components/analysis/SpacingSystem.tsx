import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { Tokens } from '../../types/tokens';
import { Card } from '../Card';

export function SpacingSystem({ tokens }: { tokens: Tokens }) {
    if (!tokens.spacing) return null;

    return (
        <Card title="Spatial Rhythm" icon={<LayoutGrid size={18} />} fullWidth>
            <div style={{ padding: '40px', border: '1px solid var(--border-default)', borderRadius: '20px', backgroundColor: 'var(--bg-app)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
                    {Object.entries(tokens.spacing).map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '12px', transition: 'all 0.2s ease' }}>
                            <div style={{ width: '40px', textAlign: 'right', fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                                {v as string}
                            </div>
                            <div style={{ flex: 1, height: '12px', borderRadius: '6px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-default)', position: 'relative', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: v as string,
                                    backgroundColor: 'var(--text-primary)',
                                    borderRadius: '4px',
                                    maxWidth: '100%'
                                }}></div>
                            </div>
                            <div style={{ width: '80px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {k}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ marginTop: '24px', padding: '0 8px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--text-primary)' }}></div>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Active Dimension</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-default)' }}></div>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Base Containment</span>
                </div>
            </div>
        </Card>
    );
}

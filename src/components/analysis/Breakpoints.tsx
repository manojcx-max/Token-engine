import React from 'react';
import { Monitor } from 'lucide-react';
import { Tokens } from '../../types/tokens';
import { Card } from '../Card';

export function Breakpoints({ tokens }: { tokens: Tokens }) {
    if (!tokens.screens) return null;

    return (
        <Card title="Responsive Breakpoints" icon={<Monitor size={18} />} fullWidth>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                {Object.entries(tokens.screens).map(([key, value]) => (
                    <div key={key} style={{
                        padding: '32px 24px',
                        border: '1px solid var(--border-default)',
                        borderRadius: '20px',
                        backgroundColor: 'var(--bg-app)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        transition: 'all 0.3s ease'
                    }} className="hover-lift">
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{key}</div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{value as string}</div>
                        <div style={{
                            width: '40px',
                            height: '2px',
                            backgroundColor: 'var(--text-primary)',
                            borderRadius: '1px',
                            opacity: 0.2
                        }}></div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

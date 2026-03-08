import React, { useState } from 'react';
import { Play, Clock, Activity, Layers, Info } from 'lucide-react';
import { Tokens } from '../../types/tokens';
import { Card } from '../Card';

export function MotionSystem({ tokens }: { tokens: Tokens }) {
    if (!tokens.motion) return null;

    const duration = tokens.motion?.duration || { fast: '150ms', normal: '300ms', slow: '500ms' };
    const easing = tokens.motion?.easing || { standard: 'cubic-bezier(0.4, 0, 0.2, 1)', emphasized: 'cubic-bezier(0.4, 0, 0.2, 1)' };
    const usage = tokens.motion?.usage || {};
    const types = tokens.motion?.types || ['Transition', 'Entry', 'Feedback'];

    const [hoveredRow, setHoveredRow] = useState<string | null>(null);

    const getMotionName = (key: string) => {
        const names: Record<string, string> = {
            'fast': 'Productive',
            'normal': 'Standard',
            'slow': 'Expressive'
        };
        return names[key] || key;
    };

    const getMotionDesc = (key: string) => {
        const descs: Record<string, string> = {
            'fast': 'Instant feedback',
            'normal': 'System state changes',
            'slow': 'Immersive navigation'
        };
        return descs[key] || '';
    };

    const majorUsage = usage ? Object.entries(usage)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([tag]) => {
            const labelMap: Record<string, string> = {
                'button': 'Buttons',
                'a': 'Links',
                'div': 'Cards',
                'section': 'Sections',
                'input': 'Inputs',
                'header': 'Navigation',
                'nav': 'Navigation'
            };
            return labelMap[tag] || tag;
        }) : [];

    return (
        <Card title="Structural Motion" icon={<Play size={18} />} fullWidth>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px' }}>
                {/* Token Grid */}
                <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '0.1em' }}>Interaction Physics</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        {Object.entries(duration).map(([dKey, dVal]) => (
                            <div
                                key={dKey}
                                onMouseEnter={() => setHoveredRow(dKey)}
                                onMouseLeave={() => setHoveredRow(null)}
                                style={{
                                    padding: '32px',
                                    borderRadius: '24px',
                                    border: '1px solid var(--border-default)',
                                    backgroundColor: 'var(--bg-app)',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '24px',
                                    cursor: 'default',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                className="hover-lift"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{getMotionName(dKey)}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{getMotionDesc(dKey)}</div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        color: 'var(--text-primary)',
                                        backgroundColor: 'var(--bg-primary)',
                                        padding: '6px 12px',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        fontFamily: 'var(--font-mono)',
                                        border: '1px solid var(--border-default)'
                                    }}>
                                        <Clock size={12} /> {dVal}
                                    </div>
                                </div>

                                <div style={{ height: '48px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px', position: 'relative', border: '1px solid var(--border-default)', overflow: 'hidden' }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: hoveredRow === dKey ? 'calc(100% - 36px)' : '12px',
                                        top: '12px',
                                        width: '24px',
                                        height: '24px',
                                        backgroundColor: 'var(--text-primary)',
                                        borderRadius: '6px',
                                        transition: `all ${dVal} ${easing.standard}`,
                                        opacity: hoveredRow === dKey ? 1 : 0.4,
                                        boxShadow: hoveredRow === dKey ? '0 0 20px rgba(var(--accent-rgb), 0.3)' : 'none'
                                    }} />
                                    {hoveredRow !== dKey && (
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                                            Simulate Physics
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Meta Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px', padding: '32px', borderRadius: '24px', backgroundColor: 'var(--bg-app)', border: '1px dashed var(--border-default)' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <Layers size={16} style={{ color: 'var(--text-tertiary)' }} />
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Motion Domains</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {types?.map(t => (
                                <span key={t} style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', backgroundColor: 'var(--bg-primary)', padding: '5px 12px', borderRadius: '6px', border: '1px solid var(--border-default)' }}>{t}</span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <Activity size={16} style={{ color: 'var(--text-tertiary)' }} />
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Easing Curve</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', backgroundColor: 'var(--bg-primary)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-default)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {easing.standard}
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <Info size={16} style={{ color: 'var(--text-tertiary)' }} />
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Extraction Intelligence</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            High activity detected on <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{majorUsage.join(', ')}</span> components.
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

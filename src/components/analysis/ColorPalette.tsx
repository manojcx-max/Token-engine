import React, { useState } from 'react';
import { Palette, Copy, Check, ShieldCheck, ShieldAlert } from 'lucide-react';
import tinycolor from 'tinycolor2';
import { Tokens } from '../../types/tokens';
import { Card } from '../Card';

function WcagBadge({ ratio, label }: { ratio: number; label: string }) {
    const passAA = ratio >= 4.5;
    const passAAA = ratio >= 7.0;
    const level = passAAA ? 'AAA' : passAA ? 'AA' : 'Fail';
    const color = passAAA ? '#10b981' : passAA ? '#f59e0b' : '#ef4444';
    const bg = passAAA ? 'rgba(16,185,129,0.1)' : passAA ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.08)';
    const border = passAAA ? 'rgba(16,185,129,0.3)' : passAA ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.25)';
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '5px',
                backgroundColor: bg, color, border: `1px solid ${border}`,
                letterSpacing: '0.04em'
            }}>
                {passAA ? <ShieldCheck size={10} /> : <ShieldAlert size={10} />}
                {level}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{label}</div>
        </div>
    );
}

export function ColorPalette({ tokens }: { tokens: Tokens }) {
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

    const handleCopy = (text: string, id: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedStates({ ...copiedStates, [id]: true });
        setTimeout(() => setCopiedStates({ ...copiedStates, [id]: false }), 2000);
    };

    const colors = [
        { name: 'Brand 500', hex: tokens.colors.brand?.[500] || '#e4e4e7' },
        ...(tokens.colors.brand?.[600] && tokens.colors.brand[600] !== tokens.colors.brand[500] ? [{ name: 'Brand 600', hex: tokens.colors.brand[600] }] : []),
        ...(tokens.colors.neutral ? Object.entries(tokens.colors.neutral).map(([k, v]) => ({ name: `Neutral ${k}`, hex: v })) : [])
    ];

    return (
        <Card title="Chroma & Tonal System" icon={<Palette size={18} />} fullWidth>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {colors.map((color, i) => {
                    const tColor = tinycolor(color.hex);
                    const isDark = tColor.isDark();
                    const onWhite = tinycolor.readability(color.hex, '#ffffff');
                    const onBlack = tinycolor.readability(color.hex, '#000000');

                    return (
                        <div key={i} style={{
                            padding: '24px',
                            border: '1px solid var(--border-default)',
                            borderRadius: '20px',
                            backgroundColor: 'var(--bg-app)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            transition: 'all 0.3s ease'
                        }} className="hover-lift">
                            <div
                                style={{
                                    width: '100%',
                                    height: '100px',
                                    backgroundColor: color.hex,
                                    borderRadius: '12px',
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    padding: '12px',
                                    position: 'relative',
                                    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)'
                                }}
                            >
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    fontFamily: 'var(--font-mono)',
                                    color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)',
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    backdropFilter: 'blur(4px)'
                                }}>
                                    {color.hex.toUpperCase()}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{color.name}</span>
                                <button
                                    className="secondary"
                                    onClick={() => handleCopy(color.hex, `color-${i}`)}
                                    style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                                >
                                    {copiedStates[`color-${i}`] ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '12px', fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                                <div style={{ backgroundColor: 'var(--bg-primary)', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
                                    <div style={{ color: 'var(--text-tertiary)', marginBottom: '4px' }}>RGB</div>
                                    <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{Math.round(tColor.toRgb().r)}, {Math.round(tColor.toRgb().g)}, {Math.round(tColor.toRgb().b)}</div>
                                </div>
                                <div style={{ backgroundColor: 'var(--bg-primary)', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
                                    <div style={{ color: 'var(--text-tertiary)', marginBottom: '4px' }}>HSL</div>
                                    <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{Math.round(tColor.toHsl().h)}°, {Math.round(tColor.toHsl().s * 100)}%, {Math.round(tColor.toHsl().l * 100)}%</div>
                                </div>
                            </div>

                            {/* WCAG Contrast Section */}
                            <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '16px' }}>
                                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                                    WCAG Contrast
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div style={{
                                        backgroundColor: '#ffffff', borderRadius: '10px',
                                        padding: '10px', display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', gap: '6px', border: '1px solid #eee'
                                    }}>
                                        <div style={{ fontSize: '14px', fontWeight: 800, color: color.hex, letterSpacing: '-0.02em' }}>Aa</div>
                                        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#555' }}>{onWhite.toFixed(2)}:1</div>
                                        <WcagBadge ratio={onWhite} label="on white" />
                                    </div>
                                    <div style={{
                                        backgroundColor: '#000000', borderRadius: '10px',
                                        padding: '10px', display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', gap: '6px', border: '1px solid #222'
                                    }}>
                                        <div style={{ fontSize: '14px', fontWeight: 800, color: color.hex, letterSpacing: '-0.02em' }}>Aa</div>
                                        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#888' }}>{onBlack.toFixed(2)}:1</div>
                                        <WcagBadge ratio={onBlack} label="on black" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}


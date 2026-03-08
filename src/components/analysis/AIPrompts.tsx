import React, { useState } from 'react';
import { Bot, Copy, Check, ExternalLink } from 'lucide-react';
import { Tokens } from '../../types/tokens';
import { trackEvent } from '../../utils/analytics';
import { Card } from '../Card';

export function AIPrompts({ tokens }: { tokens: Tokens }) {
    const [activeTab, setActiveTab] = useState<'universal' | 'v0' | 'claude' | 'antigravity'>('universal');
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

    const handleCopy = (text: string, id: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedStates({ ...copiedStates, [id]: true });
        trackEvent('copy_prompt');
        setTimeout(() => setCopiedStates({ ...copiedStates, [id]: false }), 2000);
    };

    if (!tokens.exports?.prompts) return null;

    return (
        <Card
            title="AI Builder Instructions"
            icon={<Bot size={18} />}
            fullWidth
            style={{ padding: 0 }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--bg-app)', padding: '0 32px' }}>
                    {(['universal', 'v0', 'claude', 'antigravity'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '16px 24px',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === tab ? '2px solid var(--text-primary)' : '2px solid transparent',
                                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                                fontWeight: activeTab === tab ? 600 : 500,
                                fontSize: '13px',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                borderRadius: 0,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ position: 'relative', width: '100%', borderRadius: '16px', border: '1px solid var(--border-default)', backgroundColor: 'var(--bg-app)', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--bg-surface)' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Replication Protocol</span>
                                <button
                                    className="secondary"
                                    onClick={() => handleCopy(tokens.exports.prompts[activeTab], `inline-prompt-${activeTab}`)}
                                    style={{ padding: '6px 12px', height: '32px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', borderRadius: '8px' }}
                                >
                                    {copiedStates[`inline-prompt-${activeTab}`] ? <Check size={14} /> : <Copy size={14} />}
                                    {copiedStates[`inline-prompt-${activeTab}`] ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                            <pre
                                data-lenis-prevent
                                style={{
                                    margin: 0,
                                    padding: '24px',
                                    overflowX: 'auto',
                                    overflowY: 'auto',
                                    maxHeight: '400px',
                                    fontSize: '13px',
                                    lineHeight: 1.7,
                                    color: 'var(--text-primary)',
                                    fontFamily: 'var(--font-mono)',
                                    whiteSpace: 'pre-wrap',
                                    backgroundColor: 'var(--bg-primary)'
                                }}
                            >
                                <code>{tokens.exports.prompts[activeTab]}</code>
                            </pre>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                className="primary hover-lift"
                                onClick={() => handleCopy(tokens.exports.prompts[activeTab], `inline-prompt-${activeTab}`)}
                                style={{ flex: 1, height: '52px', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', borderRadius: '12px', fontSize: '15px' }}
                            >
                                {copiedStates[`inline-prompt-${activeTab}`] ? <Check size={18} /> : <Copy size={18} />}
                                {copiedStates[`inline-prompt-${activeTab}`] ? 'Copied!' : 'Copy Instructions'}
                            </button>
                            {(activeTab === 'v0' || activeTab === 'universal') && (
                                <button
                                    className="secondary hover-lift"
                                    onClick={() => {
                                        const url = `https://v0.dev/chat?q=${encodeURIComponent(tokens.exports.prompts[activeTab].slice(0, 800))}`;
                                        window.open(url, '_blank', 'noopener,noreferrer');
                                    }}
                                    style={{ height: '52px', padding: '0 20px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', fontSize: '14px', border: '1px solid var(--border-default)', backgroundColor: 'var(--bg-surface)' }}
                                >
                                    <ExternalLink size={16} />
                                    Open in v0
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

import React, { useState } from 'react';
import { Code2, Code, Copy, Check, Download, Layers } from 'lucide-react';
import { Tokens } from '../../types/tokens';
import { Card } from '../Card';
import { RemixTheme } from '../../utils/remixEngine';

export function CodeExport({ tokens, activeRemix, remixCSS }: { tokens: Tokens, activeRemix?: RemixTheme | null, remixCSS?: string }) {
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

    if (!tokens.exports) return null;

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedStates({ ...copiedStates, [id]: true });
        setTimeout(() => setCopiedStates({ ...copiedStates, [id]: false }), 2000);
    };

    const handleDownload = (content: string, filename: string, type: string) => {
        const blob = new Blob([content], { type });
        const objUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objUrl);
    };

    // Construct final CSS
    let finalCSS = tokens.exports.css;
    if (activeRemix && remixCSS) {
        const cleanedRemixCSS = remixCSS.replace(/#tokenengine-results-view/g, ':root');
        finalCSS = `${finalCSS}\n\n/* Applied Design Evolution: ${activeRemix.name} */\n${cleanedRemixCSS}`;
    }

    // Construct Figma Tokens (W3C standard draft)
    const generateFigmaTokens = () => {
        const figmaTokens: any = {
            Global: {
                Colors: {
                    Brand: {},
                    Neutral: {},
                    Background: {
                        Primary: { $type: "color", $value: activeRemix ? "var(--bg-primary)" : tokens.colors.background.primary },
                        Surface: { $type: "color", $value: activeRemix ? "var(--bg-surface)" : tokens.colors.background.surface }
                    },
                    Text: {
                        Primary: { $type: "color", $value: activeRemix ? "var(--text-primary)" : tokens.colors.text.primary },
                        Secondary: { $type: "color", $value: activeRemix ? "var(--text-secondary)" : tokens.colors.text.secondary }
                    }
                },
                Typography: {
                    FontFamily: {
                        Heading: { $type: "fontFamily", $value: activeRemix?.fontHeading || tokens.typography.fontFamily.heading },
                        Body: { $type: "fontFamily", $value: activeRemix?.fontSans || tokens.typography.fontFamily.body }
                    }
                },
                Spacing: {},
                Radius: {}
            }
        };

        // Brand Colors
        if (activeRemix) {
            figmaTokens.Global.Colors.Brand["50"] = { $type: "color", $value: `hsl(${activeRemix.targetHue}, 80%, 95%)` };
            figmaTokens.Global.Colors.Brand["100"] = { $type: "color", $value: `hsl(${activeRemix.targetHue}, 80%, 90%)` };
            figmaTokens.Global.Colors.Brand["500"] = { $type: "color", $value: `hsl(${activeRemix.targetHue}, 70%, 50%)` };
            figmaTokens.Global.Colors.Brand["600"] = { $type: "color", $value: `hsl(${activeRemix.targetHue}, 70%, 40%)` };
            figmaTokens.Global.Colors.Brand["900"] = { $type: "color", $value: `hsl(${activeRemix.targetHue}, 80%, 15%)` };
        } else {
            Object.entries(tokens.colors.brand).forEach(([k, v]) => {
                figmaTokens.Global.Colors.Brand[k] = { $type: "color", $value: v };
            });
        }

        // Neutral Colors
        Object.entries(tokens.colors.neutral).forEach(([k, v]) => {
            figmaTokens.Global.Colors.Neutral[k] = { $type: "color", $value: v };
        });

        // Spacing
        Object.entries(tokens.spacing).forEach(([k, v]) => {
            figmaTokens.Global.Spacing[k] = { $type: "dimension", $value: v };
        });

        // Radius
        Object.entries(tokens.radius).forEach(([k, v]) => {
            figmaTokens.Global.Radius[k] = { $type: "dimension", $value: v };
        });

        return figmaTokens;
    };

    const finalFigmaJSON = JSON.stringify(generateFigmaTokens(), null, 2);

    return (
        <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {tokens.exports.css && (
                <Card
                    title="CSS Variables"
                    icon={<Code2 size={18} />}
                    headerAction={
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => handleCopy(finalCSS, 'css-copy')}
                                className="secondary"
                                style={{ height: '32px', padding: '0 12px', fontSize: '12px', borderRadius: '8px' }}
                            >
                                {copiedStates['css-copy'] ? <Check size={14} /> : <Copy size={14} />}
                                <span style={{ marginLeft: '6px' }}>{copiedStates['css-copy'] ? 'Copied' : 'Copy'}</span>
                            </button>
                            <button
                                onClick={() => handleDownload(finalCSS, 'tokens.css', 'text/css')}
                                className="secondary"
                                style={{ height: '32px', padding: '0 12px', fontSize: '12px', borderRadius: '8px' }}
                            >
                                <Download size={14} />
                                <span style={{ marginLeft: '6px' }}>CSS</span>
                            </button>
                        </div>
                    }
                >
                    <div
                        data-lenis-prevent
                        style={{
                            backgroundColor: 'var(--bg-app)',
                            padding: '24px',
                            borderRadius: '16px',
                            overflow: 'auto',
                            maxHeight: '300px',
                            border: '1px solid var(--border-default)',
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '13px',
                            lineHeight: 1.6
                        }}
                    >
                        <pre style={{ margin: 0 }}><code>{finalCSS}</code></pre>
                    </div>
                </Card>
            )}

            {tokens.exports.tailwind && (
                <Card
                    title="Tailwind Bridge"
                    icon={<Code size={18} />}
                    headerAction={
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => handleCopy(`/** @type {import('tailwindcss').Config} */\nmodule.exports = ${JSON.stringify(tokens.exports.tailwind, null, 2)}`, 'tw-copy')}
                                className="secondary"
                                style={{ height: '32px', padding: '0 12px', fontSize: '12px', borderRadius: '8px' }}
                            >
                                {copiedStates['tw-copy'] ? <Check size={14} /> : <Copy size={14} />}
                                <span style={{ marginLeft: '6px' }}>{copiedStates['tw-copy'] ? 'Copied' : 'Copy'}</span>
                            </button>
                            <button
                                onClick={() => handleDownload(`/** @type {import('tailwindcss').Config} */\nmodule.exports = ${JSON.stringify(tokens.exports.tailwind, null, 2)}`, 'tailwind.config.js', 'text/javascript')}
                                className="secondary"
                                style={{ height: '32px', padding: '0 12px', fontSize: '12px', borderRadius: '8px' }}
                            >
                                <Download size={14} />
                                <span style={{ marginLeft: '6px' }}>JS</span>
                            </button>
                        </div>
                    }
                >
                    <div
                        data-lenis-prevent
                        style={{
                            backgroundColor: 'var(--bg-app)',
                            padding: '24px',
                            borderRadius: '16px',
                            overflow: 'auto',
                            maxHeight: '300px',
                            border: '1px solid var(--border-default)',
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '13px',
                            lineHeight: 1.6
                        }}
                    >
                        <pre style={{ margin: 0 }}><code>{`/** @type {import('tailwindcss').Config} */\nmodule.exports = ${JSON.stringify(tokens.exports.tailwind, null, 2)}`}</code></pre>
                    </div>
                </Card>
            )}

            <Card
                title="Figma Variables (W3C)"
                icon={<Layers size={18} />}
                headerAction={
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => handleCopy(finalFigmaJSON, 'figma-copy')}
                            className="secondary"
                            style={{ height: '32px', padding: '0 12px', fontSize: '12px', borderRadius: '8px' }}
                        >
                            {copiedStates['figma-copy'] ? <Check size={14} /> : <Copy size={14} />}
                            <span style={{ marginLeft: '6px' }}>{copiedStates['figma-copy'] ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                            onClick={() => handleDownload(finalFigmaJSON, 'figma-tokens.json', 'application/json')}
                            className="primary hover-lift"
                            style={{ height: '32px', padding: '0 12px', fontSize: '12px', borderRadius: '8px', border: 'none' }}
                        >
                            <Download size={14} />
                            <span style={{ marginLeft: '6px' }}>Export JSON</span>
                        </button>
                    </div>
                }
            >
                <div
                    data-lenis-prevent
                    style={{
                        backgroundColor: 'var(--bg-app)',
                        padding: '24px',
                        borderRadius: '16px',
                        overflow: 'auto',
                        maxHeight: '300px',
                        border: '1px solid var(--border-default)',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        lineHeight: 1.6
                    }}
                >
                    <pre style={{ margin: 0 }}><code>{finalFigmaJSON}</code></pre>
                </div>
            </Card>
        </div>
    );
}


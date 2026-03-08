import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AlertCircle, Download, Check, Save, ArrowLeft, Plus, Wand2, Search, Loader2, ArrowRight } from 'lucide-react';
import { Tokens, SavedAnalysis } from '../types/tokens';
import { ColorPalette } from '../components/analysis/ColorPalette';
import { Typography } from '../components/analysis/Typography';
import { RadiusSystem } from '../components/analysis/RadiusSystem';
import { SpacingSystem } from '../components/analysis/SpacingSystem';
import { ShadowSystem } from '../components/analysis/ShadowSystem';
import { Breakpoints } from '../components/analysis/Breakpoints';
import { AIPrompts } from '../components/analysis/AIPrompts';
import { CodeExport } from '../components/analysis/CodeExport';
import { MotionSystem } from '../components/analysis/MotionSystem';
import { LayerSystem } from '../components/analysis/LayerSystem';
import { Card } from '../components/Card';
import { PreMonetization } from '../components/PreMonetization';
import { trackEvent } from '../utils/analytics';
import { ComponentShowcase } from '../components/analysis/ComponentShowcase';
import { DriftDashboard } from '../components/analysis/DriftDashboard';
import { PROFESSIONAL_THEMES, generateRemixCSS, RemixTheme } from '../utils/remixEngine';
import { Palette, RefreshCw, Menu, X, ChevronRight, Layout as LayoutIcon, Type as TypeIcon, Maximize, Move, Hexagon, Terminal, Box } from 'lucide-react';

// Analyzing State Component
const AnalyzingState = ({ url, isCrawling }: { url: string; isCrawling: boolean }) => {
    const [step, setStep] = useState(0);
    const steps = [
        "Initializing headless bridge...",
        "Crawling target DOM structure...",
        ...(isCrawling ? [
            "Discovering internal links...",
            "Analyzing sub-pages for drift...",
            "Comparing cross-page brand assets..."
        ] : []),
        "Computing recursive computed styles...",
        "Normalizing hex to project-specific HSL...",
        "Detecting typeface hierarchy...",
        "Synthesizing Tailwind configuration...",
        ...(isCrawling ? ["Generating visual drift map..."] : []),
        "Finalizing developer manifest..."
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setStep(s => (s < steps.length - 1 ? s + 1 : s));
        }, isCrawling ? 1200 : 800);
        return () => clearInterval(timer);
    }, [isCrawling, steps.length]);

    return (
        <div className="animate-in" style={{ padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '64px', minHeight: '80vh', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '80px', maxWidth: '1100px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
                {/* Visual Loader */}
                <div style={{ position: 'relative', width: '320px', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', inset: 0, border: '1px solid var(--border-default)', borderRadius: '50%', opacity: 0.5 }} />
                    <div style={{ position: 'absolute', inset: '40px', border: '1px solid var(--border-default)', borderRadius: '50%', opacity: 0.3 }} />
                    <div style={{ position: 'absolute', inset: '80px', border: '2px solid var(--text-primary)', borderRadius: '50%', opacity: 0.1, animation: 'pulseSubtle 2s ease-in-out infinite' }} />
                    <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Loader2 size={42} strokeWidth={1.5} style={{ color: 'var(--text-primary)', animation: 'spin 1.5s linear infinite', marginBottom: '24px' }} />
                        <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.2em', marginLeft: '0.2em' }}>Intelligence</div>
                    </div>
                </div>

                {/* Progress Card */}
                <div style={{ flex: 1, maxWidth: '520px', minWidth: '320px' }}>
                    <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: '24px', padding: '40px', boxShadow: 'var(--shadow-2xl)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '32px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--border-hover)' }} />
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--border-hover)' }} />
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--border-hover)' }} />
                        </div>

                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 2, color: 'var(--text-secondary)' }}>
                            {steps.map((s, i) => (
                                <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '8px', opacity: i === step ? 1 : (i < step ? 0.4 : 0), transition: 'opacity 0.5s ease', transform: i === step ? 'translateX(4px)' : 'none' }}>
                                    <span style={{ color: 'var(--text-tertiary)', width: '28px', opacity: i <= step ? 1 : 0 }}>{String(i + 1).padStart(2, '0')}</span>
                                    <span style={{ color: i === step ? 'var(--text-primary)' : 'inherit', fontWeight: i === step ? 600 : 400 }}>{s}</span>
                                    {i === step && <span style={{ animation: 'pulseSubtle 1s infinite', color: 'var(--text-primary)' }}>_</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '40px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 600, margin: '0 0 12px 0', letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>Synthesizing Intelligence</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>Extracting from <span style={{ color: 'var(--text-primary)', fontWeight: 600, borderBottom: '1px solid var(--border-default)' }}>{url}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default function Analyze() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const urlFromParams = searchParams.get('url');

    const [isLoading, setIsLoading] = React.useState(false);
    const [tokens, setTokens] = React.useState<Tokens | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [saveState, setSaveState] = React.useState<'idle' | 'saving' | 'saved'>('idle');
    const [activeRemix, setActiveRemix] = React.useState<RemixTheme | null>(null);

    const [localUrl, setLocalUrl] = React.useState('');
    const [isRemixPanelOpen, setIsRemixPanelOpen] = React.useState(false);
    const [tempRemix, setTempRemix] = React.useState<RemixTheme | null>(null);

    const remixCSS = React.useMemo(() => {
        const themeToUse = tempRemix || activeRemix;
        if (!themeToUse || !tokens) return '';
        return generateRemixCSS(themeToUse, tokens);
    }, [activeRemix, tempRemix, tokens]);

    const baseCSS = React.useMemo(() => {
        if (!tokens?.exports?.css) return '';
        // Wrap base CSS in the scope ID
        return `#tokenengine-results-view { ${tokens.exports.css} }`;
    }, [tokens]);

    React.useEffect(() => {
        if (urlFromParams) {
            handleExtract(urlFromParams);
        }
    }, [urlFromParams]);

    const handleExtract = async (urlToFetch: string) => {
        setIsLoading(true);
        setTokens(null);
        setError(null);
        setSaveState('idle');

        try {
            const urlObj = new URL(urlToFetch.startsWith('http') ? urlToFetch : `https://${urlToFetch}`);
            const crawlParam = searchParams.get('crawl') === 'true';
            const response = await fetch('http://localhost:3001/api/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: urlObj.toString(),
                    crawl: crawlParam
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Extraction failed');
            }

            setTokens(data);
            trackEvent('extraction');
            trackEvent('view_results');

            // Save to recent history (this isn't the saved library, just history)
            try {
                const domain = urlObj.hostname;
                const saved = localStorage.getItem('tokenengine_history');
                const history = saved ? JSON.parse(saved) : [];
                const newEntry = { url: urlToFetch, domain, timestamp: Date.now() };
                const updated = [newEntry, ...history.filter((h: any) => h.domain !== domain)].slice(0, 5);
                localStorage.setItem('tokenengine_history', JSON.stringify(updated));
            } catch (e) { }

        } catch (err: any) {
            setError(err.message || 'Extraction failed. Please check the URL and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveAnalysis = () => {
        if (!tokens || !urlFromParams) return;

        try {
            const domain = new URL(urlFromParams.startsWith('http') ? urlFromParams : `https://${urlFromParams}`).hostname;
            const newSaved: SavedAnalysis = {
                id: Math.random().toString(36).substring(7),
                url: urlFromParams,
                domain,
                timestamp: Date.now(),
                tokens,
                activeRemix
            };

            const existing = localStorage.getItem('tokenengine_saved');
            const parsed = existing ? JSON.parse(existing) : [];
            localStorage.setItem('tokenengine_saved', JSON.stringify([newSaved, ...parsed]));

            setSaveState('saving');
            setTimeout(() => {
                setSaveState('saved');
            }, 1200);

        } catch (e) {
            console.error('Failed to save analysis', e);
        }
    };

    const downloadFile = (content: string, filename: string, type: string) => {
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

    if (isLoading) {
        return (
            <AnalyzingState url={urlFromParams || ''} isCrawling={searchParams.get('crawl') === 'true'} />
        );
    }
    if (error) {
        return (
            <div className="animate-in" style={{ padding: '120px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh', justifyContent: 'center' }}>
                <div className="error-card" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '32px', backgroundColor: 'var(--error-bg)', color: 'var(--error-text)', borderRadius: '12px', border: '1px solid var(--border-default)' }}>
                    <AlertCircle size={32} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Extraction Failed</h2>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', margin: 0 }}>{error}</p>
                    <button className="primary" onClick={() => navigate('/')} style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '8px', height: '40px', padding: '0 20px' }}>
                        <ArrowLeft size={16} /> Go Back Home
                    </button>
                </div>
            </div>
        );
    }

    if (!urlFromParams && !isLoading && !error) {
        return (
            <main className="animate-in" style={{ padding: '120px 24px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', marginBottom: '24px' }}>
                        <Search size={24} style={{ color: 'var(--text-primary)' }} />
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--text-primary)', marginBottom: '16px' }}>Ready to Analyze</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>Insert any design system or website URL to run a deterministic extraction of their tokens.</p>
                </div>

                <div style={{ width: '100%', maxWidth: '640px' }}>
                    <div style={{
                        borderRadius: '20px',
                        padding: '10px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-default)',
                        boxShadow: 'var(--shadow-xl)',
                        display: 'flex',
                        gap: '8px'
                    }}>
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 16px',
                            borderRadius: '12px',
                            backgroundColor: 'var(--bg-app)',
                            border: '1px solid var(--border-default)',
                            transition: 'border-color 0.3s ease'
                        }}>
                            <input
                                type="text"
                                placeholder="Paste any website URL (e.g. linear.app)"
                                value={localUrl}
                                onChange={(e) => setLocalUrl(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && localUrl) {
                                        navigate(`/analyze?url=${encodeURIComponent(localUrl)}`);
                                    }
                                }}
                                autoFocus
                                style={{
                                    width: '100%',
                                    height: '48px',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    outline: 'none',
                                    fontSize: '15px',
                                    color: 'var(--text-primary)',
                                    fontWeight: 500
                                }}
                            />
                        </div>
                        <button
                            className="primary hover-lift"
                            onClick={() => {
                                if (localUrl) navigate(`/analyze?url=${encodeURIComponent(localUrl)}`);
                            }}
                            disabled={!localUrl}
                            style={{
                                height: '50px',
                                padding: '0 28px',
                                borderRadius: '12px',
                                fontWeight: 700,
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <Wand2 size={16} /> Extract
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    if (!tokens) return null;

    const menuItems = [
        { id: 'preview', label: 'Evolution Preview', icon: <LayoutIcon size={18} /> },
        ...(tokens.crawlData ? [{ id: 'drift', label: 'Drift Analysis', icon: <AlertCircle size={18} /> }] : []),
        { id: 'colors', label: 'Color Palette', icon: <Palette size={18} /> },
        { id: 'typography', label: 'Typography', icon: <TypeIcon size={18} /> },
        { id: 'spacing', label: 'Spacing System', icon: <Move size={18} /> },
        { id: 'radius', label: 'Corner Radius', icon: <Maximize size={18} /> },
        { id: 'shadows', label: 'Shadow Architecture', icon: <Box size={18} /> },
        { id: 'motion', label: 'Motion & Timing', icon: <Plus size={18} /> },
        { id: 'layers', label: 'Layer Hierarchy', icon: <Hexagon size={18} /> },
        { id: 'manifest', label: 'Dev Manifest', icon: <Terminal size={18} /> },
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <main className="animate-in" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
            {/* Design System Injection */}
            {baseCSS && <style>{baseCSS}</style>}
            {remixCSS && <style>{remixCSS}</style>}

            {/* Sticky Sidebar Navigation */}
            <aside style={{
                width: '300px',
                height: '100vh',
                position: 'sticky',
                top: 0,
                backgroundColor: 'var(--bg-primary)',
                borderRight: '1px solid var(--border-default)',
                padding: '40px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px',
                zIndex: 40
            }}>
                <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>Extraction Meta</div>
                    <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{urlFromParams}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Coverage: {tokens.extractionMeta?.coveragePercentage}%</div>
                    </div>
                </div>

                <nav style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>System Modules</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '10px 16px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    color: 'var(--text-secondary)',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.2s ease',
                                    width: '100%'
                                }}
                            >
                                {item.icon}
                                <span style={{ flex: 1 }}>{item.label}</span>
                                <ChevronRight size={14} style={{ opacity: 0.3 }} />
                            </button>
                        ))}
                    </div>
                </nav>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                        onClick={() => setIsRemixPanelOpen(true)}
                        className="primary hover-lift"
                        style={{ width: '100%', borderRadius: '12px', justifyContent: 'center', backgroundColor: 'var(--color-brand-500)', border: 'none', height: '48px' }}
                    >
                        <Wand2 size={18} /> Remix Design
                    </button>
                    <button
                        className="secondary hover-lift"
                        onClick={() => navigate('/')}
                        style={{ width: '100%', borderRadius: '12px', justifyContent: 'center', background: 'transparent', height: '48px' }}
                    >
                        <Plus size={16} /> New Analysis
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <section style={{ flex: 1, padding: '64px 48px 128px 48px', overflowY: 'auto' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '64px' }}>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.04em' }}>System Manifest</h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginTop: '8px' }}>Atomic architecture extracted from {urlFromParams}</p>
                        </div>
                        <button
                            className={saveState !== 'idle' ? "secondary hover-lift" : "primary hover-lift"}
                            onClick={() => {
                                if (saveState === 'saved') navigate('/saved');
                                else if (saveState === 'idle') handleSaveAnalysis();
                            }}
                            disabled={saveState === 'saving'}
                            style={{ borderRadius: '12px', height: '44px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            {saveState === 'idle' ? <><Save size={18} /> Save to Library</> : <><Check size={18} /> Saved</>}
                        </button>
                    </div>

                    {/* Results Content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
                        <div id="preview"><ComponentShowcase tokens={tokens} /></div>
                        {tokens.crawlData && <div id="drift"><DriftDashboard tokens={tokens} /></div>}
                        <div id="tokenengine-results-view" style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
                            <div id="colors"><ColorPalette tokens={tokens} /></div>
                            <div id="typography"><Typography tokens={tokens} /></div>
                            <div id="spacing"><SpacingSystem tokens={tokens} /></div>
                            <div id="radius"><RadiusSystem tokens={tokens} /></div>
                            <div id="shadows"><ShadowSystem tokens={tokens} /></div>
                            <div id="motion"><MotionSystem tokens={tokens} /></div>
                            <div id="layers"><LayerSystem tokens={tokens} /></div>
                            <div id="manifest" style={{ borderTop: '1px solid var(--border-default)', paddingTop: '64px' }}>
                                <div style={{ marginBottom: '32px' }}>
                                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Developer Manifest</h2>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Production formats for direct system consumption.</p>
                                </div>
                                <CodeExport tokens={tokens} activeRemix={activeRemix} remixCSS={remixCSS} />
                            </div>
                        </div>
                    </div>

                    <PreMonetization />
                </div>
            </section>

            {/* Design Remix Overlay */}
            {isRemixPanelOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(8px)',
                    padding: '24px'
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '800px',
                        backgroundColor: 'var(--bg-primary)',
                        borderRadius: '32px',
                        border: '1px solid var(--border-default)',
                        boxShadow: 'var(--shadow-2xl)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ padding: '32px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Design Evolution Engine</h2>
                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Apply a high-fidelity architectural remix to the current system.</p>
                            </div>
                            <button onClick={() => { setIsRemixPanelOpen(false); setTempRemix(null); }} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ padding: '32px', backgroundColor: 'var(--bg-app)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                            {PROFESSIONAL_THEMES.map((theme) => {
                                const isCurrent = (tempRemix?.id || activeRemix?.id) === theme.id;
                                return (
                                    <button
                                        key={theme.id}
                                        onClick={() => setTempRemix(theme)}
                                        style={{
                                            padding: '20px',
                                            borderRadius: '16px',
                                            border: '2px solid',
                                            borderColor: isCurrent ? 'var(--color-brand-500)' : 'var(--border-default)',
                                            backgroundColor: isCurrent ? 'var(--bg-primary)' : 'var(--bg-surface)',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            position: 'relative'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: `hsl(${theme.targetHue}, 70%, 50%)` }} />
                                            {isCurrent && <div style={{ color: 'var(--color-brand-500)' }}><Check size={16} /></div>}
                                        </div>
                                        <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>{theme.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{theme.description}</div>
                                    </button>
                                );
                            })}
                        </div>

                        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border-default)', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                            {activeRemix && (
                                <button
                                    onClick={() => { setActiveRemix(null); setTempRemix(null); setIsRemixPanelOpen(false); }}
                                    style={{ marginRight: 'auto', background: 'transparent', border: 'none', color: '#ff4444', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Reset to Original
                                </button>
                            )}
                            <button
                                onClick={() => { setTempRemix(null); setIsRemixPanelOpen(false); }}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                className="primary"
                                onClick={() => {
                                    if (tempRemix) setActiveRemix(tempRemix);
                                    setTempRemix(null);
                                    setIsRemixPanelOpen(false);
                                }}
                                style={{ borderRadius: '12px', padding: '0 32px' }}
                            >
                                Apply Design Evolution
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

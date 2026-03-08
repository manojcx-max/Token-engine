import { useState, useEffect, useRef, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Wand2,
    History,
    Layers,
    Zap,
    Terminal,
    Search,
    ArrowRight,
    Sparkles,
    Plus,
    Minus,
    Shuffle,
    AlertCircle,
    Check,
    Bot,
    Type,
    Code2
} from 'lucide-react';
import { PreMonetization } from '../components/PreMonetization';
import { LiveDemo } from '../components/LiveDemo';

function Reveal({ children, delay = 0 }: { children: ReactNode, delay?: number }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return (
        <div ref={ref} style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: `opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms`,
            willChange: 'opacity, transform'
        }}>
            {children}
        </div>
    );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={{ borderBottom: '1px solid var(--border-default)' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--text-primary)', boxShadow: 'none' }}
            >
                <span style={{ fontSize: '1.125rem', fontWeight: 500 }}>{question}</span>
                <span style={{ display: 'flex', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    {isOpen ? <Minus size={20} style={{ color: 'var(--text-secondary)' }} /> : <Plus size={20} style={{ color: 'var(--text-secondary)' }} />}
                </span>
            </button>
            <div style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: 'grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease', opacity: isOpen ? 1 : 0 }}>
                <div style={{ overflow: 'hidden' }}>
                    <p style={{ paddingBottom: '24px', margin: 0, color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>{answer}</p>
                </div>
            </div>
        </div>
    );
}

interface ExtractionHistory {
    url: string;
    domain: string;
    timestamp: number;
}

interface Tokens {
    colors: {
        brand: Record<string, string>;
        neutral: Record<string, string>;
        text: { primary: string; secondary: string };
        background: { primary: string; surface: string };
        border?: { default: string };
    };
    typography: {
        fontFamily?: { heading: string; body: string; ui: string };
        fontSize?: Record<string, string>;
        fontWeight?: Record<string, string>;
    };
    spacing: Record<string, string>;
    radius: {
        sm: string;
        md: string;
        lg: string;
    };
    shadow?: Record<string, string>;
    gradients?: string[];
    screens?: Record<string, string>;
    stats?: {
        extractionTime: string;
        tokensFound: number;
        colorsCount?: number;
        radiusCount?: number;
        spacingCount?: number;
        fontCount?: number;
        healthScore?: number;
        spacingConsistency?: string;
        radiusConsistency?: string;
        typographyConsistency?: string;
        consistency?: string;
        confidence?: Record<string, string>;
    };
    exports: {
        css: string;
        tailwind: any;
        json?: any;
        prompts: {
            universal: string;
            v0: string;
            claude: string;
            antigravity: string;
        };
    };
}

export default function Home() {
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [isDeepMode, setIsDeepMode] = useState(false);
    const [history, setHistory] = useState<ExtractionHistory[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('tokenengine_history');
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) { }
        }
    }, []);

    const saveHistory = (extUrl: string) => {
        try {
            const urlObj = new URL(extUrl.startsWith('http') ? extUrl : `https://${extUrl}`);
            const domain = urlObj.hostname;
            const newEntry = { url: extUrl, domain, timestamp: Date.now() };
            const updated = [newEntry, ...history.filter(h => h.domain !== domain)].slice(0, 5);
            setHistory(updated);
            localStorage.setItem('tokenengine_history', JSON.stringify(updated));
        } catch (e) { }
    };

    const handleExtractHistory = (hUrl: string) => {
        setUrl(hUrl);
        // handleExtract(hUrl); // Removed so user clicks Extract manually
        const el = document.getElementById('analyzer');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const handleExtract = async (overrideUrl?: string) => {
        const targetUrl = typeof overrideUrl === 'string' ? overrideUrl : url;
        if (!targetUrl) return;

        try {
            const urlObj = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
            const domain = urlObj.hostname;
            const saved = localStorage.getItem('tokenengine_history');
            const historyList = saved ? JSON.parse(saved) : [];
            const newEntry = { url: targetUrl, domain, timestamp: Date.now() };
            const updated = [newEntry, ...historyList.filter((h: any) => h.domain !== domain)].slice(0, 5);
            localStorage.setItem('tokenengine_history', JSON.stringify(updated));
        } catch (e) { }

        navigate(`/analyze?url=${encodeURIComponent(targetUrl)}${isDeepMode ? '&crawl=true' : ''}`);
    };

    return (
        <main style={{ paddingBottom: '128px' }}>
            {/* 1️⃣ Hero Section */}
            <section style={{ padding: '60px 24px 80px 24px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                <Reveal>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '100px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        <Zap size={14} style={{ fill: 'var(--text-primary)', color: 'var(--text-primary)' }} /> TokenEngine v1.0 Beta
                    </div>
                </Reveal>
                <Reveal delay={100}>
                    <h1 style={{ fontSize: '4.75rem', fontWeight: 600, letterSpacing: '-0.05em', lineHeight: 1.0, maxWidth: '900px', margin: '0 auto 24px auto', color: 'var(--text-primary)' }}>
                        Deterministic tokens.<br />For AI builders.
                    </h1>
                </Reveal>
                <Reveal delay={200}>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 400, maxWidth: '640px', margin: '0 auto 64px auto', lineHeight: 1.6 }}>
                        Extract any website's design system into a production-ready Tailwind config. Stop letting your AI code editor hallucinate hex codes.
                    </p>
                </Reveal>

                <Reveal delay={300}>
                    <div id="analyzer" style={{ maxWidth: '640px', margin: '0 auto', position: 'relative' }}>
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
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
                                    disabled={!url && false} // keep interactive
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
                                onClick={() => handleExtract()}
                                disabled={!url}
                                data-cursor-info="Analyze the data!"
                                style={{
                                    height: '50px',
                                    padding: '0 28px',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    opacity: url ? 1 : 0.5,
                                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                            >
                                <ArrowRight size={18} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                                <div
                                    onClick={() => setIsDeepMode(!isDeepMode)}
                                    style={{
                                        width: '44px',
                                        height: '24px',
                                        borderRadius: '100px',
                                        backgroundColor: isDeepMode ? 'var(--color-brand-500)' : 'var(--bg-surface)',
                                        border: '1px solid var(--border-default)',
                                        position: 'relative',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '2px'
                                    }}
                                >
                                    <div style={{
                                        width: '18px',
                                        height: '18px',
                                        borderRadius: '50%',
                                        backgroundColor: isDeepMode ? '#fff' : 'var(--text-tertiary)',
                                        transform: isDeepMode ? 'translateX(20px)' : 'translateX(0)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }} />
                                </div>
                                <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                    Deep Analysis <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>(Crawl 5 internal pages to detect design drift)</span>
                                </span>
                            </label>
                        </div>

                        {/* CLI Roadmap Note */}
                        <div style={{
                            marginTop: '24px',
                            padding: '14px 20px',
                            borderRadius: '14px',
                            backgroundColor: '#000000',
                            border: '1px solid #2a2a2a',
                            textAlign: 'left',
                            fontFamily: 'monospace',
                            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '16px'
                        }}>
                            <div>
                                <div style={{ fontSize: '10px', color: '#666', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                                    On the Roadmap
                                </div>
                                <div style={{ fontSize: '14px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ color: '#4CAF50' }}>$</span>
                                    <span>npx @tokenengine/cli extract <span style={{ color: '#888' }}>linear.app</span></span>
                                </div>
                            </div>
                            <div style={{
                                fontSize: '11px',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                backgroundColor: '#1a1a1a',
                                border: '1px solid #333',
                                color: '#666',
                                whiteSpace: 'nowrap',
                                fontFamily: 'inherit',
                                letterSpacing: '0.04em'
                            }}>
                                CLI — Coming Later
                            </div>
                        </div>

                    </div>
                </Reveal>

                <Reveal delay={400}>
                    <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
                        <button
                            onClick={() => {
                                const sites = ['linear.app', 'stripe.com', 'vercel.com', 'raycast.com', 'github.com', 'anthropic.com', 'perplexity.ai', 'figma.com'];
                                const randomSite = sites[Math.floor(Math.random() * sites.length)];
                                setUrl(randomSite);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 16px',
                                fontSize: '13px',
                                borderRadius: '100px',
                                border: '1px solid var(--border-default)',
                                background: 'var(--bg-surface)',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontWeight: 600
                            }}
                            className="hover-lift"
                            data-cursor-info="Try something new"
                        >
                            <Shuffle size={14} /> Random Example
                        </button>
                    </div>

                    {/* Habit Layer: Recent Extractions */}
                    {history.length > 0 && (
                        <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '13px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <History size={14} /> Recent Analyzers
                            </span>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {history.map((h, i) => (
                                    <button key={`${h.domain}-${i}`} onClick={() => handleExtractHistory(h.url)} className="secondary hover-lift" style={{ padding: '6px 16px', fontSize: '13px', borderRadius: '100px', border: '1px solid var(--border-default)', background: 'var(--bg-surface)' }}>
                                        {h.domain}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </Reveal>
            </section>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                {/* Live Interactive Demo */}
                <Reveal>
                    <LiveDemo />
                </Reveal>

                {/* Trusted Logos Strip */}
                <Reveal>
                    <div style={{ padding: '80px 48px', margin: '64px 0', border: '1px solid var(--border-default)', borderRadius: '24px', backgroundColor: 'var(--bg-surface)', position: 'relative', overflow: 'hidden' }}>
                        {/* Embedded Localized Noise Texture */}
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.15, mixBlendMode: 'overlay', backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, pointerEvents: 'none' }} />

                        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                            <div style={{ marginBottom: '32px', color: 'var(--border-hover)', display: 'flex', justifyItems: 'center', width: '100%', justifyContent: 'center' }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" /></svg>
                            </div>
                            <h3 style={{ fontSize: '2rem', fontWeight: 500, lineHeight: 1.4, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '32px' }}>
                                "AI builders generate UI fast — but without structure, it becomes inconsistent. <br /><span style={{ color: 'var(--text-secondary)' }}>TokenEngine extracts your reference website’s design system and turns it into production-ready tokens,</span> and prompts your AI can follow strictly."
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                                <div style={{ height: '1px', width: '40px', backgroundColor: 'var(--border-default)' }} />
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, margin: 0 }}>
                                    The Core Problem Solved
                                </p>
                                <div style={{ height: '1px', width: '40px', backgroundColor: 'var(--border-default)' }} />
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* How it Works / Compare */}
                <Reveal>
                    <section style={{ padding: '120px 0', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px' }}>
                            <div style={{ padding: '8px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-default)', marginBottom: '24px' }}>
                                <Layers size={24} style={{ color: 'var(--text-primary)' }} />
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.03em', margin: '0 0 16px 0', color: 'var(--text-primary)' }}>Stop letting AI guess your styles.</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '500px', lineHeight: 1.5, margin: 0 }}>Provide an exact, extracted design system directly into your prompt. No more magic numbers.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
                            <div className="card" style={{ backgroundColor: 'transparent', border: '1px dashed var(--border-hover)', padding: '32px', borderRadius: '16px' }}>
                                <h3 style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prompted without TokenEngine</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ padding: '12px 16px', borderRadius: '6px', backgroundColor: 'var(--code-bg)', color: 'var(--text-primary)', fontSize: '13px', border: '1px solid var(--border-default)', fontFamily: 'var(--font-mono)' }}>bg-[#1a1a1a] text-[#ffffff]</div>
                                    <div style={{ padding: '12px 16px', borderRadius: '6px', backgroundColor: 'var(--code-bg)', color: 'var(--text-primary)', fontSize: '13px', border: '1px solid var(--border-default)', fontFamily: 'var(--font-mono)' }}>rounded-[5px] p-[15px]</div>
                                    <div style={{ padding: '12px 16px', borderRadius: '6px', backgroundColor: 'var(--code-bg)', color: 'var(--text-primary)', fontSize: '13px', border: '1px solid var(--border-default)', fontFamily: 'var(--font-mono)' }}>box-shadow: 0 4px 6px rgba(...)</div>
                                    <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14} /> Inconsistent, brittle hardcoded values.</p>
                                </div>
                            </div>
                            <div className="card" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', padding: '32px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, transparent, var(--text-primary), transparent)' }} />
                                <h3 style={{ color: 'var(--text-primary)', marginBottom: '24px', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>Prompted with TokenEngine</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ padding: '12px 16px', borderRadius: '6px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-focus)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)' }}><Check size={14} style={{ color: '#10b981' }} /> bg-surface text-primary</div>
                                    <div style={{ padding: '12px 16px', borderRadius: '6px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)' }}><Check size={14} style={{ color: '#10b981' }} /> rounded-lg p-6</div>
                                    <div style={{ padding: '12px 16px', borderRadius: '6px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)' }}><Check size={14} style={{ color: '#10b981' }} /> shadow-md</div>
                                    <p style={{ color: '#10b981', fontSize: '13px', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} /> Deterministic, exact design system usage.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </Reveal>

                {/* Features Grid */}
                <Reveal>
                    <section style={{ padding: '64px 0 120px 0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                            <div style={{ padding: '32px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: '16px' }}>
                                <Terminal size={24} style={{ marginBottom: '24px', color: 'var(--text-primary)' }} />
                                <h4 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px', letterSpacing: '-0.02em' }}>Tailwind Ready</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>Generates a fully typed tailwind.config.js instantly from any live URL. Drop it in and start coding entirely in brand.</p>
                            </div>
                            <div style={{ padding: '32px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: '16px' }}>
                                <Code2 size={24} style={{ marginBottom: '24px', color: 'var(--text-primary)' }} />
                                <h4 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px', letterSpacing: '-0.02em' }}>Figma W3C Tokens</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>Exports standard Figma JSON Variables. Drag and drop the generated file directly into Tokens Studio to build UI Kits instantly.</p>
                            </div>
                            <div style={{ padding: '32px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: '16px' }}>
                                <Sparkles size={24} style={{ marginBottom: '24px', color: 'var(--text-primary)' }} />
                                <h4 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px', letterSpacing: '-0.02em' }}>Design Evolution</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>Extracted a boring structure? Spin it up via the Remix Evolution engine. Instantly map layouts to new professional themes like "Vanguard" or "Obsidian".</p>
                            </div>
                            <div style={{ padding: '32px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: '16px' }}>
                                <Type size={24} style={{ marginBottom: '24px', color: 'var(--text-primary)' }} />
                                <h4 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px', letterSpacing: '-0.02em' }}>Deep Analysis</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>Goes beyond colors. Extracts border radiuses, typography scaling, shadow logic, and spatial grids into logical tokens.</p>
                            </div>
                        </div>
                    </section>
                </Reveal>

                {/* ✨ The Value / Why Needed */}
                <Reveal>
                    <section style={{ padding: '120px 0', borderTop: '1px solid var(--border-default)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '64px', maxWidth: '600px', margin: '0 auto 64px auto' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '100px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px' }}>
                                <Sparkles size={14} /> The Value Proposition
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: '0 0 24px 0' }}>Banish design debt forever.</h2>
                            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>When you give AI a pure framework instead of raw instructions, your codebase stays cohesive. Stop refactoring messy inline styles and start shipping fast.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                            <div style={{ padding: '40px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="hover-lift">
                                <h3 style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.04em' }}>90%</h3>
                                <h4 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>Fewer AI Hallucinations</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>By providing a strict Tailwind configuration, your AI agent never has to invent hex colors or weird padding sizes. It uses exact, enforced standard variables.</p>
                            </div>
                            <div style={{ padding: '40px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-default)', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundImage: 'radial-gradient(circle at top right, var(--accent-ghost), transparent 50%)' }} className="hover-lift">
                                <h3 style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.04em' }}>10x</h3>
                                <h4 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>Faster Bootstrapping</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>See a design system you like? Extract it in 3 seconds. Copy the generated AI prompt, paste it into v0 or Lovable, and your new app inherits the exact premium feel.</p>
                            </div>
                        </div>
                    </section>
                </Reveal>

                {/* ⚙️ How It Works */}
                <Reveal>
                    <section style={{ padding: '120px 0', borderTop: '1px solid var(--border-default)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: '0 0 16px 0' }}>How TokenEngine Works</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>Three simple steps to perfect AI-driven UI.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', position: 'relative' }}>
                            {/* Horizontal connecting line for desktop view */}
                            <div style={{ position: 'absolute', top: '32px', left: '15%', right: '15%', height: '1px', background: 'var(--border-default)', zIndex: -1 }} className="hide-on-mobile" />

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px' }} className="hover-lift">
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>1</div>
                                <Search size={32} style={{ color: 'var(--text-secondary)' }} />
                                <div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px' }}>Analyze Target URL</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>We scrape and compute all rendered CSS variables, parsing computed styles to map out the underlying design intention.</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px' }} className="hover-lift">
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>2</div>
                                <Code2 size={32} style={{ color: 'var(--text-secondary)' }} />
                                <div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px' }}>Generate Config</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>We automatically build a fully functional, deterministic Tailwind CSS configuration file ready to drop into your project.</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px' }} className="hover-lift">
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--text-primary)', border: '1px solid var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 600, color: 'var(--bg-primary)' }}>3</div>
                                <Bot size={32} style={{ color: 'var(--text-primary)' }} />
                                <div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px' }}>Prompt the AI</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>Copy our generated AI-Agent prompt instructions that perfectly explain your new design system to Claude, v0, or Lovable.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </Reveal>

                <Reveal>
                    <div style={{ padding: '0 0 120px 0' }}>
                        <PreMonetization />
                    </div>
                </Reveal>

                {/* ❓ FAQ */}
                <Reveal>
                    <section style={{ padding: '120px 0', borderTop: '1px solid var(--border-default)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: '0 0 16px 0' }}>Frequently Asked Questions</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>Everything you need to know about the platform.</p>
                        </div>
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <FaqItem question="Does this work on any website?" answer="TokenEngine works best on modern websites that utilize clear CSS variables, utility classes, or structured component libraries (like React or Vue apps). For legacy sites using heavy image-based styling, extraction might be limited or less deterministic." />
                            <FaqItem question="Why do I need this specifically for AI development?" answer="AI models like Claude or Cursor are great at writing code, but they easily 'hallucinate' design decisions. They'll invent arbitrary spacing (like p-[17px]) or pull random hex colors instead of sticking to your brand guidelines. By passing our generated system into the prompt, you constrain the AI to only use valid design tokens." />
                            <FaqItem question="Is the beta completely free?" answer="Yes! While we are in public beta, you can extract as many domains as you want using our core engine. Pricing will be introduced later for advanced enterprise features like continuous token syncing, Git integrations, and unlimited API usage." />
                            <FaqItem question="Can I use this without Tailwind?" answer="Absolutely. While our primary output targets Tailwind CSS for rapid AI prototyping, we also provide raw JSON token exports and standard CSS variable sheets for custom integrations." />
                        </div>
                    </section>
                </Reveal>

                {/* 🚀 CTA / Contact Bottom */}
                <Reveal>
                    <section style={{ padding: '120px 0', borderTop: '1px solid var(--border-default)', textAlign: 'center' }}>
                        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: '24px', padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
                            {/* Subtle background glow */}
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, var(--accent-ghost) 0%, transparent 60%)', zIndex: 0, opacity: 0.5, pointerEvents: 'none' }} />

                            <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '100px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-default)', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '32px' }}>
                                    <Zap size={14} /> Ready to deploy?
                                </div>
                                <h2 style={{ fontSize: '3rem', fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--text-primary)', margin: '0 0 24px 0', lineHeight: 1.1 }}>Ship premium UI.<br />In seconds.</h2>
                                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '48px', lineHeight: 1.6 }}>Stop guessing hex codes. Get a deterministic design system for your next AI-generated application instantly.</p>
                                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <button className="primary hover-lift" style={{ height: '48px', padding: '0 32px', fontSize: '15px', borderRadius: '12px' }} onClick={() => { document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' }); }} data-cursor-info="Let's build!">
                                        Start Extracting <ArrowRight size={16} />
                                    </button>
                                    <Link to="/pricing" style={{ textDecoration: 'none' }}>
                                        <button className="secondary hover-lift" style={{ height: '48px', padding: '0 32px', fontSize: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-default)', backgroundColor: 'transparent' }} data-cursor-info="View plans">
                                            See pricing
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </Reveal>
            </div>
        </main>
    );
}

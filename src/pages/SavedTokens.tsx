import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Download, X, Copy, Check, Clock, Trash2, Code2 } from 'lucide-react';
import { SavedAnalysis } from '../types/tokens';
import { ColorPalette } from '../components/analysis/ColorPalette';
import { Typography } from '../components/analysis/Typography';
import { RadiusSystem } from '../components/analysis/RadiusSystem';
import { SpacingSystem } from '../components/analysis/SpacingSystem';
import { ShadowSystem } from '../components/analysis/ShadowSystem';
import { Breakpoints } from '../components/analysis/Breakpoints';
import { AIPrompts } from '../components/analysis/AIPrompts';
import { CodeExport } from '../components/analysis/CodeExport';
import { MotionSystem } from '../components/analysis/MotionSystem';
import { BrandLogo } from '../components/BrandLogo';
import { generateRemixCSS } from '../utils/remixEngine';

export default function SavedTokens() {
    const navigate = useNavigate();
    const [savedTokens, setSavedTokens] = useState<SavedAnalysis[]>([]);
    const [selectedAnalysis, setSelectedAnalysis] = useState<SavedAnalysis | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    useEffect(() => {
        const load = () => {
            try {
                const existing = localStorage.getItem('tokenengine_saved');
                if (existing) {
                    setSavedTokens(JSON.parse(existing));
                }
            } catch (e) {
                console.error("Failed to load saved tokens", e);
            }
        };
        load();
    }, []);

    const handleDelete = (id: string) => {
        const filtered = savedTokens.filter(t => t.id !== id);
        setSavedTokens(filtered);
        localStorage.setItem('tokenengine_saved', JSON.stringify(filtered));
        if (selectedAnalysis?.id === id) {
            setSelectedAnalysis(null);
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

    return (
        <>
            <main className="animate-in" style={{ padding: '64px 24px 128px 24px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh', width: '100%' }}>
                <div style={{ marginBottom: '48px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-default)', paddingBottom: '24px' }}>
                    <History size={24} style={{ color: 'var(--text-primary)' }} />
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 600, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Saved Tokens Library</h1>
                        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '15px' }}>Access your previously analyzed websites and design systems.</p>
                    </div>
                </div>

                {savedTokens.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px', backgroundColor: 'var(--bg-surface)', border: '1px dashed var(--border-default)', borderRadius: '16px', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>No saved analysis yet</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: '0 0 24px 0', maxWidth: '400px' }}>Extract a design system from the home page and save it here for later.</p>
                        <button className="primary hover-lift" onClick={() => navigate('/')} style={{ padding: '0 24px', borderRadius: '8px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Start Extracting
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                        {savedTokens.map((analysis) => (
                            <div key={analysis.id} className="card hover-lift" style={{ padding: '32px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px', cursor: 'pointer', transition: 'transform 0.4s var(--transition-smooth), box-shadow 0.4s var(--transition-smooth)' }} onClick={() => setSelectedAnalysis(analysis)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-all', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{analysis.domain}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                    <Clock size={14} />
                                    {new Date(analysis.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-default)', position: 'relative' }}>

                                    {/* Normal Actions Footer */}
                                    <div style={{ display: 'flex', gap: '8px', flex: 1, opacity: confirmDeleteId === analysis.id ? 0 : 1, transition: 'opacity 0.2s', pointerEvents: confirmDeleteId === analysis.id ? 'none' : 'auto' }}>
                                        <button className="primary" style={{ flex: 1, padding: '10px', borderRadius: '8px', fontSize: '14px', height: 'auto', boxShadow: 'none' }} onClick={(e) => { e.stopPropagation(); setSelectedAnalysis(analysis); }}>
                                            View Tokens
                                        </button>
                                        <button className="secondary" onClick={(e) => {
                                            e.stopPropagation();
                                            if (analysis.tokens.exports?.json) {
                                                downloadFile(JSON.stringify(analysis.tokens.exports.json, null, 2), `${analysis.domain}-tokens.json`, 'application/json');
                                            }
                                        }} style={{ padding: '10px 14px', backgroundColor: 'var(--bg-app)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)', borderRadius: '8px', cursor: 'pointer', height: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Export JSON">
                                            <Download size={16} />
                                        </button>
                                        <button className="secondary" onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(analysis.id); }} style={{ padding: '10px 14px', backgroundColor: 'var(--error-bg)', color: 'var(--error-text)', border: '1px solid transparent', borderRadius: '8px', cursor: 'pointer', height: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete Analysis">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {/* Confirmation Footer Overlay */}
                                    <div style={{ position: 'absolute', inset: '20px 0 0 0', display: 'flex', gap: '8px', alignItems: 'center', opacity: confirmDeleteId === analysis.id ? 1 : 0, transition: 'opacity 0.2s', pointerEvents: confirmDeleteId === analysis.id ? 'auto' : 'none' }}>
                                        <div style={{ flex: 1, fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>Confirm delete?</div>
                                        <button className="secondary" onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }} style={{ padding: '8px 12px', borderRadius: '8px', height: '36px' }}>Cancel</button>
                                        <button className="primary" onClick={(e) => { e.stopPropagation(); handleDelete(analysis.id); setConfirmDeleteId(null); }} style={{ padding: '8px 12px', borderRadius: '8px', height: '36px', backgroundColor: 'var(--error-bg)', color: 'var(--error-text)' }}>Delete</button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal for Details */}
            {selectedAnalysis && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', animation: 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }} onClick={() => setSelectedAnalysis(null)}>
                    <div className="animate-in" style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-default)', borderRadius: '24px', width: '100%', maxWidth: '1200px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-xl)', animationDuration: '0.4s' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '24px 32px', borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--bg-surface)' }}>
                            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                <BrandLogo size={32} />
                                <div>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: 600, margin: '0 0 4px 0', color: 'var(--text-primary)', lineHeight: 1.2 }}>{selectedAnalysis.domain}</h2>
                                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Clock size={12} />
                                        Analyzed: {new Date(selectedAnalysis.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button
                                    className="secondary hover-lift"
                                    onClick={() => downloadFile(JSON.stringify(selectedAnalysis.tokens, null, 2), `${selectedAnalysis.domain}-tokens.json`, 'application/json')}
                                    style={{ padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
                                >
                                    <Download size={16} /> JSON
                                </button>
                                {selectedAnalysis.tokens.exports?.css && (
                                    <button
                                        className="secondary hover-lift"
                                        onClick={() => downloadFile(selectedAnalysis.tokens.exports.css, `${selectedAnalysis.domain}-tokens.css`, 'text/css')}
                                        style={{ padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
                                    >
                                        <Download size={16} /> CSS
                                    </button>
                                )}
                                <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-default)', margin: '0 8px' }} />
                                <button className="secondary hover-lift" onClick={() => setSelectedAnalysis(null)} style={{ padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <div
                            data-lenis-prevent
                            style={{ overflowY: 'auto', padding: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', scrollBehavior: 'smooth' }}
                        >
                            <ColorPalette tokens={selectedAnalysis.tokens} />
                            <Typography tokens={selectedAnalysis.tokens} />
                            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <SpacingSystem tokens={selectedAnalysis.tokens} />
                                <RadiusSystem tokens={selectedAnalysis.tokens} />
                                <ShadowSystem tokens={selectedAnalysis.tokens} />
                                <MotionSystem tokens={selectedAnalysis.tokens} />
                                <Breakpoints tokens={selectedAnalysis.tokens} />
                            </div>
                            <AIPrompts tokens={selectedAnalysis.tokens} />
                            <div style={{ gridColumn: '1 / -1', marginTop: '32px' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>Developer Exports</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                                    <CodeExport
                                        tokens={selectedAnalysis.tokens}
                                        activeRemix={selectedAnalysis.activeRemix}
                                        remixCSS={selectedAnalysis.activeRemix ? generateRemixCSS(selectedAnalysis.activeRemix, selectedAnalysis.tokens) : undefined}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

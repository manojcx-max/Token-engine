import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Outlet, Link } from 'react-router-dom';
import CustomCursor from './CustomCursor';
import { BrandLogo } from './BrandLogo';
import { WaitlistModal } from './WaitlistModal';
import Lenis from 'lenis';

export default function Layout() {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    });
    const [scrolled, setScrolled] = useState(false);
    const [showWaitlist, setShowWaitlist] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
            document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}`);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="min-h-screen relative" style={{ display: 'flex', flexDirection: 'column' }}>
            <CustomCursor />
            {/* Design Elements */}
            <div className="bg-ambient-fluid" />
            <div className="bg-lines" />
            <div className="bg-lines-extended" />
            <div className="noise-bg" />

            {/* Navbar Section */}
            <header style={{
                position: 'fixed',
                top: scrolled ? '16px' : '24px',
                left: 0,
                right: 0,
                zIndex: 100,
                display: 'flex',
                justifyContent: 'center',
                padding: '0 24px',
                pointerEvents: 'none',
                transition: 'top 0.4s ease'
            }}>
                <nav style={{
                    maxWidth: scrolled ? '480px' : '1000px',
                    width: '100%',
                    height: '60px',
                    backgroundColor: 'var(--bg-nav)',
                    backdropFilter: 'blur(32px)',
                    WebkitBackdropFilter: 'blur(32px)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: scrolled ? '0 16px' : '0 24px',
                    boxShadow: 'var(--shadow-xl)',
                    transition: 'max-width 0.6s cubic-bezier(0.16, 1, 0.3, 1), padding 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    pointerEvents: 'auto',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                        {/* Logo */}
                        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                            <BrandLogo size={22} />
                            <span style={{ fontWeight: 600, fontSize: '16px', letterSpacing: '-0.02em' }}>TokenEngine</span>
                        </Link>

                        {/* Navigation Links */}
                        {!scrolled && (
                            <div style={{ display: 'flex', gap: '24px', fontSize: '13px', fontWeight: 500 }}>
                                <Link to="/analyze" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Analyze</Link>
                                <Link to="/saved" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Saved Tokens</Link>
                                <Link to="/pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Pricing</Link>
                            </div>
                        )}
                    </div>

                    {/* Action Area */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        {scrolled && (
                            <Link to="/analyze" style={{
                                color: 'var(--text-primary)',
                                textDecoration: 'none',
                                fontSize: '13px',
                                fontWeight: 600,
                                marginRight: '4px'
                            }}>Analyze</Link>
                        )}
                        <button
                            onClick={() => setShowWaitlist(true)}
                            style={{
                                height: '40px',
                                padding: '0 20px',
                                backgroundColor: 'var(--text-primary)',
                                color: 'var(--bg-primary)',
                                border: '1px solid var(--border-default)',
                                borderRadius: '10px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease, filter 0.3s ease',
                                boxShadow: 'var(--shadow-sm)'
                            }}
                        >
                            Interested?
                        </button>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: '80px', position: 'relative' }}>
                <Outlet />
            </div>

            {/* Waitlist Modal */}
            <WaitlistModal
                isOpen={showWaitlist}
                onClose={() => setShowWaitlist(false)}
            />

            {/* Detached Animated Theme Toggle */}
            <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 110 }}>
                <div
                    className="theme-toggle-container"
                    onClick={toggleTheme}
                    style={{ '--thumb-pos': theme === 'light' ? '28px' : '0px' } as any}
                >
                    <div className="theme-bg-icons">
                        <Moon size={14} />
                        <Sun size={14} />
                    </div>
                    <div className="theme-thumb">
                        {theme === 'dark' ? <Moon className="theme-icon" /> : <Sun className="theme-icon" />}
                    </div>
                </div>
            </div>

            {/* Premium Detailed Footer */}
            <footer style={{
                borderTop: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-primary)',
                padding: '80px 24px 40px 24px',
                zIndex: 10,
                position: 'relative'
            }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '64px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <BrandLogo size={24} />
                            TokenEngine
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, maxWidth: '280px', marginBottom: '24px' }}>
                            The intelligence layer for your AI design system. Built for speed and exact deterministic precision.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <a href="https://twitter.com/tokenengine" target="_blank" rel="noopener noreferrer" className="hover-lift" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', textDecoration: 'none' }} data-cursor-info="Follow on X">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a
                                href="https://twitter.com/placeholder"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover-lift"
                                style={{
                                    textDecoration: 'none',
                                    height: '36px',
                                    padding: '0 16px',
                                    borderRadius: '100px',
                                    border: '1px solid var(--border-default)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: 'var(--text-secondary)',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    backgroundColor: 'var(--bg-surface)'
                                }}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                Got ideas? Let's talk
                            </a>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px', letterSpacing: '0.02em' }}>Product</span>
                        <Link to="/" className="footer-link" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease' }}>Home</Link>
                        <Link to="/analyze" className="footer-link" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease' }}>Analyze</Link>
                        <Link to="/features" className="footer-link" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease' }}>Features</Link>
                        <Link to="/pricing" className="footer-link" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease' }}>Pricing</Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px', letterSpacing: '0.02em' }}>Resources</span>
                        <Link to="/docs" className="footer-link" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease' }}>Documentation</Link>
                        <a href="mailto:hello@tokenengine.ai" className="footer-link" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease' }}>Support</a>
                        <a href="#" className="footer-link" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease' }}>Community Discord</a>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px', letterSpacing: '0.02em' }}>Legal</span>
                        <Link to="/privacy" className="footer-link" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease' }}>Privacy Policy</Link>
                        <Link to="/terms" className="footer-link" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease' }}>Terms of Service</Link>
                    </div>
                </div>

                <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '32px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                        © {new Date().getFullYear()} TokenEngine Inc. All rights reserved.
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '6px 12px', borderRadius: '100px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>All systems operational</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

import { Scale } from 'lucide-react';

export default function Terms() {
    return (
        <main style={{ padding: '80px 24px 120px 24px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }} className="animate-in">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '100px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px' }}>
                    <Scale size={14} /> Legal
                </div>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--text-primary)', margin: '0 0 24px 0', lineHeight: 1.1 }}>
                    Terms of Service.
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                    Operations, acceptable usage, and liability framework for the extraction engine.
                </p>
            </div>
            <section className="card animate-in delay-2" style={{ color: 'var(--text-secondary)', lineHeight: '1.6', padding: '48px' }}>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>1. System Usage</h3>
                <p style={{ marginBottom: '24px' }}>
                    TokenEngine extraction processes are rate-limited. Scraping algorithms strictly target structural endpoints on public web properties. Attempting to target gated pages or execute cross-site forgery commands within the URL extraction field is restricted.
                </p>

                <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>2. Liability</h3>
                <p style={{ marginBottom: '24px' }}>
                    We provide this architectural extraction tool "As-Is". Engine operations may fail based on unexpected client-side rendering protocols, internal blocks, or specific DOM protections implemented by target architectures. We claim no liability over the generated output nor the ownership of the resultant properties extracted.
                </p>
            </section>
        </main>
    );
}

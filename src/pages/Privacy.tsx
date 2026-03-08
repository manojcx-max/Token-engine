import { Shield } from 'lucide-react';

export default function Privacy() {
    return (
        <main style={{ padding: '80px 24px 120px 24px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }} className="animate-in">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '100px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px' }}>
                    <Shield size={14} /> Security
                </div>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--text-primary)', margin: '0 0 24px 0', lineHeight: 1.1 }}>
                    Privacy Policy.
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                    Clear details on how we protect your extraction requests and local data.
                </p>
            </div>
            <section className="card animate-in delay-2" style={{ color: 'var(--text-secondary)', lineHeight: '1.6', padding: '48px' }}>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Data Collection Matrix</h3>
                <p style={{ marginBottom: '24px' }}>
                    TokenEngine does not store extracted data matrices, URL request logs, or output design system architectures on our servers beyond the scope of instantaneous rendering. All system states operate transiently.
                </p>

                <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Local Storage</h3>
                <p style={{ marginBottom: '24px' }}>
                    Local environment properties, such as target platform preference (dark/light themes), are resolved locally via your browser's persistent state (localStorage). No tracking cookies are dispatched during operations.
                </p>
            </section>
        </main>
    );
}

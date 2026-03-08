export default function About() {
    return (
        <main className="container animate-in">
            <header style={{ textAlign: 'left', maxWidth: 'none', marginBottom: '48px' }}>
                <h1 style={{ fontSize: '36px' }}>About TokenEngine.</h1>
                <p style={{ maxWidth: '600px' }}>Extracting deterministic variables from wild DOMs.</p>
            </header>
            <section className="card" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '16px' }}>
                    TokenEngine was built to solve the repetitive process of mapping existing web properties into structured variables by bridging web scraping logic with deterministic CSS heuristics.
                </p>
                <p style={{ marginBottom: '16px' }}>
                    Rather than copying hardcoded hex codes, developers require an organized and semantic collection of values that conform to engineering standards (scales, padding grids, normalized sizing).
                </p>
                <p>
                    By targeting structural components directly and interpreting the perceptual brightness of outputs, the system synthesizes intelligent design tokens faster than manual reconstruction.
                </p>
            </section>
        </main>
    );
}

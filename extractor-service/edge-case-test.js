import { launchBrowser, setupPage, navigate } from './renderer.js';
import { sampleStyles } from './sampler.js';
import { classifyColors } from './classifier.js';
import { buildTokens } from './tokenBuilder.js';
import fs from 'fs';
import path from 'path';

async function runEdgeCaseTest() {
    const filePath = 'file:///' + path.join(process.cwd(), 'extractor-service', 'test-edge-cases.html').replace(/\\/g, '/');
    console.log(`\n🧪 Running Edge Case Test on: ${filePath}`);

    let browser;
    try {
        browser = await launchBrowser();
        const page = await setupPage(browser);
        await navigate(page, filePath);

        const samples = await sampleStyles(page);

        console.log('\n--- RAW SAMPLES (PARTIAL) ---');
        console.log('Text Color Sample[0]:', samples.text[0]?.color);
        console.log('Interactive BG Sample[0]:', samples.interactive[0]?.backgroundColor);
        console.log('CSS Vars Sample (Brand):', samples.cssVars['--brand-oklch']);
        console.log('Spacing Sample (Padding):', samples.spacing.find(s => s.property === 'paddingTop')?.value);
        console.log('Motion Sample[0]:', samples.motion[0]);

        const tokens = buildTokens({
            colors: classifyColors(samples),
            typography: { heading: 'Inter', body: 'Inter', ui: 'Inter', fontSizeScale: {}, meta: {} },
            radius: { scale: [8, 16], meta: {} },
            spacing: { scale: [4, 8, 12, 16], meta: {} },
            shadows: samples.shadows,
            gradients: samples.gradients,
            zIndices: samples.zIndices,
            motion: { durations: [200], easings: [] },
            stats: {}
        });

        console.log('\n--- EXTRACTED TOKENS ---');
        console.log('Brand Color:', tokens.colors?.brand?.[500]);
        console.log('Neutral Scale:', tokens.colors?.neutral);

        if (!tokens.colors?.brand?.[500]) {
            console.log('\n❌ EDGE CASE FOUND: OKLCH colors were NOT detected in brand palette.');
        } else {
            console.log('\n✅ OKLCH detected (likely converted to RGB by browser).');
        }

        const report = `
--- EDGE CASE TEST REPORT ---
Page: ${filePath}
RAW:
  Text Color: ${samples.text[0]?.color}
  Interactive BG: ${samples.interactive[0]?.backgroundColor}
  CSS Var (Brand): ${samples.cssVars['--brand-oklch']}
  Spacing (Padding): ${samples.spacing.find(s => s.property === 'paddingTop')?.value}
TOKENS:
  Brand 500: ${tokens.colors?.brand?.[500]}
  Neutral: ${JSON.stringify(tokens.colors?.neutral)}
  Shadows: ${JSON.stringify(tokens.shadow)}
        `;
        console.log(report);
        fs.writeFileSync(path.join(process.cwd(), 'edge-case-log.txt'), report);

        await browser.close();
    } catch (e) {
        console.error('Test failed:', e);
        if (browser) await browser.close();
    }
}

runEdgeCaseTest();

import { launchBrowser, setupPage, navigate } from './renderer.js';
import { sampleStyles } from './sampler.js';
import { classifyColors } from './classifier.js';
import { clusterDeterministic, analyzeTypographyRelations, analyzeMotionRelations } from './cluster.js';
import { buildTokens } from './tokenBuilder.js';
import fs from 'fs';

const STRESS_TARGETS = [
    'https://www.apple.com',
    'https://framer.com',
    'https://www.amazon.com',
    'https://www.google.com',
    'https://discord.com',
    'https://stripe.com'
];

async function stressTest() {
    console.log('🌪️  RUNNING STRESS TEST — EDGE CASE HUNTING');
    let log = '--- STRESS TEST REPORT ---\n';

    for (const url of STRESS_TARGETS) {
        console.log(`\n🔍 TESTING: ${url}`);
        let browser;
        try {
            browser = await launchBrowser();
            const page = await setupPage(browser);
            await navigate(page, url);

            const samples = await sampleStyles(page);
            const nodes = (await page.$$('*')).length;

            const colors = classifyColors(samples);
            const radius = clusterDeterministic(samples.interactive, 'radius', 3);
            const spacing = clusterDeterministic(samples.spacing, 'spacing', 8);

            const res = `
[${url}]
   Nodes: ${nodes}
   Brand: ${colors.brand.primary || '❌'}
   Spacing Stops: ${spacing.core.length}
   Motion Points: ${samples.motion.length}
            `;
            console.log(res);
            log += res;

            await browser.close();
        } catch (e) {
            const crash = `   💥 CRASHED: ${url} -> ${e.message}\n`;
            console.log(crash);
            log += crash;
            if (browser) await browser.close();
        }
    }
    fs.writeFileSync('stress-log.txt', log);
}

stressTest();

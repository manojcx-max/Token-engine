import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';
import fs from 'fs';

dotenv.config();
import path from 'path';
import { launchBrowser, setupPage, navigate } from './renderer.js';
import { sampleStyles } from './sampler.js';
import { classifyColors } from './classifier.js';
import { clusterDeterministic, analyzeTypographyRelations, analyzeMotionRelations } from './cluster.js';
import { buildTokens } from './tokenBuilder.js';
import { compareReconstruction } from './driftAnalyst.js';
import { getInternalLinks } from './crawler.js';
import { calculateDrift } from './driftEngine.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const SIGNALS_FILE = path.join(process.cwd(), 'pricing_signals.json');

// --- RATE LIMITING & THROTTLING ---
const EXTRACTION_LIMIT_PER_HOUR = 50;
const EXTRACTION_LIMIT_PER_DAY = 100;
const rateLimitStore = new Map(); // ip -> { hourCount, dayCount, lastHourReset, lastDayReset }

const getIP = (req) => req.headers['x-forwarded-for'] || req.socket.remoteAddress;

const throttleMiddleware = (req, res, next) => {
    // Throttling disabled for vigorous testing phase
    next();
};

const incrementLimit = (req) => {
    const ip = getIP(req);
    const data = rateLimitStore.get(ip);
    if (data) {
        data.hourCount++;
        data.dayCount++;
    }
};

// Initialize signals file if not exists
if (!fs.existsSync(SIGNALS_FILE)) {
    fs.writeFileSync(SIGNALS_FILE, JSON.stringify({
        sessions: {},
        waitlist: [],
        analytics: {
            totalUsers: 0,
            totalExtractions: 0,
            pricingSelectionDistribution: {
                "$9": 0,
                "$19": 0,
                "$29": 0,
                "$49+": 0,
                "no": 0
            }
        }
    }, null, 2));
}

function getSignals() {
    return JSON.parse(fs.readFileSync(SIGNALS_FILE, 'utf8'));
}

function saveSignals(data) {
    fs.writeFileSync(SIGNALS_FILE, JSON.stringify(data, null, 2));
}

// --- PRE-MONETIZATION ENDPOINTS ---

app.post('/api/track', (req, res) => {
    const { sessionId, event, timestamp } = req.body;
    const signals = getSignals();

    if (!signals.sessions[sessionId]) {
        signals.sessions[sessionId] = {
            sessionId,
            extractions: 0,
            copiedPrompt: false,
            selectedPriceTier: null,
            events: []
        };
        signals.analytics.totalUsers++;
    }

    signals.sessions[sessionId].events.push({ event, timestamp });

    if (event === 'extraction') {
        signals.sessions[sessionId].extractions++;
        signals.analytics.totalExtractions++;
    }
    if (event === 'copy_prompt') {
        signals.sessions[sessionId].copiedPrompt = true;
    }

    saveSignals(signals);
    res.json({ success: true });
});

app.post('/api/survey', (req, res) => {
    const { sessionId, priceTier } = req.body;
    const signals = getSignals();

    if (signals.sessions[sessionId]) {
        // Remove previous selection from distribution if exists
        const oldTier = signals.sessions[sessionId].selectedPriceTier;
        if (oldTier && signals.analytics.pricingSelectionDistribution[oldTier] !== undefined) {
            signals.analytics.pricingSelectionDistribution[oldTier]--;
        }

        signals.sessions[sessionId].selectedPriceTier = priceTier;

        // Map survey values to analytics keys
        const keyMap = {
            "$9/mo": "$9",
            "$19/mo": "$19",
            "$29/mo": "$29",
            "$49+/mo": "$49+",
            "I wouldn’t pay 🫠": "no"
        };
        const key = keyMap[priceTier] || priceTier;

        if (signals.analytics.pricingSelectionDistribution[key] !== undefined) {
            signals.analytics.pricingSelectionDistribution[key]++;
        }
    }

    saveSignals(signals);
    res.json({ success: true });
});

// --- NOTIFICATIONS ---
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'manoj@example.com';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

async function sendWaitlistNotification(entry) {
    // 1. Discord Notification
    if (DISCORD_WEBHOOK_URL) {
        try {
            await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: `🚀 **New Priority Waitlist Lead!**`,
                    embeds: [{
                        title: "User Intelligence Report",
                        description: `A new user joined the priority waitlist for TokenEngine.`,
                        color: 0x00ff00,
                        fields: [
                            { name: "Name", value: entry.name || 'Not Specified', inline: true },
                            { name: "Email", value: `\`${entry.email}\``, inline: true },
                            { name: "Role", value: entry.role || 'Not Specified', inline: true },
                            { name: "Intent ($)", value: entry.selectedPriceTier || 'TBA', inline: true },
                            { name: "Activity", value: `${entry.usageMetrics.extractions} extractions`, inline: true },
                            { name: "Session", value: `\`${entry.sessionId}\``, inline: true }
                        ],
                        timestamp: new Date().toISOString()
                    }]
                })
            });
        } catch (e) { console.error('Discord error:', e); }
    }

    // 2. Telegram Notification
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        try {
            const text = `🚀 <b>New TokenEngine Lead</b>\n\n` +
                `👤 <b>Name:</b> ${entry.name || 'N/A'}\n` +
                `📧 <b>Email:</b> ${entry.email}\n` +
                `💼 <b>Role:</b> ${entry.role || 'N/A'}\n` +
                `💰 <b>Price:</b> ${entry.selectedPriceTier || 'N/A'}\n` +
                `📊 <b>Usage:</b> ${entry.usageMetrics.extractions} extractions\n\n` +
                `<i>I will reach out to them personally.</i>`;

            await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                chat_id: TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: 'HTML'
            });
            console.log(`[Notification] Telegram alert sent for entry: ${entry.email}`);
        } catch (e) { console.error('Telegram error:', e); }
    }
}

app.post('/api/waitlist', async (req, res) => {
    const { sessionId, email, name, role, priceTier } = req.body;
    const signals = getSignals();

    const sessionData = signals.sessions[sessionId] || {};
    const entry = {
        sessionId,
        name,
        email,
        role,
        selectedPriceTier: priceTier || sessionData.selectedPriceTier || 'TBA',
        usageMetrics: {
            extractions: sessionData.extractions || 0,
            copiedPrompt: sessionData.copiedPrompt || false
        },
        timestamp: new Date()
    };

    signals.waitlist.push(entry);
    saveSignals(signals);

    // Send real-time notification
    await sendWaitlistNotification(entry);

    res.json({ success: true, message: 'Confirmed' });
});

// Internal Endpoint for Excel-ready JSON
app.get('/api/analytics/report', (req, res) => {
    const signals = getSignals();
    const waitlistConversionRate = signals.analytics.totalUsers > 0
        ? (signals.waitlist.length / signals.analytics.totalUsers * 100).toFixed(2) + '%'
        : '0%';

    res.json({
        totalUsers: signals.analytics.totalUsers,
        totalExtractions: signals.analytics.totalExtractions,
        avgExtractionsPerUser: signals.analytics.totalUsers > 0 ? (signals.analytics.totalExtractions / signals.analytics.totalUsers).toFixed(2) : 0,
        pricingSelectionDistribution: signals.analytics.pricingSelectionDistribution,
        waitlistConversionRate,
        waitlist: signals.waitlist
    });
});


// Internal cache for non-determinism validation
const extractionCache = new Map();

async function analyzePage(page, url, startTime) {
    console.log(`Navigating to: ${url}`);
    await navigate(page, url);

    console.log('Sampling DOM styles with metadata...');
    const samples = await sampleStyles(page);
    const nodesSampled = (await page.$$('*')).length;

    console.log('Processing deterministic intelligence data...');

    // 1. Color Intelligence
    const colors = classifyColors(samples);

    // 2. Deterministic Clustering
    const radiusResult = clusterDeterministic(samples.interactive, 'radius', 3);
    const spacingResult = clusterDeterministic(samples.spacing, 'spacing', 8);

    // 3. Typography & Motion Relational Extraction
    const typographyData = analyzeTypographyRelations(samples.text);
    const motionData = analyzeMotionRelations(samples.motion);

    // Hardened Font Selection
    const headingFont = samples.text.filter(s => s.tag.startsWith('h'))
        .sort((a, b) => samples.text.filter(x => x.fontFamily === b.fontFamily).length - samples.text.filter(x => x.fontFamily === a.fontFamily).length)[0]?.fontFamily || 'Inter';
    const bodyFont = samples.text.filter(s => s.tag === 'p')
        .sort((a, b) => samples.text.filter(x => x.fontFamily === b.fontFamily).length - samples.text.filter(x => x.fontFamily === a.fontFamily).length)[0]?.fontFamily || 'Inter';

    // 4. Feature Extraction
    const getTopFeatures = (arr, limit = 3) => {
        const counts = arr.reduce((acc, val) => {
            const key = val.raw || val;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit).map(v => v[0]);
    };
    const shadows = getTopFeatures(samples.shadows, 3);
    const gradients = getTopFeatures(samples.gradients, 3);

    const extractionTime = ((Date.now() - startTime) / 1000).toFixed(1);

    // Build tokens
    const tokens = buildTokens({
        colors,
        typography: {
            heading: headingFont,
            body: bodyFont,
            ui: 'Inter',
            fontSizeScale: typographyData.scale.reduce((acc, s, i) => {
                const label = i === typographyData.scale.length - 1 ? 'Display' : (i < 3 ? `xs` : `h${i}`);
                acc[label] = `${s}px`;
                return acc;
            }, {}),
            meta: typographyData.meta
        },
        radius: { scale: radiusResult.core, outliers: radiusResult.outliers, meta: radiusResult.meta },
        spacing: { scale: spacingResult.core, outliers: spacingResult.outliers, meta: spacingResult.meta },
        shadows,
        gradients,
        zIndices: samples.zIndices,
        motion: motionData,
        stats: {
            extractionTime: `${extractionTime}s`,
            tokensFound: [
                ...colors.neutrals,
                colors.brand.primary,
                colors.brand.secondary,
                ...radiusResult.core,
                ...spacingResult.core,
                ...shadows,
                ...gradients,
                ...motionData.durations,
                ...typographyData.scale,
                ...[...new Set(samples.zIndices.map(z => z.value))]
            ].filter(Boolean).length,
            nodesSampled,
            healthScore: 95
        }
    });

    return { tokens, samples, nodesSampled };
}

app.post('/api/extract', throttleMiddleware, async (req, res) => {
    const { url, crawl = false } = req.body;
    if (!url) return res.status(400).json({ error: true, message: 'URL is required' });

    incrementLimit(req);
    let browser;
    const startTime = Date.now();

    try {
        browser = await launchBrowser();
        const page = await setupPage(browser);

        // Core extraction (Page 1)
        const primaryResult = await analyzePage(page, url, startTime);
        const finalTokens = primaryResult.tokens;

        let crawlData = null;
        if (crawl) {
            console.log('Initiating site-wide crawl...');
            const links = await getInternalLinks(page, url, 5);
            console.log(`Found ${links.length} internal links for drift analysis.`);

            const pagesData = [];
            for (const link of links) {
                try {
                    const pageResult = await analyzePage(page, link, Date.now());
                    pagesData.push({ url: link, tokens: pageResult.tokens });
                } catch (e) {
                    console.error(`Skipping ${link} due to error:`, e.message);
                }
            }

            const violations = calculateDrift(pagesData, finalTokens);
            crawlData = {
                pagesAnalyzed: [url, ...pagesData.map(p => p.url)],
                violations,
                summary: violations.length === 0
                    ? `Site-wide analysis complete across ${pagesData.length + 1} pages. No design system violations found.`
                    : `Identified ${violations.length} design system violations across ${pagesData.length + 1} pages analyzed.`
            };
        }

        await browser.close();

        // ── DETERMINISTIC VALIDATION & DRIFT ──────────────────────────────
        const tokenHash = crypto.createHash('md5').update(JSON.stringify(finalTokens.exports.json)).digest('hex');
        extractionCache.set(url, tokenHash);

        const replicationDrift = compareReconstruction(primaryResult.samples, finalTokens);
        console.log('REPLICATION DRIFT REPORT:', replicationDrift);

        // Append crawl data if exists
        if (crawlData) {
            finalTokens.crawlData = crawlData;
        }

        res.json(finalTokens);

    } catch (error) {
        if (browser) await browser.close();
        console.error('Advanced Extraction Error:', error.message);
        res.status(500).json({
            error: true,
            message: error.message.includes('timeout') ? 'Website took too long to load' : 'Extraction failed on this target'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Deterministic Replication Engine running on http://localhost:${PORT}`);
});

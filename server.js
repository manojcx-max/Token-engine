import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import tinycolor from 'tinycolor2';
import rateLimit from 'express-rate-limit';
import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

puppeteer.use(StealthPlugin());

puppeteer.use(StealthPlugin());

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// --- Security & Spam Prevention ---

// Telegram Notification Helper
async function notifyTelegram(message) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        console.warn('Telegram credentials not configured, skipping notification.');
        return;
    }

    try {
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        });
    } catch (e) {
        console.error('Failed to send Telegram notification:', e.message);
    }
}

// Fingerprinting & Tracking
app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ua = req.headers['user-agent'] || 'unknown';
    const fingerprint = crypto.createHash('md5').update(`${ip}-${ua}`).digest('hex');
    req.fingerprint = fingerprint;
    next();
});

// Rate Limiter: Extraction (2 per day base)
const extractionLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 10, // Increased for validation phase, can be set back to 2
    message: { error: true, message: 'Daily limit reached. To continue, please sign up for early access!' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.fingerprint // Use fingerprint as the key
});

// Rate Limiter: Global (Spam prevention)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { error: true, message: 'Too many requests, please slow down.' },
    keyGenerator: (req) => req.fingerprint
});

app.use(globalLimiter);

// --- New Endpoints for Validation ---

app.post('/api/track', async (req, res) => {
    const { sessionId, event, timestamp } = req.body;
    console.log(`[Track] ${event} from session ${sessionId}`);

    // Notify on specific events like clicks
    if (event === 'interested_click') {
        await notifyTelegram(`🔥 <b>Interest Alert</b>\nA user clicked 'Interested?' button (v3 Validator).\nSession ID: <code>${sessionId}</code>\nTime: ${new Date(timestamp).toLocaleString()}`);
    }

    res.sendStatus(200);
});

app.post('/api/survey', async (req, res) => {
    const { sessionId, priceTier } = req.body;
    await notifyTelegram(`💡 <b>Survey Response</b>\nProduct Score/Tier: <b>${priceTier}</b>\nSession ID: <code>${sessionId}</code>`);
    res.sendStatus(200);
});

app.post('/api/waitlist', async (req, res) => {
    const { sessionId, email, name, role } = req.body;

    // Spam check
    if (!email || !email.includes('@') || !name) {
        return res.status(400).json({ error: true, message: 'Invalid submission. Name and email are required.' });
    }

    await notifyTelegram(`🚀 <b>New Sign-up (Interested)</b>\nName: <b>${name}</b>\nEmail: <code>${email}</code>\nRole: <b>${role || 'N/A'}</b>\nSession: <code>${sessionId}</code>`);
    res.json({ success: true, message: 'Thank you for your interest!' });
});

/**
 * Validates the URL to ensure it's http/https and not a local/internal IP.
 */
function validateUrl(inputUrl) {
    try {
        let url = inputUrl.trim();
        // If no dot is present, it's likely just a brand name, default to .com
        if (!url.includes('.') && !url.includes(':')) {
            url += '.com';
        }
        // If it doesn't start with http/https, prefix it with https://
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }

        const parsedUrl = new URL(url);
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            return { valid: false, error: 'Only http and https protocols are allowed.' };
        }

        const hostname = parsedUrl.hostname;
        if (
            hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname.startsWith('192.168.') ||
            hostname.startsWith('10.') ||
            hostname.startsWith('172.16.') ||
            hostname === '0.0.0.0'
        ) {
            return { valid: false, error: 'Internal or local URLs are not allowed.' };
        }
        return { valid: true, url };
    } catch (e) {
        return { valid: false, error: 'Invalid URL format.' };
    }
}

function generatePrompts(tokens, tailwindConfig) {
    const { colors, typography, radius, spacing, shadow, motion, screens } = tokens;

    const themeObject = {
        colors,
        typography,
        spacing,
        radius,
        shadow,
        motion,
        screens
    };

    // 1. UNIVERSAL: Pure Engineering & CSS Focus
    const universal = `# 🔷 UNIVERSAL DESIGN SYSTEM ENGINE
## SYSTEM ROLE
You are a Lead Design Engineer. Your goal is to implement UIs with 100% token fidelity.
All styling must be derived from this theme object:
\`\`\`ts
const theme = ${JSON.stringify(themeObject, null, 2)}
\`\`\`

## CORE RULES
1. **Zero Hardcoding**: No hex codes, pixel values, or arbitrary timings.
2. **Variable Priority**: Reference tokens via \`theme[category][token]\` or \`var(--token)\`.
3. **Typography**: Only use ${typography?.fontFamily?.heading} (Heading) and ${typography?.fontFamily?.body} (Body).
4. **Consistency**: Use spacing scale [${Object.values(spacing || {}).join(', ')}] for all layout.
5. **Validation**: Double-check every value against the provided theme before output.`;

    // 2. V0: Tailwind & Rapid Prototyping Focus
    const v0 = `# 🔷 V0 PRECISE GENERATION PROMPT
## CONTEXT
You are generating high-fidelity components for v0.dev using a custom Tailwind configuration.
## TAILWIND CONFIG
\`\`\`json
${JSON.stringify(tailwindConfig, null, 2)}
\`\`\`

## IMPLEMENTATION GUIDELINES
1. **Utility First**: Use standard Tailwind classes matching the config.
2. **No Arbitrary Values**: Avoid brackets like \`w-[13px]\`. Use nearest system value.
3. **Shadcn Integration**: If using Shadcn components, remap their variables to match this system's brand.500 and radius.
4. **Motion**: Apply ${motion?.easing?.standard} easing and ${motion?.duration?.normal} durations for all interactive elements.
5. **Mobile First**: Use prefixes (md:, lg:) based on breakpoints: ${JSON.stringify(screens)}.`;

    // 3. CLAUDE: Modular React & Visual Premium Focus
    const claude = `# 🔷 CLAUDE ARTIFACT ARCHITECTURE PROMPT
## ROLE
You are a senior React developer specializing in modular, clean architecture and premium UI design.
## DESIGN TOKENS
\`\`\`json
${JSON.stringify(themeObject, null, 2)}
\`\`\`

## ARCHITECTURAL RULES
1. **Component Atomicity**: Build small, reusable components with strict prop-types.
2. **Visual Polish**: Leverage the ${motion?.types?.join(', ')} motion styles found in this system.
3. **Accessibility**: Ensure WCAG 2.1 contrast (Primary Text: ${colors.text?.primary}).
4. **Subtle Interaction**: Use the ${motion?.easing?.emphasized} easing for hero transitions.
5. **Code Style**: Use functional React components, TypeScript, and elegant container patterns.`;

    // 4. ANTIGRAVITY: High-Performance & Deterministic Focus
    const antigravity = `# 🔷 ANTIGRAVITY AGENTIC CODING PROMPT
## OBJECTIVE
Generate deterministic, high-performance code optimized for the Antigravity Agent workflow.
## SYSTEM DATA
${JSON.stringify(themeObject)}

## EXECUTION RULES
1. **Extreme Performance**: Minimize DOM depth and complex selectors.
2. **Deterministic UI**: Every property must map to a key in the system data. No variance.
3. **Interaction Physics**: Use exactly ${motion?.duration?.fast} for hover and ${motion?.duration?.slow} for entry.
4. **Layout Hygiene**: Use spacing tokens [${Object.keys(spacing || {}).join(', ')}] exclusively for grid/flex.
5. **No Placeholders**: Every asset, color, and font must be fully realized and valid.`;

    return {
        universal,
        v0,
        claude,
        antigravity
    };
}


const urlCooldowns = new Map();

app.post('/api/extract', extractionLimiter, async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: true, message: 'URL is required' });
    }

    // Same-URL Spam Prevention
    const lastRequestTime = urlCooldowns.get(url);
    if (lastRequestTime && Date.now() - lastRequestTime < 60000) { // 1 minute cooldown per URL
        return res.status(429).json({ error: true, message: 'This URL was recently analyzed. Please wait a minute or try another one.' });
    }
    urlCooldowns.set(url, Date.now());

    const validation = validateUrl(url);
    if (!validation.valid) {
        return res.status(400).json({ error: true, message: validation.error });
    }

    const targetUrl = validation.url;
    const startTime = Date.now();
    let browser;

    console.log(`[v3] Starting extraction for: ${targetUrl}`);
    notifyTelegram(`🔍 <b>New Extraction</b>\nURL: <code>${targetUrl}</code>\nFingerprint: <code>${req.fingerprint}</code>`);

    try {
        browser = await puppeteer.launch({
            headless: true,
            executablePath: 'C:\\Users\\Manoj\\.cache\\puppeteer\\chrome\\win64-145.0.7632.77\\chrome-win64\\chrome.exe',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');

        // Phase 1: Rendering Layer
        try {
            await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 12000 });
        } catch (e) {
            console.log(`[v3] NetworkIdle2 failed/timeout, falling back to domcontentloaded...`);
            await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 8000 });
        }

        // Note: We used to disable animations here, but we now need them for sampling.
        // We will disable them AFTER the sampling phase if needed for other purposes.


        // Phase 1.2: DOM Sampling Layer
        const rawData = await page.evaluate(() => {
            const samplingCap = 500;
            const data = {
                text: [],
                interactive: [],
                container: [],
                layout: [],
                motion: [],
                meta: {
                    bodyBg: window.getComputedStyle(document.body).backgroundColor,
                    bodyColor: window.getComputedStyle(document.body).color,
                    bodyFontSize: window.getComputedStyle(document.body).fontSize,
                    title: document.title,
                }
            };

            const isVisible = (el) => {
                const rect = el.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none';
            };

            const allElements = Array.from(document.querySelectorAll('*'));

            // A. Text Elements
            const textTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'li', 'a'];
            allElements
                .filter(el => textTags.includes(el.tagName.toLowerCase()) && isVisible(el))
                .slice(0, samplingCap)
                .forEach(el => {
                    const style = window.getComputedStyle(el);
                    data.text.push({
                        tag: el.tagName.toLowerCase(),
                        color: style.color,
                        fontFamily: style.fontFamily,
                        fontWeight: style.fontWeight,
                        fontSize: style.fontSize,
                        lineHeight: style.lineHeight
                    });
                });

            // B. Interactive Elements
            const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
            allElements
                .filter(el => (interactiveTags.includes(el.tagName.toLowerCase()) || el.getAttribute('role') === 'button' || window.getComputedStyle(el).cursor === 'pointer') && isVisible(el))
                .slice(0, samplingCap)
                .forEach(el => {
                    const style = window.getComputedStyle(el);
                    data.interactive.push({
                        tag: el.tagName.toLowerCase(),
                        bgColor: style.backgroundColor,
                        color: style.color,
                        radius: style.borderRadius,
                        borderColor: style.borderColor,
                        shadow: style.boxShadow,
                        fontFamily: style.fontFamily,
                        transition: style.transition,
                        animation: style.animation
                    });
                });

            // C. Containers
            const containerTags = ['section', 'div', 'header', 'footer', 'nav', 'main', 'article', 'aside'];
            allElements
                .filter(el => containerTags.includes(el.tagName.toLowerCase()) && isVisible(el))
                .slice(0, samplingCap)
                .forEach(el => {
                    const style = window.getComputedStyle(el);
                    if (style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent') {
                        data.container.push({
                            tag: el.tagName.toLowerCase(),
                            bgColor: style.backgroundColor,
                            radius: style.borderRadius,
                            padding: style.padding,
                            margin: style.margin,
                            shadow: style.boxShadow
                        });
                    }
                });

            // D. Layout Spacing
            allElements
                .filter(el => isVisible(el))
                .slice(0, samplingCap)
                .forEach(el => {
                    const style = window.getComputedStyle(el);
                    data.layout.push({
                        padding: style.padding,
                        margin: style.margin,
                        gap: style.gap
                    });

                    if (style.transitionDuration !== '0s' || style.animationDuration !== '0s') {
                        data.motion.push({
                            tag: el.tagName.toLowerCase(),
                            transitionDuration: style.transitionDuration,
                            transitionTiming: style.transitionTimingFunction,
                            transitionProperty: style.transitionProperty,
                            animationDuration: style.animationDuration,
                            animationTiming: style.animationTimingFunction,
                            animationName: style.animationName
                        });
                    }
                });

            // E. Breakpoints (Media Queries)
            const breakpoints = [];
            try {
                for (let i = 0; i < document.styleSheets.length; i++) {
                    try {
                        const rules = document.styleSheets[i].cssRules;
                        for (let j = 0; j < rules.length; j++) {
                            if (rules[j].constructor.name === 'CSSMediaRule') {
                                const match = rules[j].conditionText.match(/min-width:\s*(\d+)px/);
                                if (match) breakpoints.push(parseInt(match[1]));
                            }
                        }
                    } catch (e) { /* Cross-origin stylesheet access denied */ }
                }
            } catch (e) { }
            data.breakpoints = [...new Set(breakpoints)].sort((a, b) => a - b);

            return data;
        });

        await browser.close();

        // --- Phase 2: Color Intelligence ---
        console.log(`[v3] Phase 2: Processing Color Intelligence...`);
        const normalizeColor = (c) => tinycolor(c).toHexString().toLowerCase();

        const allColors = {};
        const interactiveColors = {};

        rawData.interactive.forEach(el => {
            const bg = normalizeColor(el.bgColor);
            if (bg !== '#00000000') interactiveColors[bg] = (interactiveColors[bg] || 0) + 1;
        });

        [...rawData.text, ...rawData.interactive, ...rawData.container].forEach(el => {
            const c = normalizeColor(el.color || el.bgColor);
            if (c !== '#00000000') allColors[c] = (allColors[c] || 0) + 1;
        });

        const scoreColor = (hex) => {
            const color = tinycolor(hex);
            const hsl = color.toHsl();
            const lux = color.getLuminance();
            if (hsl.s < 0.1 || lux > 0.95 || lux < 0.05) return -100; // Ignore neutrals/extremes for Brand
            let score = (allColors[hex] || 0) + (interactiveColors[hex] || 0) * 5;
            score += hsl.s * 50;
            return score;
        };

        const sortedColors = Object.keys(allColors).sort((a, b) => scoreColor(b) - scoreColor(a));
        const brandBase = sortedColors[0] || "#0D99FF";

        const generateBrandScale = (base) => {
            const b = tinycolor(base);
            return {
                50: b.clone().lighten(40).toHexString(),
                100: b.clone().lighten(30).toHexString(),
                200: b.clone().lighten(20).toHexString(),
                500: base,
                700: b.clone().darken(15).toHexString(),
                900: b.clone().darken(30).toHexString(),
            };
        };

        // Neutrals
        const neutrals = Object.keys(allColors)
            .filter(hex => tinycolor(hex).toHsl().s < 0.1)
            .sort((a, b) => tinycolor(b).getLuminance() - tinycolor(a).getLuminance())
            .slice(0, 6);

        const neutralScale = {};
        neutrals.forEach((hex, i) => {
            const stop = [50, 100, 200, 400, 600, 900][i] || (i * 100 + 100);
            neutralScale[stop] = hex;
        });

        // --- Phase 3: Typography System ---
        console.log(`[v3] Phase 3: Reconstructing Typography...`);
        const fonts = { heading: {}, body: {}, ui: {} };
        rawData.text.forEach(el => {
            const ff = el.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
            if (['h1', 'h2', 'h3'].includes(el.tag)) fonts.heading[ff] = (fonts.heading[ff] || 0) + 1;
            else fonts.body[ff] = (fonts.body[ff] || 0) + 1;
        });
        rawData.interactive.forEach(el => {
            const ff = el.fontFamily?.split(',')[0].replace(/['"]/g, '').trim() || 'Inter';
            fonts.ui[ff] = (fonts.ui[ff] || 0) + 1;
        });

        const getTop = (obj) => Object.keys(obj).sort((a, b) => obj[b] - obj[a])[0] || 'Inter';

        // Font Sizes - Robust detection
        const allSizes = rawData.text.map(el => parseInt(el.fontSize)).filter(s => s > 0);
        const headingSizes = rawData.text
            .filter(el => el.tag.startsWith('h'))
            .map(el => parseInt(el.fontSize))
            .sort((a, b) => b - a);

        let finalSizes = [];
        if (headingSizes.length >= 3) {
            finalSizes = [...new Set(headingSizes)].slice(0, 6);
        } else {
            // Fallback: Get most frequent sizes and sort them
            const sizeFreq = {};
            allSizes.forEach(s => sizeFreq[s] = (sizeFreq[s] || 0) + 1);

            // Get unique sizes, sort descending, and take the top 6 distinct ones that appear enough
            finalSizes = Object.keys(sizeFreq)
                .map(Number)
                .sort((a, b) => b - a)
                .filter(s => s >= 12); // Ignore tiny text

            // If we still have too few, just take whatever we have or defaults
            if (finalSizes.length === 0) finalSizes = [48, 32, 24, 18, 16, 14];
            else finalSizes = finalSizes.slice(0, 6);
        }

        const fontSizeScale = {};
        finalSizes.forEach((s, i) => {
            let label = `h${i + 1}`;
            if (i === 0 && s >= 40) label = 'Display';
            else if (i === finalSizes.length - 1 || s <= 16) label = 'Body';
            fontSizeScale[label] = `${s}px`;
        });

        // --- Phase 4 & 5: Spacing & Radius ---
        const collectMetrics = (list, keys, round = 4) => {
            const counts = {};
            list.forEach(item => {
                keys.forEach(k => {
                    const val = parseInt(item[k]);
                    if (val > 0 && val <= 128) {
                        const rounded = Math.round(val / round) * round;
                        counts[rounded] = (counts[rounded] || 0) + 1;
                    }
                });
            });
            return Object.entries(counts)
                .filter(([_, count]) => count >= 3)
                .sort((a, b) => b[1] - a[1])
                .map(e => parseInt(e[0]))
                .sort((a, b) => a - b);
        };

        const spacingVals = collectMetrics(rawData.layout, ['padding', 'margin', 'gap']).slice(0, 6);
        const spacingScale = {};
        spacingVals.forEach((v, i) => spacingScale[`space-${i + 1}`] = `${v}px`);

        const radiusVals = collectMetrics([...rawData.interactive, ...rawData.container], ['radius']).slice(0, 3);
        const radiusScale = {
            sm: `${radiusVals[0] || 4}px`,
            md: `${radiusVals[1] || radiusVals[0] || 8}px`,
            lg: `${radiusVals[2] || radiusVals[1] || 12}px`
        };

        // --- Phase 6: Shadow System ---
        const shadows = {};
        [...rawData.interactive, ...rawData.container].forEach(el => {
            if (el.shadow && el.shadow !== 'none') {
                shadows[el.shadow] = (shadows[el.shadow] || 0) + 1;
            }
        });
        const topShadows = Object.keys(shadows).sort((a, b) => shadows[b] - shadows[a]).slice(0, 3);
        const shadowScale = {
            'shadow-sm': topShadows[0] || 'none',
            'shadow-md': topShadows[1] || topShadows[0] || 'none',
            'shadow-lg': topShadows[2] || topShadows[1] || 'none'
        };

        // --- Phase 7.1: Motion Tokens ---
        console.log(`[v3] Phase 7.1: Normalizing Motion...`);
        const parseDuration = (d) => {
            if (!d || d === '0s') return 0;
            const val = parseFloat(d);
            return d.endsWith('ms') ? val : val * 1000;
        };

        const durationCounts = {};
        const easingCounts = {};
        const usageCounts = {};
        const typeCounts = {
            'Dissolve': 0, // Opacity
            'Slide': 0,    // Transform/Translate/Left/Top
            'Scale': 0     // Transform Scale
        };

        rawData.motion.forEach(m => {
            const td = parseDuration(m.transitionDuration);
            const ad = parseDuration(m.animationDuration);
            if (td > 0) durationCounts[td] = (durationCounts[td] || 0) + 1;
            if (ad > 0) durationCounts[ad] = (durationCounts[ad] || 0) + 1;

            if (m.transitionTiming && m.transitionTiming !== 'ease') easingCounts[m.transitionTiming] = (easingCounts[m.transitionTiming] || 0) + 1;
            if (m.animationTiming && m.animationTiming !== 'ease') easingCounts[m.animationTiming] = (easingCounts[m.animationTiming] || 0) + 1;

            if (m.tag) usageCounts[m.tag] = (usageCounts[m.tag] || 0) + 1;

            // Type Detection
            const props = (m.transitionProperty || '').toLowerCase();
            const animName = (m.animationName || '').toLowerCase();
            if (props.includes('opacity') || animName.includes('fade')) typeCounts['Dissolve']++;
            if (props.includes('transform') || props.includes('translate') || props.includes('left') || props.includes('top') || animName.includes('slide') || animName.includes('move')) typeCounts['Slide']++;
            if (props.includes('scale') || animName.includes('scale') || animName.includes('zoom')) typeCounts['Scale']++;
        });

        const sortedDurations = Object.entries(durationCounts)
            .filter(([_, count]) => count >= 3)
            .sort((a, b) => b[1] - a[1])
            .map(([d, _]) => parseInt(d))
            .sort((a, b) => a - b);

        const motionScale = {
            duration: {
                fast: `${sortedDurations.find(d => d <= 150) || 150}ms`,
                normal: `${sortedDurations.find(d => d > 150 && d <= 300) || 250}ms`,
                slow: `${sortedDurations.find(d => d > 300) || 400}ms`
            },
            easing: {
                standard: Object.keys(easingCounts).sort((a, b) => easingCounts[b] - easingCounts[a])[0] || 'ease-in-out',
                emphasized: Object.keys(easingCounts).sort((a, b) => easingCounts[b] - easingCounts[a])[1] || 'cubic-bezier(0.4, 0, 0.2, 1)'
            },
            usage: usageCounts,
            types: Object.entries(typeCounts)
                .filter(([_, count]) => count > 0)
                .sort((a, b) => b[1] - a[1])
                .map(([type]) => type)
        };

        // --- Phase 7: Breakpoints ---
        const screenScale = {};
        const screenNames = ['sm', 'md', 'lg', 'xl'];
        rawData.breakpoints.slice(0, 4).forEach((bp, i) => screenScale[screenNames[i]] = `${bp}px`);


        // --- Phase 8 & 9: Final Assembly & Generators ---
        const tokens = {
            colors: {
                brand: generateBrandScale(brandBase),
                neutral: neutralScale,
                text: { primary: normalizeColor(rawData.meta.bodyColor), secondary: neutrals[1] || neutrals[0] || "#666666" },
                background: { primary: normalizeColor(rawData.meta.bodyBg), surface: normalizeColor(rawData.container[0]?.bgColor || "#ffffff") },
                border: { default: normalizeColor(rawData.interactive[0]?.borderColor || "#e5e7eb") }
            },
            typography: {
                fontFamily: { heading: getTop(fonts.heading), body: getTop(fonts.body), ui: getTop(fonts.ui) },
                fontSize: fontSizeScale,
                fontWeight: { regular: "400", medium: "500", semibold: "600", bold: "700" }
            },
            spacing: spacingScale,
            radius: radiusScale,
            shadow: shadowScale,
            motion: motionScale,
            screens: screenScale
        };

        // Confidence Scores (Heuristic)
        const confidence = {
            colors: Math.min(Object.keys(allColors).length / 10, 1).toFixed(2),
            typography: Math.min(rawData.text.length / 50, 1).toFixed(2),
            layout: Math.min(spacingVals.length / 3, 1).toFixed(2)
        };

        const result = {
            ...tokens,
            stats: {
                extractionTime: `${((Date.now() - startTime) / 1000).toFixed(1)}s`,
                tokensFound: rawData.text.length + rawData.interactive.length,
                confidence
            },
            exports: {
                css: `:root {\n${Object.entries(tokens.colors).map(([group, map]) =>
                    Object.entries(map).map(([k, v]) => `  --${group}-${k}: ${v};`).join('\n')).join('\n')}\n}`,
                tailwind: {
                    theme: {
                        extend: {
                            colors: tokens.colors,
                            spacing: tokens.spacing,
                            borderRadius: tokens.radius,
                            fontFamily: tokens.typography.fontFamily,
                            boxShadow: tokens.shadow,
                            transitionDuration: tokens.motion.duration,
                            transitionTimingFunction: tokens.motion.easing,
                            screens: tokens.screens
                        }
                    }
                },
                json: tokens,
                prompts: generatePrompts(tokens, {
                    theme: {
                        extend: {
                            colors: tokens.colors,
                            spacing: tokens.spacing,
                            borderRadius: tokens.radius,
                            fontFamily: tokens.typography.fontFamily,
                            boxShadow: tokens.shadow,
                            transitionDuration: tokens.motion.duration,
                            transitionTimingFunction: tokens.motion.easing,
                            screens: tokens.screens
                        }
                    }
                })
            }
        };

        console.log(`[v3] Extraction complete in ${result.stats.extractionTime}`);
        res.json(result);

    } catch (error) {
        if (browser) await browser.close();
        console.error('v3 Engine Error:', error);
        res.status(500).json({ error: true, message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Advanced Extraction Engine running on http://localhost:${PORT}`);
});

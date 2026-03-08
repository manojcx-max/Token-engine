export async function sampleStyles(page) {
    // 1. Scroll through the entire page to trigger lazy-load and CSS transitions
    await page.evaluate(async () => {
        await new Promise(resolve => {
            let totalHeight = 0;
            const distance = 400;
            const timer = setInterval(() => {
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= document.body.scrollHeight) {
                    clearInterval(timer);
                    window.scrollTo(0, 0);
                    resolve();
                }
            }, 80);
        });
    });

    // 2. Wait for any triggered animations or lazy content to settle
    await new Promise(r => setTimeout(r, 600));

    return await page.evaluate(() => {
        const samples = {
            text: [],
            interactive: [],
            containers: [],
            spacing: [],
            shadows: [],
            gradients: [],
            zIndices: [],
            motion: [],
            borders: [],
            cssVars: {}
        };

        // ── Visibility check ──────────────────────────────────────────────────
        const isVisible = (el) => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return (
                rect.width > 0 &&
                rect.height > 0 &&
                style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                parseFloat(style.opacity) > 0
            );
        };

        // ── DOM depth ────────────────────────────────────────────────────────
        const getDomDepth = (el) => {
            let depth = 0;
            let cur = el;
            while (cur.parentElement) { cur = cur.parentElement; depth++; }
            return depth;
        };

        // ── Shadow parser ────────────────────────────────────────────────────
        const parseShadow = (shadowStr) => {
            if (!shadowStr || shadowStr === 'none') return null;
            // Split by space, except inside parentheses
            const parts = shadowStr.split(/ (?![^(]*\))/);
            const isInset = shadowStr.includes('inset');

            // Extract lengths (px, or unitless 0)
            const pixelValues = parts
                .filter(p => p && !p.includes('(') && !p.includes('#') && p !== 'inset')
                .map(p => {
                    const m = p.match(/(-?\d+(\.\d+)?)(px|rem|em)?/);
                    if (m && p !== '0') return parseFloat(m[1]);
                    if (p === '0') return 0;
                    return null;
                })
                .filter(v => v !== null);

            const colorMatch = shadowStr.match(/(?:rgba?|oklch|oklab|hwb|color)\([^)]+\)|#[0-9a-fA-F]+/i);

            if (pixelValues.length < 2) return null;
            return {
                offsetX: pixelValues[0] || 0,
                offsetY: pixelValues[1] || 0,
                blur: pixelValues[2] || 0,
                spread: pixelValues[3] || 0,
                color: colorMatch?.[0] || 'rgba(0,0,0,0.1)',
                inset: isInset
            };
        };

        // ── Collect CSS Custom Properties from :root and document ────────────
        const collectCSSVars = () => {
            const vars = {};
            try {
                const sheets = Array.from(document.styleSheets);
                sheets.forEach(sheet => {
                    try {
                        const rules = Array.from(sheet.cssRules || []);
                        rules.forEach(rule => {
                            if (rule.selectorText === ':root' || rule.selectorText === 'html') {
                                const style = rule.style;
                                for (let i = 0; i < style.length; i++) {
                                    const prop = style[i];
                                    if (prop.startsWith('--')) {
                                        vars[prop] = style.getPropertyValue(prop).trim();
                                    }
                                }
                            }
                        });
                    } catch (e) { } // Cross-origin sheets are not accessible
                });
            } catch (e) { }
            return vars;
        };
        samples.cssVars = collectCSSVars();

        // ── Text tags expanded ───────────────────────────────────────────────
        const TEXT_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'label', 'a', 'li', 'td', 'th', 'caption', 'blockquote', 'small', 'strong', 'em', 'figcaption', 'dt', 'dd', 'legend']);

        // ── Main element traversal ───────────────────────────────────────────
        const elements = document.querySelectorAll('*');

        elements.forEach(el => {
            if (!isVisible(el)) return;

            const style = window.getComputedStyle(el);
            const tagName = el.tagName.toLowerCase();
            const depth = getDomDepth(el);
            const meta = { depth, tagName };

            // 1. TEXT — deep capture: all text-bearing tags
            if (TEXT_TAGS.has(tagName)) {
                const fs = parseFloat(style.fontSize);
                if (fs > 0) {
                    samples.text.push({
                        tag: tagName,
                        color: style.color,
                        fontFamily: style.fontFamily.split(',')[0].replace(/['"]/g, '').trim(),
                        fontWeight: style.fontWeight,
                        fontSize: style.fontSize,
                        lineHeight: style.lineHeight,
                        letterSpacing: style.letterSpacing,
                        textTransform: style.textTransform,
                        ...meta
                    });
                }
            }

            // 2. INTERACTIVE — expanded detection
            const isInteractive = (
                tagName === 'button' ||
                tagName === 'a' ||
                tagName === 'input' ||
                tagName === 'select' ||
                tagName === 'textarea' ||
                style.cursor === 'pointer' ||
                el.getAttribute('role') === 'button' ||
                el.getAttribute('role') === 'tab' ||
                el.getAttribute('role') === 'link' ||
                el.getAttribute('tabindex') === '0'
            );
            if (isInteractive) {
                const br = style.borderRadius;
                samples.interactive.push({
                    tag: tagName,
                    backgroundColor: style.backgroundColor,
                    color: style.color,
                    borderRadius: br,
                    borderColor: style.borderColor,
                    borderWidth: style.borderWidth,
                    padding: style.padding,
                    fontSize: style.fontSize,
                    fontWeight: style.fontWeight,
                    ...meta
                });
            }

            // 3. CONTAINERS — capture background colors for palette
            const isContainer = ['div', 'section', 'header', 'footer', 'nav', 'main', 'aside', 'article', 'form', 'table', 'figure'].includes(tagName);
            if (isContainer) {
                const bg = style.backgroundColor;
                if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                    samples.containers.push({
                        backgroundColor: bg,
                        borderRadius: style.borderRadius,
                        padding: style.padding,
                        ...meta
                    });
                }
            }

            // 4. BORDER COLORS — important for design system palette
            const bw = parseFloat(style.borderWidth);
            if (bw > 0 && style.borderColor && style.borderColor !== 'rgba(0, 0, 0, 0)') {
                samples.borders.push({
                    color: style.borderColor,
                    width: bw,
                    style: style.borderStyle,
                    radius: parseFloat(style.borderRadius) || 0,
                    ...meta
                });
            }

            // 5. SPACING — expanded property list
            const spacingProps = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'gap', 'rowGap', 'columnGap'];
            spacingProps.forEach(prop => {
                const val = parseFloat(style[prop]);
                if (val > 0 && val < 320) {
                    samples.spacing.push({ value: val, property: prop, ...meta });
                }
            });

            // 6. SHADOWS — full decomposition
            const shadowStr = style.boxShadow;
            if (shadowStr && shadowStr !== 'none') {
                // Handle multiple comma-separated shadows
                const singleShadows = shadowStr.split(/,(?![^(]*\))/);
                singleShadows.forEach(ss => {
                    const parsed = parseShadow(ss.trim());
                    if (parsed && (parsed.blur > 0 || parsed.offsetY > 0)) { // filter zero-blur zero-offset "nothing shadows"
                        samples.shadows.push({ raw: shadowStr, ...parsed, ...meta });
                    }
                });
            }

            // 7. GRADIENTS — all gradient types
            const bgImg = style.backgroundImage;
            if (bgImg && bgImg !== 'none' && bgImg.includes('gradient')) {
                samples.gradients.push({ raw: bgImg, type: bgImg.startsWith('linear') ? 'linear' : bgImg.startsWith('radial') ? 'radial' : 'conic', ...meta });
            }
            // Also check CSS mask-image for decorative gradients
            const maskImg = style.maskImage || style.webkitMaskImage;
            if (maskImg && maskImg !== 'none' && maskImg.includes('gradient')) {
                samples.gradients.push({ raw: maskImg, type: 'mask', ...meta });
            }

            // 8. Z-INDEX — all positioned elements
            const zi = style.zIndex;
            const position = style.position;
            if (zi !== 'auto' && zi !== 'initial' && zi !== 'inherit' && position !== 'static') {
                const val = parseInt(zi);
                if (!isNaN(val)) {
                    samples.zIndices.push({ value: val, position, tagName, ...meta });
                }
            }

            // 9. MOTION — both transition AND animation
            const transitionDuration = style.transitionDuration;
            const animationDuration = style.animationDuration;
            const transitionEasing = style.transitionTimingFunction;
            const animationEasing = style.animationTimingFunction;
            const transitionProp = style.transitionProperty;
            const animationName = style.animationName;

            const parseDuration = (str) => {
                if (!str || str === '0s' || str === '0ms') return 0;
                // Handle comma-separated multiple durations, take the first
                const first = str.split(',')[0].trim();
                if (first.endsWith('ms')) return parseFloat(first);
                if (first.endsWith('s')) return parseFloat(first) * 1000;
                return 0;
            };

            const tDur = parseDuration(transitionDuration);
            const aDur = parseDuration(animationDuration);
            const duration = tDur > 0 ? tDur : aDur;
            const easing = tDur > 0 ? transitionEasing : animationEasing;
            const property = tDur > 0 ? transitionProp : animationName;

            if (duration > 0 && duration < 3000) {
                samples.motion.push({ duration, easing, property, ...meta });
            }
        });

        return samples;
    });
}

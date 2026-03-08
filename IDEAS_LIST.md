# TokenEngine — Ideas & Future Roadmap

A running list of feature ideas and improvements to implement later.
Sorted by approximate priority / impact.

---

## 🚀 Planned Features

### 1. CLI NPM Package (`@tokenengine/cli`)
**Status:** `IDEA – Not started`
**Description:**  
Publish the existing `cli/index.js` as a proper npm package (`@tokenengine/cli`) so developers can run extractions directly from their terminal without opening the web app.

```sh
npx @tokenengine/cli extract stripe.com
# → Outputs tokens.css + tailwind.config.js into ./tokenengine-output/
```

**Notes:**
- The core extractor service is already built at `extractor-service/server.js`
- CLI entrypoint exists at `cli/index.js`
- Need to: update `package.json` with `"bin"` field, publish to npm, add help text and flags (`--json`, `--css`, `--output-dir`)
- Nice-to-have: Watch mode that re-extracts on URL change

---

### 2. Accessibility / WCAG Contrast Analyzer
**Status:** `IDEA – Not started`
**Description:**  
After extracting colors, automatically run a contrast ratio check against all text/background pairs. Show a "Health Badge" (WCAG AA / WCAG AAA pass/fail) next to every color swatch in the Color Palette panel.

**Notes:**
- Can use the `relative luminance` formula on extracted hex values, no external lib needed
- Display inline warnings if brand color on white fails 4.5:1 ratio
- Could add an overall "Accessibility Score" to the analysis stats card

---

### 3. Dark Mode vs. Light Mode Preview Toggle
**Status:** `IDEA – Not started`
**Description:**  
Add a Light/Dark mode toggle directly above the Live SaaS Component Preview in the Analyze page. The extracted brand tokens should have a way to flip between light and dark surfaces so the user can verify both modes are visually solid.

---

### 4. Token Drift / Consistency Report
**Status:** `IDEA – Not started`
**Description:**  
The `driftAnalyst.js` already runs server-side. Surface the drift data visually on the frontend. Show a dashboard card with bars indicating how "consistent" the extracted spacing, radius, and type-scale values are (e.g. "Your spacing uses 17px which deviates from the 4pt grid by 1px").

---

### 5. Continuous Token Sync (Pro Feature)
**Status:** `IDEA – Enterprise / Pro`  
**Description:**  
Connect a GitHub repo. On push, automatically re-extract tokens from the target URL and open a PR with updated CSS / Tailwind / Figma JSON files if the design drifted from the committed baseline.

---

## ✅ Completed

- [x] Headless Puppeteer Extraction Engine
- [x] Color Intelligence (HSL scoring + 50-900 scale generation)
- [x] Typography Extractor (heading / body / UI font separation)
- [x] Tailwind Config Generator
- [x] CSS Variables Export
- [x] AI Prompts (v0, Claude, Lovable, Antigravity formats)
- [x] Saved Tokens Library (with remix state persistence)
- [x] Design Evolution / Remix Engine (thematic override)
- [x] Figma W3C JSON Variable Exporter
- [x] Sidebar Navigation on Analyze results page
- [x] Live SaaS Component Preview (Hero, Feature Grid, Pricing Card)

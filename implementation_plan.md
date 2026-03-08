# Token Intelligence Engine: Advanced Implementation Plan

Implementation of a robust design token extraction system based on a modular Node.js service architecture.

## Architecture Highlights
- **Service-Based**: Modular logic across `renderer`, `sampler`, `classifier`, and `cluster`.
- **Heuristic Scoring**: Intelligent brand and neutral color detection using saturation and frequency weights.
- **Clustering**: Smart radius and spacing detection with outlier removal.
- **Multi-Output**: JSON tokens, CSS variables, and Tailwind configuration.

## Proposed Changes

### Extractor Service (`/extractor-service`)

#### [NEW] [server.js](file:///c:/Users/Manoj/design scrapper/extractor-service/server.js)
- Express server entry point.
- Orchestrates the extraction flow.

#### [NEW] [renderer.js](file:///c:/Users/Manoj/design%20scrapper/extractor-service/renderer.js)
- Manages Puppeteer lifecycle (Launch, Navigation, Cleanup).
- Implements stealth and viewport configuration.

#### [NEW] [sampler.js](file:///c:/Users/Manoj/design%20scrapper/extractor-service/sampler.js)
- Injected DOM script to collect computed styles from specific element categories (Text, Interactive, Container, Layout).

#### [NEW] [classifier.js](file:///c:/Users/Manoj/design%20scrapper/extractor-service/classifier.js)
- Color Intelligence Engine.
- Classifies Neutrals (<10% saturation).
- Scores Brand colors based on interactive usage and frequency.

#### [NEW] [cluster.js](file:///c:/Users/Manoj/design%20scrapper/extractor-service/cluster.js)
- Clustering logic for Radius and Spacing.
- Normalizes to nearest 4px.

#### [NEW] [tokenBuilder.js](file:///c:/Users/Manoj/design%20scrapper/extractor-service/tokenBuilder.js)
- Constructs the final structured JSON object.
- Generates CSS and Tailwind outputs.

---

### UI System Refactor

#### [MODIFY] [App.tsx](file:///c:/Users/Manoj/design scrapper/src/App.tsx)
- Update to handle the deeper nested JSON structure (Brand, Neutral, Text, Background, Border areas).
- Add specific sections for Spacing and Typography scales.

---

## Verification Plan

### Automated Tests
- Test extraction on sites with diverse systems: `linear.app`, `stripe.com`, `vercel.com`, `github.com`.
- Verify the `score` heuristics correctly identify the brand color.
- Confirm radius/spacing scales are rounded to 4px multiples.

### Manual Verification
- Check the generated Tailwind config for correctness.
- Verify Light/Dark mode responsiveness in the results UI.

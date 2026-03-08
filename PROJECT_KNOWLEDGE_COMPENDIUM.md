# 📔 TokenEngine: The Full Project Knowledge Compendium
**Version:** 1.2.0 (Fidelity Milestone)
**Project Lead:** AI Lead Engineer
**Last Updated:** February 23, 2026

---

## 1. The Core Vision
TokenEngine is a **Deterministic Design System Replication Engine**. The primary objective is achieving **95%+ replication fidelity** by focusing on exact structural mirroring and removing creative variance. TokenEngine reverse-engineers a target website's architecture into rigid tokens for AI agents.

---

## 2. Technical Stack
*   **Frontend**: React 18, Vite, Lucide Icons.
*   **Backend**: Node.js, Express.
*   **Intelligence**: Deterministic Stability-Weighted Clustering with Adaptive Grid Detection.
*   **Math/Logic**: HSL/Luminance scoring, Density-based clustering (±1px tolerance), typography relational metrics.
*   **Fidelity Tools**: Internal Replication Test Harness (Drift Analyst).

---

## 3. The Replication Pipeline (Fidelity 1.2.0)

### Phase 1: Stability-Weighted Sampling (`sampler.js`)
*   **Metadata Layer**: Every extracted value is tagged with its **Occurrence Count**, **Unique Node Frequency**, and **DOM Depth**.
*   **Decomposition**: Box-shadows are parsed into structured components (offset, blur, spread, color).

### Phase 2: Deterministic Clustering Layer (`cluster.js`)
*   **Stability Weighting**: prioritizes values that appear frequently across different unique elements and higher in the DOM hierarchy. 
    *   *Formula*: `(occurrenceCount * 0.6) + (uniqueNodes * 0.3) + (1/avgDepth * 0.1)`
*   **Outlier Separation**: Clusters with a weight < 20% of the dominant weight are marked as outliers and excluded from AI enforcement.
*   **Dynamic Grid Detection**: Pairwise difference analysis detects the system's base unit (4, 5, 8, etc.) without forcing a 4px grid.

### Phase 3: System Trait Analysis (`tokenBuilder.js`)
*   **Trait Detection**: The engine identifies high-level system patterns like **Radius Bias** (Sharp/Soft/Rounded) and **Shadow Depth** (Minimal/Expressive) to better inform the AI.
*   **Semantic Z-Index Tiers**: Values are clustered into logical layers (Base, Sticky, Dropdown, Overlay, Modal).

---

## 4. AI Replication Contract (`promptBuilder.js`)
TokenEngine enforces a **Strict System Contract**:
*   **Zero Invention Policy**: Explicitly bans hex codes, arbitrary spacing, and "guesswork" values.
*   **Fallback Rejection**: Forced mapping to the nearest defined token.
*   **Deterministic Contract**: The system instructions communicate a "Replication task, not a creative redesign" to the LLM.

---

## 5. Fidelity Validation (Drift Analysis)
The `driftAnalyst.js` harness measures the match percentage between:
*   Original Raw Data vs. Reconstructed Tokens.
*   **KPIs**: Color Match, Spacing Match, Radius Match, Typography Match, Shadow Match, Z-Index Match.
*   **Target**: Overall match > 95%.

---

## 6. How to Maintain
1.  **Boot**: `pnpm run server` (3001) and `pnpm run dev`.
2.  **Verify**: Check logs for `[DETERMINISM VALIDATED]` hashes and the `REPLICATION DRIFT REPORT`.

---

**End of Compendium.**

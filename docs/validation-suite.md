# Phase 6B — Comprehensive Validation & Regression Suite

## Overview

The Validation and Regression Suite provides automated measurement, accuracy testing, and regression protection across all engine packages (`@vedica/astrology-core`, `@vedica/dasha-engine`, `@vedica/analysis-engine`, `@vedica/rules-engine`, `@vedica/timing-engine`, `@vedica/interpretation-engine`).

---

## Key Principles

1. **Explicit Benchmark Categorization**:
   - `REAL_WORLD_BENCHMARK`: Cases containing verified outputs from external calculation software (e.g. Jagannatha Hora 8.0).
   - `SYNTHETIC_TEST_FIXTURE`: Synthetic test cases built for verifying internal component logic (e.g. dignity, aspect orbs, gapless Dasha boundaries).
   - Unvalidated real-world cases remain explicitly marked `NOT_VALIDATED` until expected values are entered.
2. **Circular Longitude Mathematics**:
   - `calculateAngularDifference(lon1, lon2)` handles 0° / 360° circular wraparound correctly (e.g. 359.98° vs 0.02° = 0.04° difference).
3. **Dasha Timeline Continuity**:
   - Verifies exact millisecond alignment (`period[n].end === period[n+1].start`), `start < end` conditions, and 1ms boundary behavior.
4. **Interpretation Language Safety**:
   - Scans output templates to prevent forbidden predictive words (`"definitely"`, `"will certainly"`, `"guaranteed"`, `"You will get promoted"`).
5. **Machine Regression Snapshots**:
   - Validates that profile versions (`calculation`, `analysis`, `rules`, `timing`, `interpretation`) are preserved consistently across calculation runs.

---

## Validation Commands

```bash
# Run all workspace unit tests
pnpm test

# Run JHora, Dasha, and Transit benchmark validation suites
pnpm test:validation

# Run Interpretation safety & Machine snapshot regression suites
pnpm test:regression

# Run Playwright E2E integration tests
pnpm test:e2e

# Run complete validation, regression, E2E, and production build check
pnpm validate
```

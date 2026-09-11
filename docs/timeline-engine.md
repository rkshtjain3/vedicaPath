# Vedica Multi-Level Dasha Timeline Engine (@vedica/timeline-engine)

## Overview

The `@vedica/timeline-engine` package constructs a structured multi-level Vimshottari Dasha timeline (**MAHADASHA** → **ANTARDASHA** → **PRATYANTARDASHA**) and correlates periods with factual natal evidence, planetary strengths, Yogas, divisional chart indicators, Ashtakavarga points, and active transits.

## Architecture

- **`src/types.ts`**: Canonical interfaces (`DashaLevel`, `TimelinePeriod`, `LordChartContext`, `TimingEvidence`, `TimingWindow`, `TimingWindowContextClass`, `ConfidenceMetadata`).
- **`src/timeline/`**: Multi-level tree generation reusing `@vedica/dasha-engine` calculations.
- **`src/dasha/` & `src/context/`**: Extracts source-attributed chart facts across natal, strength, yoga, divisional, and 7 life domains.
- **`src/windows/`**: Multi-source evidence convergence detector and context classifier (`HIGH_EVIDENCE_CONTEXT`, `MODERATE_EVIDENCE_CONTEXT`, `MIXED_EVIDENCE_CONTEXT`, `LOW_EVIDENCE_CONTEXT`, `INSUFFICIENT_EVIDENCE`).
- **`src/transit/`**: Contextual overlay for Jupiter and Saturn transits and Ashtakavarga SAV/BAV points.

## Key Principles

1. **Non-Predictive**: Does not predict guaranteed events. Only answers: *"What chart evidence becomes contextually relevant during this period?"*.
2. **No Score Subtraction**: Supportive and challenging evidence are accumulated independently.
3. **Auditable Reproducibility**: SHA-256 hash generated over target date, profile version, active lords, and evaluated rules.

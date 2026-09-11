# Astrology Timing & Activity Window Engine Architecture

## Overview
The `@vedica/timing-engine` package provides a 100% deterministic, explainable timing engine that answers:
- *"Which life domains are active during my current Dasha?"*
- *"What were my strongest activity windows in the past?"*
- *"Which future periods show higher domain activity?"*

---

## 1. Multi-Level Dasha Domain Activation Methodology

### Dasha Weights
- **Mahadasha (MD)**: 3 points
- **Antardasha (AD)**: 2 points
- **Pratyantardasha (PD)**: 1 point

### Domain House Map
- **CAREER**: 10th House
- **WEALTH**: 2nd & 11th Houses
- **RELATIONSHIPS**: 7th House
- **PROPERTY**: 4th House

### Connection Resolver
A planet is connected to a domain house if any of the 5 vectors match:
1. Occupies house
2. Owns house
3. Aspects house
4. Aspects house lord
5. Conjoined with house lord

---

## 2. Combined Activity Window Aggregation

Total score = Dasha Activation Score + Transit Activation Score.

### Scoring Boundaries (`PERSONAL_TIMING_V1`)
- **LOW**: Total Score < 3
- **MODERATE**: 3 <= Total Score < 6
- **HIGH**: Total Score >= 6

---

## 3. Profile Versioning & Transparency
Every output includes version metadata:
- `calculationProfileVersion` (e.g. `personal-vedic-v1`)
- `analysisProfileVersion` (e.g. `personal-analysis-v1`)
- `rulesProfileVersion` (e.g. `personal-rules-v1`)
- `timingProfileVersion` (e.g. `personal-timing-v1`)

# Benchmark Accuracy Certification & Metrics Standard

## Overview
The Benchmark Accuracy Certification engine generates deterministic, mathematically auditable certification reports for the Personal Vedic Astrology & Numerology Analyzer.

---

## Metric Definitions

1. **Absolute Angular Difference**: Shortest circular angular distance between calculated and reference degrees (`Math.min(diff, 360 - diff)`).
2. **Maximum Angular Difference**: Worst-case angular deviation across all evaluated planetary coordinates.
3. **Mean Angular Difference**: Average angular deviation across all evaluated planetary coordinates.
4. **Planetary Pass Percentage**: Percentage of planetary coordinates that fall within configured tolerance (`0.05°`).

---

## Tolerance Profile Standard
- **Profile ID**: `benchmark-tolerance-v1`
- **Longitude Tolerance**: `0.05°` (3 arcminutes)
- **Ascendant Tolerance**: `0.05°`
- **Boundary Tolerance**: `0.001°`

---

## Boundary Sensitivity Analysis
When planetary positions fall within `0.005°` of a Zodiac Sign (0° / 30°) or Nakshatra edge, the benchmark runner flags `BOUNDARY_SENSITIVE`. Discrepancies at boundary edges trigger candidate diagnosis `BOUNDARY_REFERENCE_PRECISION` (accounting for rounding differences in external reference software displays).

---

## Non-Predictive Disclaimer
A computational benchmark `PASS` confirms that Vedica calculation engines match external reference software under configured astronomical settings. It does **NOT** establish scientific proof of astrological prediction.

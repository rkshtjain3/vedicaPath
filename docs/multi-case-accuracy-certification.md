# Multi-Case Accuracy Certification Standard

## Overview
This document outlines how multi-case computational accuracy certification reports are calculated and formatted across the Vedica benchmark suite.

---

## 1. Multi-Case Metric Definitions

- **Total Cases**: Total benchmark cases registered in the dataset.
- **Cases with Reference Data**: Cases containing non-empty external reference data (`PARTIAL` or `COMPLETE`).
- **Unreferenced Cases (Excluded)**: Cases without external reference data (`NOT_AVAILABLE`). These are explicitly **EXCLUDED** from calculation pass rates and angular difference statistics.
- **Maximum Angular Difference**: Worst-case shortest circular angular difference (`Math.min(diff, 360 - diff)`) observed across all evaluated planetary coordinates.
- **Mean Angular Difference**: Average shortest circular angular difference across all evaluated planetary coordinates.
- **Overall Pass Rate**: Percentage of validated components that meet configured angular tolerance (`0.05°`).

---

## 2. 14-Category Mismatch Diagnostics
When a component comparison fails, the diagnostic classifier evaluates failure patterns against 14 categories:
1. `AYANAMSHA`
2. `EPHEMERIS`
3. `TRUE_VS_MEAN_NODE`
4. `INPUT_TIMEZONE`
5. `DST_RESOLUTION`
6. `HISTORICAL_TIMEZONE`
7. `LONGITUDE_BOUNDARY`
8. `NAKSHATRA_BOUNDARY`
9. `DIVISIONAL_MAPPING_ERROR`
10. `DASHA_CALCULATION_VARIANT`
11. `HOUSE_SYSTEM`
12. `REFERENCE_DATA_ERROR`
13. `IMPLEMENTATION_BUG`
14. `UNKNOWN`

Each diagnosis provides a likelihood rating, evidence summary, and recommended investigation steps.

---

## 3. Non-Predictive Disclaimer
The accuracy certification report establishes computational consistency of Vedica Swiss Ephemeris calculation engines against external reference software ONLY. It does **NOT** constitute empirical validation or scientific proof of astrological prediction.

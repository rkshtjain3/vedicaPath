# Birth Chart Validation Framework

## Overview
The Birth Chart Validation Framework in `@vedica/validation` provides a standardized, mathematical mechanism to benchmark planetary longitudes, Lagna (Ascendant), Nakshatras/Padas, Whole Sign Houses, Vimshottari Dasha, and D1-D30 Divisional Charts against external reference software (e.g., Jagannatha Hora).

---

## Core Principles

1. **Zero Reference Fabrication**: Reference data is never invented or assumed. Cases without verified external outputs are explicitly marked with status `NOT_VALIDATED`.
2. **Circular Angular Comparison**: All longitude comparisons utilize circular angular distance metrics, correctly evaluating boundary wrapping (e.g., circular distance between 359.99° and 0.01° is 0.02°).
3. **Deterministic Mismatch Classification**: Mismatches trigger a deterministic diagnostic engine that evaluates candidate root causes (`AYANAMSHA`, `TRUE_VS_MEAN_NODE`, `INPUT_TIMEZONE`, `DIVISIONAL_MAPPING_ERROR`, `LONGITUDE_BOUNDARY`, etc.) rather than assuming code bugs.

---

## Component Validation Scopes

- **Ascendant**: Longitude, Sign, House boundary.
- **Planetary Longitudes**: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu.
- **Nakshatra & Pada**: Exact Nakshatra name and Pada (1-4).
- **Vimshottari Dasha**: Moon Nakshatra, starting Dasha lord, and balance years at birth.
- **Divisional Charts**: D1, D2, D3, D7, D9, D10, D12, D30 sign and longitude mapping.

---

## Tolerance Policy
- Default angular longitude tolerance: `0.05°` (3 arcminutes).
- Exact match required for signs, Nakshatra names, and Dasha lords.

---

## Disclaimer
A benchmark `PASS` confirms that the mathematical calculation aligns with configured reference software data. It does NOT imply scientific prediction of real-world outcomes.

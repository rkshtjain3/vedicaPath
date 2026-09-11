# Benchmark Tolerance Policy — PERSONAL_BENCHMARK_TOLERANCE_V1

## Overview
This document defines the mathematical tolerance policy for comparing calculated Vedic astrology parameters against reference software (JHora).

---

## Tolerance Rules

### 1. Planetary Longitudes
- **Profile Version**: `PERSONAL_BENCHMARK_TOLERANCE_V1`
- **Tolerance Limit**: `±0.05°` (3 arcminutes)
- **Comparison Formula**: Modular 360° Circular Angular Difference:
  $$ \Delta\theta = \min(|a - b|, 360 - |a - b|) $$
- Example: 359.99° and 0.01° yield a circular difference of `0.02°` (PASS).

### 2. Virupa (Shadbala Components)
- **Tolerance Limit**: `±0.05 Virupa`

### 3. Exact Category Matches
- Exact string/integer match required for:
  - Rashi Signs (Lagna & Planets in D1, D2, D3, D7, D9, D10, D12, D30)
  - Nakshatra Name & Pada
  - Dasha Mahadasha / Antardasha / Pratyantardasha Lords
  - Ashtakavarga BAV Bindu Totals & SAV Totals (Total SAV must equal 337)

---

## Status Classification
- **PASS**: Value is within specified tolerance or exact match confirmed.
- **FAIL**: Difference exceeds tolerance limit or string mismatch detected.
- **NOT_VALIDATED**: Reference value has not yet been manually entered.
- **NOT_COMPARABLE**: Calculation is unavailable for comparison.

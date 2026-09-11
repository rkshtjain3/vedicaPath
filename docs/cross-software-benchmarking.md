# Cross-Software Benchmarking Policy

## Overview
Cross-software benchmarking in `@vedica/validation` compares internal calculations against third-party astrology software (e.g. Jagannatha Hora, Swiss Ephemeris standalone tools, Parashara's Light).

---

## Policies & Best Practices

1. **Non-Fabrication Policy**: Never populate reference values using synthetic guesses. All cases without verified external reference outputs must remain `NOT_VALIDATED`.
2. **Diagnostic Classification**: When a discrepancy occurs, the mismatch engine evaluates candidate causes (`AYANAMSHA`, `TRUE_VS_MEAN_NODE`, `INPUT_TIMEZONE`, `DIVISIONAL_MAPPING_ERROR`, `LONGITUDE_BOUNDARY`).
3. **No Blind Formula Mutating**: Never silently adjust internal formulas just to pass a benchmark. Formula changes are allowed only when a confirmed mathematical bug is proven.
4. **Developer UI**: Benchmark comparisons are rendered on developer-only routes (`/benchmark/chart` and `/benchmark/jhora`) to maintain clear boundaries between system validation and user reports.

# Cross-Engine Benchmarking Philosophy

The `@vedica` workspace relies on mathematically pure, deterministic algorithms to generate astrological artifacts. The benchmark suite guarantees the ongoing precision and reliability of these engines across version upgrades and logic adjustments.

## Core Philosophy

1. **Do not fabricate output.** JHora (or equivalent) reference data must always be manually entered. If a test case lacks data for a particular engine, the validation state must explicitly remain `NOT_VALIDATED`. 
2. **Never change logic for synthetic cases.** Astrology calculation engines represent deterministic math. If a discrepancy is found, it must be proven mathematically.

## Benchmark Execution

Benchmarks are categorized by boundary cases:
- `NORMAL_INDIAN`
- `MIDNIGHT_BIRTH`
- `LAGNA_BOUNDARY`
- `NAKSHATRA_BOUNDARY`
- `DATE_BOUNDARY`
- `DST_AMBIGUOUS`
- `DST_NON_EXISTENT`
- `FOREIGN_LOCATION`
- `HIGH_LATITUDE`
- `HISTORICAL`
- `EXALTATION_BOUNDARY`
- `DEBILITATION_BOUNDARY`
- `DIVISIONAL_BOUNDARY`

## Tolerances
- **Astrology Core**: Default angular tolerance of `0.05°` with full circular wrap-around logic (e.g., `359.99°` matches `0.01°`).
- **Dasha**: Default boundary timestamp tolerance of `24 hours` due to varying calendar system interpretations across different software.

## Invariant vs Reference Testing
Certain elements (e.g., Ashtakavarga SAV totals = 337) are mathematical invariants. Tests distinguish between:
- `INTERNAL_INVARIANT_PASS`: The mathematical invariant is maintained by the engine.
- `REFERENCE_BENCHMARK_PASS`: The value exactly matches the entered benchmark reference (e.g., JHora output).

## Failure Classifications
When investigating benchmark drift, root cause can be categorized as:
- `INPUT_TIMEZONE`
- `LOCATION_DATA`
- `AYANAMSHA`
- `EPHEMERIS`
- `UTC_CONVERSION`
- `LONGITUDE_BOUNDARY`
- `DIVISIONAL_FORMULA`
- `DASHA_DATE_POLICY`
- `HOUSE_METHOD`
- `FORMULA_VARIANT`
- `REFERENCE_DATA_ERROR`
- `IMPLEMENTATION_BUG`
- `UNKNOWN`

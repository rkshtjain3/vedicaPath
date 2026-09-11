# Classical Shadbala Engine — JHora Benchmark Validation Results & Mismatch Log

**Document Version**: `1.0.0`  
**Engine Package**: `@vedica/shadbala-engine`  
**Profile**: `personal-shadbala-v1`  
**Default Virupa Tolerance**: `0.05 Virupas`

---

## Executive Summary

Phase 13B establishes the real-world Jagannatha Hora (JHora) benchmark validation runner and tolerance framework for `@vedica/shadbala-engine`. In accordance with strict validation policies, benchmark test cases without verified JHora reference values are marked as `NOT_VALIDATED`.

---

## Benchmark Case Results Matrix

| Case ID | Description | Status | Components Tested | Overall Result | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `CASE-001` | Normal Indian Chart (New Delhi) | `NOT_VALIDATED` | 0 | `NOT_VALIDATED` | Awaiting verified JHora 8.0 output |
| `CASE-002` | Birth near midnight (Midnight boundary) | `NOT_VALIDATED` | 0 | `NOT_VALIDATED` | Awaiting verified JHora 8.0 output |
| `CASE-003` | Exaltation/Debilitation Boundary | `NOT_VALIDATED` | 0 | `NOT_VALIDATED` | Awaiting verified JHora 8.0 output |
| `CASE-004` | 0° / 360° Sidereal Longitude Boundary | `NOT_VALIDATED` | 0 | `NOT_VALIDATED` | Awaiting verified JHora 8.0 output |
| `CASE-005` | Drekkana Boundary (10.0°, 20.0°) | `NOT_VALIDATED` | 0 | `NOT_VALIDATED` | Awaiting verified JHora 8.0 output |
| `CASE-006` | Kendra House Placement | `NOT_VALIDATED` | 0 | `NOT_VALIDATED` | Awaiting verified JHora 8.0 output |
| `CASE-007` | Panaphara Placement | `NOT_VALIDATED` | 0 | `NOT_VALIDATED` | Awaiting verified JHora 8.0 output |
| `CASE-008` | Apoklima Placement | `NOT_VALIDATED` | 0 | `NOT_VALIDATED` | Awaiting verified JHora 8.0 output |
| `CASE-009` | Foreign Location (London, UK) | `NOT_VALIDATED` | 0 | `NOT_VALIDATED` | Awaiting verified JHora 8.0 output |
| `CASE-010` | DST-Sensitive Chart (New York) | `NOT_VALIDATED` | 0 | `NOT_VALIDATED` | Awaiting verified JHora 8.0 output |

---

## Formula Mismatch Workflow & Classification Standard

When a component comparison produces a `FAIL` result, the mismatch must be recorded and classified using the 9 standard root cause categories before modifying any code.

### 9 Root Cause Classifications

1. `INPUT_TIMEZONE`: Timezone resolution or DST offset mismatch between birth input and reference software.
2. `AYANAMSHA`: Difference in sidereal ayanamsha value (e.g. Lahiri vs True Chitra Paksha vs Raman).
3. `EPHEMERIS`: Difference in planetary positions (Swiss Ephemeris JPL vs astronomical approximations).
4. `LONGITUDE_BOUNDARY`: Numerical precision or rounding differences at $0^\circ / 360^\circ$ or sign boundaries.
5. `HOUSE_METHOD`: House system variation (Whole Sign vs Placidus vs Sripati).
6. `FORMULA_VARIANT`: Variation in BPHS translation or commentary interpretation (e.g. Uchcha Bala formula variant).
7. `REFERENCE_DATA_ERROR`: Transcription or data entry error in the reference dataset.
8. `IMPLEMENTATION_BUG`: Confirmed defect in `@vedica/shadbala-engine` calculation code.
9. `UNKNOWN`: Unclassified mismatch requiring deeper mathematical investigation.

---

## Formula Mismatch Resolution Protocol

```text
Benchmark FAIL
    ↓
Preserve failing benchmark case
    ↓
Classify mismatch cause
    ↓
Document hypothesis & mathematical justification
    ↓
Fix code ONLY if methodology is confirmed across multiple charts
    ↓
Add regression unit test
    ↓
Re-run benchmark suite
```

> [!IMPORTANT]
> Never overfit or alter a classical formula to match a single reference chart output. Validate across multiple chart types (normal, midnight, boundary, foreign, DST) before committing changes.

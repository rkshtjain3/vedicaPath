# External Reference Data Policy & Provenance Standard

## Overview
The External Reference Data Policy strictly dictates how third-party reference data (e.g. from Jagannatha Hora, Swiss Ephemeris standalone tools, Parashara's Light) is collected, stored, and verified within `@vedica/validation`.

---

## Core Rules

1. **Zero Reference Fabrication**: Reference data is **NEVER** guessed, generated synthetically, or fabricated. Any benchmark case without explicitly verified external reference output MUST retain `ReferenceCoverageStatus: NOT_AVAILABLE` (0% completeness).
2. **Mandatory Reference Provenance**: Every reference entry MUST carry complete provenance metadata:
   - `sourceSoftware`: Identifiable software name (e.g., `"Jagannatha Hora"`).
   - `sourceVersion`: Explicit version string (e.g., `"8.0"`).
   - `sourceDate`: Date when reference output was captured.
   - `sourceConfiguration`: Zodiac, Ayanamsha, House System, Node Type, Ephemeris version.
   - `dataEntryMethod`: Entry mechanism (e.g., `"MANUAL_REFERENCE_ENTRY"`, `"VERIFIED_SOFTWARE_BENCHMARK"`).
   - `referenceCapturedBy`: Person or agent capturing the reference data.
   - `verificationStatus`: `"NOT_CAPTURED"`, `"SOURCE_CAPTURED"`, or `"VERIFIED"`.

---

## Two-Stage Benchmark Status

Vedica decouples **Reference Coverage Status** from **Validation Result Execution**:

### Stage 1: Reference Coverage Status
- `NOT_AVAILABLE` (0% coverage)
- `PARTIAL` (1–99% coverage)
- `COMPLETE` (100% coverage)

### Stage 2: Validation Execution Result
- `NOT_RUN`
- `PASS` (All component longitudes, signs, nakshatras match within tolerance)
- `FAIL` (Discrepancy detected)
- `PARTIAL_PASS` (Some components match, others unvalidated)
- `INCOMPARABLE_CONFIGURATION` (Calculation settings conflict, e.g. Raman vs Lahiri)

---

## Configuration Matching Policy
Before comparing planetary coordinates, the engine validates calculation configuration matching. If reference software configuration differs from Vedica's current profile (e.g. Raman Ayanamsha vs Lahiri Ayanamsha), the status is explicitly logged as `INCOMPARABLE_CONFIGURATION` rather than an engine bug.

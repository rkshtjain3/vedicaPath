# Multi-Software Reference Data Policy

## Overview
This document defines the strict policies for capturing, verifying, and comparing external reference data from third-party astrology software within the Vedica benchmark repository.

---

## Provenance Rules

### 1. Mandatory Metadata for VERIFIED Status
Any reference entry claiming `VERIFIED` status MUST specify:
- `sourceSoftware`: Name of external software (e.g. `Jagannatha Hora`, `Swiss Ephemeris`).
- `sourceVersion`: Exact software version (e.g. `8.0`).
- `sourceDate`: Date of reference capture.
- `sourceConfiguration`: Ephemeris, ayanamsha, zodiac, house system, node type parameters.
- `dataEntryMethod`: Specific entry method (e.g. `VERIFIED_SOFTWARE_BENCHMARK`).
- `referenceCapturedBy`: Name/role of auditor.

References lacking mandatory metadata are automatically downgraded to `UNVERIFIED`.

---

## 2. Anti-Self-Referencing Guard
To preserve scientific integrity:
- **No Internal Copying**: Internal Vedica calculation outputs MUST NEVER be copied or re-entered as external reference data.
- **Automated Guarding**: The `detectSelfReferencing` service automatically scans submitted longitudes against internal engine outputs to 6-decimal precision. If an identical match is detected across all points, submission is REJECTED.

---

## 3. Configuration Compatibility Requirement
Before performing accuracy comparison between Vedica and an external reference:
- **Calculation Settings Check**: Zodiac, ayanamsha, house system, and node calculation type MUST match.
- **Incompatible Configuration Result**: If settings conflict (e.g. Tropical vs Sidereal, or Lahiri vs Raman ayanamsha), the runner returns `INCOMPARABLE_CONFIGURATION` rather than marking the comparison as a calculation failure.

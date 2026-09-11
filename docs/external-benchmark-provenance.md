# External Benchmark Data Provenance Standard

## Overview
This document specifies the data provenance standards and validation policies for external benchmark reference data within the Vedica astrology engine ecosystem.

---

## 1. Provenance Requirements
Every third-party reference entry MUST include explicit provenance metadata:

- **sourceSoftware**: Identifiable external software name (e.g. `"Jagannatha Hora"`, `"Swiss Ephemeris standalone"`).
- **sourceVersion**: Precise software version string (e.g. `"8.0"`).
- **sourceDate**: Date on which reference output was recorded.
- **sourceConfiguration**: Mandatory astronomical configuration settings (Zodiac type, Ayanamsha, House system, Node type, Ephemeris version).
- **dataEntryMethod**: Entry method (e.g. `"MANUAL_REFERENCE_ENTRY"`, `"VERIFIED_SOFTWARE_BENCHMARK"`).
- **referenceCapturedBy**: Identifier of the developer or agent capturing the data.
- **verificationStatus**: Verification workflow state (`UNVERIFIED`, `SOURCE_CAPTURED`, `REVIEWED`, `VERIFIED`, `REJECTED`).

---

## 2. Verification Workflow States
1. **UNVERIFIED**: Reference data entered without full provenance metadata or imported from unreviewed sources. Default for all imports.
2. **SOURCE_CAPTURED**: Raw output captured directly from third-party software display.
3. **REVIEWED**: Audited by a secondary maintainer.
4. **VERIFIED**: Fully validated with verified software outputs and complete provenance metadata.
5. **REJECTED**: Reference entry flagged for errors or configuration mismatch.

---

## 3. Anti-Self-Referencing Guard
The benchmark system enforces a strict anti-self-referencing rule:
Vedica's own internal calculation outputs are **NEVER** allowed to be stored as external benchmark references. If submitted longitudes match Vedica's floating-point calculations to 6 decimal places across all planets, the system automatically rejects the save attempt with an anti-self-referencing error.

# Name Astrology Isolation Policy — Vedica Architecture

## Overview
This document defines the architectural isolation boundaries between **Birth Astrology** (Vedic Horoscopy) and **Name Numerology** within the Vedica monorepo.

---

## 1. Isolation Core Mandate
Vedic horoscopy relies strictly on astronomical birth coordinates (Date of Birth, Time of Birth, Latitude, Longitude, Timezone). A person's name has zero effect on astronomical planetary positions, house divisions, dashas, transits, or classical yogas.

To preserve scientific rigor and transparency:
1. **Birth Chart Fingerprint**: The calculation reproducibility hash for birth charts is calculated strictly from birth parameters (`dob`, `tob`, `lat`, `lon`, `tz`, `ayanamsha`, `house_system`).
2. **Query Fingerprint Isolation**: `generateQueryFingerprint()` omits `fullName` from the hash calculation payload UNLESS the query intent category is explicitly `NUMEROLOGY`.

---

## 2. Name Numerology Exception
Name Numerology (Pythagorean / Chaldean expression numbers, soul urge numbers, personality numbers) inherently depends on name string character values.
- Name numerology calculations are executed in `@vedica/numerology-engine`.
- If no full name is supplied by the user, birth date numerology (Life Path, Birthday Number, Personal Year) remains fully functional, while name numerology displays an informative `NAME_REQUIRED` note.

---

## 3. Auditing & Verification
Unit tests in `@vedica/query-engine` explicitly verify that:
```typescript
const fpWithName = generateQueryFingerprint({ normalizedQuestion: 'career', profileVersion: 'v1', isNumerologyExplicit: false, fullName: 'John Doe' });
const fpNoName = generateQueryFingerprint({ normalizedQuestion: 'career', profileVersion: 'v1', isNumerologyExplicit: false, fullName: undefined });
assert(fpWithName === fpNoName);
```
This guarantees 100% hash equivalence regardless of whether a user enters or changes their display name when exploring astrological chart queries.

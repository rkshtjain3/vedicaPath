# Calculation Reproducibility & Audit Fingerprints

## Overview
Every birth chart calculation produced by the Personal Vedic Astrology & Numerology Analyzer generates a deterministic **Input Fingerprint** and **Reproducibility Hash**.

This guarantees that:
1. Identical inputs always produce the exact same mathematical output.
2. Any meaningful change to birth date, birth time, latitude, longitude, or timezone changes the input fingerprint.
3. Astrological output can be audited for precision and regression testing.

---

## 1. Input Fingerprint (`inputFingerprint`)
The `inputFingerprint` is a SHA-256 hex hash computed over the canonical input record:

```
canonicalPayload = birthLocalDate | birthLocalTime | latitude | longitude | timezone | resolvedUTC | calculationProfile
```

If any parameter changes (e.g. birth time modified by 1 second or latitude changed by 0.001°), the fingerprint changes completely.

---

## 2. Reproducibility Hash (`reproducibilityHash`)
The `reproducibilityHash` combines the `inputFingerprint` with key deterministic chart calculation outputs:
- Ascendant (Lagna) sidereal longitude
- Planetary sidereal longitudes (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)

It intentionally **excludes**:
- System clock execution timestamps
- Database row IDs or session IDs
- Network cache metadata

This hash allows instant detection of engine drift or calculation discrepancies between environments.

---

## 3. Advanced Calculation Details Card
In the Web UI, an expandable **Calculation Details** card displays:
- Birth LocalDate & LocalTime
- Selected Location & Coordinates
- IANA Timezone & Resolved UTC Birth Instant
- Calculation Profile Version (`personal-vedic-v1`)
- Local Time Status (`VALID` / `AMBIGUOUS`)
- **Input Fingerprint** (SHA-256)
- **Reproducibility Hash** (SHA-256)

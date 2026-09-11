# Calculation Profile Specification (`personal-vedic-v1`)

## Overview
All astronomical and astrological calculations in the application are governed by versioned calculation profiles. This prevents historical calculation shifts when ephemeris configuration settings are adjusted.

## Central Profile Configuration (`PERSONAL_VEDIC_V1`)

| Parameter | Value | Description |
|---|---|---|
| **Version** | `personal-vedic-v1` | Unique version identifier attached to every computed chart |
| **Name** | `Personal Vedic Standard v1` | Human-readable profile name |
| **Zodiac** | `sidereal` | Sidereal zodiac system |
| **Ayanamsa** | `lahiri` | Chitra Paksha (Lahiri) Ayanamsa |
| **Node Type** | `true` | True Node calculation (configurable to `mean`) |
| **House System** | `whole_sign` | Whole Sign / Equal sign house system for Vedic chart alignment |
| **Dasha System** | `vimshottari` | 120-year Vimshottari Dasha framework baseline |

## Calculation Details

### Ephemeris Precision
- Powered by native Swiss Ephemeris (`sweph` v2.10) with automatic fallback to high-precision Moshier ephemeris algorithms.
- Planets tracked: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu (North Node), Ketu (South Node = Rahu + 180°).
- Retrograde status determined via speed in longitude (`speed < 0`).

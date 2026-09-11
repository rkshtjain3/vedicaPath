# Application Architecture & System Design

## Overview
The Personal Vedic Astrology & Numerology Analyzer is structured as a modular TypeScript monorepo managed with pnpm workspaces. The architecture enforces strict decoupling between data models, calculation engines, storage mechanisms, and presentation layers.

```
apps/
  web/                         # Next.js App Router, Tailwind CSS UI, REST API
packages/
  shared/                      # Core Location & Time interfaces (UTC conversion, LocationResolver)
  astrology-core/              # Swiss Ephemeris wrapper engine, planetary calculations, Nakshatras & Rashis
  numerology-engine/           # Pure TS deterministic date-based numerology & formula step reduction
  dasha-engine/                # Baseline Vimshottari Dasha framework
  analysis-engine/             # Dignity, Chart Facts, Aspects & Yogas baseline interfaces
  rules-engine/                # Deterministic astrology rule evaluation engine baseline
validation/
  jhora-test-cases/            # JHora benchmark test cases & expected values
```

## Module Responsibilities

1. **`@vedica/shared`**: Provides domain primitives such as `LocationInput`, `LocationResolver`, `BirthTimeInput`, and `getUTCInstant` which converts local date/time and IANA timezone into exact UTC Julian Day numbers.
2. **`@vedica/astrology-core`**: Implements `AstrologyCalculationEngine` wrapped around `sweph` (Swiss Ephemeris v2.10 native bindings with Moshier ephemeris fallback). Calculates planetary longitudes, Rashi positions, degrees, Nakshatras, Padas, Lagna (Ascendant), and retrograde status without exposing third-party dependencies to downstream packages.
3. **`@vedica/numerology-engine`**: Pure deterministic engine calculating Life Path, Birthday, Attitude, Personal Year, Personal Month, and Personal Day numbers. Preserves step-by-step reduction records for complete transparency and supports configurable Master Number rules (11, 22, 33).
4. **`@vedica/validation`**: Automated comparison runner testing engine output against JHora benchmark data within specified degree tolerances (±0.05°). Assigns `PASS`, `FAIL`, or `NOT VALIDATED` status tags.
5. **`apps/web`**: Next.js 15 App Router web application rendering dual Astrology and Numerology output tabs and persisting birth profiles to a local SQLite database via Drizzle ORM.

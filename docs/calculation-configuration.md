# Calculation Configuration Audit & Transparency

## Overview
All astronomical and astrological calculations in `@vedica/astrology-core` explicitly expose their calculation configuration via the `AstrologyCalculationConfiguration` interface. This eliminates implicit assumptions and guarantees full auditability.

---

## Configuration Schema

```typescript
export interface AstrologyCalculationConfiguration {
  zodiacType: 'SIDEREAL' | 'TROPICAL';
  ayanamsha: string;            // e.g. "Lahiri" | "Raman" | "KP"
  houseSystem: string;          // e.g. "Whole Sign" | "Placidus"
  nodeCalculation: 'TRUE' | 'MEAN';
  ephemerisVersion: string;     // e.g. "Swiss Ephemeris v2.10"
  calculationProfileVersion: string; // e.g. "personal-vedic-v1"
}
```

---

## Configuration Drift Detection
When re-running benchmark cases or loading historical calculation outputs, the `detectConfigurationDrift` service compares stored snapshots against current calculation engine parameters. Any mismatch in Ayanamsha, Node Type, or House System flags a `CONFIGURATION_CHANGED` drift status to prevent false regression reports.

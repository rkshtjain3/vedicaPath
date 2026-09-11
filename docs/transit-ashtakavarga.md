# Phase 11 — Ashtakavarga-Aware Transit Analysis & Timing Evidence

## Overview

The **Ashtakavarga-Aware Transit Engine** extends `@vedica/timing-engine` to provide a transparent, factual evidence layer linking current planetary transits with natal Bhinna Ashtakavarga (BAV) and Sarvashtakavarga (SAV) points.

This phase is **non-predictive and evidence-only**. It does **not** alter existing domain activity scores (LOW/MODERATE/HIGH), Dasha scores, or transit rules, nor does it generate speculative horoscope predictions.

---

## 1. System Architecture & Flow

```
   [ Birth Details ]
          │
          ▼
   [ D1 Natal Chart ] ──► [ @vedica/ashtakavarga-engine ]
          │                          │ (BAV & SAV Matrices)
          ▼                          ▼
[ Transit Instant ] ──► [ @vedica/timing-engine ]
(Current / Historical / Future)     │
                                     ▼
                      [ Transit-Ashtakavarga Evaluator ]
                                     │
                                     ▼
                   [ TransitAshtakavargaEvidence ]
                      (Jupiter & Saturn BAV/SAV)
```

---

## 2. Calculation Pipeline & Lookup Logic

### 1. Sidereal Transit Position Resolution
Using `SwissEphemerisEngine`, the transiting position of the planet is calculated for the specified instant (historical, present, or future).
- Resolves **Transit Sign** (1-12, e.g. Leo)
- Resolves **House from Natal Lagna**:
  $$\text{transitHouse} = ((\text{transitSignIndex} - \text{lagnaSignIndex} + 12) \pmod{12}) + 1$$

### 2. BAV & SAV Bindu Lookup
- **BAV Lookup**: Retrieves raw bindu points for the transiting planet in the transit sign from `ashtakavargaResult.bav[PLANET].signPoints[transitSign]`.
- **SAV Lookup**: Retrieves raw bindu points for the transit sign from `ashtakavargaResult.sav.signPoints[transitSign]`.

### 3. Chart-Relative Statistical Context
Raw bindu points are evaluated against chart-relative averages:
- **Planet BAV Average**:
  $$\text{bavAverage} = \frac{\text{planetTotalPoints}}{12}$$
  *(e.g., Jupiter total points = 56 $\Rightarrow$ Average = 4.67 bindus)*
- **SAV Chart Average**:
  $$\text{savAverage} = \frac{337}{12} \approx 28.08\text{ bindus}$$

### 4. Neutral Classification Bands (`PERSONAL_TRANSIT_ASHTAKAVARGA_V1`)
Profile thresholds classify position relative to the chart distribution:
- **BAV Classification Band**: $\pm 0.5$ from `bavAverage`
- **SAV Classification Band**: $\pm 2.0$ from `savAverage`

Classifications:
- `BELOW_AVERAGE` (Rendered as `BELOW CHART AVERAGE`)
- `AVERAGE` (Rendered as `AROUND CHART AVERAGE`)
- `ABOVE_AVERAGE` (Rendered as `ABOVE CHART AVERAGE`)

---

## 3. Data Structures

```ts
interface TransitAshtakavargaEvidence {
  transitPlanet: 'JUPITER' | 'SATURN' | string;
  transitDate: string; // ISO 8601 date string
  transitSign: RashiDetails;
  transitHouseFromLagna: number;
  bavPoints: number;
  savPoints: number;
  bavAverage: number;
  savAverage: number;
  bavRelativePosition: 'BELOW_AVERAGE' | 'AVERAGE' | 'ABOVE_AVERAGE';
  savRelativePosition: 'BELOW_AVERAGE' | 'AVERAGE' | 'ABOVE_AVERAGE';
  evidence: string[];
}
```

---

## 4. API & Web UI Integration

- **API Endpoint (`/api/calculate`)**: Returns `transitAshtakavarga` containing `evidenceMap` for supported transit planets. Incorporates transit BAV/SAV summary into the audit `reproducibilityHash`.
- **Web Dashboard**: Adds **`TRANSIT ASHTAKAVARGA CONTEXT`** section in **`4. TIMING & TRANSITS`** tab (`#transit-ashtakavarga-section`), featuring planet cards with neutral classification pills and collapsible **"WHY? Evidence"** panels.

---

## 5. Non-Predictive Safety Guarantee

- **No AI / No LLM**: All output is deterministically calculated.
- **No Guaranteed Success / Failure**: High bindu points are labeled as `ABOVE CHART AVERAGE`, never "Lucky" or "Guaranteed Success".
- **Evidence-Only**: Existing domain scores remain 100% unaffected until future validated scoring rules are defined.

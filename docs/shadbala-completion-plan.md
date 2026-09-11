# Phase 14A: Shadbala Architecture Audit & Completion Plan

## 1. Current Architecture Overview
The `@vedica/shadbala-engine` is currently designed to provide foundational calculations for Shadbala. The architecture evaluates strength using the classical 6-component model (Sthana, Dig, Kala, Cheshta, Naisargika, Drik), but some components are stubbed or marked as `PARTIAL` / `FOUNDATION`.

## 2. Implemented vs. Incomplete Components

### Currently Implemented (Phase 13A Foundation)
- **Uchcha Bala** (Sthana Bala component): Implemented using standard exaltation degrees.
- **Ojayugma Bala** (Sthana Bala component): Implemented (Odd/Even sign placements in D1 and D9).
- **Kendradi Bala** (Sthana Bala component): Implemented (Kendra, Panaphara, Apoklima placement).
- **Drekkana Bala** (Sthana Bala component): Implemented (Male/Female/Hermaphrodite planet placement in decanates).
- **Dig Bala**: Implemented (Directional strength based on angle from Lagna).
- **Naisargika Bala**: Implemented (Fixed natural strength constants).

### Currently Incomplete (Phase 14 Focus)
- **Saptavargaja Bala** (Sthana Bala component): Currently `PARTIAL`. Only uses D1 and D9. Missing D2, D3, D7, D12, D30.
- **Cheshta Bala**: Currently `FOUNDATION`. Only exposes speed and retrograde boolean. Lacks the full BPHS motional state evaluation (Vakra, Anuvakra, Margi, etc.) and arc of retrogression formula.
- **Kala Bala**: `NOT_IMPLEMENTED`. (Temporal strength based on day/night, lunar fortnight, year/month/day/hour lords).
- **Yuddha Bala** (Kala Bala sub-component): `NOT_IMPLEMENTED`. (Planetary war).
- **Ayana Bala** (Kala Bala sub-component): `NOT_IMPLEMENTED`. (Declination strength).
- **Drik Bala**: `NOT_IMPLEMENTED`. (Aspectual strength).

## 3. Missing Dependencies & Required Chart Data

### Saptavargaja Bala
To complete Saptavargaja Bala mathematically, we require the exact planetary sign placements across 7 Vargas:
- D1 (Rasi) - *Available*
- D2 (Hora) - **Required in divisional-chart-engine**
- D3 (Drekkana) - **Required in divisional-chart-engine**
- D7 (Saptamsa) - **Required in divisional-chart-engine**
- D9 (Navamsa) - *Available*
- D12 (Dwadashamsa) - **Required in divisional-chart-engine**
- D30 (Trimsamsa) - **Required in divisional-chart-engine**

### Cheshta Bala
Requires calculating the **Seeghrochcha** (apogee) and mean longitudes for Mars, Mercury, Jupiter, Venus, and Saturn to determine the Arc of Retrogression (Cheshta Kendra).
- Requires `sweph` true and mean longitude data.
- Sun and Moon have separate rules (Sun = Ayana Bala, Moon = Paksha Bala).

## 4. Assumptions & Design Decisions
- **No Arbitrary Scoring**: All Virupas will directly trace back to BPHS formulas (e.g. 45 for Moolatrikona, 30 for Own Sign, 22.5 for Great Friend, 15 for Friend, 7.5 for Neutral, 3.75 for Enemy, 1.875 for Great Enemy).
- **Dignity System**: We assume the 5-fold relationship (Panchadha Maitri) which combines natural and temporary relationships will be used for evaluating Saptavargaja placements.
- **Completeness Status**: The Shadbala Engine will report `PARTIAL` until *all* 6 groups (including Kala and Drik Bala) are implemented. Phase 14 focuses on completing Sthana and Cheshta Bala.

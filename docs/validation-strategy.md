# Validation Strategy & JHora Benchmarking

## Principles
1. **No Unsubstantiated Claims**: The system will NOT state that calculation output matches JHora or any third-party astrology software without automated test suite verification.
2. **Explicit Tolerances**: Numerical longitudes and ascendant degrees are compared against benchmark targets within a configurable degree tolerance (default `±0.05°`).
3. **Tri-State Status**:
   - `PASS`: All positions, rashis, degrees, and nakshatras match target benchmark within tolerance.
   - `FAIL`: Any position or attribute deviates beyond specified tolerance.
   - `NOT_VALIDATED`: Benchmark comparison has not yet been executed or benchmark expected values are absent.

## 7 Benchmark Categories (`validation/jhora-test-cases/`)

1. **Normal Indian Birth**: Standard IST birth (`case-001-normal-indian.json`).
2. **Midnight Birth**: Birth close to midnight transition (`case-002-midnight-birth.json`).
3. **Lagna Boundary**: Birth close to sign boundary (0° or 29.9°) (`case-003-lagna-boundary.json`).
4. **Nakshatra Boundary**: Moon close to Nakshatra boundary transition (`case-004-nakshatra-boundary.json`).
5. **Foreign DST Birth**: Foreign birth with Daylight Saving Time (`case-005-foreign-dst.json`).
6. **High Latitude Birth**: High latitude geographical location (`case-006-high-latitude.json`).
7. **Historical Birth**: Historical birth preceding standard timezone definitions (`case-007-historical-birth.json`).

## How to Collect and Populate Real JHora Benchmark Data

1. Open **Jagannatha Hora (JHora)**.
2. Configure JHora calculation preferences to match standard profile `personal-vedic-v1`:
   - Zodiac: **Sidereal**
   - Ayanamsa: **Lahiri (Chitra Paksha)**
   - Node Calculation: **True Nodes**
   - House System: **Equal / Rashi-based**
3. Input the exact birth parameters (Date, Time, Latitude, Longitude, Timezone).
4. Extract exact degrees for Lagna and all 9 planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu).
5. Open the target benchmark JSON file in `validation/jhora-test-cases/`.
6. Populate the `expected` object with `ascendant` and `planets` entries:
   ```json
   "expected": {
     "ascendant": {
       "sign": "Sagittarius",
       "longitude": 26.5611
     },
     "planets": {
       "Sun": {
         "sign": "Virgo",
         "longitude": 6.7995,
         "nakshatra": "Uttara Phalguni",
         "pada": 4
       }
     }
   }
   ```
7. Change `"status": "NOT_VALIDATED"` to `"status": "PASS"`.
8. Run `pnpm test` to execute automated benchmark verification.

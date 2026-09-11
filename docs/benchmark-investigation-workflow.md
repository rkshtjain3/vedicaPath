# Benchmark Mismatch Investigation Workflow & Root Cause Taxonomy

## Overview
When a benchmark test evaluates to `FAIL`, it must be systematically investigated rather than arbitrarily altering formulas.

---

## Root Cause Classifications

1. **`INPUT_TIMEZONE`**: Timezone identifier or offset mismatch between JHora and Swiss Ephemeris input.
2. **`DST_HANDLING`**: Discrepancy in Daylight Saving Time transition offset.
3. **`LOCATION_COORDINATES`**: Small delta in city latitude/longitude lookup values.
4. **`AYANAMSHA`**: Ayanamsha variant discrepancy (e.g. Lahiri traditional vs Lahiri Chitrapaksha).
5. **`EPHEMERIS`**: Swiss Ephemeris polynomial approximation vs JPL DE431 ephemeris delta.
6. **`LONGITUDE_BOUNDARY`**: Precision rounding near 00°00' sign/nakshatra transition.
7. **`DIVISIONAL_CHART_RULE`**: Commentary rule variation for divisional charts (e.g., Parasari vs Jaimini D2/D3 rules).
8. **`DASHA_YEAR_BASIS`**: 365.2425 solar days per year vs 360 savana days per year.
9. **`HOUSE_SYSTEM`**: Whole Sign vs Equal / Placidus house cusp computation.
10. **`FORMULA_VARIANT`**: Classical text mathematical variant (e.g., Saptavargaja scoring table interpretations).
11. **`REFERENCE_DATA_ERROR`**: Human entry error when copying values from JHora UI.
12. **`IMPLEMENTATION_BUG`**: Authentic bug in project calculation code requiring a fix.
13. **`UNKNOWN`**: Uninvestigated mismatch.

---

## Investigation Workflow

1. Open `/benchmark/jhora/[id]`.
2. Inspect the **"WHY DIFFERENT?"** card for failing components.
3. Verify if input parameters (date, time, lat, lon, timezone, ayanamsha) match JHora settings exactly.
4. Select the suspected **Root Cause Classification** from the dropdown menu.
5. Update the **Investigation Status** (`INVESTIGATING`, `EXPLAINED`, `FIXED`, `REFERENCE_CORRECTED`).
6. Enter detailed explanatory notes and save metadata.

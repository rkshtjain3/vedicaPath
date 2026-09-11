# JHora Benchmark Entry Guide

This guide details the step-by-step process for entering verified external benchmark data into the `validation/jhora-test-cases/` suite.

---

## Step-by-Step Entry Procedure

1. **Open Jagannatha Hora (JHora 8.0)**:
   - Configure calculation settings:
     - **Ayanamsa**: Lahiri (Chitra Paksha).
     - **Node Calculation**: Mean Nodes (or True Nodes as configured in `PERSONAL_VEDIC_V1`).
     - **House System**: Equal House / Sri Pati as defined in calculation profile.

2. **Enter Birth Input Details**:
   - Date of Birth
   - Time of Birth
   - City / Latitude / Longitude
   - Time Zone Offset

3. **Record Expected Coordinates**:
   - Note Ascendant sign & exact longitude.
   - Note planetary sign, exact longitude, Nakshatra name, and Pada number for Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu.

4. **Update Benchmark JSON File**:
   - Open target JSON file in `validation/jhora-test-cases/case-XXX.json`.
   - Update `sourceType` to `"REAL_WORLD_BENCHMARK"`.
   - Populate `expected` field with recorded longitudes and Nakshatra data.
   - Change `status` from `"NOT_VALIDATED"` to `"PASS"`.

5. **Run Benchmark Validation Suite**:
   ```bash
   pnpm test:validation
   ```

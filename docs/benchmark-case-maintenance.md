# Benchmark Case Maintenance Guide

## Overview
This guide provides instructions for adding, updating, and auditing benchmark cases in the Vedica repository.

---

## Adding New Benchmark Cases

1. **Dataset Location**: Edit `validation/astrology-chart-benchmark-data/chart-dataset.json`.
2. **Schema Versioning**: Ensure `datasetVersion` is set to `chart-reference-dataset-v2`.
3. **Snapshot Inputs**:
   - Provide exact ISO birth date and birth time.
   - Specify IANA timezone string (e.g. `Asia/Kolkata`, `America/New_York`).
   - Include city, country, latitude, and longitude coordinates.
4. **Reference Data Entry**:
   - Enter reference longitudes from third-party verified software.
   - Include complete provenance metadata.
5. **Run Validation Suite**:
   - Execute `pnpm --filter @vedica/validation test` to verify suite integrity.
   - Re-run `pnpm build` to confirm monorepo integrity.

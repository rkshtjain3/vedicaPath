# Benchmark Suite Quality Specification (`BENCHMARK_QUALITY_V1`)

## Overview
The **Benchmark Suite Quality Score** evaluates the coverage, rigor, and maturity of the Vedica benchmark test program itself. It is a deterministic, versioned software program quality metric.

> **Important**: The suite quality score measures test program maturity and reference coverage ONLY. It does NOT constitute astrological prediction accuracy or empirical validation of astrological claims.

---

## Profile Parameters (`BENCHMARK_QUALITY_V1`)

### 1. Verified Reference Coverage (Weight: 25%)
Measures the proportion of benchmark cases backed by complete, independently verified third-party reference data (`verificationStatus === 'VERIFIED'`).

### 2. Geographical & Hemispheric Diversity (Weight: 15%)
Evaluates whether the test suite includes global locations spanning multiple timezones and both Northern and Southern hemispheres.

### 3. Daylight Saving Time (DST) Transition Coverage (Weight: 15%)
Ensures inclusion of Spring DST transition cases (non-existent local time) and Fall DST transition cases (duplicate local time).

### 4. Historical Timezone Coverage (Weight: 10%)
Ensures testing of pre-1970 birth charts affected by historical timezone changes.

### 5. Boundary Sensitivity Coverage (Weight: 10%)
Validates planetary longitudes and Ascendant positions located near sign boundaries (0°, 30°, 360°) or nakshatra boundaries.

### 6. Divisional Chart Coverage (Weight: 10%)
Measures coverage across D1, D2, D3, D7, D9, D10, D12, and D30 divisional charts.

### 7. Vimshottari Dasha Coverage (Weight: 10%)
Validates birth nakshatra, starting lord, and balance year parameters.

### 8. Reference Software Diversity (Weight: 5%)
Measures the number of distinct independent reference software systems (e.g. Jagannatha Hora, Swiss Ephemeris standalone) represented in the benchmark dataset.

---

## Maturity Classifications

| Quality Score | Classification | Description |
| :--- | :--- | :--- |
| **80 – 100** | **HIGH** | Comprehensive test coverage across all astronomical edge cases and multi-software references. |
| **50 – 79** | **MEDIUM** | Standard test program with solid primary coverage but partial boundary/DST edge cases. |
| **0 – 49** | **LOW** | Initial or incomplete test suite requiring reference expansion. |

---

## Audit & Verification
Suite quality scores are computed deterministically via `@vedica/validation` using `assessBenchmarkSuiteQuality()`.

# Benchmark External Reference Data Entry Guide

## Overview
This step-by-step guide explains how to capture, format, and submit external reference data for benchmark cases (CASE-001 through CASE-007) using third-party astrology software.

---

## Supported External Software
- **Jagannatha Hora (v8.0 or later)**
- **Swiss Ephemeris standalone tools**
- **Parashara's Light**

---

## Step-by-Step Entry Workflow

### Step 1: Configure External Software
Ensure reference software settings match Vedica benchmark input settings exactly:
- **Zodiac**: Sidereal
- **Ayanamsha**: Lahiri (Chitra Paksha)
- **House System**: Whole Sign
- **Node Calculation**: True Node (or Mean Node as configured)

### Step 2: Open Developer Dashboard
Navigate to `/benchmark/chart` in your web browser. Select the desired benchmark case (e.g. `CASE-002`).

### Step 3: Enter Reference Data
Click **"Enter Reference Data"** to open the entry drawer.

Enter JSON in the format:
```json
{
  "astrology": {
    "ascendantLongitude": 100.5302,
    "ascendantSign": "Cancer",
    "planetaryLongitudes": {
      "Sun": 60.3121,
      "Moon": 22.5193,
      "Mars": 70.1309,
      "Mercury": 69.4056,
      "Jupiter": 293.1478,
      "Venus": 14.5854,
      "Saturn": 209.0792,
      "Rahu": 24.2191,
      "Ketu": 204.2191
    },
    "planetarySigns": {
      "Sun": "Gemini",
      "Moon": "Aries"
    }
  },
  "nakshatras": {
    "Sun": "Mrigashira",
    "Moon": "Bharani"
  },
  "padas": {
    "Sun": 3,
    "Moon": 3
  },
  "dasha": {
    "birthNakshatra": "Bharani",
    "dashaStartingLord": "Venus",
    "balanceYearsAtBirth": "6.22"
  },
  "divisionalCharts": {
    "D9": {
      "Sun": "Libra",
      "Moon": "Libra"
    }
  }
}
```

### Step 4: Add Provenance Metadata
- **Software Name**: `Jagannatha Hora`
- **Software Version**: `8.0`
- **Verification Status**: Select `VERIFIED` or `SOURCE_CAPTURED`
- **Notes**: Record reference capture details.

### Step 5: Save and Validate
Click **"Save Reference Data"**. Run the benchmark to verify accuracy metrics!

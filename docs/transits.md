# Planetary Transits Specification & Rules Engine

## Overview
Transit calculations determine the real-time or historical positions of planets relative to the natal Lagna, providing reproducible triggers for domain activity windows.

---

## 1. Transit Ephemeris & Sampling Methodology
- Built using Swiss Ephemeris (`SwissEphemerisEngine`) in Lahiri Sidereal mode.
- Computes 9 planets: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu.
- House placement relative to natal Lagna:
  $$\text{natalHouse} = ((\text{transitSignIndex} - \text{lagnaSignIndex} + 12) \pmod{12}) + 1$$
- **Boundary Detection**: Timeline generation uses efficient daily/step-wise sampling to detect sign/house transition boundaries.

---

## 2. Core Transit Rules (`PERSONAL_TIMING_V1`)

### TRANSIT-001: Jupiter transiting natal 10th house
- **Domain**: CAREER
- **Condition**: Transit Jupiter occupies natal 10th house.
- **Effects**: Growth +2.

### TRANSIT-002: Saturn transiting natal 10th house
- **Domain**: CAREER
- **Condition**: Transit Saturn occupies natal 10th house.
- **Effects**: Responsibility +2, Challenges +1.

### TRANSIT-003: Jupiter transiting natal 2nd or 11th house
- **Domain**: WEALTH
- **Condition**: Transit Jupiter occupies natal 2nd or 11th house.
- **Effects**: IncomePotential +2, AssetBuilding +1.

### TRANSIT-004: Jupiter transiting natal 7th house
- **Domain**: RELATIONSHIPS
- **Condition**: Transit Jupiter occupies natal 7th house.
- **Effects**: RelationshipActivity +2, Harmony +1.

### TRANSIT-005: Jupiter transiting natal 4th house
- **Domain**: PROPERTY
- **Condition**: Transit Jupiter occupies natal 4th house.
- **Effects**: PropertyActivity +2, AcquisitionPotential +1.

### TRANSIT-006: Saturn transiting natal 4th house
- **Domain**: PROPERTY
- **Condition**: Transit Saturn occupies natal 4th house.
- **Effects**: PropertyActivity +1, Obstacles +2.

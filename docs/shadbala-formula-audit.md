# Classical Shadbala Engine — Formula Audit & Methodology Specification

**Document Version**: `1.0.0`  
**Profile Version**: `personal-shadbala-v1`  
**Engine Package**: `@vedica/shadbala-engine`  
**Date**: `2026-08-29`

---

## Overview

This document provides a comprehensive mathematical audit for every currently implemented component of the classical Parashari Shadbala engine. Each component is audited across 9 standard metrics:
1. Formula
2. Input values
3. Units
4. Maximum value
5. Boundary behavior
6. Sign / house conventions
7. Planet-specific constants
8. Current implementation file
9. Validation status (`IMPLEMENTED_UNBENCHMARKED` | `BENCHMARK_VALIDATED` | `MISMATCH_FOUND` | `NOT_IMPLEMENTED`)

---

## Component Audit Specifications

### 1. UCHCHA BALA (Exaltation Strength)

* **Formula**:
  $$\text{Uchcha Bala (Virupas)} = \frac{\text{Angular Distance}(\lambda_{\text{planet}}, \lambda_{\text{debilitation}})}{3}$$
  Where $\text{Angular Distance}(\lambda_1, \lambda_2)$ computes the shortest arc distance in $[0^\circ, 180^\circ]$ between the planet's sidereal longitude and its deepest debilitation longitude (Paramaneecha).
* **Input Values**:
  * `planet`: PlanetName (`Sun`, `Moon`, `Mars`, `Mercury`, `Jupiter`, `Venus`, `Saturn`)
  * `longitude`: Sidereal longitude in degrees $[0^\circ, 360^\circ)$
* **Units**: Virupas ($60 \text{ Virupas} = 1 \text{ Rupa}$)
* **Maximum Value**: $60.00 \text{ Virupas}$ ($1.00 \text{ Rupa}$) at Paramochcha (deepest exaltation point).
* **Boundary Behavior**:
  * At Paramochcha ($\lambda_{\text{exaltation}}$): Distance from debilitation = $180^\circ \implies 180 / 3 = 60.00 \text{ Virupas}$.
  * At Paramaneecha ($\lambda_{\text{debilitation}}$): Distance from debilitation = $0^\circ \implies 0 / 3 = 0.00 \text{ Virupas}$.
  * Midpoint ($90^\circ$ arc from exaltation/debilitation): Distance = $90^\circ \implies 90 / 3 = 30.00 \text{ Virupas}$.
  * Smooth linear variation across all degrees with continuous wrap-around across $0^\circ / 360^\circ$.
* **Sign / House Conventions**: Sidereal absolute longitude (Lahiri Ayanamsha). Sign boundaries do not introduce step discontinuities.
* **Planet-Specific Constants**:
  * Sun: Exaltation Aries 10° ($10^\circ$), Debilitation Libra 10° ($190^\circ$)
  * Moon: Exaltation Taurus 3° ($33^\circ$), Debilitation Scorpio 3° ($213^\circ$)
  * Mars: Exaltation Capricorn 28° ($298^\circ$), Debilitation Cancer 28° ($118^\circ$)
  * Mercury: Exaltation Virgo 15° ($165^\circ$), Debilitation Pisces 15° ($345^\circ$)
  * Jupiter: Exaltation Cancer 5° ($95^\circ$), Debilitation Capricorn 5° ($275^\circ$)
  * Venus: Exaltation Pisces 27° ($357^\circ$), Debilitation Virgo 27° ($177^\circ$)
  * Saturn: Exaltation Libra 20° ($200^\circ$), Debilitation Aries 20° ($20^\circ$)
* **Implementation File**: [`packages/shadbala-engine/src/sthana/uchcha-bala.ts`](file:///home/rkshtjain3/vedicaPath/packages/shadbala-engine/src/sthana/uchcha-bala.ts)
* **Validation Status**: `IMPLEMENTED_UNBENCHMARKED`

---

### 2. OJAYUGMA BALA (Odd / Even Sign Strength)

* **Formula**:
  $$\text{Ojayugma Bala} = \text{Points}(D1) + \text{Points}(D9)$$
  Where:
  * Male planets (Sun, Mars, Jupiter) & Neutral planets (Mercury, Saturn) receive $15 \text{ Virupas}$ if placed in an Odd sign ($1, 3, 5, 7, 9, 11$), and $0 \text{ Virupas}$ if in an Even sign.
  * Female planets (Moon, Venus) receive $15 \text{ Virupas}$ if placed in an Even sign ($2, 4, 6, 8, 10, 12$), and $0 \text{ Virupas}$ if in an Odd sign.
* **Input Values**:
  * `planet`: PlanetName
  * `d1Sign`: RashiDetails (D1 sign ID 1-12)
  * `d9Sign`: RashiDetails (D9 Navamsa sign ID 1-12)
* **Units**: Virupas
* **Maximum Value**: $30.00 \text{ Virupas}$ ($15 \text{ from D1} + 15 \text{ from D9}$)
* **Boundary Behavior**: Discrete step function based on sign boundaries ($1^\text{st}$ arc second of sign determines odd/even classification).
* **Sign / House Conventions**: 1-indexed Rashi numbers: Odd = $\{1, 3, 5, 7, 9, 11\}$, Even = $\{2, 4, 6, 8, 10, 12\}$.
* **Planet-Specific Constants**:
  * Male: Sun, Mars, Jupiter
  * Female: Moon, Venus
  * Neutral: Mercury, Saturn
* **Implementation File**: [`packages/shadbala-engine/src/sthana/ojayugma-bala.ts`](file:///home/rkshtjain3/vedicaPath/packages/shadbala-engine/src/sthana/ojayugma-bala.ts)
* **Validation Status**: `IMPLEMENTED_UNBENCHMARKED`

---

### 3. KENDRADI BALA (House Placement Strength)

* **Formula**:
  $$\text{Kendradi Bala} = \begin{cases}
  60 \text{ Virupas} & \text{if House } \in \{1, 4, 7, 10\} \quad (\text{Kendra}) \\
  30 \text{ Virupas} & \text{if House } \in \{2, 5, 8, 11\} \quad (\text{Panaphara}) \\
  15 \text{ Virupas} & \text{if House } \in \{3, 6, 9, 12\} \quad (\text{Apoklima})
  \end{cases}$$
* **Input Values**:
  * `planet`: PlanetName
  * `house`: House number ($1 \dots 12$)
* **Units**: Virupas
* **Maximum Value**: $60.00 \text{ Virupas}$ ($1.00 \text{ Rupa}$)
* **Boundary Behavior**: Discrete step classification based on D1 house placement.
* **Sign / House Conventions**: Whole sign house system (or Equal house system depending on profile configuration).
* **Planet-Specific Constants**: Applies equally to all 7 planets.
* **Implementation File**: [`packages/shadbala-engine/src/sthana/kendradi-bala.ts`](file:///home/rkshtjain3/vedicaPath/packages/shadbala-engine/src/sthana/kendradi-bala.ts)
* **Validation Status**: `IMPLEMENTED_UNBENCHMARKED`

---

### 4. DREKKANA BALA (Decan Strength)

* **Formula**:
  $$\text{Drekkana Bala} = \begin{cases}
  15 \text{ Virupas} & \text{if Male planet (Sun, Mars, Jupiter) in 1st Drekkana } [0^\circ, 10^\circ) \\
  15 \text{ Virupas} & \text{if Neutral planet (Mercury, Saturn) in 2nd Drekkana } [10^\circ, 20^\circ) \\
  15 \text{ Virupas} & \text{if Female planet (Moon, Venus) in 3rd Drekkana } [20^\circ, 30^\circ) \\
  0 \text{ Virupas} & \text{otherwise}
  \end{cases}$$
* **Input Values**:
  * `planet`: PlanetName
  * `degreeInSign`: Degree position in sign $[0^\circ, 30^\circ)$
* **Units**: Virupas
* **Maximum Value**: $15.00 \text{ Virupas}$ ($0.25 \text{ Rupa}$)
* **Boundary Behavior**: Exact boundary checks at $10.0^\circ$ and $20.0^\circ$:
  * $0.0^\circ \le d < 10.0^\circ \implies 1\text{st Drekkana}$
  * $10.0^\circ \le d < 20.0^\circ \implies 2\text{nd Drekkana}$
  * $20.0^\circ \le d < 30.0^\circ \implies 3\text{rd Drekkana}$
* **Sign / House Conventions**: Degree within current sidereal sign.
* **Planet-Specific Constants**: Male (Sun, Mars, Jupiter), Neutral (Mercury, Saturn), Female (Moon, Venus).
* **Implementation File**: [`packages/shadbala-engine/src/sthana/drekkana-bala.ts`](file:///home/rkshtjain3/vedicaPath/packages/shadbala-engine/src/sthana/drekkana-bala.ts)
* **Validation Status**: `IMPLEMENTED_UNBENCHMARKED`

---

### 5. DIG BALA (Directional Strength)

* **Formula**:
  $$\text{Dig Bala (Virupas)} = \frac{\text{Angular Distance}(\lambda_{\text{planet}}, \lambda_{\text{zero}})}{3}$$
  Where $\lambda_{\text{zero}}$ is the planet's zero-strength cusp longitude relative to the Ascendant longitude $\lambda_{\text{Lagna}}$:
  * Mercury & Jupiter: Strongest in East (House 1 / Lagna) $\implies \lambda_{\text{zero}} = (\lambda_{\text{Lagna}} + 180^\circ) \bmod 360^\circ$ (House 7 cusp)
  * Sun & Mars: Strongest in South (House 10 / MC) $\implies \lambda_{\text{zero}} = (\lambda_{\text{Lagna}} + 90^\circ) \bmod 360^\circ$ (House 4 cusp)
  * Saturn: Strongest in West (House 7 / Descendant) $\implies \lambda_{\text{zero}} = (\lambda_{\text{Lagna}} + 0^\circ) \bmod 360^\circ$ (House 1 cusp)
  * Moon & Venus: Strongest in North (House 4 / IC) $\implies \lambda_{\text{zero}} = (\lambda_{\text{Lagna}} + 270^\circ) \bmod 360^\circ$ (House 10 cusp)
* **Input Values**:
  * `planet`: PlanetName
  * `planetLongitude`: Sidereal longitude of planet $[0^\circ, 360^\circ)$
  * `ascendantLongitude`: Sidereal longitude of Lagna $[0^\circ, 360^\circ)$
  * `methodology`: `EXACT_ANGULAR`
* **Units**: Virupas
* **Maximum Value**: $60.00 \text{ Virupas}$ ($1.00 \text{ Rupa}$) when planet is exactly at its strongest directional cusp ($180^\circ$ arc from zero point).
* **Boundary Behavior**: Continuous circular calculation across $0^\circ / 360^\circ$. Range $[0.00, 60.00] \text{ Virupas}$.
* **Sign / House Conventions**: Exact angular distance from designated zero-strength point.
* **Planet-Specific Constants**: Directional strong houses (Sun/Mars: H10, Moon/Venus: H4, Mercury/Jupiter: H1, Saturn: H7).
* **Implementation File**: [`packages/shadbala-engine/src/dig/dig-bala.ts`](file:///home/rkshtjain3/vedicaPath/packages/shadbala-engine/src/dig/dig-bala.ts)
* **Validation Status**: `IMPLEMENTED_UNBENCHMARKED`

---

### 6. NAISARGIKA BALA (Natural Illumination Strength)

* **Formula**: Fixed Parashari classical constants:
  $$\text{Naisargika Bala} = \begin{cases}
  60.000 \text{ Virupas} \quad (1.000 \text{ Rupa}) & \text{Sun} \\
  51.429 \text{ Virupas} \quad (0.857 \text{ Rupa}) & \text{Moon} \\
  42.857 \text{ Virupas} \quad (0.714 \text{ Rupa}) & \text{Venus} \\
  34.286 \text{ Virupas} \quad (0.571 \text{ Rupa}) & \text{Jupiter} \\
  25.714 \text{ Virupas} \quad (0.429 \text{ Rupa}) & \text{Mercury} \\
  17.143 \text{ Virupas} \quad (0.286 \text{ Rupa}) & \text{Mars} \\
  8.571 \text{ Virupas} \quad (0.143 \text{ Rupa}) & \text{Saturn}
  \end{cases}$$
* **Input Values**: `planet`: PlanetName
* **Units**: Virupas
* **Maximum Value**: $60.00 \text{ Virupas}$ (Sun)
* **Boundary Behavior**: Constant values invariant of chart time, date, or location.
* **Sign / House Conventions**: None (Intrinsic natural brilliance property).
* **Planet-Specific Constants**: Fixed fractions of 60 Virupas ($\frac{7}{7}, \frac{6}{7}, \frac{5}{7}, \frac{4}{7}, \frac{3}{7}, \frac{2}{7}, \frac{1}{7} \times 60$).
* **Implementation File**: [`packages/shadbala-engine/src/constants/naisargika.ts`](file:///home/rkshtjain3/vedicaPath/packages/shadbala-engine/src/constants/naisargika.ts)
* **Validation Status**: `BENCHMARK_VALIDATED` (Constant values derived directly from Brihat Parasara Hora Shastra Chapter 27).

---

## Component Validation Status Matrix

| Component ID | Component Name | Formula Version | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `UCHCHA_BALA` | Exaltation Strength | `bphs-uchcha-v1` | `IMPLEMENTED_UNBENCHMARKED` | Awaiting real JHora reference verification |
| `OJAYUGMA_BALA` | Odd/Even Sign Strength | `bphs-ojayugma-v1` | `IMPLEMENTED_UNBENCHMARKED` | D1 + D9 odd/even logic verified against BPHS |
| `KENDRADI_BALA` | House Type Strength | `bphs-kendradi-v1` | `IMPLEMENTED_UNBENCHMARKED` | Whole sign Kendra/Panaphara/Apoklima verified |
| `DREKKANA_BALA` | Decan Strength | `bphs-drekkana-v1` | `IMPLEMENTED_UNBENCHMARKED` | 10° decan boundary logic verified |
| `DIG_BALA` | Directional Strength | `bphs-dig-bala-v1` | `IMPLEMENTED_UNBENCHMARKED` | Exact angular zero-point calculation verified |
| `NAISARGIKA_BALA` | Natural Strength | `classical-naisargika-v1` | `BENCHMARK_VALIDATED` | Verified against BPHS Chapter 27 fixed constants |
| `SAPTAVARGAJA_BALA` | Saptavarga Strength | `bphs-saptavarga-foundation-v1` | `IMPLEMENTED_UNBENCHMARKED` | Partial foundation (D1/D9 only, 0 Virupas assigned) |
| `CHESHTA_BALA` | Motional Strength | `bphs-cheshta-foundation-v1` | `IMPLEMENTED_UNBENCHMARKED` | Foundation metadata (speed/retrograde, 0 Virupas) |

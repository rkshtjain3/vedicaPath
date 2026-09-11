# Divisional Chart Engine Documentation (`@vedica/divisional-chart-engine`)

The **Divisional Chart Engine** (`packages/divisional-chart-engine/`) provides a mathematically deterministic, modular, and extensible architecture for computing Vedic divisional (Varga) charts including D9 Navamsa and D10 Dashamsa.

---

## 1. Architectural Design

```
D1 Natal Birth Chart
       │
       ▼
Sidereal Planetary Longitudes (0°–360°)
       │
       ├──────────────────────────────────────┐
       ▼                                      ▼
D9 Navamsa Transformation             D10 Dashamsa Transformation
(`calculateNavamsaPosition`)          (`calculateDashamsaPosition`)
       │                                      │
       ▼                                      ▼
D9 Chart & Whole Sign Houses          D10 Chart & Whole Sign Houses
       │                                      │
       ▼                                      ▼
D1 vs D9 Vargottama Detection         D1 vs D10 Same Sign & Career Facts
```

### Key Architectural Principles
1. **Reuses D1 Sidereal Longitudes**: Does not re-query Swiss Ephemeris or recalculate planetary positions from astronomical ephemerides.
2. **Deterministic & Pure Math**: Implements exact double-precision floating-point divisional transformations without intermediate rounding.
3. **Independent Package**: Does not depend on Web UI, rules engine, or interpretation engine.
4. **Extensible Architecture**: Defined with `DivisionalChartType` (`'D1' | 'D9' | 'D10'`), driven by configuration profiles (`DIVISIONAL_PROFILES`).

---

## 2. Supported Divisional Charts

### D9 Navamsa (9 Divisions, 3° 20' per division)
- Divided into 9 equal parts of 3° 20' (3.3333333333333335°).
- Governed by sign categories: Movable (1st sign), Fixed (9th sign), Dual (5th sign).
- Evaluates traditional Vargottama status ($S_{D1} = S_{D9}$).

### D10 Dashamsa (10 Divisions, 3° per division)
- Divided into 10 equal parts of 3.0°.
- Governed by odd/even sign rules: Odd signs start from the sign itself (1st sign); Even signs start from the 9th sign counted from itself.
- Evaluates $S_{D1} = S_{D10}$ sign match (`sameD1D10Sign`) and computes career cross-chart facts (`calculateCareerCrossChartFacts`).
- See [docs/dashamsa.md](file:///home/rkshtjain3/vedicaPath/docs/dashamsa.md) for full details.

---

## 3. Whole Sign House System

In all divisional charts (D9, D10), house calculation uses **Whole Sign Houses**:
- **House 1**: The sign of the Divisional Ascendant ($S_{Div\_Lagna}$).
- **House $H$**: Sign $((S_{Div\_Lagna} + H - 2) \pmod{12}) + 1$.

---

## 4. Floating-Point Precision Policy

1. **Intermediate Calculations**: Uses full IEEE 754 double precision without intermediate `Math.round()`.
2. **Boundary Safeguard**: Remainder calculations use exact subtraction ($deg - divIdx \times W$) to avoid floating-point modulo precision loss.
3. **Display Formatting**: Degrees are formatted to `DD° MM' SS"` only for UI presentation.

# Planetary Strength & Relationship Engine (`@vedica/strength-engine`)

The **Planetary Strength & Relationship Engine** (`@vedica/strength-engine`) provides transparent, factual, and deterministic strength classification and compound relationship modeling for classical Vedic astrology.

> [!IMPORTANT]
> **Deterministic & Explainable Philosophy**:
> - Zero AI / LLM usage.
> - Zero generic predictions or fatalistic horoscope claims.
> - Every score and relationship classification is computed deterministically from chart geometry and explicit scoring rules (`PERSONAL_STRENGTH_V1`).

---

## 1. Core Architecture

The package resides in `packages/strength-engine` and operates as a pure computational module.

```
packages/strength-engine/src/
├── types/
│   └── strength-types.ts        # Interfaces for factors, scores, and relationship matrices
├── profiles/
│   └── personal-strength-v1.ts   # Configurable weights, thresholds, and policy parameters
├── relationships/
│   └── relationship-engine.ts   # Naisargika, Tatkalika, and Panchadha Maitri calculators
├── house-strength/
│   └── house-categories.ts      # Kendra, Trikona, Upachaya, Dusthana classification
├── dignity/
│   └── dignity-strength.ts      # Factual sign dignity evaluation
├── conditions/
│   └── combustion-retrograde.ts # Combustion thresholds & retrograde status evaluation
├── comparison/
│   └── d1-d9-comparison.ts      # D1 vs D9 Vargottama detection & strength contribution
├── scoring/
│   └── strength-calculator.ts   # Main strength evaluation pipeline
└── index.ts
```

---

## 2. Panchadha Maitri Relationship Engine

Planetary relationships are evaluated in 3 stages:

### A. Naisargika Maitri (Natural Relationship)
Base relationships between planets derived from classical friendship tables (`NAISARGIKA_FRIENDSHIPS`).
- Categories: `FRIEND`, `NEUTRAL`, `ENEMY`

### B. Tatkalika Maitri (Temporary Relationship)
Calculated from relative house placement in the birth chart (D1):
- **Temporary Friend (`FRIEND`)**: Target planet occupies 2nd, 3rd, 4th, 10th, 11th, or 12th house relative to origin planet.
- **Temporary Enemy (`ENEMY`)**: Target planet occupies 1st (same sign), 5th, 6th, 7th, 8th, or 9th house relative to origin planet.

### C. Panchadha Maitri (Compound Relationship)
Combines Natural and Temporary relationships into 5 final categories:

| Natural | Temporary | Compound Result | Description |
| :--- | :--- | :--- | :--- |
| `FRIEND` | `FRIEND` | `GREAT_FRIEND` | Ati Mitra (Great Friend) |
| `FRIEND` | `ENEMY` | `NEUTRAL` | Sama (Neutral) |
| `NEUTRAL` | `FRIEND` | `FRIEND` | Mitra (Friend) |
| `NEUTRAL` | `ENEMY` | `ENEMY` | Satru (Enemy) |
| `ENEMY` | `FRIEND` | `NEUTRAL` | Sama (Neutral) |
| `ENEMY` | `ENEMY` | `GREAT_ENEMY` | Ati Satru (Great Enemy) |

---

## 3. Strength Scoring Methodology (`PERSONAL_STRENGTH_V1`)

Strength scores sum contributions across multiple factual factors:

### Factor Contributions

| Category | Condition | Default Weight | Effect |
| :--- | :--- | :--- | :--- |
| **Dignity** | Exalted | +6 | `SUPPORTIVE` |
| **Dignity** | Moolatrikona | +5 | `SUPPORTIVE` |
| **Dignity** | Own Sign | +4 | `SUPPORTIVE` |
| **Dignity** | Great Friend Sign | +3 | `SUPPORTIVE` |
| **Dignity** | Friendly Sign | +2 | `SUPPORTIVE` |
| **Dignity** | Neutral Sign | 0 | `NEUTRAL` |
| **Dignity** | Enemy Sign | -2 | `CHALLENGING` |
| **Dignity** | Great Enemy Sign | -3 | `CHALLENGING` |
| **Dignity** | Debilitated | -5 | `CHALLENGING` |
| **House** | Kendra House (1, 4, 7, 10) | +3 | `SUPPORTIVE` |
| **House** | Trikona House (1, 5, 9) | +3 | `SUPPORTIVE` |
| **House** | Upachaya House (3, 6, 10, 11) | +1 | `SUPPORTIVE` |
| **House** | Dusthana House (6, 8, 12) | -2 | `CHALLENGING` |
| **Divisional** | Vargottama (D1 Sign = D9 Sign) | +3 | `SUPPORTIVE` |
| **Condition** | Combustion (within orb of Sun) | -3 | `CHALLENGING` |
| **Condition** | Retrograde Status | 0 | `NEUTRAL` (Factual Modifier) |
| **Aspect** | Benefic Aspect Received | +1 | `SUPPORTIVE` |
| **Aspect** | Malefic Aspect Received | -1 | `CHALLENGING` |

### Strength Classification Thresholds

| Overall Strength | Score Range |
| :--- | :--- |
| **`VERY_STRONG`** | Score $\ge 7$ |
| **`STRONG`** | $3 \le$ Score $< 7$ |
| **`MODERATE`** | $0 \le$ Score $< 3$ |
| **`WEAK`** | $-3 \le$ Score $< 0$ |
| **`VERY_WEAK`** | Score $< -3$ |

---

## 4. API & Web UI Exposure

- **API Route**: `/api/calculate` includes `strengthAnalysis` payload in the JSON response.
- **Web UI Tab**: **"7. PLANET STRENGTH"** (`#tab-strength`) provides:
  - Overview cards for classical planets with strength badges and expandable factor evidence.
  - Attribute comparison table (`#strength-comparison-table`).
  - Interactive Panchadha Maitri relationship dropdown matrix (`#relationship-matrix-section`).

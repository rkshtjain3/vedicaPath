# @vedica/analysis-engine — Astrological Analysis Engine & Transparent Yoga Framework

## Overview
`@vedica/analysis-engine` is a pure, deterministic, and factual analysis package designed to compute astrological placement facts, planetary dignities, house/lord relationships, orb-based conjunctions, Vedic house aspects, planetary combustion, and classical Yogas without producing predictive or AI-generated interpretations.

All detections output structured data with full mathematical and condition-level traceability.

---

## 1. Analysis Profile Configuration (`PERSONAL_ANALYSIS_V1`)

The analysis engine operates under versioned profiles (`AnalysisProfile`).

| Setting | Value | Description |
| :--- | :--- | :--- |
| **Profile Version** | `personal-analysis-v1` | Baseline canonical analysis profile version. |
| **Conjunction Orb** | `8.0°` | Maximum angular difference between two grahas for conjunction detection. |
| **Node Aspects** | `false` | Rahu and Ketu do not cast house aspects in default baseline mode. |
| **Combustion Thresholds** | Direct / Retrograde | Sun proximity angle threshold for planetary combustion. |

### Combustion Threshold Orbs
- **Mercury**: Direct $14.0^\circ$, Retrograde $12.0^\circ$
- **Venus**: Direct $10.0^\circ$, Retrograde $8.0^\circ$
- **Mars**: Direct $17.0^\circ$, Retrograde $17.0^\circ$
- **Jupiter**: Direct $11.0^\circ$, Retrograde $11.0^\circ$
- **Saturn**: Direct $15.0^\circ$, Retrograde $15.0^\circ$

---

## 2. Calculated Astrological Facts

### A. Planet Facts
- **Sign**: Calculated 1-indexed Rashi assignment ($(\lfloor \text{longitude} / 30 \rfloor) + 1$).
- **House**: Lagna-relative house number ($1 - 12$), calculated as $((\text{SignIndex} - \text{LagnaSignIndex} + 12) \bmod 12) + 1$.
- **Degree in Sign**: $\text{longitude} \bmod 30$.
- **Nakshatra & Pada**: Nakshatra ID ($1 - 27$) and Pada ($1 - 4$).
- **Retrograde Status**: Derived directly from ephemeris orbital speed ($v < 0$).

### B. House & Lord Facts
- **House Facts**: 12 houses with sign name, sign lord (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn), occupant list, and occupant count.
- **House Lord Facts**: Placement of each of the 12 house lords, identifying which house/sign the lord resides in and the lord's primary dignity in that sign.

---

## 3. Planetary Dignities Engine

Dignity calculation follows standard classical hierarchy:
1. **Exaltation (`EXALTED`)**: Matches exact exaltation sign (e.g. Sun in Aries, Moon in Taurus, Mars in Capricorn).
2. **Debilitation (`DEBILITATED`)**: Matches exact debilitation sign (e.g. Sun in Libra, Moon in Scorpio, Mars in Cancer).
3. **Moolatrikona (`MOOLATRIKONA`)**: Matches sign and degree range (e.g. Sun in Leo $0^\circ-20^\circ$, Jupiter in Sagittarius $0^\circ-10^\circ$).
4. **Own Sign (`OWN_SIGN`)**: Matches signs ruled by the planet (e.g. Mars in Aries/Scorpio, Venus in Taurus/Libra).
5. **Naisargika Relationship**:
   - `FRIENDLY_SIGN`: Sign lord is a natural friend.
   - `NEUTRAL_SIGN`: Sign lord is neutral.
   - `ENEMY_SIGN`: Sign lord is a natural enemy.

---

## 4. Conjunction & Aspect Engines

### Angular Distance Formula
For any two longitudes $L_A, L_B \in [0^\circ, 360^\circ)$:
$$\Delta \theta = \min(|L_A - L_B|, 360 - |L_A - L_B|)$$

- **Conjunctions**: Detected if $\Delta \theta \le \text{orbDegrees}$. Duplicate pairs $(P_B, P_A)$ are automatically eliminated.

### Vedic House Aspect Rules
Calculated by house relative distance (inclusive counting):
$$\text{TargetHouse} = ((H_{\text{from}} + \text{AspectNumber} - 1) \bmod 12), \quad (\text{if } 0 \implies 12)$$

- **All Grahas**: Cast 7th house aspect.
- **Mars**: Special 4th, 7th, 8th aspects.
- **Jupiter**: Special 5th, 7th, 9th aspects.
- **Saturn**: Special 3rd, 7th, 10th aspects.

---

## 5. Transparent Yoga Detection Framework

Every Yoga detection returns a `YogaDetectionResult` containing:
- `id`: Unique identifier (e.g., `GAJAKESARI_YOGA`).
- `name`: Human-readable name.
- `detected`: Boolean result (`true` if ALL conditions pass).
- `conditions`: Array of evaluated boolean conditions, each with `id`, `description`, and `result`.

### Initial 8 Classical Yogas Evaluated
1. **Gajakesari Yoga**: Jupiter in Kendra (1/4/7/10) from Moon AND Jupiter not debilitated.
2. **Budha-Aditya Yoga**: Sun and Mercury conjunct in same house or within orb.
3. **Dharma-Karmadhipati Yoga**: 9th Lord and 10th Lord in conjunction, mutual aspect, or sign exchange.
4. **Ruchaka Yoga** (Mahapurusha): Mars in Kendra from Lagna AND in Own Sign/Exaltation.
5. **Bhadra Yoga** (Mahapurusha): Mercury in Kendra from Lagna AND in Own Sign/Exaltation.
6. **Hamsa Yoga** (Mahapurusha): Jupiter in Kendra from Lagna AND in Own Sign/Exaltation.
7. **Malavya Yoga** (Mahapurusha): Venus in Kendra from Lagna AND in Own Sign/Exaltation.
8. **Sasa Yoga** (Mahapurusha): Saturn in Kendra from Lagna AND in Own Sign/Exaltation.

---

## 6. Verification & Test Suite

- **Unit Tests**: Executed via Vitest in `packages/analysis-engine/tests/analysis-engine.test.ts`.
- **UI Integration**: Next.js Web UI features an interactive "2. Analysis & Yogas" tab with sub-tabs for Overview, Planets, Houses, Aspects, Dignities, and Yogas.
- **Condition Breakdown**: Clicking `[ Why? ]` on any Yoga reveals its transparent pass/fail condition list.
- **E2E Automation**: End-to-end user workflows verified via Playwright in `apps/web/e2e/calculation.spec.ts`.

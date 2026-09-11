# D10 Dashamsa Career Rules — Technical Documentation

## Purpose

Phase 12 introduces a **D10 Dashamsa career evidence layer** into the Rules Engine. This layer evaluates factual career indicators from the D10 (Dashamsa) divisional chart and presents them as **separate, transparent evidence** without modifying existing D1 career scores, activity ratings, or Dasha timing calculations.

---

## Architecture

```
D1 Natal Chart
       │
       ├─── Existing D1 Career Rules  ──► Career Domain Score (unchanged)
       │
       └─── D10 Dashamsa Chart  ──► D10 Career Evidence Layer (NEW)
                │
                ├── D10-CAREER-001: 10th Lord Placement
                ├── D10-CAREER-002: 10th Lord Dignity
                ├── D10-CAREER-003: Lagna Lord Placement
                ├── D10-CAREER-004: Career Karakas (Sun, Saturn, Jupiter)
                └── D10-CAREER-005: D1/D10 Career Lord Relationship
```

### Key Separation Guarantee

| Layer | Modifies D1 Career Score? | Modifies D1 Rating Level? |
|-------|:------------------------:|:------------------------:|
| D1 Career Rules | YES | YES |
| **D10 Career Evidence** | **NO** | **NO** |

---

## Implemented Rules

### D10-CAREER-001 — D10 10th Lord Placement

Evaluates which house and sign the D10 10th lord occupies.

**Outputs:**
- Planet name
- D10 sign
- D10 house number
- Dignity (canonical)
- House category classification

**House Category Mapping (from profile `PERSONAL_CAREER_D10_RULES_V1`):**

| Category | Houses | Effect |
|----------|--------|--------|
| KENDRA | 1, 4, 7, 10 | SUPPORTIVE |
| TRIKONA | 5, 9 | SUPPORTIVE |
| UPACHAYA | 3, 11 | SUPPORTIVE |
| DUSTHANA | 6, 8, 12 | CHALLENGING |
| OTHER | 2 | NEUTRAL |

---

### D10-CAREER-002 — D10 10th Lord Dignity

Evaluates the dignity of the D10 10th lord using canonical dignity logic (reused from `@vedica/analysis-engine`).

**Dignity Effect Mapping:**

| Dignity | Effect |
|---------|--------|
| EXALTED | SUPPORTIVE |
| MOOLATRIKONA | SUPPORTIVE |
| OWN_SIGN | SUPPORTIVE |
| FRIENDLY_SIGN | SUPPORTIVE |
| NEUTRAL_SIGN | NEUTRAL |
| ENEMY_SIGN | CHALLENGING |
| DEBILITATED | CHALLENGING |

---

### D10-CAREER-003 — D10 Lagna Lord Placement

Evaluates D10 Lagna Lord placement (same structure as D10-CAREER-001 but for the ascendant lord).

---

### D10-CAREER-004 — Career Karaka Placement

Evaluates Sun, Saturn, and Jupiter individually in D10. Each planet receives its own evidence entry with house, sign, dignity, house category, and effect classification.

---

### D10-CAREER-005 — D1/D10 Career Lord Relationship

Compares D1 10th Lord with D10 10th Lord.

**Effect Mapping:**

| Condition | Effect |
|-----------|--------|
| SAME_PLANET | SUPPORTIVE |
| DIFFERENT_PLANET | NEUTRAL |

---

## Profile: `PERSONAL_CAREER_D10_RULES_V1`

All effect mappings are explicitly visible in the profile configuration at:
`packages/rules-engine/src/profiles/career-d10-profile.ts`

Every rule references this profile for its classification logic. No hidden interpretation logic exists.

---

## Mixed Signal Detection

When **at least one SUPPORTIVE evidence** and **at least one CHALLENGING evidence** coexist across all 5 rules, the evaluator returns:

```ts
{ mixedSignals: true }
```

Opposing evidence is **never cancelled**. All supportive, challenging, and neutral evidence is preserved and presented independently.

---

## API Response Shape

```json
{
  "rules": {
    "careerD10": {
      "profileVersion": "personal-career-d10-rules-v1",
      "rules": [...],
      "supportiveEvidence": [...],
      "challengingEvidence": [...],
      "neutralEvidence": [...],
      "mixedSignals": false,
      "summaryFacts": {
        "d10LagnaSign": "Aries",
        "d10LagnaLord": "Mars",
        "d10TenthSign": "Capricorn",
        "d10TenthLord": "Saturn",
        ...
      }
    }
  }
}
```

---

## WHY? Evidence

Every D10 rule produces a `whyEvidence` string array containing step-by-step calculation trace:

```
D10 Lagna: Leo
D10 10th Sign: Taurus
10th Lord: Venus
Venus is placed in: D10 House 1 (Leo)
Dignity: Neutral Sign
House Category: KENDRA
Classification: SUPPORTIVE
```

All evidence is machine-generated from chart data. No hard-coded explanatory paragraphs.

---

## Limitations

1. D10 evidence does **not** contribute points to existing D1 Career dimension scores.
2. D10 evidence does **not** alter existing LOW/MODERATE/HIGH career rating levels.
3. No combined D1 + D10 score is calculated in this phase.
4. No AI, LLM, or speculative horoscope text is used.
5. No promotion, salary, or career outcome predictions are generated.
6. Future phases may consider carefully combining D10 evidence with D1 scoring after validation.

---

## Non-Predictive Policy

This engine produces 100% deterministic, machine-readable evidence. The classification labels (SUPPORTIVE, NEUTRAL, CHALLENGING) describe chart-relative factual positions, not career outcomes. Users should consult qualified professionals for career guidance.

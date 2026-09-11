# @vedica/rules-engine — Deterministic, Explainable Astrology Rules Engine

## Overview
`@vedica/rules-engine` is a pure, deterministic, and explainable astrological rules package. It consumes outputs from `@vedica/astrology-core`, `@vedica/dasha-engine`, and `@vedica/analysis-engine` to evaluate 4 primary life domains (**CAREER**, **WEALTH**, **RELATIONSHIPS**, **PROPERTY**).

### Core Principles
- **Zero AI / Zero LLMs**: No generative models, natural language processing, or probabilistic text generators are used.
- **Traceability**: Every output maps strictly to versioned rules and machine-readable chart evidence.
- **No Guaranteed Claims**: Produces domain dimension ratings (`LOW`, `MODERATE`, `HIGH`) and active indications rather than event predictions.

---

## 1. Rule Interface & Evidence Model

### Canonical Rule Structure
```ts
interface AstrologyRule {
  id: string;
  domain: 'CAREER' | 'WEALTH' | 'RELATIONSHIPS' | 'PROPERTY';
  version: string;
  evaluate(context: AstrologyRuleContext): RuleEvaluation;
}
```

### Machine-Readable Evidence Model
Every rule evaluation includes explicit chart evidence:
```json
{
  "ruleId": "CAREER-001",
  "domain": "CAREER",
  "triggered": true,
  "effects": [
    { "dimension": "Growth", "value": 2 },
    { "dimension": "Stability", "value": 2 }
  ],
  "evidence": [
    {
      "type": "HOUSE_LORD_DIGNITY",
      "house": 10,
      "lord": "Saturn",
      "dignity": "OWN_SIGN",
      "details": "10th Lord Saturn has OWN_SIGN dignity"
    }
  ],
  "explanationKey": "CAREER_001_PASS"
}
```

---

## 2. Versioned Rules Profile (`PERSONAL_RULES_V1`)

- **Profile Version**: `personal-rules-v1`
- **Calculation Profile**: `personal-vedic-v1`
- **Analysis Profile**: `personal-analysis-v1`

### Scoring Boundaries
Dimensions within each domain accumulate integer values from triggered rules. Rating levels are calculated as:
- **`LOW`**: Score $\le 1$
- **`MODERATE`**: $2 \le \text{Score} \le 4$
- **`HIGH`**: Score $> 4$

---

## 3. Reusable Dasha & House Connection Resolver

`isPlanetConnectedToHouse(planet, house, analysis)` evaluates 5 connection vectors:
1. **Occupation**: Planet occupies the target house.
2. **Lordship**: Planet rules the target house.
3. **House Aspect**: Planet casts a Vedic aspect onto the target house.
4. **Lord Aspect**: Planet casts a Vedic aspect onto the target house lord.
5. **Lord Conjunction**: Planet is conjunct the target house lord within orb.

---

## 4. Domain Breakdown

| Domain | Dimensions | Rule IDs |
| :--- | :--- | :--- |
| **CAREER** | Growth, Stability, Change, Responsibility, Challenges | `CAREER-001` to `CAREER-005` |
| **WEALTH** | IncomePotential, SavingsPotential, ExpensePressure, FinancialVolatility, AssetBuilding | `WEALTH-001` to `WEALTH-004` |
| **RELATIONSHIPS** | RelationshipActivity, Stability, Harmony, Challenges | `REL-001` to `REL-004` |
| **PROPERTY** | PropertyActivity, AcquisitionPotential, Stability, Obstacles | `PROP-001` to `PROP-004` |

# Deterministic Interpretation & Explanation Engine (`@vedica/interpretation-engine`)

## Overview

The `@vedica/interpretation-engine` converts deterministic structured outputs from `@vedica/astrology-core`, `@vedica/analysis-engine`, `@vedica/rules-engine`, and `@vedica/timing-engine` into transparent, user-facing, explainable interpretations across 4 core life domains (**CAREER**, **WEALTH**, **RELATIONSHIPS**, **PROPERTY**).

### Core Design Principles:
1. **No AI / No LLM**: All text summaries are rendered through parameterized, deterministic templates.
2. **No Guaranteed Predictions**: Never produces deterministic real-world claims like *"You will get promoted"*, *"You will get rich"*, or *"You will definitely marry"*.
3. **Traceable Evidence & Explanations**: Every summary and factor links back to source rule IDs, timing factors, machine evidence, and chart facts.
4. **Preserved Mixed Signals**: Conflicting supportive and challenging factors are preserved side-by-side without automatic cancellation.
5. **Framework Confidence**: Confidence measures volume and consistency of evidence *within the configured astrological framework*, not scientific probability.

---

## Engine Architecture

```
@vedica/interpretation-engine
├── src/
│   ├── types/               # Domain & Factor interfaces
│   ├── profiles/            # Versioned profile (PERSONAL_INTERPRETATION_V1)
│   ├── factors/             # Factor classifier (SUPPORTIVE, CHALLENGING, NEUTRAL)
│   ├── conflicts/           # Mixed signal detector
│   ├── confidence/          # Framework confidence calculator & disclaimers
│   ├── templates/           # Parameterized template engine
│   ├── domains/             # Domain generators (Career, Wealth, Relationships, Property)
│   └── index.ts             # Public API & primary evaluateInterpretationEngine() entrypoint
```

---

## Interpretation Profile (`PERSONAL_INTERPRETATION_V1`)

```json
{
  "version": "personal-interpretation-v1",
  "language": "en",
  "tone": "NEUTRAL",
  "certaintyPolicy": "NON_DETERMINISTIC",
  "templateSet": "personal-template-set-v1"
}
```

Every generated output contains the complete profile version stack:
- `calculationProfileVersion`: `personal-vedic-v1`
- `analysisProfileVersion`: `personal-analysis-v1`
- `rulesProfileVersion`: `personal-rules-v1`
- `timingProfileVersion`: `personal-timing-v1`
- `interpretationProfileVersion`: `personal-interpretation-v1`

---

## Factor Classification Methodology

Factors are classified dynamically based on rule effect dimensions rather than fixed planet stereotypes:

| Classification | Criteria |
| :--- | :--- |
| **SUPPORTIVE** | Rule or timing effect enhances domain growth, income potential, harmony, or asset building without negative obstacle penalties. |
| **CHALLENGING** | Rule or timing effect introduces obstacles, volatilities, delays, expense pressure, or friction. |
| **NEUTRAL** | Informational baseline factors or balanced effects. |

---

## Mixed Signal Detection & Preserved Conflicts

When a domain contains both supportive factors (e.g. strong 10th lord) and challenging factors (e.g. Saturn delay effect), the detector sets:

```json
{
  "mixedSignals": true,
  "supportiveCount": 2,
  "challengingCount": 1,
  "totalFactors": 3
}
```

The system preserves all factors rather than canceling them out to provide complete, honest transparency.

---

## Confidence Model & Meaning

> **IMPORTANT DISCLAIMER**:
> The confidence level represents consistency and volume of structured evidence *within the configured astrological framework*. It does NOT represent scientific probability or guaranteed real-world events.

### Confidence Rating Scoring:
- **HIGH** (Score >= 60): High evidence volume (4+ factors) and strong alignment between natal rules and active Dasha/transits.
- **MEDIUM** (Score 35–59): Moderate evidence volume (2–3 factors) with partial timing convergence.
- **LOW** (Score < 35): Single factor or low evidence alignment.

---

## Testing & Verification

1. **Unit Tests**:
   - `pnpm test` executes Vitest tests verifying classification, mixed signal detection, confidence scoring, template rendering, and domain aggregation across all 4 domains.
2. **E2E Integration Tests**:
   - `pnpm --filter web test:e2e` runs Playwright testing tab navigation, domain card rendering, and `[ WHY AM I SEEING THIS? ]` evidence expansion.

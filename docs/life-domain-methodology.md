# Life Domain Synthesis Methodology

## Scoring Model & Domain State Classification

The `@vedica/life-domain-engine` evaluates domain states using a weighted, direction-aware scoring model:

- **Supportive Weight**: `HIGH` = 1.5, `MEDIUM` = 1.0, `LOW` = 0.5 multiplied by item weight.
- **Challenging Weight**: Same multiplier subtracted from overall directional balance.
- **Domain State Rules**:
  - `INSUFFICIENT_EVIDENCE`: Total evidence count = 0.
  - `MIXED`: Both supportScore and challengeScore >= 1.2, or conflicting high-impact factors present.
  - `STRONGLY_SUPPORTIVE`: Net score >= +3.5.
  - `SUPPORTIVE`: Net score >= +1.2.
  - `STRONGLY_CHALLENGING`: Net score <= -3.5.
  - `CHALLENGING`: Net score <= -1.2.

## Dasha & Transit Contextual Integration

- **Dasha Context**: Integrates Vimshottari Mahadasha/Antardasha house lordships and karaka alignment to identify active life themes without predicting future dates.
- **Transit Context**: Incorporates Jupiter and Saturn transits relative to Lagna/Moon and Ashtakavarga BAV/SAV point thresholds.

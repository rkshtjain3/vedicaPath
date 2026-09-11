# Timing Window Classification Policy

## Non-Predictive Classification Categories

Timing windows categorize periods based solely on evidence density and convergence:
- **`HIGH_EVIDENCE_CONTEXT`**: Strong, consistent supportive evidence (supportScore >= 3.0, challengeScore < 1.0).
- **`MODERATE_EVIDENCE_CONTEXT`**: Moderate evidence concentration (supportScore >= 1.5 or challengeScore >= 1.5).
- **`MIXED_EVIDENCE_CONTEXT`**: Significant opposing evidence present simultaneously (both supportScore and challengeScore >= 1.2).
- **`LOW_EVIDENCE_CONTEXT`**: Sparse evidence points.
- **`INSUFFICIENT_EVIDENCE`**: Zero evidence points detected.

## Prohibited Predictive Terms

The following terminology is strictly banned across all engine outputs and UI elements:
- `GOOD_PERIOD` / `BAD_PERIOD`
- `SUCCESS_PERIOD` / `FAILURE_PERIOD`
- `GUARANTEED_JOB` / `WILL_MARRY`

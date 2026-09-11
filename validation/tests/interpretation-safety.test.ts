import { describe, it, expect } from 'vitest';
import { selectAndRenderTemplate } from '@vedica/interpretation-engine';

const FORBIDDEN_PHRASES = [
  'definitely',
  'will certainly',
  'guaranteed',
  'you will get promoted',
  'you will become rich',
  'you will marry',
  'guarantee',
  'will surely',
  'inevitable',
];

describe('Interpretation Safety & Non-Predictive Language Suite', () => {
  it('scans all template rendering modes for forbidden predictive claims', () => {
    const domains = ['CAREER', 'WEALTH', 'RELATIONSHIPS', 'PROPERTY'] as const;
    const activities = ['HIGH', 'MODERATE', 'LOW'] as const;

    for (const domain of domains) {
      for (const activity of activities) {
        const scenarios = [
          { supportiveCount: 2, challengingCount: 0, neutralCount: 0 },
          { supportiveCount: 0, challengingCount: 2, neutralCount: 0 },
          { supportiveCount: 2, challengingCount: 2, neutralCount: 0 },
          { supportiveCount: 0, challengingCount: 0, neutralCount: 1 },
        ];

        for (const sc of scenarios) {
          const res = selectAndRenderTemplate({
            domain,
            activity,
            ...sc,
          });

          const lowerSummary = res.summary.toLowerCase();
          for (const phrase of FORBIDDEN_PHRASES) {
            expect(lowerSummary).not.toContain(phrase);
          }
        }
      }
    }
  });
});

import { BirthChart } from '@vedica/astrology-core';
import { TransitCalculationEngine } from '../transit/transit-calculator.js';
import { evaluateTransitRules } from '../transit/transit-rules.js';
import { TimingProfile } from '../profiles/timing-profile.js';
import { TimingDomain, TransitEvaluation } from '../types/timing-types.js';

export interface TransitTimelineWindow {
  start: string;
  end: string;
  evaluations: TransitEvaluation[];
  score: number;
}

export interface TransitTimelineStep {
  date: Date;
  allEvals: TransitEvaluation[];
}

export async function calculateTransitTimelineSteps(params: {
  chart: BirthChart;
  start: Date;
  end: Date;
  profile: TimingProfile;
  stepDays?: number;
  engine?: TransitCalculationEngine;
}): Promise<TransitTimelineStep[]> {
  const { chart, start, end, profile, stepDays = 14, engine = new TransitCalculationEngine() } = params;
  const dates: Date[] = [];
  const curr = new Date(start);

  while (curr <= end) {
    dates.push(new Date(curr));
    curr.setDate(curr.getDate() + stepDays);
  }

  const steps = await Promise.all(
    dates.map(async (d) => {
      const transits = await engine.calculateTransit(d, chart);
      const allEvals = evaluateTransitRules(transits, profile);
      return {
        date: d,
        allEvals,
      };
    })
  );

  return steps;
}

export async function getDomainTransitTimeline(params: {
  chart: BirthChart;
  domain: TimingDomain;
  start: Date;
  end: Date;
  profile: TimingProfile;
  stepDays?: number;
  engine?: TransitCalculationEngine;
  precalculatedSteps?: TransitTimelineStep[];
}): Promise<TransitTimelineWindow[]> {
  const { chart, domain, start, end, profile, stepDays = 7, engine, precalculatedSteps } = params;

  const steps = precalculatedSteps || await calculateTransitTimelineSteps({ chart, start, end, profile, stepDays, engine });
  const windows: TransitTimelineWindow[] = [];

  let prevEvalKey = '';
  let windowStart = new Date(start);
  let currentEvals: TransitEvaluation[] = [];
  let currentScore = 0;

  for (let i = 0; i < steps.length; i++) {
    const { date, allEvals } = steps[i];
    const domainEvals = allEvals.filter((e) => e.domain === domain);

    const triggeredRules = domainEvals
      .filter((e) => e.triggered)
      .map((e) => e.ruleId)
      .sort()
      .join(',');

    let score = 0;
    for (const ev of domainEvals) {
      if (ev.triggered) {
        for (const ef of ev.effects) {
          score += ef.value;
        }
      }
    }

    if (triggeredRules !== prevEvalKey) {
      if (prevEvalKey !== '') {
        windows.push({
          start: windowStart.toISOString(),
          end: new Date(date.getTime() - 24 * 3600 * 1000).toISOString(),
          evaluations: currentEvals,
          score: currentScore,
        });
      }
      windowStart = new Date(date);
      prevEvalKey = triggeredRules;
      currentEvals = domainEvals;
      currentScore = score;
    }
  }

  if (windowStart <= end) {
    windows.push({
      start: windowStart.toISOString(),
      end: end.toISOString(),
      evaluations: currentEvals,
      score: currentScore,
    });
  }

  return windows;
}

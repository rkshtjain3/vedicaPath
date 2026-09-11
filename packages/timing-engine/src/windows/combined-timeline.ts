import { ChartAnalysisResult } from '@vedica/analysis-engine';
import { BirthChart } from '@vedica/astrology-core';
import { DashaPeriod } from '@vedica/dasha-engine';
import { evaluateRulesEngine, PERSONAL_RULES_V1 } from '@vedica/rules-engine';
import { getDomainDashaTimeline } from './dasha-timeline.js';
import {
  getDomainTransitTimeline,
  calculateTransitTimelineSteps,
  TransitTimelineStep,
} from './transit-timeline.js';
import { TimingProfile } from '../profiles/timing-profile.js';
import {
  ActivityRating,
  CombinedActivityWindow,
  TimingDomain,
  TimingEngineResult,
} from '../types/timing-types.js';
import { TransitCalculationEngine } from '../transit/transit-calculator.js';
import { evaluateTransitRules } from '../transit/transit-rules.js';
import { evaluateMultiLevelDashaActivation } from '../dasha/dasha-activation.js';

function getCombinedActivityRating(
  score: number,
  profile: TimingProfile
): ActivityRating {
  if (score >= profile.scoringBoundaries.combinedActivity.HIGH_MIN) return 'HIGH';
  if (score >= profile.scoringBoundaries.combinedActivity.MODERATE_MIN) return 'MODERATE';
  return 'LOW';
}

function getRatingFromScore(score: number, highMin: number, modMin: number): ActivityRating {
  if (score >= highMin) return 'HIGH';
  if (score >= modMin) return 'MODERATE';
  return 'LOW';
}

export async function getCombinedTimeline(params: {
  chart: BirthChart;
  analysis: ChartAnalysisResult;
  mahadashas: DashaPeriod[];
  domain: TimingDomain;
  start: Date;
  end: Date;
  profile: TimingProfile;
  engine?: TransitCalculationEngine;
  precalculatedSteps?: TransitTimelineStep[];
}): Promise<CombinedActivityWindow[]> {
  const { chart, analysis, mahadashas, domain, start, end, profile, engine, precalculatedSteps } = params;

  const dashaPeriods = getDomainDashaTimeline({
    chart,
    analysis,
    mahadashas,
    domain,
    start,
    end,
    profile,
  });
  const transitWindows = await getDomainTransitTimeline({
    chart,
    domain,
    start,
    end,
    profile,
    stepDays: 14,
    engine,
    precalculatedSteps,
  });

  const combinedWindows: CombinedActivityWindow[] = [];

  const parsedDashaPeriods = dashaPeriods.map((d) => ({
    ...d,
    startMs: Date.parse(d.start),
    endMs: Date.parse(d.end),
  }));

  const parsedTransitWindows = transitWindows.map((t) => ({
    ...t,
    startMs: Date.parse(t.start),
    endMs: Date.parse(t.end),
  }));

  for (const dPeriod of parsedDashaPeriods) {
    for (const tWindow of parsedTransitWindows) {
      const overlapStartMs = Math.max(dPeriod.startMs, tWindow.startMs);
      const overlapEndMs = Math.min(dPeriod.endMs, tWindow.endMs);

      if (overlapStartMs < overlapEndMs) {
        const dashaScore = dPeriod.dashaActivation.totalScore;
        const transitScore = tWindow.score;
        const totalScore = dashaScore + transitScore;

        const activity = getCombinedActivityRating(totalScore, profile);
        const dashaRating = getRatingFromScore(
          dashaScore,
          profile.scoringBoundaries.dashaActivation.HIGH_MIN,
          profile.scoringBoundaries.dashaActivation.MODERATE_MIN
        );
        const transitRating = getRatingFromScore(
          transitScore,
          profile.scoringBoundaries.transitActivation.HIGH_MIN,
          profile.scoringBoundaries.transitActivation.MODERATE_MIN
        );

        const factors: string[] = [];

        if (dPeriod.dashaActivation.mahadasha.connected) {
          factors.push(
            `Mahadasha lord (${dPeriod.dashaActivation.mahadasha.lord}) connected to ${domain}`
          );
        }
        if (dPeriod.dashaActivation.antardasha.connected) {
          factors.push(
            `Antardasha lord (${dPeriod.dashaActivation.antardasha.lord}) connected to ${domain}`
          );
        }
        if (dPeriod.dashaActivation.pratyantardasha.connected) {
          factors.push(
            `Pratyantardasha lord (${dPeriod.dashaActivation.pratyantardasha.lord}) connected to ${domain}`
          );
        }

        for (const ev of tWindow.evaluations) {
          if (ev.triggered) {
            factors.push(ev.evidence.details);
          }
        }

        combinedWindows.push({
          start: new Date(overlapStartMs).toISOString(),
          end: new Date(overlapEndMs).toISOString(),
          activity,
          natalStrength: 'MODERATE',
          dashaActivationRating: dashaRating,
          transitActivationRating: transitRating,
          totalScore,
          factors,
          dashaEvidence: dPeriod.dashaActivation,
          transitEvidence: tWindow.evaluations,
        });
      }
    }
  }

  // Merge adjacent combined windows if activity & totalScore match
  const merged: CombinedActivityWindow[] = [];
  for (const w of combinedWindows) {
    if (merged.length === 0) {
      merged.push({ ...w });
      continue;
    }

    const prev = merged[merged.length - 1];
    if (prev.activity === w.activity && prev.totalScore === w.totalScore) {
      prev.end = w.end;
    } else {
      merged.push({ ...w });
    }
  }

  return merged;
}

export async function evaluateTimingEngine(params: {
  chart: BirthChart;
  analysis: ChartAnalysisResult;
  dasha: {
    mahadashas: DashaPeriod[];
    current?: any;
  };
  instant?: Date;
  profile: TimingProfile;
}): Promise<TimingEngineResult> {
  const { chart, analysis, dasha, instant = new Date(), profile } = params;

  const transitCalc = new TransitCalculationEngine();
  const currentTransits = await transitCalc.calculateTransit(instant, chart);
  const allTransitEvals = evaluateTransitRules(currentTransits, profile);

  const rulesRes = evaluateRulesEngine({ chart, currentDasha: dasha.current, analysis }, PERSONAL_RULES_V1);

  const domains: TimingDomain[] = ['CAREER', 'WEALTH', 'RELATIONSHIPS', 'PROPERTY'];
  const currentStatus: any = {};
  const timelines: any = {};

  const nowYear = instant.getFullYear();
  const startDate = new Date(nowYear - 2, 0, 1);
  const endDate = new Date(nowYear + 5, 11, 31);

  const precalculatedSteps = await calculateTransitTimelineSteps({
    chart,
    start: startDate,
    end: endDate,
    profile,
    stepDays: 14,
    engine: transitCalc,
  });

  for (const dom of domains) {
    const dashaActivation = evaluateMultiLevelDashaActivation(
      {
        mahadasha: dasha.current?.mahadasha,
        antardasha: dasha.current?.antardasha,
        pratyantardasha: dasha.current?.pratyantardasha,
      },
      dom,
      analysis,
      profile
    );

    const domTransitEvals = allTransitEvals.filter((e) => e.domain === dom);
    let transitScore = 0;
    for (const ev of domTransitEvals) {
      if (ev.triggered) {
        for (const ef of ev.effects) {
          transitScore += ef.value;
        }
      }
    }

    const totalCurrentScore = dashaActivation.totalScore + transitScore;
    const combinedActivity = getCombinedActivityRating(totalCurrentScore, profile);

    const factors: string[] = [];
    if (dashaActivation.mahadasha.connected) {
      factors.push(`Mahadasha lord (${dashaActivation.mahadasha.lord}) connected to ${dom}`);
    }
    if (dashaActivation.antardasha.connected) {
      factors.push(`Antardasha lord (${dashaActivation.antardasha.lord}) connected to ${dom}`);
    }
    if (dashaActivation.pratyantardasha.connected) {
      factors.push(`Pratyantardasha lord (${dashaActivation.pratyantardasha.lord}) connected to ${dom}`);
    }
    for (const ev of domTransitEvals) {
      if (ev.triggered) {
        factors.push(ev.evidence.details);
      }
    }

    currentStatus[dom] = {
      dashaActivation,
      transitEvaluations: domTransitEvals,
      combinedActivity,
      factors,
    };

    const timeline = await getCombinedTimeline({
      chart,
      analysis,
      mahadashas: dasha.mahadashas,
      domain: dom,
      start: startDate,
      end: endDate,
      profile,
      engine: transitCalc,
      precalculatedSteps,
    });

    timelines[dom] = timeline;
  }

  return {
    calculationProfileVersion: chart.calculationProfile?.version || 'personal-vedic-v1',
    analysisProfileVersion: rulesRes.analysisProfileVersion,
    rulesProfileVersion: rulesRes.rulesProfileVersion,
    timingProfileVersion: profile.version,
    currentStatus,
    timelines,
  };
}

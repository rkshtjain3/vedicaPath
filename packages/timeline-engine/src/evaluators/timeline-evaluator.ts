import { createHash } from 'crypto';
import {
  LifeDomain,
  TimelineAnalysisOutput,
  TimingWindow,
} from '../types.js';
import { PERSONAL_TIMELINE_V1 } from '../profile.js';
import { buildMultiLevelTimeline } from '../timeline/timeline-builder.js';
import { findCurrentActiveHierarchy } from '../timeline/period-tree.js';
import { buildTimingWindowsForPeriod } from '../windows/timing-window-builder.js';
import { calculateConfidence } from '../shared/confidence.js';

export interface EvaluateTimelineOptions {
  currentDate?: Date | string;
  historyYears?: number;
  futureYears?: number;
}

export function evaluateTimelineEngine(
  engineData: any,
  options?: EvaluateTimelineOptions
): TimelineAnalysisOutput {
  const targetDate = options?.currentDate
    ? new Date(options.currentDate)
    : new Date('2026-08-30T10:00:00.000Z');

  const { boundedTimeline, allMahadashas } = buildMultiLevelTimeline(engineData, {
    currentDate: targetDate,
    historyYears: options?.historyYears ?? 10,
    futureYears: options?.futureYears ?? 10,
  });

  const currentPeriod = findCurrentActiveHierarchy(allMahadashas);

  const timingWindows: TimingWindow[] = [];
  const allEvidence = boundedTimeline.flatMap((p) => p.evidence || []);

  for (const period of boundedTimeline) {
    timingWindows.push(...buildTimingWindowsForPeriod(period, engineData));
  }

  const domainContexts: Record<LifeDomain, TimingWindow[]> = {
    CAREER: [],
    WEALTH: [],
    RELATIONSHIPS: [],
    HEALTH: [],
    EDUCATION: [],
    PROPERTY: [],
    SPIRITUALITY: [],
  };

  for (const w of timingWindows) {
    if (domainContexts[w.domain]) {
      domainContexts[w.domain].push(w);
    }
  }

  const availableEngines = [
    'astrology-core',
    'strength-engine',
    'yoga-engine',
    'divisional-chart-engine',
    'life-domain-engine',
  ];
  const confidence = calculateConfidence(allEvidence, availableEngines);

  const evaluatedRuleIds = Array.from(
    new Set(allEvidence.map((e) => e.sourceRuleId || e.id))
  );

  const hashInput = {
    profileVersion: PERSONAL_TIMELINE_V1,
    targetDate: targetDate.toISOString(),
    currentMahadasha: currentPeriod.mahadasha?.lord,
    currentAntardasha: currentPeriod.antardasha?.lord,
    evaluatedRuleIds,
    windowCount: timingWindows.length,
  };

  const hashKey = createHash('sha256')
    .update(JSON.stringify(hashInput))
    .digest('hex');

  return {
    profileVersion: PERSONAL_TIMELINE_V1,
    targetDate: targetDate.toISOString(),
    currentPeriod,
    timeline: boundedTimeline,
    timingWindows,
    domainContexts,
    confidence,
    summary: {
      totalPeriodsGenerated: boundedTimeline.length,
      totalTimingWindows: timingWindows.length,
      evaluatedRuleIds,
    },
    audit: {
      hashKey,
      evaluatedAt: new Date().toISOString(),
      targetDate: targetDate.toISOString(),
    },
  };
}

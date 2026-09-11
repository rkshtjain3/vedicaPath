import { DomainAnalysisResult } from '@vedica/rules-engine';
import { CombinedActivityWindow, MultiLevelDashaActivation, TransitEvaluation } from '@vedica/timing-engine';
import {
  DomainInterpretation,
  InterpretationFactor,
  SourceMapping,
} from '../../types/interpretation-types.js';
import {
  classifyRuleEvaluation,
  classifyDashaActivations,
  classifyTransitEvaluations,
} from '../../factors/factor-classifier.js';
import { detectMixedSignals } from '../../conflicts/conflict-detector.js';
import { calculateConfidence } from '../../confidence/confidence-calculator.js';
import { selectAndRenderTemplate } from '../../templates/template-engine.js';

export function interpretRelationshipDomain(params: {
  rulesDomain?: DomainAnalysisResult;
  timingStatus?: {
    dashaActivation: MultiLevelDashaActivation;
    transitEvaluations: TransitEvaluation[];
    combinedActivity: 'LOW' | 'MODERATE' | 'HIGH';
    factors: string[];
  };
  timelineWindows?: CombinedActivityWindow[];
}): DomainInterpretation {
  const { rulesDomain, timingStatus } = params;

  const factors: InterpretationFactor[] = [];
  const sources: string[] = [];

  if (rulesDomain) {
    for (const evalItem of rulesDomain.evaluations) {
      if (evalItem.triggered) {
        factors.push(classifyRuleEvaluation(evalItem));
        sources.push(evalItem.ruleId);
      }
    }
  }

  if (timingStatus) {
    if (timingStatus.dashaActivation) {
      const dashaFactors = classifyDashaActivations(timingStatus.dashaActivation, 'RELATIONSHIPS');
      for (const df of dashaFactors) {
        factors.push(df);
        sources.push(df.sourceId);
      }
    }
    if (timingStatus.transitEvaluations) {
      const transitFactors = classifyTransitEvaluations(timingStatus.transitEvaluations);
      for (const tf of transitFactors) {
        factors.push(tf);
        sources.push(tf.sourceId);
      }
    }
  }

  const supportiveFactors = factors.filter((f) => f.classification === 'SUPPORTIVE');
  const challengingFactors = factors.filter((f) => f.classification === 'CHALLENGING');
  const neutralFactors = factors.filter((f) => f.classification === 'NEUTRAL');
  const activeTimingFactors = factors.filter((f) => f.type === 'DASHA' || f.type === 'TRANSIT');

  const mixedSignals = detectMixedSignals(factors);
  const overallActivity = timingStatus?.combinedActivity || 'MODERATE';

  const renderedTemplate = selectAndRenderTemplate({
    domain: 'RELATIONSHIPS',
    activity: overallActivity,
    supportiveCount: mixedSignals.supportiveCount,
    challengingCount: mixedSignals.challengingCount,
    neutralCount: mixedSignals.neutralCount,
  });

  const confidence = calculateConfidence({
    factors,
    mixedSignals,
    hasTimingData: !!timingStatus,
  });

  const explanations: SourceMapping[] = [
    {
      text: renderedTemplate.summary,
      sources,
    },
  ];

  return {
    domain: 'RELATIONSHIPS',
    overallActivity,
    summary: renderedTemplate.summary,
    supportiveFactors,
    challengingFactors,
    neutralFactors,
    activeTimingFactors,
    mixedSignals,
    confidence,
    sources,
    explanations,
    dashaEvidence: timingStatus?.dashaActivation,
    transitEvidence: timingStatus?.transitEvaluations,
    ruleEvaluations: rulesDomain?.evaluations,
  };
}

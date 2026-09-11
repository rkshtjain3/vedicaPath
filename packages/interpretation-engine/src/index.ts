import { RulesEngineResult } from '@vedica/rules-engine';
import { TimingEngineResult } from '@vedica/timing-engine';
import {
  InterpretationEngineResult,
  InterpretationProfile,
  InterpretationDomain,
} from './types/interpretation-types.js';
import { PERSONAL_INTERPRETATION_V1 } from './profiles/interpretation-profile.js';
import { interpretCareerDomain } from './domains/career/career-interpretation.js';
import { interpretWealthDomain } from './domains/wealth/wealth-interpretation.js';
import { interpretRelationshipDomain } from './domains/relationships/relationship-interpretation.js';
import { interpretPropertyDomain } from './domains/property/property-interpretation.js';

export * from './types/interpretation-types.js';
export * from './profiles/interpretation-profile.js';
export * from './factors/factor-classifier.js';
export * from './conflicts/conflict-detector.js';
export * from './confidence/confidence-calculator.js';
export * from './templates/template-engine.js';
export * from './domains/career/career-interpretation.js';
export * from './domains/wealth/wealth-interpretation.js';
export * from './domains/relationships/relationship-interpretation.js';
export * from './domains/property/property-interpretation.js';
export * from './narrative/narrative-synthesizer.js';

export function evaluateInterpretationEngine(params: {
  rulesResult: RulesEngineResult;
  timingResult?: TimingEngineResult;
  profile?: InterpretationProfile;
}): InterpretationEngineResult {
  const { rulesResult, timingResult, profile = PERSONAL_INTERPRETATION_V1 } = params;

  const careerInterpretation = interpretCareerDomain({
    rulesDomain: rulesResult.domains?.CAREER,
    d10Rules: rulesResult.careerD10,
    timingStatus: timingResult?.currentStatus?.CAREER,
    timelineWindows: timingResult?.timelines?.CAREER,
  });

  const wealthInterpretation = interpretWealthDomain({
    rulesDomain: rulesResult.domains?.WEALTH,
    timingStatus: timingResult?.currentStatus?.WEALTH,
    timelineWindows: timingResult?.timelines?.WEALTH,
  });

  const relationshipInterpretation = interpretRelationshipDomain({
    rulesDomain: rulesResult.domains?.RELATIONSHIPS,
    timingStatus: timingResult?.currentStatus?.RELATIONSHIPS,
    timelineWindows: timingResult?.timelines?.RELATIONSHIPS,
  });

  const propertyInterpretation = interpretPropertyDomain({
    rulesDomain: rulesResult.domains?.PROPERTY,
    timingStatus: timingResult?.currentStatus?.PROPERTY,
    timelineWindows: timingResult?.timelines?.PROPERTY,
  });

  return {
    calculationProfileVersion:
      rulesResult.calculationProfileVersion || timingResult?.calculationProfileVersion || 'personal-vedic-v1',
    analysisProfileVersion:
      rulesResult.analysisProfileVersion || timingResult?.analysisProfileVersion || 'personal-analysis-v1',
    rulesProfileVersion: rulesResult.rulesProfileVersion || 'personal-rules-v1',
    timingProfileVersion: timingResult?.timingProfileVersion || 'personal-timing-v1',
    interpretationProfileVersion: profile.version,
    domains: {
      CAREER: careerInterpretation,
      WEALTH: wealthInterpretation,
      RELATIONSHIPS: relationshipInterpretation,
      PROPERTY: propertyInterpretation,
    },
  };
}

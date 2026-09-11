import { RulesEngineResult } from '@vedica/rules-engine';
import { TimingEngineResult } from '@vedica/timing-engine';
import { InterpretationEngineResult, InterpretationProfile } from './types/interpretation-types.js';
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
export declare function evaluateInterpretationEngine(params: {
    rulesResult: RulesEngineResult;
    timingResult?: TimingEngineResult;
    profile?: InterpretationProfile;
}): InterpretationEngineResult;
//# sourceMappingURL=index.d.ts.map
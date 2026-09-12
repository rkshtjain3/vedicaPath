import { DigitalRatios, HastRekhaRuleResult, PalmarLines, PalmarMounts, PalmistryObservation } from '../types/palmistry-types.js';
export declare function buildPalmistryObservations(digitalRatios: DigitalRatios, lines: PalmarLines, mounts: PalmarMounts): PalmistryObservation[];
export declare function evaluateHastRekhaRules(digitalRatios: DigitalRatios, lines: PalmarLines, mounts: PalmarMounts): HastRekhaRuleResult[];

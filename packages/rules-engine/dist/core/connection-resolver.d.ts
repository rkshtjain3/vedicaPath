import { PlanetName } from '@vedica/astrology-core';
import { ChartAnalysisResult } from '@vedica/analysis-engine';
import { RuleEvidence } from '../types/rule-types.js';
export interface HouseConnectionResult {
    connected: boolean;
    evidence: RuleEvidence[];
}
export declare function isPlanetConnectedToHouse(planet: PlanetName, house: number, analysis: ChartAnalysisResult): HouseConnectionResult;
//# sourceMappingURL=connection-resolver.d.ts.map
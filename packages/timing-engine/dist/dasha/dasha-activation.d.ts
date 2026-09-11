import { ChartAnalysisResult } from '@vedica/analysis-engine';
import { PlanetName } from '@vedica/astrology-core';
import { DashaLevelActivation, MultiLevelDashaActivation, TimingDomain } from '../types/timing-types.js';
import { TimingProfile } from '../profiles/timing-profile.js';
export declare function evaluateDashaLevelForDomain(dashaLevel: 'MAHADASHA' | 'ANTARDASHA' | 'PRATYANTARDASHA', lord: PlanetName | undefined, domain: TimingDomain, analysis: ChartAnalysisResult, profile: TimingProfile): DashaLevelActivation;
export declare function evaluateMultiLevelDashaActivation(dasha: {
    mahadasha?: {
        lord?: string | PlanetName;
    };
    antardasha?: {
        lord?: string | PlanetName;
    };
    pratyantardasha?: {
        lord?: string | PlanetName;
    };
}, domain: TimingDomain, analysis: ChartAnalysisResult, profile: TimingProfile): MultiLevelDashaActivation;
//# sourceMappingURL=dasha-activation.d.ts.map
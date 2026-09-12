import { BirthChart } from '@vedica/astrology-core';
export interface VedicRemedy {
    targetPlanet: string;
    reason: string;
    mantra: {
        sanskrit: string;
        roman: string;
        recitationsCount: number;
        recommendedTime: string;
    };
    danaCharity: {
        items: string[];
        beneficiary: string;
        dayOfWeek: string;
    };
    gemstoneAudit: {
        primaryGem: string;
        isSuitable: boolean;
        contraindicationWarning?: string;
        alternateUpratna: string;
    };
}
export interface RemedialSynthesizerResult {
    remedies: VedicRemedy[];
    generalRemedialGuidance: string;
}
export declare function synthesizeVedicRemedies(chart: BirthChart): RemedialSynthesizerResult;
//# sourceMappingURL=remedial-synthesizer.d.ts.map
import { AshtakavargaPlanet, BhinnaAshtakavarga } from '../types/ashtakavarga-types.js';
export interface BinduExplanation {
    targetPlanet: AshtakavargaPlanet;
    signName: string;
    totalBindus: number;
    contributorBreakdown: Record<string, 0 | 1>;
    details: {
        contributor: string;
        sourceSign: string;
        targetSign: string;
        relativeHouse: number;
        allowedHouses: number[];
        bindu: 0 | 1;
        evidence: string[];
    }[];
}
/**
 * Returns explainable breakdown for a selected target planet and zodiac sign.
 */
export declare function explainBinduForSign(bavMap: Record<AshtakavargaPlanet, BhinnaAshtakavarga>, targetPlanet: AshtakavargaPlanet, signName: string): BinduExplanation;

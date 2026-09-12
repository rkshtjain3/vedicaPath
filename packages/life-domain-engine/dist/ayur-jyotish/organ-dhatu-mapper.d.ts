import { BirthChart } from '@vedica/astrology-core';
export interface BodyZoneAffliction {
    house: number;
    bodyPart: string;
    rashi: string;
    afflictedPlanets: string[];
    vulnerabilityLevel: 'HIGH' | 'MODERATE' | 'LOW';
}
export interface DhatuStatus {
    dhatuName: 'Rasa (Plasma)' | 'Rakta (Blood)' | 'Mamsa (Muscle)' | 'Meda (Fat)' | 'Asthi (Bone)' | 'Majja (Nerve/Marrow)' | 'Shukra (Reproductive)';
    rulingPlanet: string;
    status: 'BALANCED' | 'AFFLICTED' | 'WEAKENED';
    description: string;
}
export interface AyurJyotishOrganDhatuAnalysis {
    bodyZoneAfflictions: BodyZoneAffliction[];
    dhatuStatuses: DhatuStatus[];
    summary: string;
}
export declare function diagnoseOrganDhatuAfflictions(chart: BirthChart): AyurJyotishOrganDhatuAnalysis;
//# sourceMappingURL=organ-dhatu-mapper.d.ts.map
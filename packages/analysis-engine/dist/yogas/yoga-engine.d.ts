import { ConjunctionResult, HouseFact, HouseLordFact, PlanetDignity, PlanetFact, VedicAspect, YogaDetectionResult } from '../types/analysis-types.js';
export declare function isKendraHouse(house: number): boolean;
export declare function detectGajakesariYoga(planetFacts: PlanetFact[], dignities: PlanetDignity[]): YogaDetectionResult;
export declare function detectBudhaAdityaYoga(planetFacts: PlanetFact[], conjunctions: ConjunctionResult[]): YogaDetectionResult;
export declare function detectDharmaKarmadhipatiYoga(houseLordFacts: HouseLordFact[], planetFacts: PlanetFact[], aspects: VedicAspect[]): YogaDetectionResult;
export declare function detectMahapurushaYoga(planetName: 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn', yogaId: string, yogaName: string, planetFacts: PlanetFact[], dignities: PlanetDignity[]): YogaDetectionResult;
export declare function detectAllYogas(planetFacts: PlanetFact[], houseFacts: HouseFact[], houseLordFacts: HouseLordFact[], conjunctions: ConjunctionResult[], aspects: VedicAspect[], dignities: PlanetDignity[]): YogaDetectionResult[];

import { PlanetName } from '@vedica/astrology-core';
export type Paksha = 'SHUKLA' | 'KRISHNA';
export type PanchangaElement = 'PRITHVI' | 'JALA' | 'AGNI' | 'VAYU' | 'AKASHA';
export interface TithiFact {
    index: number;
    numberInPaksha: number;
    name: string;
    sanskritName: string;
    paksha: Paksha;
    pakshaName: string;
    deity: string;
    element: PanchangaElement;
    nature: 'Nanda' | 'Bhadra' | 'Jaya' | 'Rikta' | 'Poorna';
    elapsedDegrees: number;
    percentageElapsed: number;
    rulingPlanet: PlanetName;
    auspiciousness: string;
}
export interface VaraFact {
    dayIndex: number;
    name: string;
    sanskritName: string;
    lord: PlanetName;
    element: PanchangaElement;
    guna: 'Sattva' | 'Rajas' | 'Tamas';
    recommendation: string;
}
export interface NakshatraPanchangaFact {
    index: number;
    name: string;
    sanskritName: string;
    pada: number;
    lord: PlanetName;
    deity: string;
    gana: 'Deva' | 'Manushya' | 'Rakshasa';
    animal: string;
    element: PanchangaElement;
    elapsedDegrees: number;
    percentageElapsed: number;
}
export interface YogaFact {
    index: number;
    name: string;
    sanskritName: string;
    isAuspicious: boolean;
    deity: string;
    element: PanchangaElement;
    meaning: string;
    elapsedDegrees: number;
    percentageElapsed: number;
}
export interface KaranaFact {
    index: number;
    karanaName: string;
    sanskritName: string;
    type: 'CHARA' | 'STHIRA';
    deity: string;
    element: PanchangaElement;
    isVishtiBhadra: boolean;
    auspiciousness: string;
}
export interface TimeInterval {
    start: string;
    end: string;
    startMinutesFromMidnight: number;
    endMinutesFromMidnight: number;
}
export interface MuhurthaWindows {
    rahuKalam: TimeInterval;
    yamaganda: TimeInterval;
    gulikaKalam: TimeInterval;
    abhijitMuhurta: TimeInterval;
    brahmaMuhurta: TimeInterval;
    amritKalam?: TimeInterval;
    durmuhurtham?: TimeInterval[];
    calculationMode: 'ASTRONOMICAL' | 'STANDARDIZED_FALLBACK';
    source: 'LOCAL_SUNRISE_SUNSET' | 'EQUAL_DAYLIGHT_DIVISION';
}
export interface UpagrahaPositions {
    mandiLongitude: number;
    gulikaLongitude: number;
    mandiSign: string;
    gulikaSign: string;
    mandiDegreeFormatted: string;
    gulikaDegreeFormatted: string;
}
export interface PanchangaResult {
    tithi: TithiFact;
    vara: VaraFact;
    nakshatra: NakshatraPanchangaFact;
    yoga: YogaFact;
    karana: KaranaFact;
    muhurtha: MuhurthaWindows;
    upagrahas: UpagrahaPositions;
    summary: {
        title: string;
        description: string;
        dominantEnergy: string;
        sattvicRecommendation: string;
    };
    evidence: string[];
}

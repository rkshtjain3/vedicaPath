import { PlanetName } from '@vedica/astrology-core';
export interface TithiDefinition {
    number: number;
    name: string;
    sanskritName: string;
    deity: string;
    nature: 'Nanda' | 'Bhadra' | 'Jaya' | 'Rikta' | 'Poorna';
    rulingPlanet: PlanetName;
    auspiciousness: string;
}
export declare const TITHI_DEFINITIONS: TithiDefinition[];
export interface YogaDefinition {
    index: number;
    name: string;
    sanskritName: string;
    isAuspicious: boolean;
    deity: string;
    meaning: string;
}
export declare const YOGA_DEFINITIONS: YogaDefinition[];
export interface KaranaDefinition {
    name: string;
    sanskritName: string;
    type: 'CHARA' | 'STHIRA';
    deity: string;
    isVishtiBhadra: boolean;
    auspiciousness: string;
}
export declare const CHARA_KARANAS: KaranaDefinition[];
export declare const STHIRA_KARANAS: Record<string, KaranaDefinition>;
export declare const VARA_DEFINITIONS: ({
    dayIndex: number;
    name: string;
    sanskritName: string;
    lord: PlanetName;
    guna: "Sattva";
    recommendation: string;
    lordPlanet?: undefined;
} | {
    dayIndex: number;
    name: string;
    sanskritName: string;
    lord: PlanetName;
    guna: "Tamas";
    recommendation: string;
    lordPlanet?: undefined;
} | {
    dayIndex: number;
    name: string;
    sanskritName: string;
    lord: PlanetName;
    guna: "Rajas";
    recommendation: string;
    lordPlanet?: undefined;
} | {
    dayIndex: number;
    name: string;
    sanskritName: string;
    lord: string;
    lordPlanet: PlanetName;
    guna: "Rajas";
    recommendation: string;
})[];

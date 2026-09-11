import { PlanetName, RashiDetails } from '@vedica/astrology-core';

export type CharaKarakaRole = 'AK' | 'AmK' | 'BK' | 'MK' | 'PiK' | 'PK' | 'GK' | 'DK';

export interface CharaKarakaInfo {
  role: CharaKarakaRole;
  name: string;
  nameHi: string;
  planet: PlanetName;
  degreeInSign: number;
  longitude: number;
  sign: RashiDetails;
  significance: string;
  significanceHi: string;
}

export interface KarakamshaAnalysis {
  atmakarakaPlanet: PlanetName;
  d1Sign: RashiDetails;
  karakamshaSign: RashiDetails; // D9 Navamsa sign of Atmakaraka
  karakamshaHouseFromLagna: number; // House where Karakamsha falls in D1
  isSwamsha: boolean; // True if Navamsa Lagna is the Karakamsha sign
  significance: string;
  significanceHi: string;
}

export interface ArudhaPada {
  houseNumber: number; // 1 to 12
  code: string; // 'AL' | 'A2' | ... | 'A7' | ... | 'UL'
  name: string; // 'Arudha Lagna', 'Dara Pada', 'Upapada Lagna', etc.
  nameHi: string;
  sign: RashiDetails;
  signId: number; // 1 to 12
  houseLord: PlanetName;
  lordHouse: number;
  rawOffsetSigns: number;
  exceptionApplied: boolean;
  exceptionNote?: string;
  significance: string;
  significanceHi: string;
}

export interface RashiDrishtiItem {
  sign: RashiDetails;
  aspectingSigns: RashiDetails[];
  occupyingPlanets: PlanetName[];
  aspectingPlanets: PlanetName[];
}

export interface JaiminiReport {
  scheme: '7_KARAKA' | '8_KARAKA';
  charaKarakas: CharaKarakaInfo[];
  karakamsha: KarakamshaAnalysis;
  arudhaPadas: ArudhaPada[];
  rashiDrishti: RashiDrishtiItem[];
}

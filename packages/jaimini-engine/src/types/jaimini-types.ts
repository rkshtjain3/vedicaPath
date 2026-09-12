import { PlanetName, RashiDetails } from '@vedica/astrology-core';

export type CharaKarakaRole = 'AK' | 'AmK' | 'BK' | 'MK' | 'PiK' | 'PK' | 'GK' | 'DK';

export interface CharaKarakaEvidence {
  planet: PlanetName;
  longitude: number;
  signName: string;
  degreeInSign: number;
  effectiveDegree: number; // 30 - degree for Rahu in 8-karaka, normal degree otherwise
  rank: number; // 1 to 7 or 1 to 8
  assignedRole: CharaKarakaRole;
  methodology: string;
  reasoning: string;
  reasoningHi: string;
}

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
  evidence?: CharaKarakaEvidence;
}

export interface KarakamshaEvidence {
  atmakarakaPlanet: PlanetName;
  d1Sign: string;
  d9NavamsaSign: string;
  karakamshaHouseFromD1Lagna: number;
  isSwamsha: boolean;
  reasoning: string;
  reasoningHi: string;
}

export interface KarakamshaAnalysis {
  atmakarakaPlanet: PlanetName;
  d1Sign: RashiDetails;
  karakamshaSign: RashiDetails; // D9 Navamsa sign of Atmakaraka
  karakamshaHouseFromLagna: number; // House where Karakamsha falls in D1
  isSwamsha: boolean; // True if Navamsa Lagna is the Karakamsha sign
  significance: string;
  significanceHi: string;
  evidence: KarakamshaEvidence;
}

export interface ArudhaEvidence {
  houseNumber: number; // 1 to 12
  houseSign: string;
  houseLord: PlanetName;
  lordSign: string;
  lordHouseDistance: number; // 1 to 12
  rawOffsetSign: string;
  rawHouseOffset: number; // 1 to 12
  exceptionApplied: boolean;
  exceptionRule?: string;
  finalSign: string;
  reasoning: string;
  reasoningHi: string;
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
  evidence: ArudhaEvidence;
}

export interface RashiDrishtiEvidence {
  signId: number;
  signName: string;
  signType: 'MOVABLE' | 'FIXED' | 'DUAL';
  targetSignNames: string[];
  excludedAdjacentSignName?: string;
  aspectingPlanets: PlanetName[];
  reasoning: string;
  reasoningHi: string;
}

export interface RashiDrishtiItem {
  sign: RashiDetails;
  signType: 'MOVABLE' | 'FIXED' | 'DUAL';
  aspectingSigns: RashiDetails[];
  occupyingPlanets: PlanetName[];
  aspectingPlanets: PlanetName[];
  evidence: RashiDrishtiEvidence;
}

export interface JaiminiYogaEvidence {
  ruleId: string;
  name: string;
  nameHi: string;
  planetsInvolved: PlanetName[];
  signsInvolved: string[];
  evidenceTrace: string[];
  significance: string;
  significanceHi: string;
}

export interface JaiminiYoga {
  ruleId: string;
  category: 'RAJA_YOGA' | 'DHANA_YOGA' | 'KARAKAMSHA_YOGA';
  name: string;
  nameHi: string;
  planetsInvolved: PlanetName[];
  signsInvolved: string[];
  strength: 'STRONG' | 'MODERATE' | 'MILD';
  description: string;
  descriptionHi: string;
  evidence: JaiminiYogaEvidence;
}

export interface JaiminiReport {
  profileVersion: 'personal-jaimini-v1';
  scheme: '7_KARAKA' | '8_KARAKA';
  charaKarakas: CharaKarakaInfo[];
  karakamsha: KarakamshaAnalysis;
  arudhaPadas: ArudhaPada[];
  rashiDrishti: RashiDrishtiItem[];
  yogas: JaiminiYoga[];
  calculationConvention: {
    karakaScheme: '7_KARAKA' | '8_KARAKA';
    rahuDegreeTreatment: 'RETROGRADE_DEGREES' | 'NONE';
    arudhaExceptionRule: 'CLASSICAL_10TH_SHIFT';
    rashiDrishtiRule: 'CLASSICAL_MOVABLE_FIXED_DUAL';
  };
}

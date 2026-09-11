import { RashiDetails } from '@vedica/astrology-core';

export type ZodiacSign = RashiDetails;

export type AshtakavargaPlanet =
  | 'SUN'
  | 'MOON'
  | 'MARS'
  | 'MERCURY'
  | 'JUPITER'
  | 'VENUS'
  | 'SATURN';

export type AshtakavargaContributor =
  | 'Sun'
  | 'Moon'
  | 'Mars'
  | 'Mercury'
  | 'Jupiter'
  | 'Venus'
  | 'Saturn'
  | 'Lagna';

export interface BinduContribution {
  source: AshtakavargaContributor;
  sourceSign: ZodiacSign;
  target: AshtakavargaPlanet;
  targetSign: ZodiacSign;
  relativeHouse: number;
  contributingHouses: number[];
  bindu: 0 | 1;
  evidence: string[];
}

export interface SignBinduSummary {
  sign: ZodiacSign;
  bindus: number;
  contributorBreakdown: Record<AshtakavargaContributor, 0 | 1>;
  contributions: BinduContribution[];
}

export interface BhinnaAshtakavarga {
  planet: AshtakavargaPlanet;
  signPoints: Record<string, number>; // Sign name -> bindus
  signDetails: SignBinduSummary[];
  totalPoints: number;
}

export interface Sarvashtakavarga {
  signPoints: Record<string, number>; // Sign name -> bindus
  totalPoints: number;
  contributors: AshtakavargaPlanet[];
}

export interface AshtakavargaValidation {
  passed: boolean;
  expected: number;
  actual: number;
  bavRowValidation: Record<AshtakavargaPlanet, { passed: boolean; expected: number; actual: number }>;
}

export interface AshtakavargaProfile {
  version: string;
  chart: string;
  includeLagnaContributor: boolean;
  savContributors: AshtakavargaPlanet[];
}

export interface PlanetaryShodhana {
  planet: AshtakavargaPlanet;
  rawPoints: Record<string, number>;
  trikonaPoints: Record<string, number>;
  ekadhipatyaPoints: Record<string, number>;
  rashiPinda: number;
  grahaPinda: number;
  shodhyaPinda: number;
  explanation: string[];
}

export interface ShodhanaResult {
  trikonaShodhana: Record<AshtakavargaPlanet, Record<string, number>>;
  ekadhipatyaShodhana: Record<AshtakavargaPlanet, Record<string, number>>;
  savTrikona: Record<string, number>;
  savEkadhipatya: Record<string, number>;
  planetaryPindas: Record<AshtakavargaPlanet, PlanetaryShodhana>;
  totalSarvaShodhyaPinda: number;
}

export interface AshtakavargaResult {
  bav: Record<AshtakavargaPlanet, BhinnaAshtakavarga>;
  sav: Sarvashtakavarga;
  shodhana: ShodhanaResult;
  validation: AshtakavargaValidation;
  profileVersion: string;
}


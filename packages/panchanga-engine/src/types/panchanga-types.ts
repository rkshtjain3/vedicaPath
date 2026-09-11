import { PlanetName } from '@vedica/astrology-core';

export type Paksha = 'SHUKLA' | 'KRISHNA';

export type PanchangaElement = 'PRITHVI' | 'JALA' | 'AGNI' | 'VAYU' | 'AKASHA';

export interface TithiFact {
  index: number; // 1 to 30
  numberInPaksha: number; // 1 to 15
  name: string; // e.g., "Pratipada", "Purnima", "Amavasya"
  sanskritName: string;
  paksha: Paksha;
  pakshaName: string; // "Shukla Paksha" | "Krishna Paksha"
  deity: string;
  element: PanchangaElement; // Jala (Water)
  nature: 'Nanda' | 'Bhadra' | 'Jaya' | 'Rikta' | 'Poorna';
  elapsedDegrees: number; // 0 to 12 degrees
  percentageElapsed: number; // 0 to 100%
  rulingPlanet: PlanetName;
  auspiciousness: string;
}

export interface VaraFact {
  dayIndex: number; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  name: string; // "Sunday", "Monday", etc.
  sanskritName: string; // "Ravivara", "Somavara", etc.
  lord: PlanetName; // Sun, Moon, Mars, etc.
  element: PanchangaElement; // Agni (Fire)
  guna: 'Sattva' | 'Rajas' | 'Tamas';
  recommendation: string;
}

export interface NakshatraPanchangaFact {
  index: number; // 1 to 27
  name: string;
  sanskritName: string;
  pada: number; // 1 to 4
  lord: PlanetName;
  deity: string;
  gana: 'Deva' | 'Manushya' | 'Rakshasa';
  animal: string;
  element: PanchangaElement; // Vayu (Air)
  elapsedDegrees: number; // 0 to 13.333 degrees
  percentageElapsed: number;
}

export interface YogaFact {
  index: number; // 1 to 27
  name: string; // e.g. "Vishkambha", "Priti", "Ayushman", "Saubhagya", ... "Vaidhriti"
  sanskritName: string;
  isAuspicious: boolean;
  deity: string;
  element: PanchangaElement; // Akasha (Ether)
  meaning: string;
  elapsedDegrees: number;
  percentageElapsed: number;
}

export interface KaranaFact {
  index: number; // 1 to 60 in the lunar month
  karanaName: string; // e.g. "Bava", "Balava", "Vishti / Bhadra", "Shakuni"
  sanskritName: string;
  type: 'CHARA' | 'STHIRA';
  deity: string;
  element: PanchangaElement; // Prithvi (Earth)
  isVishtiBhadra: boolean;
  auspiciousness: string;
}

export interface TimeInterval {
  start: string; // HH:MM AM/PM
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

import {
  ConjunctionResult,
  HouseFact,
  HouseLordFact,
  PlanetDignity,
  PlanetFact,
  VedicAspect,
  YogaDetectionResult,
} from '../types/analysis-types.js';
import {
  evaluateMahapurushaYogas,
  evaluateRajaYogas,
  evaluateDhanaYogas,
  evaluateLunarYogas,
  evaluateSpecialYogas,
  PERSONAL_YOGA_V1,
} from '@vedica/yoga-engine';

export function isKendraHouse(house: number): boolean {
  return [1, 4, 7, 10].includes(house);
}

export function detectGajakesariYoga(
  planetFacts: PlanetFact[],
  dignities: PlanetDignity[]
): YogaDetectionResult {
  const lunarYogas = evaluateLunarYogas(planetFacts, dignities, PERSONAL_YOGA_V1.version);
  const gk = lunarYogas.find((y) => y.id === 'GAJAKESARI_YOGA');
  return {
    id: 'GAJAKESARI_YOGA',
    name: gk?.name || 'Gajakesari Yoga',
    detected: gk?.detected || false,
    conditions: (gk?.conditions || []).map((c) => ({
      id: c.id,
      description: c.description,
      result: c.passed,
    })),
  };
}

export function detectBudhaAdityaYoga(
  planetFacts: PlanetFact[],
  conjunctions: ConjunctionResult[]
): YogaDetectionResult {
  const specialYogas = evaluateSpecialYogas(
    planetFacts,
    [],
    conjunctions,
    [],
    [],
    PERSONAL_YOGA_V1.version
  );
  const ba = specialYogas.find((y) => y.id === 'BUDHA_ADITYA_YOGA');
  return {
    id: 'BUDHA_ADITYA_YOGA',
    name: ba?.name || 'Budha-Aditya Yoga',
    detected: ba?.detected || false,
    conditions: (ba?.conditions || []).map((c) => ({
      id: c.id,
      description: c.description,
      result: c.passed,
    })),
  };
}

export function detectDharmaKarmadhipatiYoga(
  houseLordFacts: HouseLordFact[],
  planetFacts: PlanetFact[],
  aspects: VedicAspect[]
): YogaDetectionResult {
  const rajaYogas = evaluateRajaYogas(
    houseLordFacts,
    planetFacts,
    [],
    aspects,
    PERSONAL_YOGA_V1.version
  );
  const dk = rajaYogas.find((y) => y.id === 'DHARMA_KARMADHIPATI_YOGA');
  return {
    id: 'DHARMA_KARMADHIPATI_YOGA',
    name: dk?.name || 'Dharma-Karmadhipati Yoga',
    detected: dk?.detected || false,
    conditions: (dk?.conditions || []).map((c) => ({
      id: c.id,
      description: c.description,
      result: c.passed,
    })),
  };
}

export function detectMahapurushaYoga(
  planetName: 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn',
  yogaId: string,
  yogaName: string,
  planetFacts: PlanetFact[],
  dignities: PlanetDignity[]
): YogaDetectionResult {
  const mpYogas = evaluateMahapurushaYogas(planetFacts, dignities, PERSONAL_YOGA_V1.version);
  const mp = mpYogas.find((y) => y.id === yogaId);
  return {
    id: yogaId,
    name: yogaName,
    detected: mp?.detected || false,
    conditions: (mp?.conditions || []).map((c) => ({
      id: c.id,
      description: c.description,
      result: c.passed,
    })),
  };
}

export function detectAllYogas(
  planetFacts: PlanetFact[],
  houseFacts: HouseFact[],
  houseLordFacts: HouseLordFact[],
  conjunctions: ConjunctionResult[],
  aspects: VedicAspect[],
  dignities: PlanetDignity[]
): YogaDetectionResult[] {
  const mahapurusha = evaluateMahapurushaYogas(planetFacts, dignities, PERSONAL_YOGA_V1.version);
  const raja = evaluateRajaYogas(houseLordFacts, planetFacts, conjunctions, aspects, PERSONAL_YOGA_V1.version);
  const dhana = evaluateDhanaYogas(houseLordFacts, planetFacts, conjunctions, aspects, PERSONAL_YOGA_V1.version);
  const lunar = evaluateLunarYogas(planetFacts, dignities, PERSONAL_YOGA_V1.version);
  const special = evaluateSpecialYogas(planetFacts, houseLordFacts, conjunctions, aspects, dignities, PERSONAL_YOGA_V1.version);

  const all = [...mahapurusha, ...raja, ...dhana, ...lunar, ...special];
  return all.map((y) => ({
    id: y.id,
    name: y.name,
    detected: y.detected,
    conditions: y.conditions.map((c) => ({
      id: c.id,
      description: c.description,
      result: c.passed,
    })),
  }));
}

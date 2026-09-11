import {
  AstrologyCalculationConfiguration,
  CalculationInputSnapshot,
  DriftResult,
} from '../types/benchmark-types.js';

export const DEFAULT_ASTROLOGY_CALCULATION_CONFIG: AstrologyCalculationConfiguration = {
  zodiacType: 'SIDEREAL',
  ayanamsha: 'Lahiri',
  houseSystem: 'Whole Sign',
  nodeCalculation: 'TRUE',
  ephemerisVersion: 'Swiss Ephemeris v2.10',
  calculationProfileVersion: 'personal-vedic-v1',
};

export function createAstrologyCalculationConfig(
  overrides?: Partial<AstrologyCalculationConfiguration>
): AstrologyCalculationConfiguration {
  return {
    ...DEFAULT_ASTROLOGY_CALCULATION_CONFIG,
    ...overrides,
  };
}

export function detectConfigurationDrift(
  storedSnapshot: CalculationInputSnapshot,
  currentConfig: AstrologyCalculationConfiguration
): DriftResult {
  const storedConfig = storedSnapshot.calculationConfig || {
    zodiacType: 'SIDEREAL' as const,
    ayanamsha: storedSnapshot.ayanamsha || 'Lahiri',
    houseSystem: storedSnapshot.houseSystem || 'Whole Sign',
    nodeCalculation: 'TRUE' as const,
    ephemerisVersion: 'Swiss Ephemeris v2.10',
    calculationProfileVersion: storedSnapshot.calculationProfileVersion || 'personal-vedic-v1',
  };

  const changes: string[] = [];

  if (storedConfig.zodiacType !== currentConfig.zodiacType) {
    changes.push(`Zodiac (${storedConfig.zodiacType} -> ${currentConfig.zodiacType})`);
  }
  if (storedConfig.ayanamsha !== currentConfig.ayanamsha) {
    changes.push(`Ayanamsha (${storedConfig.ayanamsha} -> ${currentConfig.ayanamsha})`);
  }
  if (storedConfig.houseSystem !== currentConfig.houseSystem) {
    changes.push(`House System (${storedConfig.houseSystem} -> ${currentConfig.houseSystem})`);
  }
  if (storedConfig.nodeCalculation !== currentConfig.nodeCalculation) {
    changes.push(`Node Calculation (${storedConfig.nodeCalculation} -> ${currentConfig.nodeCalculation})`);
  }
  if (storedConfig.calculationProfileVersion !== currentConfig.calculationProfileVersion) {
    changes.push(`Profile Version (${storedConfig.calculationProfileVersion} -> ${currentConfig.calculationProfileVersion})`);
  }

  if (changes.length > 0) {
    return {
      driftStatus: 'CONFIGURATION_CHANGED',
      storedFingerprint: JSON.stringify(storedConfig),
      currentFingerprint: JSON.stringify(currentConfig),
      storedProfileVersion: storedConfig.calculationProfileVersion,
      currentProfileVersion: currentConfig.calculationProfileVersion,
      details: `Configuration drift detected: ${changes.join(', ')}`,
    };
  }

  return {
    driftStatus: 'MATCH',
    storedFingerprint: JSON.stringify(storedConfig),
    currentFingerprint: JSON.stringify(currentConfig),
    storedProfileVersion: storedConfig.calculationProfileVersion,
    currentProfileVersion: currentConfig.calculationProfileVersion,
    details: 'Calculation configuration is identical',
  };
}

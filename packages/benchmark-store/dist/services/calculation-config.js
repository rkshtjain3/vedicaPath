export const DEFAULT_ASTROLOGY_CALCULATION_CONFIG = {
    zodiacType: 'SIDEREAL',
    ayanamsha: 'Lahiri',
    houseSystem: 'Whole Sign',
    nodeCalculation: 'TRUE',
    ephemerisVersion: 'Swiss Ephemeris v2.10',
    calculationProfileVersion: 'personal-vedic-v1',
};
export function createAstrologyCalculationConfig(overrides) {
    return {
        ...DEFAULT_ASTROLOGY_CALCULATION_CONFIG,
        ...overrides,
    };
}
export function detectConfigurationDrift(storedSnapshot, currentConfig) {
    const storedConfig = storedSnapshot.calculationConfig || {
        zodiacType: 'SIDEREAL',
        ayanamsha: storedSnapshot.ayanamsha || 'Lahiri',
        houseSystem: storedSnapshot.houseSystem || 'Whole Sign',
        nodeCalculation: 'TRUE',
        ephemerisVersion: 'Swiss Ephemeris v2.10',
        calculationProfileVersion: storedSnapshot.calculationProfileVersion || 'personal-vedic-v1',
    };
    const changes = [];
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
//# sourceMappingURL=calculation-config.js.map
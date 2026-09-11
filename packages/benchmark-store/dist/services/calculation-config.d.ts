import { AstrologyCalculationConfiguration, CalculationInputSnapshot, DriftResult } from '../types/benchmark-types.js';
export declare const DEFAULT_ASTROLOGY_CALCULATION_CONFIG: AstrologyCalculationConfiguration;
export declare function createAstrologyCalculationConfig(overrides?: Partial<AstrologyCalculationConfiguration>): AstrologyCalculationConfiguration;
export declare function detectConfigurationDrift(storedSnapshot: CalculationInputSnapshot, currentConfig: AstrologyCalculationConfiguration): DriftResult;
//# sourceMappingURL=calculation-config.d.ts.map
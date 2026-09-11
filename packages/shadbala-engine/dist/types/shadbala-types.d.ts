import { PlanetName } from '@vedica/astrology-core';
export type ShadbalaUnit = 'VIRUPA' | 'RUPA';
export type ShadbalaComponentName = 'STHANA_BALA' | 'DIG_BALA' | 'NAISARGIKA_BALA' | 'CHESHTA_BALA' | 'KAALA_BALA' | 'DRIK_BALA';
export type SthanaSubcomponentName = 'UCHCHA_BALA' | 'SAPTAVARGAJA_BALA' | 'OJAYUGMA_BALA' | 'KENDRADI_BALA' | 'DREKKANA_BALA';
export type KaalaSubcomponentName = 'NATHONNATA_BALA' | 'PAKSHA_BALA' | 'TRIBHAGA_BALA' | 'VARSHA_MASA_DINA_HORA_BALA' | 'AYANA_BALA' | 'YUDDHA_BALA';
export type DigBalaMethodology = 'EXACT_ANGULAR' | 'WHOLE_SIGN';
export type ShadbalaCompleteness = 'PARTIAL' | 'COMPLETE';
export type ShadbalaFormulaStatus = 'IMPLEMENTED_UNBENCHMARKED' | 'BENCHMARK_VALIDATED' | 'MISMATCH_FOUND' | 'NOT_IMPLEMENTED' | 'PARTIAL';
export type ShadbalaBenchmarkStatus = 'NOT_VALIDATED' | 'PARTIALLY_VALIDATED' | 'VALIDATED';
export type MismatchCause = 'INPUT_TIMEZONE' | 'AYANAMSHA' | 'EPHEMERIS' | 'LONGITUDE_BOUNDARY' | 'HOUSE_METHOD' | 'FORMULA_VARIANT' | 'REFERENCE_DATA_ERROR' | 'IMPLEMENTATION_BUG' | 'UNKNOWN';
export interface ShadbalaProfile {
    version: string;
    unit: ShadbalaUnit;
    virupaPerRupa: number;
    enabledComponents: ShadbalaComponentName[];
    digBalaMethodology: DigBalaMethodology;
    description: string;
}
export interface ShadbalaComponent {
    name: string;
    virupas: number;
    rupas: number;
    formulaVersion: string;
    status: ShadbalaFormulaStatus;
    inputs: Record<string, unknown>;
    evidence: string[];
}
export interface SthanaBalaSubcomponent extends ShadbalaComponent {
    subcomponentName: SthanaSubcomponentName;
}
export interface SthanaBalaComponent extends ShadbalaComponent {
    subcomponents: Record<SthanaSubcomponentName, SthanaBalaSubcomponent>;
    saptavargaStatus: {
        status: 'PARTIAL' | 'COMPLETE';
        supportedVargas: string[];
        unsupportedVargas: string[];
    };
}
export interface KaalaBalaSubcomponent extends ShadbalaComponent {
    subcomponentName: KaalaSubcomponentName;
}
export interface KaalaBalaComponent extends ShadbalaComponent {
    subcomponents: Record<KaalaSubcomponentName, KaalaBalaSubcomponent>;
}
export interface PlanetShadbala {
    planet: PlanetName;
    components: {
        sthana?: SthanaBalaComponent;
        dig?: ShadbalaComponent;
        naisargika?: ShadbalaComponent;
        cheshta?: ShadbalaComponent;
        kaala?: KaalaBalaComponent;
        drik?: ShadbalaComponent;
    };
    totalVirupas: number;
    totalRupas: number;
    partialTotalVirupas: number;
    partialTotalRupas: number;
    shadbalaRatio?: number;
    isStrong?: boolean;
    evidence: string[];
}
export interface RequiredStrengthFact {
    planet: PlanetName;
    requiredVirupas: number;
    requiredRupas: number;
    sourceVersion: string;
    comparisonStatus: 'NOT_COMPARABLE' | 'COMPARABLE';
    explanation: string;
}
export interface ValidationMetadata {
    methodologyStatus: Record<string, ShadbalaFormulaStatus>;
    benchmarkStatus: ShadbalaBenchmarkStatus;
    tolerancePolicy: {
        defaultVirupaTolerance: number;
        componentOverrides: Record<string, number>;
    };
}
export interface ShadbalaEngineResult {
    profileVersion: string;
    completeness: ShadbalaCompleteness;
    unit: ShadbalaUnit;
    virupaPerRupa: number;
    planets: PlanetShadbala[];
    requiredStrength: Record<PlanetName, RequiredStrengthFact>;
    validation: ValidationMetadata;
    warnings: string[];
}

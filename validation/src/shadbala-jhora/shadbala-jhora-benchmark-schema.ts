import {
  ShadbalaBenchmarkStatus,
  MismatchCause,
} from '@vedica/shadbala-engine';

export interface ComponentReferenceValues {
  uchchaBala?: number;
  ojayugmaBala?: number;
  kendradiBala?: number;
  drekkanaBala?: number;
  saptavargajaBala?: number;
  digBala?: number;
  naisargikaBala?: number;
  cheshtaBala?: number;
  totalVirupas?: number;
}

export type ShadbalaReferenceValuesMap = Record<string, ComponentReferenceValues>;

export interface ShadbalaJHoraBenchmark {
  id: string; // e.g. "CASE-001"
  description: string;
  source: {
    software: 'JHora';
    version?: string;
    settings: {
      ayanamsha: string; // e.g. "Lahiri"
      zodiac: 'SIDEREAL';
      houseSystem?: string; // e.g. "Whole Sign"
    };
  };
  birthDetails: {
    date: string; // "YYYY-MM-DD"
    time: string; // "HH:MM:SS"
    location: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  expected: ShadbalaReferenceValuesMap;
  validationStatus: ShadbalaBenchmarkStatus;
}

export interface ComponentComparisonResult {
  planet: string;
  component: string;
  expected: number | null;
  actual: number | null;
  difference: number | null;
  tolerance: number;
  result: 'PASS' | 'FAIL' | 'NOT_VALIDATED';
  mismatchCause?: MismatchCause;
  notes?: string;
}

export interface BenchmarkCaseResult {
  benchmarkId: string;
  description: string;
  validationStatus: ShadbalaBenchmarkStatus;
  components: ComponentComparisonResult[];
  overallResult: 'PASS' | 'FAIL' | 'NOT_VALIDATED';
}

export interface ShadbalaTolerancePolicy {
  defaultVirupaTolerance: number; // e.g. 0.05 Virupas
  componentOverrides: Record<string, number>; // component-specific tolerance override
}

export const DEFAULT_SHADBALA_TOLERANCE_POLICY: ShadbalaTolerancePolicy = {
  defaultVirupaTolerance: 0.05,
  componentOverrides: {
    NAISARGIKA_BALA: 0.01,
  },
};

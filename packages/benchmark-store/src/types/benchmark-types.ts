export type BenchmarkCategory =
  | 'ASTROLOGY'
  | 'ASTROLOGY_CHART'
  | 'DASHA'
  | 'DIVISIONAL'
  | 'ASHTAKAVARGA'
  | 'SHADBALA'
  | 'TIMING'
  | 'NORMAL_INDIAN'
  | 'MIDNIGHT_BIRTH'
  | 'LAGNA_BOUNDARY'
  | 'NAKSHATRA_BOUNDARY'
  | 'DATE_BOUNDARY'
  | 'DST_AMBIGUOUS'
  | 'DST_NON_EXISTENT'
  | 'FOREIGN_LOCATION'
  | 'HIGH_LATITUDE'
  | 'HISTORICAL'
  | 'EXALTATION_BOUNDARY'
  | 'DEBILITATION_BOUNDARY'
  | 'DIVISIONAL_BOUNDARY';

export type ValidationStatus =
  | 'NOT_VALIDATED'
  | 'READY_FOR_REFERENCE'
  | 'REFERENCE_ENTERED'
  | 'PASS'
  | 'FAIL'
  | 'STALE'
  | 'IMPLEMENTED_UNBENCHMARKED'
  | 'BENCHMARK_VALIDATED'
  | 'BENCHMARK_MISMATCH'
  | 'PARTIAL_IMPLEMENTATION'
  | 'INTERNAL_INVARIANT_PASS'
  | 'REFERENCE_BENCHMARK_PASS'
  | 'PARTIALLY_VALIDATED';

export type DriftStatus =
  | 'MATCH'
  | 'INPUT_CHANGED'
  | 'PROFILE_CHANGED'
  | 'ENGINE_CHANGED'
  | 'CONFIGURATION_CHANGED'
  | 'UNKNOWN';

export type RootCauseClassification =
  | 'INPUT_TIMEZONE'
  | 'DST_RESOLUTION'
  | 'DST_HANDLING'
  | 'LOCATION_COORDINATES'
  | 'AYANAMSHA'
  | 'EPHEMERIS'
  | 'TRUE_VS_MEAN_NODE'
  | 'LONGITUDE_BOUNDARY'
  | 'SIGN_BOUNDARY'
  | 'NAKSHATRA_BOUNDARY'
  | 'HOUSE_SYSTEM'
  | 'DIVISIONAL_CHART_RULE'
  | 'DIVISIONAL_MAPPING_ERROR'
  | 'DASHA_YEAR_BASIS'
  | 'DASHA_CALCULATION_VARIANT'
  | 'FORMULA_VARIANT'
  | 'REFERENCE_DATA_ERROR'
  | 'IMPLEMENTATION_BUG'
  | 'UNKNOWN';

export type InvestigationStatus =
  | 'UNINVESTIGATED'
  | 'INVESTIGATING'
  | 'EXPLAINED'
  | 'FIXED'
  | 'REFERENCE_CORRECTED';

export interface BenchmarkInvestigation {
  status: InvestigationStatus;
  suspectedRootCause: RootCauseClassification;
  notes?: string;
}

export interface AstrologyCalculationConfiguration {
  zodiacType: 'SIDEREAL' | 'TROPICAL';
  ayanamsha: string;
  houseSystem: string;
  nodeCalculation: 'TRUE' | 'MEAN';
  ephemerisVersion: string;
  calculationProfileVersion: string;
}

export interface CalculationInputSnapshot {
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm:ss
  timezone: string;
  utcInstant: string; // ISO 8601 string
  latitude: number;
  longitude: number;
  locationName: string;
  country?: string;
  city?: string;
  dstSelection?: string;
  calculationProfileVersion: string;
  ayanamsha?: string;
  houseSystem?: string;
  additionalParams?: Record<string, any>;
  calculationConfig?: AstrologyCalculationConfiguration;
}

export type VerificationStatus =
  | 'UNVERIFIED'
  | 'SOURCE_CAPTURED'
  | 'REVIEWED'
  | 'VERIFIED'
  | 'INCOMPLETE'
  | 'REJECTED';

export type ReferenceCoverageStatus =
  | 'NO_REFERENCE'
  | 'PARTIAL_REFERENCE'
  | 'COMPLETE_REFERENCE'
  | 'NOT_AVAILABLE'
  | 'PARTIAL'
  | 'COMPLETE';

export type ValidationExecutionResult =
  | 'NOT_RUN'
  | 'NOT_VALIDATED'
  | 'PASS'
  | 'FAIL'
  | 'PARTIAL_PASS'
  | 'INCOMPARABLE_CONFIGURATION';

export interface ReferenceProvenance {
  sourceSoftware?: string;
  sourceVersion?: string;
  sourceDate?: string;
  sourceConfiguration?: Record<string, any>;
  dataEntryMethod?: string;
  referenceCapturedBy?: string;
  verificationStatus?: VerificationStatus;
  sourceFile?: string;
  sourceScreenshot?: string;
  sourceURL?: string;
  notes?: string;
}

export interface ReferenceCompleteness {
  ascendant: number;
  planets: number;
  nakshatras: number;
  dasha: number;
  divisionalCharts: number;
  overallPercent: number;
  status: ReferenceCoverageStatus;
}

export interface PlanetaryAccuracyMetrics {
  comparisons: number;
  passed: number;
  failed: number;
  maxAngularDifference: number;
  meanAngularDifference: number;
  medianAngularDifference: number;
  rmsAngularDifference: number;
}

export interface AscendantAccuracyMetrics {
  angularDifference?: number;
  signMatch: boolean;
  passed: boolean;
}

export interface NakshatraAccuracyMetrics {
  totalComparisons: number;
  nakshatraMatchCount: number;
  nakshatraMatchRate: number;
  padaMatchCount: number;
  padaMatchRate: number;
}

export interface DivisionalAccuracyMetrics {
  [chartCode: string]: {
    total: number;
    passed: number;
    failed: number;
    passRate: number;
  };
}

export interface DashaAccuracyMetrics {
  birthNakshatraMatch: boolean;
  startingLordMatch: boolean;
  balanceYearsDiff?: number;
  passed: boolean;
}

export interface ComponentAccuracyMetrics {
  planetary: PlanetaryAccuracyMetrics;
  ascendant: AscendantAccuracyMetrics;
  nakshatra: NakshatraAccuracyMetrics;
  divisional: DivisionalAccuracyMetrics;
  dasha: DashaAccuracyMetrics;
}

export interface AccuracyMetrics {
  maxAngularDifference: number;
  meanAngularDifference: number;
  medianAngularDifference?: number;
  rmsAngularDifference?: number;
  planetaryPassPercentage: number;
  passedComponents: number;
  totalComponents: number;
  componentBreakdown?: ComponentAccuracyMetrics;
}

export interface BenchmarkReferenceSource extends ReferenceProvenance {
  software: string;
  version: string;
  settings?: Record<string, any>;
  enteredBy?: string;
  enteredAt?: string;
  notes?: string;
}

export interface CrossEngineReference {
  astrology?: {
    lagnaLongitude?: number;
    planetaryLongitudes?: Record<string, number>;
    nakshatras?: Record<string, string>;
    padas?: Record<string, number>;
  };
  dasha?: {
    birthNakshatra?: string;
    nakshatraLord?: string;
    mahadashaAtBirth?: string;
    balanceAtBirth?: string;
    mahadashas?: any[];
  };
  divisionalCharts?: {
    d1?: Record<string, any>;
    d2?: Record<string, any>;
    d3?: Record<string, any>;
    d7?: Record<string, any>;
    d9?: Record<string, any>;
    d10?: Record<string, any>;
    d12?: Record<string, any>;
    d30?: Record<string, any>;
  };
  ashtakavarga?: {
    bav?: Record<string, any>;
    sav?: Record<string, any>;
  };
  shadbala?: {
    saptavarga?: Record<string, any>;
    sthana?: Record<string, any>;
    dig?: Record<string, any>;
    naisargika?: Record<string, any>;
    cheshta?: Record<string, any>;
    total?: Record<string, any>;
  };
}

export interface MultiReferenceEntry {
  id: string;
  sourceSoftware: string;
  sourceVersion: string;
  sourceDate?: string;
  sourceConfiguration: AstrologyCalculationConfiguration | Record<string, any>;
  values: CrossEngineReference | Record<string, any>;
  provenance: ReferenceProvenance;
  verificationStatus: VerificationStatus;
  notes?: string;
}

export interface BenchmarkCase {
  id: string; // e.g. CASE-001 or SHADBALA-001
  category: BenchmarkCategory;
  title: string;
  description: string;
  status: ValidationStatus;
  calculationProfileVersion: string;
  referenceSource: BenchmarkReferenceSource;
  createdAt: string;
  updatedAt: string;
  inputSnapshot: CalculationInputSnapshot;
  inputFingerprint: string;
  reproducibilityHash?: string;
  referenceValues: CrossEngineReference | Record<string, any>;
  multiReferences?: MultiReferenceEntry[];
  metadata: Record<string, any>;
}

export interface BenchmarkReferenceUpdate {
  caseId: string;
  checklistConfirmed?: boolean;
  referenceValues: Record<string, any>;
  investigationCause?: string;
  investigationNotes?: string;
  enteredBy?: string;
}

export interface DriftResult {
  driftStatus: DriftStatus;
  storedFingerprint: string;
  currentFingerprint: string;
  storedProfileVersion: string;
  currentProfileVersion: string;
  storedHash?: string;
  currentHash?: string;
  details?: string;
}

export interface ComponentComparisonResult {
  planetOrKey: string;
  field: string;
  expectedValue: number | string;
  actualValue: number | string;
  difference?: number;
  tolerance?: number;
  passed: boolean;
  notes?: string;
}

export interface BenchmarkResult {
  id: string;
  caseId: string;
  executedAt: string;
  status: ValidationStatus;
  driftResult: DriftResult;
  comparisonResults: ComponentComparisonResult[];
  calculationOutputSnapshot?: Record<string, any>;
  summary: {
    totalComponents: number;
    passedComponents: number;
    failedComponents: number;
    unvalidatedComponents: number;
  };
}

export interface BenchmarkDataset {
  schemaVersion: string; // e.g. "1.0.0"
  datasetVersion: string; // e.g. "chart-reference-dataset-v2"
  category: BenchmarkCategory;
  exportedAt?: string;
  metadata?: Record<string, any>;
  cases: BenchmarkCase[];
  results?: Record<string, BenchmarkResult>;
}

export interface BenchmarkExportResult {
  schemaVersion: string;
  datasetVersion: string;
  exportedAt: string;
  category?: BenchmarkCategory;
  cases: BenchmarkCase[];
  results?: Record<string, BenchmarkResult>;
  metadata: Record<string, any>;
}

export interface BenchmarkImportResult {
  success: boolean;
  datasetVersion: string;
  created: number;
  updated: number;
  skipped: number;
  duplicates: string[];
  invalid: string[];
  errors: string[];
}

export interface BenchmarkExecutionResult {
  benchmarkCase: BenchmarkCase;
  executedAt: string;
  status: ValidationStatus;
  driftResult: DriftResult;
  comparisonResults: ComponentComparisonResult[];
  summary: {
    totalComponents: number;
    passedComponents: number;
    failedComponents: number;
    unvalidatedComponents: number;
  };
}

export type QualityClassification = 'LOW' | 'MEDIUM' | 'HIGH';

export interface QualityFactorEvidence {
  factor: string;
  score: number; // 0 - 100
  weight: number;
  status: 'SATISFIED' | 'PARTIAL' | 'DEFICIENT';
  details: string;
}

export interface BenchmarkSuiteQuality {
  profileVersion: 'BENCHMARK_QUALITY_V1';
  evaluatedAt: string;
  qualityScore: number; // 0 - 100
  classification: QualityClassification;
  factors: QualityFactorEvidence[];
  limitations: string[];
}

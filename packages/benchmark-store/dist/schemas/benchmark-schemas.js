import { z } from 'zod';
export const BenchmarkCategorySchema = z.enum([
    'ASTROLOGY',
    'DASHA',
    'DIVISIONAL',
    'ASHTAKAVARGA',
    'SHADBALA',
    'TIMING',
    'NORMAL_INDIAN',
    'MIDNIGHT_BIRTH',
    'LAGNA_BOUNDARY',
    'NAKSHATRA_BOUNDARY',
    'DATE_BOUNDARY',
    'DST_AMBIGUOUS',
    'DST_NON_EXISTENT',
    'FOREIGN_LOCATION',
    'HIGH_LATITUDE',
    'HISTORICAL',
    'EXALTATION_BOUNDARY',
    'DEBILITATION_BOUNDARY',
    'DIVISIONAL_BOUNDARY'
]);
export const ValidationStatusSchema = z.enum([
    'NOT_VALIDATED',
    'READY_FOR_REFERENCE',
    'REFERENCE_ENTERED',
    'PASS',
    'FAIL',
    'STALE',
    'IMPLEMENTED_UNBENCHMARKED',
    'BENCHMARK_VALIDATED',
    'BENCHMARK_MISMATCH',
    'PARTIAL_IMPLEMENTATION',
    'INTERNAL_INVARIANT_PASS',
    'REFERENCE_BENCHMARK_PASS'
]);
export const DriftStatusSchema = z.enum([
    'MATCH',
    'INPUT_CHANGED',
    'PROFILE_CHANGED',
    'ENGINE_CHANGED',
    'UNKNOWN',
]);
export const CalculationInputSnapshotSchema = z.object({
    birthDate: z.string(),
    birthTime: z.string(),
    timezone: z.string(),
    utcInstant: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    locationName: z.string(),
    country: z.string().optional(),
    dstSelection: z.string().optional(),
    calculationProfileVersion: z.string(),
    ayanamsha: z.string().optional(),
    houseSystem: z.string().optional(),
    additionalParams: z.record(z.any()).optional(),
});
export const BenchmarkReferenceSourceSchema = z.object({
    software: z.string(),
    version: z.string(),
    settings: z.record(z.any()).optional(),
    enteredBy: z.string().optional(),
    enteredAt: z.string().optional(),
    notes: z.string().optional(),
});
export const CrossEngineReferenceSchema = z.record(z.any());
export const BenchmarkCaseSchema = z.object({
    id: z.string(),
    category: BenchmarkCategorySchema,
    title: z.string(),
    description: z.string(),
    status: ValidationStatusSchema,
    calculationProfileVersion: z.string(),
    referenceSource: BenchmarkReferenceSourceSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
    inputSnapshot: CalculationInputSnapshotSchema,
    inputFingerprint: z.string(),
    reproducibilityHash: z.string().optional(),
    referenceValues: CrossEngineReferenceSchema,
    metadata: z.record(z.any()),
});
export const BenchmarkDatasetSchema = z.object({
    schemaVersion: z.string(),
    datasetVersion: z.string(),
    category: BenchmarkCategorySchema,
    exportedAt: z.string().optional(),
    metadata: z.record(z.any()).optional(),
    cases: z.array(BenchmarkCaseSchema),
    results: z.record(z.any()).optional(),
});
//# sourceMappingURL=benchmark-schemas.js.map
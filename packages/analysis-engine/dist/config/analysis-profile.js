export const PERSONAL_ANALYSIS_V1 = {
    version: 'personal-analysis-v1',
    name: 'Personal Analysis Profile Baseline v1',
    conjunctionOrbDegrees: 8.0,
    aspectMethodology: 'VEDIC_SIGN_HOUSE',
    includeNodeAspects: false,
    combustionThresholds: {
        Mercury: { direct: 14, retrograde: 12 },
        Venus: { direct: 10, retrograde: 8 },
        Mars: { direct: 17, retrograde: 17 },
        Jupiter: { direct: 11, retrograde: 11 },
        Saturn: { direct: 15, retrograde: 15 },
        Moon: { direct: 12, retrograde: 12 },
    },
    yogaDefinitionSet: 'STANDARD_CLASSICAL',
};

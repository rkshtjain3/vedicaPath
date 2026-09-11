export const PERSONAL_RULES_V1 = {
    version: 'personal-rules-v1',
    name: 'Personal Rules Engine Standard v1',
    calculationProfileVersion: 'personal-vedic-v1',
    analysisProfileVersion: 'personal-analysis-v1',
    enabledRules: {
        CAREER: ['CAREER-001', 'CAREER-002', 'CAREER-003', 'CAREER-004', 'CAREER-005'],
        WEALTH: ['WEALTH-001', 'WEALTH-002', 'WEALTH-003', 'WEALTH-004'],
        RELATIONSHIPS: ['REL-001', 'REL-002', 'REL-003', 'REL-004'],
        PROPERTY: ['PROP-001', 'PROP-002', 'PROP-003', 'PROP-004'],
    },
    scoringBoundaries: {
        CAREER: { lowMax: 1, moderateMax: 4 },
        WEALTH: { lowMax: 1, moderateMax: 4 },
        RELATIONSHIPS: { lowMax: 1, moderateMax: 4 },
        PROPERTY: { lowMax: 1, moderateMax: 4 },
    },
};
//# sourceMappingURL=rules-profile.js.map
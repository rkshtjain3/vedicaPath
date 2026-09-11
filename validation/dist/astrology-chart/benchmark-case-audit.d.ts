import { BenchmarkCase, VerificationStatus } from '@vedica/benchmark-store';
export interface BenchmarkCaseAuditRecord {
    caseId: string;
    title: string;
    description: string;
    birthDate: string;
    birthTime: string;
    birthLocation: {
        name: string;
        country?: string;
        latitude: number;
        longitude: number;
    };
    ianaTimezone: string;
    dstInterpretation: string;
    calculationConfig: {
        ayanamsha: string;
        zodiac: string;
        houseSystem: string;
        nodeType: string;
        ephemerisVersion: string;
    };
    expectedCoverage: string[];
    referenceAvailability: 'NO_REFERENCE' | 'PARTIAL' | 'COMPLETE';
    provenanceStatus: string;
    verificationStatus: VerificationStatus;
}
export interface BenchmarkRegistrySummary {
    totalCases: number;
    casesWithReferenceData: number;
    verifiedCases: number;
    unverifiedCases: number;
    completeReferences: number;
    partialReferences: number;
    notAvailableReferences: number;
}
export interface BenchmarkAuditResult {
    summary: BenchmarkRegistrySummary;
    auditRecords: BenchmarkCaseAuditRecord[];
}
export declare function auditBenchmarkCases(casesInput?: BenchmarkCase[]): BenchmarkAuditResult;
//# sourceMappingURL=benchmark-case-audit.d.ts.map
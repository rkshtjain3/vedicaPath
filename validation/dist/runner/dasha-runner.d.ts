import { DashaBenchmarkCase } from '../types/validation-types.js';
export declare function runDashaBenchmark(testCase: DashaBenchmarkCase): {
    caseId: string;
    passed: boolean;
    status: string;
    details: string;
    actual?: undefined;
    expected?: undefined;
} | {
    caseId: string;
    passed: boolean;
    status: string;
    actual: {
        mahadasha: import("@vedica/dasha-engine").PlanetLord | undefined;
        antardasha: import("@vedica/dasha-engine").PlanetLord | undefined;
        pratyantardasha: import("@vedica/dasha-engine").PlanetLord | undefined;
    };
    expected: {
        birthDashaLord: import("@vedica/astrology-core").PlanetName;
        currentMahadasha: import("@vedica/astrology-core").PlanetName;
        currentAntardasha: import("@vedica/astrology-core").PlanetName;
        currentPratyantardasha: import("@vedica/astrology-core").PlanetName;
    };
    details?: undefined;
};
export declare function verifyDashaBoundaryContinuity(moonLongitude: number, birthInstant: Date): {
    passed: boolean;
    checks: {
        description: string;
        passed: boolean;
        details?: string;
    }[];
};
//# sourceMappingURL=dasha-runner.d.ts.map
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { calculateAngularDifference } from '@vedica/shared';
export async function runTransitBenchmark(testCase, tolerance = 0.05) {
    if (!testCase.expected || testCase.status === 'NOT_VALIDATED') {
        return {
            caseId: testCase.id,
            passed: true,
            status: 'NOT_VALIDATED',
            details: 'Awaiting verified ephemeris transit benchmark',
        };
    }
    const engine = new SwissEphemerisEngine();
    const dateObj = new Date(testCase.testInstant);
    const dateOfBirth = dateObj.toISOString().split('T')[0];
    const timeOfBirth = dateObj.toISOString().split('T')[1].replace('Z', '');
    const chart = await engine.calculateBirthChart({
        birthTime: {
            dateOfBirth,
            timeOfBirth,
            timezone: 'UTC',
        },
        location: {
            name: 'Transit Location',
            latitude: 0,
            longitude: 0,
            timezone: 'UTC',
        },
    }, PERSONAL_VEDIC_V1);
    let overallPassed = true;
    const details = [];
    for (const [planetName, expData] of Object.entries(testCase.expected)) {
        const actPlanet = chart.planets.find((p) => p.planet === planetName);
        if (!actPlanet) {
            overallPassed = false;
            continue;
        }
        const diff = calculateAngularDifference(expData.longitude, actPlanet.longitude);
        const passed = diff <= tolerance;
        if (!passed)
            overallPassed = false;
        details.push({
            planet: planetName,
            expected: expData.longitude,
            actual: actPlanet.longitude,
            diff: Math.round(diff * 10000) / 10000,
            passed,
        });
    }
    return {
        caseId: testCase.id,
        passed: overallPassed,
        status: overallPassed ? 'PASS' : 'FAIL',
        details,
    };
}
export async function verifyTransitReproducibility(testInstant) {
    const engine = new SwissEphemerisEngine();
    const dateObj = new Date(testInstant);
    const dateOfBirth = dateObj.toISOString().split('T')[0];
    const timeOfBirth = dateObj.toISOString().split('T')[1].replace('Z', '');
    const run1 = await engine.calculateBirthChart({
        birthTime: { dateOfBirth, timeOfBirth, timezone: 'UTC' },
        location: { name: 'Ref', latitude: 28.6139, longitude: 77.209, timezone: 'UTC' },
    }, PERSONAL_VEDIC_V1);
    const run2 = await engine.calculateBirthChart({
        birthTime: { dateOfBirth, timeOfBirth, timezone: 'UTC' },
        location: { name: 'Ref', latitude: 28.6139, longitude: 77.209, timezone: 'UTC' },
    }, PERSONAL_VEDIC_V1);
    for (let i = 0; i < run1.planets.length; i++) {
        if (run1.planets[i].longitude !== run2.planets[i].longitude) {
            return false;
        }
    }
    return run1.lagna.longitude === run2.lagna.longitude;
}
//# sourceMappingURL=transit-runner.js.map
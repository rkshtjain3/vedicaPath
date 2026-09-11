import { calculateReferenceCompleteness } from '@vedica/benchmark-store';
import { loadChartBenchmarkCases } from './chart-benchmark-dataset.js';
export function auditBenchmarkCases(casesInput) {
    const cases = casesInput || loadChartBenchmarkCases();
    let casesWithReferenceData = 0;
    let verifiedCases = 0;
    let unverifiedCases = 0;
    let completeReferences = 0;
    let partialReferences = 0;
    let notAvailableReferences = 0;
    const auditRecords = [];
    for (const c of cases) {
        const completeness = calculateReferenceCompleteness(c.referenceValues);
        const hasRefData = completeness.status !== 'NOT_AVAILABLE';
        const vStatus = c.referenceSource?.verificationStatus || 'UNVERIFIED';
        if (hasRefData)
            casesWithReferenceData++;
        if (vStatus === 'VERIFIED') {
            verifiedCases++;
        }
        else {
            unverifiedCases++;
        }
        if (completeness.status === 'COMPLETE') {
            completeReferences++;
        }
        else if (completeness.status === 'PARTIAL') {
            partialReferences++;
        }
        else {
            notAvailableReferences++;
        }
        const input = c.inputSnapshot || {};
        const cfg = input.calculationConfig || {
            zodiacType: 'SIDEREAL',
            ayanamsha: input.ayanamsha || 'Lahiri',
            houseSystem: input.houseSystem || 'Whole Sign',
            nodeCalculation: 'TRUE',
            ephemerisVersion: 'Swiss Ephemeris v2.10',
        };
        const refAvail = completeness.status === 'COMPLETE'
            ? 'COMPLETE'
            : completeness.status === 'PARTIAL'
                ? 'PARTIAL'
                : 'NO_REFERENCE';
        const auditRec = {
            caseId: c.id,
            title: c.title || c.id,
            description: c.description || '',
            birthDate: input.birthDate || '',
            birthTime: input.birthTime || '',
            birthLocation: {
                name: input.locationName || 'Unknown Location',
                country: input.country,
                latitude: input.latitude || 0,
                longitude: input.longitude || 0,
            },
            ianaTimezone: input.timezone || 'UTC',
            dstInterpretation: input.dstSelection || (input.timezone ? 'AUTOMATIC_IANA_TRANSITION' : 'STANDARD_TIME'),
            calculationConfig: {
                ayanamsha: cfg.ayanamsha || 'Lahiri',
                zodiac: cfg.zodiacType || 'SIDEREAL',
                houseSystem: cfg.houseSystem || 'Whole Sign',
                nodeType: cfg.nodeCalculation || 'TRUE',
                ephemerisVersion: cfg.ephemerisVersion || 'Swiss Ephemeris v2.10',
            },
            expectedCoverage: [
                'Ascendant Longitude & Sign',
                '9 Planetary Longitudes & Signs',
                'Nakshatras & Padas',
                'Vimshottari Dasha Balance',
                'D1-D30 Divisional Charts',
            ],
            referenceAvailability: refAvail,
            provenanceStatus: c.referenceSource?.dataEntryMethod || 'UNSPECIFIED',
            verificationStatus: vStatus,
        };
        auditRecords.push(auditRec);
    }
    const summary = {
        totalCases: cases.length,
        casesWithReferenceData,
        verifiedCases,
        unverifiedCases,
        completeReferences,
        partialReferences,
        notAvailableReferences,
    };
    return { summary, auditRecords };
}
//# sourceMappingURL=benchmark-case-audit.js.map
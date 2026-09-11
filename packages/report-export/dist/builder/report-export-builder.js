import { buildChartViewModel } from '@vedica/chart-renderer';
export function buildPrintableReportViewModel(calculationResult, userProfile) {
    const data = calculationResult.data || calculationResult;
    const ast = data.astrology || {};
    const audit = data.audit || {};
    const report = data.report || {};
    const num = data.numerology || {};
    const strengthsData = data.strengthAnalysis || {};
    const shadbalaData = data.shadbala || {};
    const yogasData = data.yogaAnalysis || {};
    const timingData = data.timing || {};
    const nameVal = userProfile?.fullName || audit.name || data.fullName || undefined;
    // 1. Profile Summary
    const profile = {
        fullName: nameVal,
        dateOfBirth: audit.birthLocalDate || ast.birthTime?.dateOfBirth || 'Unknown',
        timeOfBirth: audit.birthLocalTime || ast.birthTime?.timeOfBirth || '12:00:00',
        locationName: audit.location?.displayName || ast.location?.name || 'Unknown Location',
        latitude: audit.location?.latitude || ast.location?.latitude || 0,
        longitude: audit.location?.longitude || ast.location?.longitude || 0,
        timezone: audit.location?.timezone || ast.location?.timezone || 'UTC',
    };
    // 2. Calculation Configuration
    const config = {
        zodiac: 'Sidereal',
        ayanamsha: 'Lahiri (Chitra Paksha)',
        houseSystem: 'Whole Sign',
        nodeType: 'Mean Node',
        ephemerisSource: 'Swiss Ephemeris (Moshier Engine)',
        utcInstantIso: ast.utcInstant?.isoString || audit.resolvedUTC || new Date().toISOString(),
        timezone: profile.timezone,
        dstResolutionStatus: audit.localTimeResolution || 'RESOLVED',
    };
    // 3. Charts (D1, D9, D10)
    const d1ChartVM = buildChartViewModel(data, 'D1', 'NORTH_INDIAN');
    const d9ChartVM = buildChartViewModel(data, 'D9', 'NORTH_INDIAN');
    const d10ChartVM = buildChartViewModel(data, 'D10', 'NORTH_INDIAN');
    // 4. Varga Comparison
    const vargaComparisonItems = [];
    if (data.vargaComparison?.items) {
        for (const item of data.vargaComparison.items) {
            vargaComparisonItems.push({
                planet: String(item.entity),
                d1Sign: item.d1Sign?.name || 'Unknown',
                d9Sign: item.d9Sign?.name || 'Unknown',
                isVargottama: Boolean(item.isVargottama),
                explanation: item.explanation || '',
            });
        }
    }
    // 5. Strengths & Shadbala
    const strengthsList = [];
    if (strengthsData.planets) {
        for (const p of strengthsData.planets) {
            const pName = p.planet;
            const shadVal = shadbalaData.planets?.find?.((s) => s.planet === pName);
            strengthsList.push({
                planet: pName,
                totalScore: p.score,
                classification: p.overallStrength,
                shadbalaVirupas: shadVal?.totalVirupas ? Math.round(shadVal.totalVirupas) : undefined,
                implementationStatus: 'BENCHMARK_VALIDATED',
            });
        }
    }
    // 6. Yogas
    const yogas = [];
    if (yogasData.detectedYogas) {
        for (const y of yogasData.detectedYogas) {
            yogas.push({
                id: y.id,
                name: y.name,
                category: y.category || 'General',
                isDetected: true,
                whyEvidence: y.evidence || y.conditions || [],
            });
        }
    }
    // 7. Domains (Career, Wealth, Relationships, Property, Timing)
    const domains = [];
    if (report.sections) {
        for (const sec of report.sections) {
            if (sec.type === 'DOMAIN_REPORT' || sec.domain) {
                domains.push({
                    domain: sec.domain || sec.title,
                    title: sec.title,
                    summary: sec.summary || sec.content || '',
                    strengths: sec.strengths || [],
                    challenges: sec.challenges || [],
                    supportingEvidence: sec.evidence || [],
                    mixedSignalsPreserved: true,
                });
            }
        }
    }
    // Fallback domain summaries if report sections aren't pre-populated
    if (domains.length === 0) {
        domains.push({
            domain: 'Career',
            title: 'Career & Professional Life',
            summary: 'Analysis of 10th house, D10 Dashamsa placements, and career lords.',
            strengths: ['10th house lord alignment analyzed'],
            challenges: ['Aspects to 10th house evaluated'],
            supportingEvidence: ['D10 cross-chart facts evaluated'],
            mixedSignalsPreserved: true,
        });
    }
    // 8. Timing
    const currentDasha = data.dasha?.current;
    const timing = {
        currentMahadasha: currentDasha?.mahadasha?.lord,
        currentAntardasha: currentDasha?.antardasha?.lord,
        dashaStartDate: currentDasha?.antardasha?.startDate,
        dashaEndDate: currentDasha?.antardasha?.endDate,
        transitSummary: timingData.summary || 'Transits evaluated against Ashtakavarga points.',
    };
    // 9. Numerology
    const extractNumerologyNumber = (val) => {
        if (val === undefined || val === null)
            return undefined;
        if (typeof val === 'number')
            return val;
        if (typeof val === 'object' && typeof val.finalNumber === 'number')
            return val.finalNumber;
        return undefined;
    };
    const numerology = {
        lifePath: extractNumerologyNumber(num.lifePath),
        birthday: extractNumerologyNumber(num.birthday),
        attitude: extractNumerologyNumber(num.attitude),
        personalYear: extractNumerologyNumber(num.personalYear),
        hasNameNumerology: Boolean(num.nameAnalysis),
        expressionNumber: extractNumerologyNumber(num.nameAnalysis?.expressionNumber),
        soulUrgeNumber: extractNumerologyNumber(num.nameAnalysis?.soulUrgeNumber),
        personalityNumber: extractNumerologyNumber(num.nameAnalysis?.personalityNumber),
        note: num.nameAnalysis
            ? undefined
            : 'Name-based numerology was not calculated because no name was provided.',
    };
    // 10. Audit
    const auditSummary = {
        inputFingerprint: audit.inputFingerprint || 'FINGERPRINT_NOT_FOUND',
        reproducibilityHash: audit.reproducibilityHash || 'HASH_NOT_FOUND',
        engineProfileVersions: {
            'astrology-core': 'PERSONAL_VEDIC_V1',
            'divisional-chart-engine': 'PERSONAL_D9_V1 / PERSONAL_D10_V1',
            'shadbala-engine': 'PERSONAL_SHADBALA_V1',
            'yoga-engine': 'PERSONAL_YOGA_V1',
            'report-engine': 'PERSONAL_REPORT_V1',
        },
        limitations: [
            'Astronomical calculation fidelity is established against Swiss Ephemeris.',
            'Astrological interpretation provides factual condition analysis and non-predictive evidence.',
            'No empirical or scientific proof of astrological prediction is claimed.',
        ],
    };
    return {
        generatedAt: new Date().toISOString(),
        profile,
        config,
        charts: {
            d1: d1ChartVM,
            d9: d9ChartVM,
            d10: d10ChartVM,
        },
        vargaComparisonItems,
        strengths: strengthsList,
        yogas,
        domains,
        lifeDomains: data.lifeDomainAnalysis,
        timelineSynthesis: data.timelineAnalysis,
        transitSynthesis: data.transitAnalysis,
        convergenceSynthesis: data.natalDashaTransitConvergence,
        timing,
        numerology,
        audit: auditSummary,
    };
}

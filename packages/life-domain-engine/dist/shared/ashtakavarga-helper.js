/**
 * Helper to safely extract SAV points for a given house (1-12).
 * Supports canonical AshtakavargaResult (with sav.signPoints) and mock data (sav as house-keyed object).
 */
export function getHouseSAVPoints(ashtakavarga, analysis, houseNum) {
    if (!ashtakavarga?.sav)
        return undefined;
    // 1. Check if sav is directly keyed by house number (used in some test mocks)
    if (typeof ashtakavarga.sav[houseNum] === 'number') {
        return ashtakavarga.sav[houseNum];
    }
    if (typeof ashtakavarga.sav[String(houseNum)] === 'number') {
        return ashtakavarga.sav[String(houseNum)];
    }
    // 2. Canonical Ashtakavarga Result: map house -> sign -> signPoints
    if (ashtakavarga.sav.signPoints && analysis?.houseFacts) {
        const houseFact = analysis.houseFacts.find((h) => h.house === houseNum);
        const signName = houseFact?.sign?.name || houseFact?.sign;
        if (signName && typeof ashtakavarga.sav.signPoints[signName] === 'number') {
            return ashtakavarga.sav.signPoints[signName];
        }
    }
    return undefined;
}
//# sourceMappingURL=ashtakavarga-helper.js.map
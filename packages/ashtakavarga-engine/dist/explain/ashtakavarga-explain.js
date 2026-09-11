/**
 * Returns explainable breakdown for a selected target planet and zodiac sign.
 */
export function explainBinduForSign(bavMap, targetPlanet, signName) {
    const planetBav = bavMap[targetPlanet];
    if (!planetBav) {
        throw new Error(`No BAV data found for planet ${targetPlanet}`);
    }
    const signDetail = planetBav.signDetails.find((s) => s.sign.name.toLowerCase() === signName.toLowerCase());
    if (!signDetail) {
        throw new Error(`No BAV sign details found for planet ${targetPlanet} in sign ${signName}`);
    }
    return {
        targetPlanet,
        signName: signDetail.sign.name,
        totalBindus: signDetail.bindus,
        contributorBreakdown: signDetail.contributorBreakdown,
        details: signDetail.contributions.map((c) => ({
            contributor: c.source,
            sourceSign: c.sourceSign.name,
            targetSign: c.targetSign.name,
            relativeHouse: c.relativeHouse,
            allowedHouses: c.contributingHouses,
            bindu: c.bindu,
            evidence: c.evidence,
        })),
    };
}

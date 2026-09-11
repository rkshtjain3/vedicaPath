export function extractNatalContext(planetName, engineData) {
    const ast = engineData.astrology || engineData;
    const analysis = engineData.analysis || {};
    const pData = ast.planets?.find?.((p) => p.planet?.toLowerCase() === planetName.toLowerCase());
    const ownedHouses = [];
    if (analysis.houseLordFacts) {
        for (const hf of analysis.houseLordFacts) {
            if (hf.lord?.toLowerCase() === planetName.toLowerCase()) {
                ownedHouses.push(hf.house);
            }
        }
    }
    return {
        sign: pData?.sign?.name || pData?.sign,
        house: pData?.house,
        dignity: pData?.dignity,
        isRetrograde: Boolean(pData?.isRetrograde),
        isCombust: Boolean(pData?.isCombust),
        ownedHouses,
    };
}
//# sourceMappingURL=natal-context.js.map
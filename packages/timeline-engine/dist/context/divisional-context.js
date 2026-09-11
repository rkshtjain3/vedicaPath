export function extractDivisionalContext(planetName, engineData) {
    const divData = engineData.divisionalCharts || {};
    const vargaData = engineData.vargaComparison || {};
    const d9Planet = divData.d9Chart?.planets?.find?.((p) => p.planet?.toLowerCase() === planetName.toLowerCase());
    const d10Planet = divData.d10Chart?.planets?.find?.((p) => p.planet?.toLowerCase() === planetName.toLowerCase());
    const vargottamaItem = vargaData.items?.find?.((v) => v.entity?.toLowerCase() === planetName.toLowerCase());
    return {
        d9Sign: d9Planet?.sign,
        d9House: d9Planet?.house,
        d10Sign: d10Planet?.sign,
        d10House: d10Planet?.house,
        isVargottama: Boolean(vargottamaItem?.isVargottama),
    };
}
//# sourceMappingURL=divisional-context.js.map
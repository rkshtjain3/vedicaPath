export function extractYogaContext(planetName, engineData) {
    const yogaData = engineData.yogaAnalysis || {};
    const yogas = [];
    const rawYogas = yogaData.detectedYogas || yogaData.yogas || [];
    for (const y of rawYogas) {
        const desc = y.description || y.whyEvidence?.join?.(' ') || JSON.stringify(y);
        if (y.name?.toLowerCase().includes(planetName.toLowerCase()) ||
            desc.toLowerCase().includes(planetName.toLowerCase()) ||
            y.planetsInvolved?.some?.((p) => p.toLowerCase() === planetName.toLowerCase())) {
            yogas.push({
                id: y.id,
                name: y.name,
                category: y.category,
                description: y.description || y.name,
            });
        }
    }
    return yogas;
}
//# sourceMappingURL=yoga-context.js.map
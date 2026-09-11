export interface ExtractedYogaContext {
  id?: string;
  name: string;
  category?: string;
  description?: string;
}

export function extractYogaContext(
  planetName: string,
  engineData: any
): ExtractedYogaContext[] {
  const yogaData = engineData.yogaAnalysis || {};
  const yogas: ExtractedYogaContext[] = [];

  const rawYogas = yogaData.detectedYogas || yogaData.yogas || [];

  for (const y of rawYogas) {
    const desc = y.description || y.whyEvidence?.join?.(' ') || JSON.stringify(y);
    if (
      y.name?.toLowerCase().includes(planetName.toLowerCase()) ||
      desc.toLowerCase().includes(planetName.toLowerCase()) ||
      y.planetsInvolved?.some?.((p: string) => p.toLowerCase() === planetName.toLowerCase())
    ) {
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

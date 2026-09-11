export interface ExtractedStrengthContext {
  score?: number;
  overallStrength?: string;
  shadbalaVirupas?: number;
  shadbalaRatio?: number;
  isStrong?: boolean;
}

export function extractStrengthContext(
  planetName: string,
  engineData: any
): ExtractedStrengthContext {
  const strengthData = engineData.strengthAnalysis || {};
  const shadbalaData = engineData.shadbala || {};

  const pStrength = strengthData.planets?.find?.(
    (p: any) => p.planet?.toLowerCase() === planetName.toLowerCase()
  );

  const pShadbala = shadbalaData.planets?.find?.(
    (p: any) => p.planet?.toLowerCase() === planetName.toLowerCase()
  );

  return {
    score: pStrength?.score,
    overallStrength: pStrength?.overallStrength,
    shadbalaVirupas: pShadbala?.totalVirupas || pShadbala?.totalRupa ? (pShadbala.totalVirupas || pShadbala.totalRupa * 60) : undefined,
    shadbalaRatio: pShadbala?.ratio,
    isStrong: pShadbala?.isStrong ?? (pStrength?.overallStrength === 'STRONG' || pStrength?.overallStrength === 'EXCELLENT'),
  };
}

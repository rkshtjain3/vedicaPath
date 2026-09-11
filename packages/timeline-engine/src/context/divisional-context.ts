export interface ExtractedDivisionalContext {
  d9Sign?: string;
  d9House?: number;
  d10Sign?: string;
  d10House?: number;
  isVargottama?: boolean;
}

export function extractDivisionalContext(
  planetName: string,
  engineData: any
): ExtractedDivisionalContext {
  const divData = engineData.divisionalCharts || {};
  const vargaData = engineData.vargaComparison || {};

  const d9Planet = divData.d9Chart?.planets?.find?.(
    (p: any) => p.planet?.toLowerCase() === planetName.toLowerCase()
  );
  const d10Planet = divData.d10Chart?.planets?.find?.(
    (p: any) => p.planet?.toLowerCase() === planetName.toLowerCase()
  );

  const vargottamaItem = vargaData.items?.find?.(
    (v: any) => v.entity?.toLowerCase() === planetName.toLowerCase()
  );

  return {
    d9Sign: d9Planet?.sign,
    d9House: d9Planet?.house,
    d10Sign: d10Planet?.sign,
    d10House: d10Planet?.house,
    isVargottama: Boolean(vargottamaItem?.isVargottama),
  };
}

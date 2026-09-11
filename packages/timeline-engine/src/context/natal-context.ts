export interface ExtractedNatalContext {
  sign?: string;
  house?: number;
  dignity?: string;
  isRetrograde?: boolean;
  isCombust?: boolean;
  ownedHouses?: number[];
}

export function extractNatalContext(
  planetName: string,
  engineData: any
): ExtractedNatalContext {
  const ast = engineData.astrology || engineData;
  const analysis = engineData.analysis || {};

  const pData = ast.planets?.find?.(
    (p: any) => p.planet?.toLowerCase() === planetName.toLowerCase()
  );

  const ownedHouses: number[] = [];
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

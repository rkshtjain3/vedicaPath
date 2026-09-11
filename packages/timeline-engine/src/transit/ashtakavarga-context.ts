export function extractAshtakavargaTransitContext(engineData: any): string {
  const savMap = engineData.ashtakavarga?.sav || {};
  const total = Object.values(savMap).reduce((acc: number, val: any) => acc + Number(val || 0), 0);
  const avg = total > 0 ? (total / 12).toFixed(1) : '28.0';

  return `Ashtakavarga SAV points evaluated across transit houses. Average SAV per house: ${avg}.`;
}

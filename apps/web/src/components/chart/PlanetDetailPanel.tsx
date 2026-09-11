import React from 'react';
import { ChartPlanet, getPlanetaryAspects } from '@vedica/chart-renderer';
import { X, Sparkles, Eye, Compass, ShieldCheck, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export interface PlanetDetailPanelProps {
  planet: ChartPlanet | null;
  calculationResult?: any;
  onClose: () => void;
}

export const PlanetDetailPanel: React.FC<PlanetDetailPanelProps> = ({
  planet,
  calculationResult,
  onClose,
}) => {
  const { language } = useI18n();
  if (!planet) return null;

  const data = calculationResult?.data || calculationResult;

  // Retrieve cross-engine factual evidence for this planet
  const vargaItem = data?.vargaComparison?.items?.find(
    (i: any) => String(i.entity).toLowerCase() === planet.planet.toLowerCase()
  );

  const strengthItem = data?.strengthAnalysis?.planets?.find(
    (s: any) => String(s.planet).toLowerCase() === planet.planet.toLowerCase()
  );

  const shadbalaItem = data?.shadbala?.planets?.find(
    (s: any) => String(s.planet).toLowerCase() === planet.planet.toLowerCase()
  );

  const d9SignName = vargaItem?.d9Sign?.name || planet.d9Sign || '-';
  const isVargottama = vargaItem?.isVargottama ?? planet.isVargottama ?? false;
  const strengthClass = strengthItem?.overallStrength || planet.dignity || 'Neutral';
  const totalShadbala = shadbalaItem?.totalVirupas
    ? `${Math.round(shadbalaItem.totalVirupas)} Virupas`
    : undefined;

  // Calculate Parashari Aspects Cast
  const rawPlanet = planet.planet.replace(/^T-/, '');
  const aspectsCast = getPlanetaryAspects(rawPlanet, planet.house);

  // Calculate Aspects Received by this planet's house from other planets
  const allPlanets: ChartPlanet[] = data?.astrology?.planets || [];
  const aspectsReceived: { fromPlanet: string; fromHouse: number; label: string; special: boolean }[] = [];

  for (const other of allPlanets) {
    if (other.planet.toLowerCase() === rawPlanet.toLowerCase()) continue;
    const otherHouse = other.house || 1;
    const otherAspects = getPlanetaryAspects(other.planet, otherHouse);
    const hitsThis = otherAspects.find((a) => a.targetHouse === planet.house);
    if (hitsThis) {
      aspectsReceived.push({
        fromPlanet: other.planet,
        fromHouse: otherHouse,
        label: hitsThis.label,
        special: !!hitsThis.specialAspect,
      });
    }
  }

  return (
    <div className="bg-slate-900/90 backdrop-blur border border-indigo-500/30 rounded-2xl p-5 shadow-2xl space-y-4 text-slate-100 relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center font-mono font-bold text-indigo-300 text-lg">
            {planet.abbreviation}
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              {planet.planet}
              {planet.retrograde && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {language === 'hi' ? 'वक्री (R)' : 'Retrograde (R)'}
                </span>
              )}
              {planet.combust && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {language === 'hi' ? 'अस्त (Combust)' : 'Combust'}
                </span>
              )}
              {planet.isTransit && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {language === 'hi' ? 'गोचर' : 'Transit'}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {language === 'hi' ? 'प्रामाणिक खगोलीय स्थिति' : 'Factual Placement Details (Deterministic)'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          aria-label="Close planet detail panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Facts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-500 font-mono uppercase block">
            {language === 'hi' ? 'राशि एवं भाव' : 'D1 Sign & House'}
          </span>
          <span className="text-sm font-bold text-indigo-300 font-mono">
            {planet.sign} (H{planet.house})
          </span>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-500 font-mono uppercase block">
            {language === 'hi' ? 'भोगांश' : 'Longitude'}
          </span>
          <span className="text-sm font-bold text-slate-200 font-mono">
            {planet.formattedDegree || `${planet.longitude?.toFixed(2)}°`}
          </span>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-500 font-mono uppercase block">
            {language === 'hi' ? 'नक्षत्र व पद' : 'Nakshatra & Pada'}
          </span>
          <span className="text-sm font-bold text-amber-300 font-mono">
            {planet.nakshatra ? `${planet.nakshatra.name} (P${planet.nakshatra.pada})` : '-'}
          </span>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-500 font-mono uppercase block">
            {language === 'hi' ? 'डी९ नवांश राशि' : 'D9 Navamsa Sign'}
          </span>
          <span className="text-sm font-bold text-purple-300 font-mono">{d9SignName}</span>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-500 font-mono uppercase block">
            {language === 'hi' ? 'वर्गोत्तम' : 'Vargottama'}
          </span>
          <span className={`text-sm font-bold font-mono ${isVargottama ? 'text-emerald-400' : 'text-slate-400'}`}>
            {isVargottama ? (language === 'hi' ? 'हाँ (उच्च स्थिरता)' : 'Yes (High Stability)') : (language === 'hi' ? 'नहीं' : 'No')}
          </span>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-500 font-mono uppercase block">
            {language === 'hi' ? 'बल / षड्बल' : 'Dignity / Shadbala'}
          </span>
          <span className="text-sm font-bold text-emerald-300 font-mono">
            {strengthClass} {totalShadbala ? `(${totalShadbala})` : ''}
          </span>
        </div>
      </div>

      {/* Aspects Cast (Graha Drishti) Section */}
      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 font-mono">
          <ArrowUpRight className="w-4 h-4 text-cyan-400" />
          <span>{language === 'hi' ? 'प्रसारित दृष्टि (Aspects Cast)' : 'Classical Aspects Cast (Graha Drishti)'}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {aspectsCast.map((a, idx) => (
            <span
              key={idx}
              className={`text-xs font-mono px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                a.specialAspect
                  ? 'bg-amber-950/50 text-amber-300 border-amber-500/40'
                  : 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30'
              }`}
            >
              <span className="font-bold">House {a.targetHouse}</span>
              <span className="text-[10px] opacity-80">({a.label.split('(')[0].trim()})</span>
            </span>
          ))}
        </div>
      </div>

      {/* Aspects Received Section */}
      {aspectsReceived.length > 0 && (
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 font-mono">
            <ArrowDownLeft className="w-4 h-4 text-indigo-400" />
            <span>{language === 'hi' ? 'प्राप्त दृष्टि (Aspects Received)' : 'Aspects Received on House ' + planet.house}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {aspectsReceived.map((r, idx) => (
              <span
                key={idx}
                className="text-xs font-mono px-2.5 py-1 rounded-lg border bg-indigo-950/40 text-indigo-300 border-indigo-500/30 flex items-center gap-1.5"
              >
                <span className="font-bold">{r.fromPlanet} (H{r.fromHouse})</span>
                <span className="text-[10px] opacity-80">[{r.label.split('(')[0].trim()}]</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Explanation Banner */}
      {vargaItem?.explanation && (
        <div className="bg-indigo-950/40 border border-indigo-500/20 p-3 rounded-xl text-xs text-indigo-200/90 font-mono flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>{vargaItem.explanation}</span>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { ChartHouse, ChartPlanet } from '@vedica/chart-renderer';
import { X, Home, Users, ArrowRight, ShieldAlert } from 'lucide-react';

export interface HouseDetailPanelProps {
  house: ChartHouse | null;
  calculationResult?: any;
  onSelectPlanet?: (planet: ChartPlanet) => void;
  onClose: () => void;
}

export const HouseDetailPanel: React.FC<HouseDetailPanelProps> = ({
  house,
  calculationResult,
  onSelectPlanet,
  onClose,
}) => {
  if (!house) return null;

  const data = calculationResult?.data || calculationResult;
  const isLagna = house.house === 1;

  // Retrieve cross-chart facts for this house if available
  const careerCross = data?.crossChartAnalysis?.career;
  let crossChartFact: string | null = null;
  if (house.house === 10 && careerCross?.d1TenthHouse) {
    crossChartFact = `10th House (Career & Karma): Sign ${careerCross.d1TenthHouse.sign?.name}, Lord ${careerCross.d1TenthHouse.lord}. Occupants: ${careerCross.d1TenthHouse.occupants?.join(', ') || 'None'}.`;
  }

  // Related evidence rules matching this house
  const rulesList: any[] = data?.rules?.triggeredRules || [];
  const relatedRules = rulesList.filter((r) => r.house === house.house || r.targetHouse === house.house);

  return (
    <div className="bg-slate-900/90 backdrop-blur border border-indigo-500/30 rounded-2xl p-5 shadow-2xl space-y-4 text-slate-100 relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center font-mono font-bold text-indigo-300 text-lg">
            H{house.house}
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              House {house.house} — {house.sign}
              {isLagna && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Ascendant (Lagna)
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Sign Lord: <strong className="text-amber-300">{house.lord}</strong>
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          aria-label="Close house detail panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Occupants List */}
      <div>
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          Occupying Planets ({house.planets.length})
        </h4>
        {house.planets.length === 0 ? (
          <p className="text-xs font-mono text-slate-500 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            No planets occupy House {house.house} in this chart.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {house.planets.map((p) => (
              <button
                key={p.planet}
                onClick={() => onSelectPlanet?.(p)}
                className="bg-slate-950/80 hover:bg-indigo-950/80 p-3 rounded-xl border border-slate-800 hover:border-indigo-500/50 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-indigo-300 group-hover:text-white font-mono">
                    {p.planet}
                  </span>
                  <span className="text-xs font-mono text-slate-500 group-hover:text-indigo-400">
                    {p.abbreviation}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  {p.formattedDegree || `${p.longitude?.toFixed(1)}°`}
                  {p.retrograde ? ' (R)' : ''}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cross-Chart Evidence Banner */}
      {crossChartFact && (
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
          <strong className="text-amber-400 block mb-1">D10 Dashamsa Cross-Chart Fact:</strong>
          {crossChartFact}
        </div>
      )}

      {/* Supporting Evidence Rules */}
      {relatedRules.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Supporting Evidence Rules ({relatedRules.length})
          </h4>
          <div className="space-y-1.5">
            {relatedRules.slice(0, 3).map((r: any, idx: number) => (
              <div
                key={`rule-${idx}`}
                className="bg-indigo-950/30 border border-indigo-500/20 p-2.5 rounded-lg text-xs font-mono text-indigo-200/90 flex items-center justify-between"
              >
                <span>{r.name || r.id || 'Evidence Rule'}</span>
                <span className="text-[10px] text-indigo-400 bg-indigo-900/50 px-2 py-0.5 rounded">
                  {r.category || 'Rule'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

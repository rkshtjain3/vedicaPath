import React from 'react';
import { ChartViewModel, ChartHouse, ChartPlanet } from '../types/chart-renderer-types.js';

export interface AccessibilityTableProps {
  viewModel: ChartViewModel;
  onSelectPlanet?: (planet: ChartPlanet) => void;
  onSelectHouse?: (house: ChartHouse) => void;
  className?: string;
}

export const AccessibilityTable: React.FC<AccessibilityTableProps> = ({
  viewModel,
  onSelectPlanet,
  onSelectHouse,
  className = '',
}) => {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
          Accessible Tabular Representation — {viewModel.title}
        </h4>
        <span className="text-[11px] font-mono text-indigo-400">
          Ascendant: <strong>{viewModel.ascendantSign}</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse" aria-label={`House and Planet Summary for ${viewModel.title}`}>
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-slate-950">
              <th className="p-2">House</th>
              <th className="p-2">Sign</th>
              <th className="p-2">House Lord</th>
              <th className="p-2">Occupant Planets</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {viewModel.houses.map((house) => {
              const isLagna = house.house === 1;

              return (
                <tr
                  key={`acc-house-${house.house}`}
                  className="hover:bg-slate-800/40 cursor-pointer"
                  onClick={() => onSelectHouse?.(house)}
                >
                  <td className="p-2 font-bold text-slate-200">
                    House {house.house} {isLagna && <span className="text-amber-400 font-bold ml-1">(Lagna)</span>}
                  </td>
                  <td className="p-2 text-indigo-300">
                    {house.sign} ({house.signId})
                  </td>
                  <td className="p-2 text-slate-400">{house.lord || '-'}</td>
                  <td className="p-2">
                    {house.planets.length === 0 ? (
                      <span className="text-slate-600">None</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {house.planets.map((p) => (
                          <button
                            key={p.planet}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPlanet?.(p);
                            }}
                            className="bg-slate-800 hover:bg-indigo-900/80 text-slate-200 px-2 py-0.5 rounded border border-slate-700 hover:border-indigo-500 text-[11px] font-bold transition-colors"
                          >
                            {p.planet} ({p.abbreviation}){p.retrograde ? ' (R)' : ''}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

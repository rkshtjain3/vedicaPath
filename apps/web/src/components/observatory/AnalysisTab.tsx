'use client';

import React, { useState } from 'react';
import { Check, ChevronDown, ChevronRight, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export interface AnalysisTabProps {
  analysisData: any;
}

export const AnalysisTab: React.FC<AnalysisTabProps> = ({ analysisData }) => {
  const { language } = useI18n();
  const [analysisSubTab, setAnalysisSubTab] = useState<'overview' | 'planets' | 'houses' | 'aspects' | 'dignities' | 'yogas'>('overview');
  const [expandedYoga, setExpandedYoga] = useState<string | null>(null);

  if (!analysisData) return null;

  return (
    <div id="analysis-content" className="space-y-6">
      {/* Profile Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div>
          <span className="text-slate-400">Analysis Profile: </span>
          <span className="font-bold text-amber-400">{analysisData.analysisProfileVersion}</span>
          <span className="text-slate-500 ml-2">(Calculation: {analysisData.calculationProfileVersion})</span>
        </div>
        <div className="flex flex-wrap gap-2 font-mono">
          <button
            id="subtab-overview"
            onClick={() => setAnalysisSubTab('overview')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              analysisSubTab === 'overview' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Overview
          </button>
          <button
            id="subtab-planets"
            onClick={() => setAnalysisSubTab('planets')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              analysisSubTab === 'planets' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Planets
          </button>
          <button
            id="subtab-houses"
            onClick={() => setAnalysisSubTab('houses')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              analysisSubTab === 'houses' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Houses & Lords
          </button>
          <button
            id="subtab-aspects"
            onClick={() => setAnalysisSubTab('aspects')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              analysisSubTab === 'aspects' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Aspects & Conjunctions
          </button>
          <button
            id="subtab-dignities"
            onClick={() => setAnalysisSubTab('dignities')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              analysisSubTab === 'dignities' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Dignities & Combustion
          </button>
          <button
            id="subtab-yogas"
            onClick={() => setAnalysisSubTab('yogas')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              analysisSubTab === 'yogas' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Yogas ({analysisData.yogas?.filter((y: any) => y.detected).length ?? 0} Detected)
          </button>
        </div>
      </div>

      {/* SubTab 1: Overview */}
      {analysisSubTab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
            <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Occupied Houses</span>
            <p className="text-2xl font-bold text-slate-100">{analysisData.houseFacts?.filter((h: any) => h.occupied).length ?? 0} / 12</p>
            <p className="text-xs text-slate-400">Houses with graha occupants</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
            <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Combust Grahas</span>
            <p className="text-2xl font-bold text-slate-100">{analysisData.combustion?.filter((c: any) => c.isCombust).length ?? 0}</p>
            <p className="text-xs text-amber-400">
              {analysisData.combustion?.filter((c: any) => c.isCombust).map((c: any) => c.planet).join(', ') || 'None'}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
            <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Exalted / Debilitated</span>
            <p className="text-2xl font-bold text-slate-100">
              {analysisData.dignities?.filter((d: any) => d.primaryDignity === 'EXALTED' || d.primaryDignity === 'DEBILITATED').length ?? 0}
            </p>
            <p className="text-xs text-slate-400">
              Exalted: {analysisData.dignities?.filter((d: any) => d.primaryDignity === 'EXALTED').map((d: any) => d.planet).join(', ') || 'None'}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
            <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Detected Yogas</span>
            <p className="text-2xl font-bold text-amber-400">
              {analysisData.yogas?.filter((y: any) => y.detected).length ?? 0} / {analysisData.yogas?.length ?? 0}
            </p>
            <p className="text-xs text-slate-400">Initial framework detections</p>
          </div>
        </div>
      )}

      {/* SubTab 2: Planets */}
      {analysisSubTab === 'planets' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 font-mono">
                  <th className="py-3.5 px-6">Planet</th>
                  <th className="py-3.5 px-6">Longitude</th>
                  <th className="py-3.5 px-6">Sign</th>
                  <th className="py-3.5 px-6">Degree in Sign</th>
                  <th className="py-3.5 px-6">House</th>
                  <th className="py-3.5 px-6">Nakshatra</th>
                  <th className="py-3.5 px-6">Pada</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs sm:text-sm">
                {analysisData.planetFacts?.map((pf: any) => (
                  <tr key={pf.planet} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-100">{pf.planet}</td>
                    <td className="py-3.5 px-6 text-slate-300">{pf.longitude?.toFixed(4)}°</td>
                    <td className="py-3.5 px-6 font-sans text-slate-200">{pf.sign}</td>
                    <td className="py-3.5 px-6 text-amber-400">{pf.degreeInSign?.toFixed(4)}°</td>
                    <td className="py-3.5 px-6 font-sans font-semibold text-slate-200">House {pf.house}</td>
                    <td className="py-3.5 px-6 font-sans text-slate-300">{pf.nakshatra}</td>
                    <td className="py-3.5 px-6 text-slate-300">{pf.pada}</td>
                    <td className="py-3.5 px-6 font-sans">
                      {pf.retrograde ? (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-xs">Retrograde</span>
                      ) : (
                        <span className="text-slate-500 text-xs">Direct</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 3: Houses & Lords */}
      {analysisSubTab === 'houses' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 text-xs font-bold uppercase text-amber-400 font-mono">
              12 Houses Analysis
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 font-mono">
                    <th className="py-3 px-6">House</th>
                    <th className="py-3 px-6">Sign</th>
                    <th className="py-3 px-6">House Lord</th>
                    <th className="py-3 px-6">Occupants</th>
                    <th className="py-3 px-6">Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs sm:text-sm">
                  {analysisData.houseFacts?.map((hf: any) => (
                    <tr key={hf.house} className="hover:bg-slate-800/40">
                      <td className="py-3 px-6 font-bold text-amber-400 font-sans">House {hf.house}</td>
                      <td className="py-3 px-6 font-sans text-slate-200">{hf.sign}</td>
                      <td className="py-3 px-6 font-sans text-slate-100 font-semibold">{hf.lord}</td>
                      <td className="py-3 px-6 font-sans text-slate-300">
                        {hf.planets?.length > 0 ? hf.planets.join(', ') : <span className="text-slate-600">Unoccupied</span>}
                      </td>
                      <td className="py-3 px-6 text-slate-400">{hf.occupantCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 text-xs font-bold uppercase text-amber-400 font-mono">
              12 House Lords Placement
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 font-mono">
                    <th className="py-3 px-6">House</th>
                    <th className="py-3 px-6">Lord</th>
                    <th className="py-3 px-6">Placed in House</th>
                    <th className="py-3 px-6">Placed in Sign</th>
                    <th className="py-3 px-6">Lord Dignity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs sm:text-sm">
                  {analysisData.houseLordFacts?.map((hlf: any) => (
                    <tr key={hlf.house} className="hover:bg-slate-800/40">
                      <td className="py-3 px-6 font-sans font-bold text-slate-300">House {hlf.house} Lord</td>
                      <td className="py-3 px-6 font-sans font-semibold text-amber-400">{hlf.lord}</td>
                      <td className="py-3 px-6 font-sans text-slate-100 font-bold">House {hlf.lordHouse}</td>
                      <td className="py-3 px-6 font-sans text-slate-300">{hlf.lordSign}</td>
                      <td className="py-3 px-6 font-sans">
                        <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-200 border border-slate-700 font-semibold">
                          {hlf.dignity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 4: Aspects & Conjunctions */}
      {analysisSubTab === 'aspects' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 text-xs font-bold uppercase text-amber-400 font-mono">
              Vedic Graha Aspects Matrix
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 font-mono">
                    <th className="py-3 px-6">From Graha</th>
                    <th className="py-3 px-6">From House</th>
                    <th className="py-3 px-6">Aspect Number</th>
                    <th className="py-3 px-6">Target House</th>
                    <th className="py-3 px-6">Target Occupants</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs sm:text-sm">
                  {analysisData.aspects?.map((asp: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-3 px-6 font-sans font-bold text-slate-100">{asp.fromPlanet}</td>
                      <td className="py-3 px-6 font-sans text-slate-400">House {asp.fromHouse}</td>
                      <td className="py-3 px-6 text-amber-400 font-bold">{asp.aspectNumber}th Aspect</td>
                      <td className="py-3 px-6 font-sans font-bold text-slate-200">House {asp.toHouse}</td>
                      <td className="py-3 px-6 font-sans text-slate-300">
                        {asp.targetPlanets?.length > 0 ? asp.targetPlanets.join(', ') : <span className="text-slate-600">None</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 text-xs font-bold uppercase text-amber-400 font-mono">
              Planetary Conjunctions (Orb: 8.0°)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 font-mono">
                    <th className="py-3 px-6">Pair</th>
                    <th className="py-3 px-6">Angular Diff</th>
                    <th className="py-3 px-6">Configured Orb</th>
                    <th className="py-3 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs sm:text-sm">
                  {analysisData.conjunctions?.map((conj: any, idx: number) => (
                    <tr key={idx} className={`hover:bg-slate-800/40 ${conj.detected ? 'bg-amber-500/10' : ''}`}>
                      <td className="py-3 px-6 font-sans font-bold text-slate-100">{conj.planetA} + {conj.planetB}</td>
                      <td className="py-3 px-6 text-amber-400">{conj.longitudeDifference?.toFixed(4)}°</td>
                      <td className="py-3 px-6 text-slate-400">{conj.orb}°</td>
                      <td className="py-3 px-6 font-sans">
                        {conj.detected ? (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-xs font-bold">
                            CONJUNCT
                          </span>
                        ) : (
                          <span className="text-slate-600 text-xs">Separate</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 5: Dignities & Combustion */}
      {analysisSubTab === 'dignities' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 text-xs font-bold uppercase text-amber-400 font-mono">
              Graha Dignities Breakdown
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 font-mono">
                    <th className="py-3 px-6">Planet</th>
                    <th className="py-3 px-6">Sign</th>
                    <th className="py-3 px-6">Primary Dignity</th>
                    <th className="py-3 px-6">Lord Relationship</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs sm:text-sm">
                  {analysisData.dignities?.map((dig: any) => (
                    <tr key={dig.planet} className="hover:bg-slate-800/40">
                      <td className="py-3 px-6 font-sans font-bold text-slate-100">{dig.planet}</td>
                      <td className="py-3 px-6 font-sans text-slate-300">{dig.sign}</td>
                      <td className="py-3 px-6 font-sans">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                          dig.primaryDignity === 'EXALTED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : dig.primaryDignity === 'DEBILITATED'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : dig.primaryDignity === 'OWN_SIGN' || dig.primaryDignity === 'MOOLATRIKONA'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {dig.primaryDignity}
                        </span>
                      </td>
                      <td className="py-3 px-6 font-sans text-slate-400">{dig.relationshipToSignLord}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 text-xs font-bold uppercase text-amber-400 font-mono">
              Planetary Combustion Engine
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 font-mono">
                    <th className="py-3 px-6">Planet</th>
                    <th className="py-3 px-6">Distance from Sun</th>
                    <th className="py-3 px-6">Combustion Threshold</th>
                    <th className="py-3 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs sm:text-sm">
                  {analysisData.combustion?.map((cmb: any) => (
                    <tr key={cmb.planet} className={`hover:bg-slate-800/40 ${cmb.isCombust ? 'bg-rose-500/10' : ''}`}>
                      <td className="py-3 px-6 font-sans font-bold text-slate-100">{cmb.planet}</td>
                      <td className="py-3 px-6 text-amber-400">{cmb.distanceFromSun?.toFixed(4)}°</td>
                      <td className="py-3 px-6 text-slate-400">{cmb.combustionThreshold}°</td>
                      <td className="py-3 px-6 font-sans">
                        {cmb.isCombust ? (
                          <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded text-xs font-bold">
                            COMBUST
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">Clear</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 6: Yogas */}
      {analysisSubTab === 'yogas' && (
        <div className="space-y-4" id="yogas-list">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Classical Initial Yoga Framework ({analysisData.yogas?.length ?? 0} evaluated)
            </span>
            <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
              {analysisData.yogas?.filter((y: any) => y.detected).length ?? 0} Detected
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {analysisData.yogas?.map((yoga: any) => {
              const isExpanded = expandedYoga === yoga.id;

              return (
                <div
                  key={yoga.id}
                  className={`bg-slate-900 border rounded-2xl overflow-hidden shadow-xl transition-colors ${
                    yoga.detected ? 'border-amber-500/40 bg-slate-900/90' : 'border-slate-800 opacity-80'
                  }`}
                >
                  <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-100 text-base flex items-center gap-2">
                        {yoga.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">ID: {yoga.id}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {yoga.detected ? (
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" /> DETECTED
                        </span>
                      ) : (
                        <span className="bg-slate-800 text-slate-400 border border-slate-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                          <X className="w-3.5 h-3.5" /> NOT DETECTED
                        </span>
                      )}

                      <button
                        onClick={() => setExpandedYoga(isExpanded ? null : yoga.id)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        [ Why? ] {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-6 bg-slate-950/80 space-y-3 font-mono text-xs border-t border-slate-800/60">
                      <span className="text-slate-400 uppercase text-[11px] font-sans font-bold tracking-wider">
                        Evaluated Conditions Breakdown:
                      </span>
                      <div className="space-y-2">
                        {yoga.conditions?.map((cond: any) => (
                          <div
                            key={cond.id}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                              cond.result
                                ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <p className="font-bold text-slate-200 text-xs">{cond.description}</p>
                              <p className="text-[10px] text-slate-500">Condition ID: {cond.id}</p>
                            </div>
                            <span className="shrink-0 font-bold">
                              {cond.result ? (
                                <span className="text-emerald-400 flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                                  <Check className="w-3 h-3" /> PASS
                                </span>
                              ) : (
                                <span className="text-rose-400 flex items-center gap-1 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                                  <X className="w-3 h-3" /> FAIL
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

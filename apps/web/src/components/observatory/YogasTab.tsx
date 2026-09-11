'use client';

import React, { useState } from 'react';
import { Sparkles, Info, ChevronDown, ChevronRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export interface YogasTabProps {
  yogaData: any;
  analysisData?: any;
}

export const YogasTab: React.FC<YogasTabProps> = ({ yogaData, analysisData }) => {
  const { language } = useI18n();
  const [yogaCategoryFilter, setYogaCategoryFilter] = useState<'ALL' | 'MAHAPURUSHA' | 'RAJA' | 'DHANA' | 'LUNAR' | 'SPECIAL'>('ALL');
  const [expandedYogaCardId, setExpandedYogaCardId] = useState<string | null>(null);

  if (!yogaData && !analysisData) return null;

  return (
    <div id="yogas-content" className="space-y-8">
      {/* YOGA ENGINE SUMMARY HEADER */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Classical Yoga Engine
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {yogaData?.profileVersion || 'personal-yoga-v1'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Deterministic evaluation of 24 canonical Vedic Yogas with condition-level evidence graph breakdowns.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Detected: {yogaData?.detectedCount ?? 0}</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 text-slate-400 px-3 py-1.5 rounded-xl font-semibold">
              <span>Not Detected: {yogaData?.notDetectedCount ?? 0}</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 text-slate-400 px-3 py-1.5 rounded-xl font-semibold">
              <span>Total: {yogaData?.totalEvaluated ?? 24}</span>
            </div>
          </div>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="flex flex-wrap items-center gap-2 pt-1" id="yoga-category-filters">
          {(['ALL', 'MAHAPURUSHA', 'RAJA', 'DHANA', 'LUNAR', 'SPECIAL'] as const).map((cat) => {
            const count = cat === 'ALL'
              ? (yogaData?.results?.length ?? 0)
              : (yogaData?.results?.filter((r: any) => r.category === cat).length ?? 0);
            return (
              <button
                key={cat}
                id={`yoga-filter-${cat.toLowerCase()}`}
                onClick={() => setYogaCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  yogaCategoryFilter === cat
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span>{cat === 'ALL' ? 'All Categories' : cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  yogaCategoryFilter === cat ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* YOGAS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="yogas-grid-container">
        {(yogaData?.results || []).filter((y: any) =>
          yogaCategoryFilter === 'ALL' ? true : y.category === yogaCategoryFilter
        ).map((yoga: any) => {
          const isExpanded = expandedYogaCardId === yoga.id;
          const isDetected = yoga.status === 'DETECTED';

          return (
            <div
              key={yoga.id}
              id={`yoga-card-${yoga.id}`}
              className={`bg-slate-900 border rounded-2xl p-6 space-y-4 shadow-xl transition-all ${
                isDetected
                  ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-slate-900'
                  : 'border-slate-800/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      yoga.category === 'MAHAPURUSHA' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      yoga.category === 'RAJA' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      yoga.category === 'DHANA' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      yoga.category === 'LUNAR' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {yoga.category}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-950 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded">
                      {yoga.chartScope || 'D1'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100">{yoga.name}</h3>
                </div>

                <div className="shrink-0">
                  {isDetected ? (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-3 py-1 rounded-full font-bold font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      DETECTED
                    </span>
                  ) : (
                    <span className="bg-slate-950 text-slate-400 border border-slate-800 text-xs px-3 py-1 rounded-full font-mono">
                      NOT DETECTED
                    </span>
                  )}
                </div>
              </div>

              {yoga.notes && yoga.notes.length > 0 && (
                <p className="text-xs text-slate-400 line-clamp-2">
                  {yoga.notes.join(' ')}
                </p>
              )}

              {/* WHY? EVIDENCE BREAKDOWN BUTTON */}
              <div className="pt-2">
                <button
                  type="button"
                  id={`yoga-why-${yoga.id}`}
                  onClick={() => setExpandedYogaCardId(isExpanded ? null : yoga.id)}
                  className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl py-2 px-3 text-xs font-semibold text-amber-400 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-400" />
                    Why? View Condition & Evidence Breakdown
                  </span>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-amber-400" /> : <ChevronRight className="w-4 h-4 text-amber-400" />}
                </button>

                {/* EXPANDED EVIDENCE GRAPH BREAKDOWN PANEL */}
                {isExpanded && (
                  <div className="mt-3 p-4 bg-slate-950 rounded-xl border border-slate-800/90 space-y-4 text-xs">
                    {/* CONDITIONS LIST */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                        Evaluation Conditions ({yoga.conditions?.length || 0})
                      </span>
                      <div className="space-y-2">
                        {yoga.conditions?.map((cond: any) => (
                          <div
                            key={cond.id}
                            className={`p-3 rounded-lg border font-mono space-y-1 ${
                              cond.passed
                                ? 'bg-emerald-950/30 border-emerald-500/30 text-slate-200'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-200">{cond.id}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                cond.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-400'
                              }`}>
                                {cond.passed ? 'PASS' : 'FAIL'}
                              </span>
                            </div>
                            <p className="text-[11px] font-sans text-slate-300">{cond.description}</p>
                            {cond.actualValue && (
                              <div className="text-[10px] text-amber-300/90 pt-1 border-t border-slate-800/60">
                                Details: {String(cond.actualValue)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* EVIDENCE GRAPH DETAILS */}
                    {yoga.evidence && yoga.evidence.length > 0 && (
                      <div className="space-y-2 border-t border-slate-800 pt-3">
                        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                          Evidence Graph Breakdown ({yoga.evidence.length})
                        </span>
                        <div className="space-y-1.5">
                          {yoga.evidence.map((ev: any, idx: number) => (
                            <div key={idx} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-300 font-mono text-[11px] space-y-1">
                              <div className="flex items-center gap-2 text-amber-300 font-bold">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Type: {ev.type}</span>
                                {ev.planet && <span>| Planet: {ev.planet}</span>}
                                {ev.targetPlanet && <span>| Target: {ev.targetPlanet}</span>}
                              </div>
                              {ev.details && ev.details.map((d: string, dIdx: number) => (
                                <div key={dIdx} className="text-slate-400 text-[10px] pl-5">
                                  • {d}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

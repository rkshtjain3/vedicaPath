'use client';

import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export interface RulesTabProps {
  rulesData: any;
  careerD10Data?: any;
}

export const RulesTab: React.FC<RulesTabProps> = ({ rulesData, careerD10Data }) => {
  const { language } = useI18n();
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [expandedD10Rule, setExpandedD10Rule] = useState<string | null>(null);

  if (!rulesData) return null;

  return (
    <div id="rules-content" className="space-y-8">
      {/* Engine Header Metadata */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Deterministic Life Analysis</h2>
              <p className="text-xs text-slate-400">
                Explainable Indications & Domain Scores • Zero LLM / Zero Generic Horoscope
              </p>
            </div>
          </div>

          <div className="flex gap-2 font-mono text-[11px]">
            <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-400 rounded-md">
              Rules: {rulesData.rulesProfileVersion}
            </span>
            <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-400 rounded-md">
              Calc: {rulesData.calculationProfileVersion}
            </span>
            <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-400 rounded-md">
              Analysis: {rulesData.analysisProfileVersion}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          This rules engine evaluates planetary placements, dignities, house lordships, aspects, and active Vimshottari Dashas against deterministic rules. Numerical dimension scores determine rating levels (<span className="text-slate-300 font-semibold">LOW</span>, <span className="text-amber-400 font-semibold">MODERATE</span>, <span className="text-emerald-400 font-semibold">HIGH</span>) with 100% machine-readable chart evidence.
        </p>
      </div>

      {/* 4 Domains Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(rulesData.domains || {}).map(([domainKey, domainRes]: [string, any]) => {
          const isExpanded = expandedDomain === domainKey;

          const domainTitles: Record<string, string> = {
            CAREER: 'Career & Vocation',
            WEALTH: 'Wealth & Financial Assets',
            RELATIONSHIPS: 'Relationships & Marriage',
            PROPERTY: 'Property & Fixed Assets',
          };

          const domainColors: Record<string, string> = {
            CAREER: 'border-blue-500/30 bg-blue-950/10',
            WEALTH: 'border-emerald-500/30 bg-emerald-950/10',
            RELATIONSHIPS: 'border-rose-500/30 bg-rose-950/10',
            PROPERTY: 'border-amber-500/30 bg-amber-950/10',
          };

          return (
            <div
              key={domainKey}
              className={`bg-slate-900 border rounded-2xl p-6 shadow-xl space-y-5 transition-all ${
                domainColors[domainKey] || 'border-slate-800'
              }`}
              id={`domain-card-${domainKey.toLowerCase()}`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                    DOMAIN ANALYSIS
                  </span>
                  <h3 className="text-xl font-bold text-slate-100">{domainTitles[domainKey] || domainKey}</h3>
                </div>

                <button
                  onClick={() => setExpandedDomain(isExpanded ? null : domainKey)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700/60"
                  id={`why-btn-${domainKey.toLowerCase()}`}
                >
                  [ WHY? ] {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Dimension Ratings */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dimension Ratings</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(domainRes.dimensionRatings || {}).map(([dim, rating]: [string, any]) => {
                    const ratingBadges: Record<string, string> = {
                      HIGH: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                      MODERATE: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                      LOW: 'bg-slate-800 text-slate-400 border-slate-700',
                    };

                    return (
                      <div
                        key={dim}
                        className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs"
                      >
                        <span className="text-slate-300 font-medium">{dim}:</span>
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[11px] border ${
                            ratingBadges[rating] || 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {rating}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Expandable Rule Evidence Breakdown */}
              {isExpanded && (
                <div className="pt-4 border-t border-slate-800 space-y-4 font-mono text-xs">
                  <p className="text-xs font-bold font-sans text-amber-400 uppercase tracking-wider">
                    Evaluated Astrological Rules Evidence
                  </p>

                  <div className="space-y-3">
                    {domainRes.evaluations?.map((ev: any) => (
                      <div
                        key={ev.ruleId}
                        className={`p-4 rounded-xl border space-y-2 ${
                          ev.triggered
                            ? 'bg-slate-950 border-emerald-500/30 text-emerald-200'
                            : 'bg-slate-950/50 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-400 font-sans text-xs">{ev.ruleId}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                ev.triggered
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-500 border border-slate-700'
                              }`}
                            >
                              {ev.triggered ? 'TRIGGERED' : 'NOT TRIGGERED'}
                            </span>
                          </div>

                          {ev.effects && ev.effects.length > 0 && (
                            <div className="flex gap-1.5">
                              {ev.effects.map((ef: any, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-[10px] font-bold"
                                >
                                  {ef.dimension} {ef.value > 0 ? `+${ef.value}` : ef.value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Evidence List */}
                        <div className="space-y-1 pt-1">
                          {ev.evidence?.map((evi: any, eIdx: number) => (
                            <div key={eIdx} className="text-[11px] text-slate-300 flex items-start gap-2">
                              <span className="text-amber-500 shrink-0">•</span>
                              <span>
                                {evi.details || `${evi.type}: ${JSON.stringify(evi)}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* D10 Career Evidence — Separate from D1 Career Analysis */}
      {careerD10Data && (
        <div id="d10-career-evidence-section" className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl space-y-6" style={{ background: 'linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(30,27,75,0.15) 100%)' }}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                D10 DASHAMSA CAREER EVIDENCE
              </span>
              <h3 className="text-xl font-bold text-slate-100">D10 Career Chart Analysis</h3>
              <p className="text-xs text-slate-400 mt-1">
                Separate evidence layer from D10 Dashamsa — does not modify primary D1 career score or rating.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-full text-xs font-mono">
                {careerD10Data.profileVersion}
              </span>
              {careerD10Data.mixedSignals && (
                <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-full text-xs font-bold animate-pulse">
                  ⚡ MIXED SIGNALS
                </span>
              )}
            </div>
          </div>

          {/* Evidence Summary Counts */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-emerald-400">{careerD10Data.supportiveEvidence?.length || 0}</div>
              <div className="text-[10px] font-bold text-emerald-300/60 uppercase tracking-wider">Supportive</div>
            </div>
            <div className="bg-slate-950/40 border border-slate-700 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-slate-400">{careerD10Data.neutralEvidence?.length || 0}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Neutral</div>
            </div>
            <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-red-400">{careerD10Data.challengingEvidence?.length || 0}</div>
              <div className="text-[10px] font-bold text-red-300/60 uppercase tracking-wider">Challenging</div>
            </div>
          </div>

          {/* D10 Summary Facts */}
          {careerD10Data.summaryFacts && (
            <div className="space-y-4">
              {/* D10 10th Lord Card */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">D10 10th Lord</span>
                  {careerD10Data.rules?.find((r: any) => r.ruleId === 'D10-CAREER-001')?.evidence?.[0]?.effectClassification && (
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                      careerD10Data.rules.find((r: any) => r.ruleId === 'D10-CAREER-001')?.evidence?.[0]?.effectClassification === 'SUPPORTIVE'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : careerD10Data.rules.find((r: any) => r.ruleId === 'D10-CAREER-001')?.evidence?.[0]?.effectClassification === 'CHALLENGING'
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {careerD10Data.rules.find((r: any) => r.ruleId === 'D10-CAREER-001')?.evidence?.[0]?.effectClassification}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs font-mono">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center">
                    <div className="text-[9px] text-slate-500 uppercase font-sans">Planet</div>
                    <div className="text-slate-200 font-bold">{careerD10Data.summaryFacts.d10TenthLord}</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center">
                    <div className="text-[9px] text-slate-500 uppercase font-sans">Sign</div>
                    <div className="text-slate-200 font-bold">{careerD10Data.summaryFacts.d10TenthSign}</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center">
                    <div className="text-[9px] text-slate-500 uppercase font-sans">House</div>
                    <div className="text-slate-200 font-bold">{careerD10Data.summaryFacts.d10TenthLordHouse}</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center">
                    <div className="text-[9px] text-slate-500 uppercase font-sans">Dignity</div>
                    <div className="text-slate-200 font-bold">{careerD10Data.summaryFacts.d10TenthLordDignity?.replace(/_/g, ' ')}</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center">
                    <div className="text-[9px] text-slate-500 uppercase font-sans">Category</div>
                    <div className="text-slate-200 font-bold">{careerD10Data.summaryFacts.d10TenthLordHouseCategory}</div>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedD10Rule(expandedD10Rule === 'D10-CAREER-001' ? null : 'D10-CAREER-001')}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-700/60"
                  id="why-btn-d10-001"
                >
                  [ WHY? ] {expandedD10Rule === 'D10-CAREER-001' ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
                {expandedD10Rule === 'D10-CAREER-001' && (
                  <div className="pt-2 border-t border-slate-800 space-y-1 font-mono text-[11px]" id="why-evidence-d10-001">
                    {careerD10Data.rules?.find((r: any) => r.ruleId === 'D10-CAREER-001')?.evidence?.[0]?.whyEvidence?.map((line: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-slate-300">
                        <span className="text-amber-500 shrink-0">•</span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* D10 Lagna Lord Card */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">D10 Lagna Lord</span>
                  {careerD10Data.rules?.find((r: any) => r.ruleId === 'D10-CAREER-003')?.evidence?.[0]?.effectClassification && (
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                      careerD10Data.rules.find((r: any) => r.ruleId === 'D10-CAREER-003')?.evidence?.[0]?.effectClassification === 'SUPPORTIVE'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : careerD10Data.rules.find((r: any) => r.ruleId === 'D10-CAREER-003')?.evidence?.[0]?.effectClassification === 'CHALLENGING'
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {careerD10Data.rules.find((r: any) => r.ruleId === 'D10-CAREER-003')?.evidence?.[0]?.effectClassification}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs font-mono">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center">
                    <div className="text-[9px] text-slate-500 uppercase font-sans">Planet</div>
                    <div className="text-slate-200 font-bold">{careerD10Data.summaryFacts.d10LagnaLord}</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center">
                    <div className="text-[9px] text-slate-500 uppercase font-sans">D10 Lagna</div>
                    <div className="text-slate-200 font-bold">{careerD10Data.summaryFacts.d10LagnaSign}</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center">
                    <div className="text-[9px] text-slate-500 uppercase font-sans">House</div>
                    <div className="text-slate-200 font-bold">{careerD10Data.summaryFacts.d10LagnaLordHouse}</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center">
                    <div className="text-[9px] text-slate-500 uppercase font-sans">Dignity</div>
                    <div className="text-slate-200 font-bold">{careerD10Data.summaryFacts.d10LagnaLordDignity?.replace(/_/g, ' ')}</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center">
                    <div className="text-[9px] text-slate-500 uppercase font-sans">Category</div>
                    <div className="text-slate-200 font-bold">{careerD10Data.summaryFacts.d10LagnaLordHouseCategory}</div>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedD10Rule(expandedD10Rule === 'D10-CAREER-003' ? null : 'D10-CAREER-003')}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-700/60"
                  id="why-btn-d10-003"
                >
                  [ WHY? ] {expandedD10Rule === 'D10-CAREER-003' ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
                {expandedD10Rule === 'D10-CAREER-003' && (
                  <div className="pt-2 border-t border-slate-800 space-y-1 font-mono text-[11px]" id="why-evidence-d10-003">
                    {careerD10Data.rules?.find((r: any) => r.ruleId === 'D10-CAREER-003')?.evidence?.[0]?.whyEvidence?.map((line: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-slate-300">
                        <span className="text-amber-500 shrink-0">•</span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Career Karakas */}
              {careerD10Data.summaryFacts.karakas && careerD10Data.summaryFacts.karakas.length > 0 && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Career Karakas in D10</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {careerD10Data.summaryFacts.karakas.map((k: any) => {
                      const karakaEv = careerD10Data.rules?.find((r: any) => r.ruleId === 'D10-CAREER-004')?.evidence?.find((e: any) => e.planet === k.planet);
                      return (
                        <div key={k.planet} className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-100">{k.planet}</span>
                            {karakaEv?.effectClassification && (
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                karakaEv.effectClassification === 'SUPPORTIVE'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : karakaEv.effectClassification === 'CHALLENGING'
                                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}>
                                {karakaEv.effectClassification}
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                            <div className="text-slate-500">House: <span className="text-slate-200 font-bold">{k.d10House}</span></div>
                            <div className="text-slate-500">Sign: <span className="text-slate-200 font-bold">{k.sign}</span></div>
                            <div className="text-slate-500">Dignity: <span className="text-slate-200 font-bold">{k.dignity?.replace(/_/g, ' ')}</span></div>
                            <div className="text-slate-500">Category: <span className="text-slate-200 font-bold">{k.houseCategory}</span></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setExpandedD10Rule(expandedD10Rule === 'D10-CAREER-004' ? null : 'D10-CAREER-004')}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-700/60"
                    id="why-btn-d10-004"
                  >
                    [ WHY? ] {expandedD10Rule === 'D10-CAREER-004' ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {expandedD10Rule === 'D10-CAREER-004' && (
                    <div className="pt-2 border-t border-slate-800 space-y-2 font-mono text-[11px]" id="why-evidence-d10-004">
                      {careerD10Data.rules?.find((r: any) => r.ruleId === 'D10-CAREER-004')?.evidence?.map((ev: any, eIdx: number) => (
                        <div key={eIdx} className="space-y-1 pb-2 border-b border-slate-800/50 last:border-0">
                          <span className="text-indigo-400 font-bold text-xs">{ev.planet}</span>
                          {ev.whyEvidence?.map((line: string, i: number) => (
                            <div key={i} className="flex items-start gap-2 text-slate-300">
                              <span className="text-amber-500 shrink-0">•</span>
                              <span>{line}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* D1 ↔ D10 Career Comparison */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">D1 ↔ D10 Career Lord Comparison</span>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs font-mono">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center">
                    <div className="text-[9px] text-slate-500 uppercase font-sans">D1 10th Lord</div>
                    <div className="text-slate-200 font-bold">{careerD10Data.summaryFacts.d1TenthLord}</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center">
                    <div className="text-[9px] text-slate-500 uppercase font-sans">D10 10th Lord</div>
                    <div className="text-slate-200 font-bold">{careerD10Data.summaryFacts.d10TenthLord}</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center">
                    <div className="text-[9px] text-slate-500 uppercase font-sans">Same Planet</div>
                    <div className={`font-bold ${careerD10Data.summaryFacts.sameTenthLord ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {careerD10Data.summaryFacts.sameTenthLord ? 'YES' : 'NO'}
                    </div>
                  </div>
                  {(() => {
                    const ev005 = careerD10Data.rules?.find((r: any) => r.ruleId === 'D10-CAREER-005')?.evidence?.[0];
                    return (
                      <>
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center">
                          <div className="text-[9px] text-slate-500 uppercase font-sans">D1 Dignity</div>
                          <div className="text-slate-200 font-bold">{ev005?.d1Dignity?.replace(/_/g, ' ') || 'N/A'}</div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center">
                          <div className="text-[9px] text-slate-500 uppercase font-sans">D10 Dignity</div>
                          <div className="text-slate-200 font-bold">{ev005?.d10Dignity?.replace(/_/g, ' ') || 'N/A'}</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <button
                  onClick={() => setExpandedD10Rule(expandedD10Rule === 'D10-CAREER-005' ? null : 'D10-CAREER-005')}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-700/60"
                  id="why-btn-d10-005"
                >
                  [ WHY? ] {expandedD10Rule === 'D10-CAREER-005' ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
                {expandedD10Rule === 'D10-CAREER-005' && (
                  <div className="pt-2 border-t border-slate-800 space-y-1 font-mono text-[11px]" id="why-evidence-d10-005">
                    {careerD10Data.rules?.find((r: any) => r.ruleId === 'D10-CAREER-005')?.evidence?.[0]?.whyEvidence?.map((line: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-slate-300">
                        <span className="text-amber-500 shrink-0">•</span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Non-predictive disclaimer */}
          <div className="bg-slate-950/50 border border-slate-700 rounded-xl p-3 text-[11px] text-slate-400 italic">
            D10 career-chart factors are shown as additional chart-specific evidence and are not currently combined with the primary D1 career rating.
          </div>
        </div>
      )}
    </div>
  );
};

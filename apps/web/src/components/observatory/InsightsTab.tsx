'use client';

import React, { useState } from 'react';
import { Lightbulb, Layers, ChevronDown, ChevronRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export interface InsightsTabProps {
  interpretationData: any;
}

export const InsightsTab: React.FC<InsightsTabProps> = ({ interpretationData }) => {
  const { language } = useI18n();
  const [expandedWhyDomain, setExpandedWhyDomain] = useState<string | null>(null);

  if (!interpretationData) return null;

  return (
    <div id="interpretation-content" className="space-y-8">
      {/* Header Metadata */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Deterministic Life Insights & Explanations</h2>
              <p className="text-xs text-slate-400">
                Plain-English summary derived from structured astrological rules & timing transits
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-mono">
            {interpretationData.interpretationProfileVersion || 'personal-interpretation-v1'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs font-mono pt-1 text-slate-400">
          <div>Calculation: <span className="text-slate-200">{interpretationData.calculationProfileVersion}</span></div>
          <div>Analysis: <span className="text-slate-200">{interpretationData.analysisProfileVersion}</span></div>
          <div>Rules: <span className="text-slate-200">{interpretationData.rulesProfileVersion}</span></div>
          <div>Timing: <span className="text-slate-200">{interpretationData.timingProfileVersion}</span></div>
          <div>Interpretation: <span className="text-slate-200">{interpretationData.interpretationProfileVersion}</span></div>
        </div>
      </div>

      {/* 4 Domain Cards Grid */}
      <div className="space-y-6">
        {(['CAREER', 'WEALTH', 'RELATIONSHIPS', 'PROPERTY'] as const).map((domainKey) => {
          const domData = interpretationData.domains?.[domainKey];
          if (!domData) return null;

          const isWhyExpanded = expandedWhyDomain === domainKey;
          const isHighAct = domData.overallActivity === 'HIGH';
          const isModAct = domData.overallActivity === 'MODERATE';

          const isHighConf = domData.confidence?.level === 'HIGH';
          const isMedConf = domData.confidence?.level === 'MEDIUM';

          return (
            <div
              key={domainKey}
              id={`insight-card-${domainKey.toLowerCase()}`}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5"
            >
              {/* Domain Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">{domainKey} INSIGHTS</h3>
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                      isHighAct
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isModAct
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {domData.overallActivity} ACTIVITY
                  </span>

                  {domData.mixedSignals?.mixedSignals && (
                    <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-[11px] font-semibold">
                      MIXED SIGNALS
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold ${
                      isHighConf
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        : isMedConf
                        ? 'bg-slate-800 text-slate-300 border border-slate-700'
                        : 'bg-slate-800/80 text-slate-400 border border-slate-700'
                    }`}
                    title={domData.confidence?.disclaimer}
                  >
                    Framework Confidence: {domData.confidence?.level} ({domData.confidence?.score}%)
                  </span>

                  <button
                    id={`why-insights-${domainKey.toLowerCase()}`}
                    onClick={() => setExpandedWhyDomain(isWhyExpanded ? null : domainKey)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors flex items-center gap-1 font-bold"
                  >
                    <span>[ WHY AM I SEEING THIS? ]</span>
                    {isWhyExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Plain English Summary */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 text-sm leading-relaxed">
                {domData.summary}
              </div>

              {/* Factor Lists Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Supportive Factors */}
                <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="shrink-0">✓</span> Supportive Factors ({domData.supportiveFactors?.length || 0})
                  </h4>
                  <div className="space-y-1.5">
                    {domData.supportiveFactors?.length > 0 ? (
                      domData.supportiveFactors.map((fac: any, fIdx: number) => (
                        <div key={fIdx} className="text-slate-300 flex items-start gap-2 text-[11px]">
                          <span className="text-emerald-400 shrink-0">•</span>
                          <span>{fac.title}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500 italic text-[11px]">No active supportive factors</div>
                    )}
                  </div>
                </div>

                {/* Challenging Factors */}
                <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                    <span className="shrink-0">⚠️</span> Challenging / Demand Factors ({domData.challengingFactors?.length || 0})
                  </h4>
                  <div className="space-y-1.5">
                    {domData.challengingFactors?.length > 0 ? (
                      domData.challengingFactors.map((fac: any, fIdx: number) => (
                        <div key={fIdx} className="text-slate-300 flex items-start gap-2 text-[11px]">
                          <span className="text-amber-400 shrink-0">•</span>
                          <span>{fac.title}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500 italic text-[11px]">No active challenging factors</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable Explanation Panel */}
              {isWhyExpanded && (
                <div className="pt-4 border-t border-slate-800 space-y-4 text-xs">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                    <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2 font-sans">
                      <Layers className="w-4 h-4" /> Explanation & Evidence Breakdown
                    </h4>

                    {/* Confidence Rationale */}
                    <div className="space-y-1.5">
                      <h5 className="font-semibold text-slate-300 text-xs">Confidence Model Rationale</h5>
                      <div className="space-y-1">
                        {domData.confidence?.rationale?.map((rat: string, rIdx: number) => (
                          <div key={rIdx} className="text-slate-400 flex items-start gap-2 text-[11px]">
                            <span className="text-amber-500 shrink-0">•</span>
                            <span>{rat}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-[10px] text-slate-500 italic pt-1">
                        {domData.confidence?.disclaimer}
                      </div>
                    </div>

                    {/* Triggered Rule IDs & Transits */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <h5 className="font-semibold text-slate-300 text-xs">Source Astrological Rules & Transits</h5>
                      <div className="flex flex-wrap gap-2">
                        {domData.sources?.map((src: string, sIdx: number) => (
                          <span
                            key={sIdx}
                            className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-200 font-mono text-[11px] rounded-md"
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

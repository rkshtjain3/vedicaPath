'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Grid3X3, ChevronDown, ChevronRight, Info } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export interface TimingTabProps {
  timingData: any;
  transitAshtakavargaData?: any;
}

export const TimingTab: React.FC<TimingTabProps> = ({ timingData, transitAshtakavargaData }) => {
  const { language } = useI18n();
  const [expandedTransitA8Planet, setExpandedTransitA8Planet] = useState<string | null>(null);
  const [selectedTimelineDomain, setSelectedTimelineDomain] = useState<'CAREER' | 'WEALTH' | 'RELATIONSHIPS' | 'PROPERTY'>('CAREER');
  const [expandedWindowIndex, setExpandedWindowIndex] = useState<number | null>(null);

  if (!timingData) return null;

  return (
    <div id="timing-content" className="space-y-8">
      {/* Header Metadata */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Astrology Timing & Activity Windows</h2>
              <p className="text-xs text-slate-400">
                Multi-Level Dasha Domain Activations & Planetary Transit Triggers
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-mono">
            {timingData.timingProfileVersion || 'personal-timing-v1'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono pt-1 text-slate-400">
          <div>Calculation: <span className="text-slate-200">{timingData.calculationProfileVersion}</span></div>
          <div>Analysis: <span className="text-slate-200">{timingData.analysisProfileVersion}</span></div>
          <div>Rules: <span className="text-slate-200">{timingData.rulesProfileVersion}</span></div>
          <div>Timing: <span className="text-slate-200">{timingData.timingProfileVersion}</span></div>
        </div>
      </div>

      {/* Current Status Overview */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" /> Current Domain Activity Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['CAREER', 'WEALTH', 'RELATIONSHIPS', 'PROPERTY'].map((domKey) => {
            const domStatus = timingData.currentStatus?.[domKey];
            if (!domStatus) return null;
            const isHigh = domStatus.combinedActivity === 'HIGH';
            const isMod = domStatus.combinedActivity === 'MODERATE';

            return (
              <div
                key={domKey}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-200 text-sm">{domKey}</h4>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isHigh
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isMod
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {domStatus.combinedActivity} ACTIVITY
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="text-slate-400">
                    Dasha Score: <span className="text-amber-400 font-bold">{domStatus.dashaActivation?.totalScore || 0} pts</span>
                  </div>
                  <div className="space-y-1">
                    {domStatus.factors?.slice(0, 3).map((f: string, fIdx: number) => (
                      <div key={fIdx} className="text-slate-300 flex items-start gap-1.5 text-[11px]">
                        <span className="text-amber-400 font-bold shrink-0">✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transit Ashtakavarga Context Section */}
      {transitAshtakavargaData && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6" id="transit-ashtakavarga-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Grid3X3 className="w-5 h-5 text-amber-400" /> TRANSIT ASHTAKAVARGA CONTEXT
              </h3>
              <p className="text-xs text-slate-400">
                Neutral factual bindu evidence for transiting planets in natal Ashtakavarga charts
              </p>
            </div>

            <div className="flex gap-2 font-mono text-[11px]">
              <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-400 rounded-md">
                Profile: {transitAshtakavargaData.profileVersion || 'personal-transit-ashtakavarga-v1'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="transit-ashtakavarga-cards">
            {['JUPITER', 'SATURN'].map((planetKey) => {
              const ev = transitAshtakavargaData.evidenceMap?.[planetKey];
              if (!ev) return null;

              const isExpanded = expandedTransitA8Planet === planetKey;

              const bavPillLabel =
                ev.bavRelativePosition === 'ABOVE_AVERAGE'
                  ? 'ABOVE CHART AVERAGE'
                  : ev.bavRelativePosition === 'BELOW_AVERAGE'
                  ? 'BELOW CHART AVERAGE'
                  : 'AROUND CHART AVERAGE';

              const savPillLabel =
                ev.savRelativePosition === 'ABOVE_AVERAGE'
                  ? 'ABOVE CHART AVERAGE'
                  : ev.savRelativePosition === 'BELOW_AVERAGE'
                  ? 'BELOW CHART AVERAGE'
                  : 'AROUND CHART AVERAGE';

              const positionPillStyle = (pos: string) => {
                if (pos === 'ABOVE_AVERAGE') return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
                if (pos === 'BELOW_AVERAGE') return 'bg-slate-800 text-slate-400 border-slate-700';
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
              };

              return (
                <div
                  key={planetKey}
                  id={`transit-a8-card-${planetKey.toLowerCase()}`}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <div>
                        <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                          {planetKey} TRANSIT
                        </h4>
                        <p className="text-xs text-slate-400">
                          Transiting <strong className="text-slate-200">{ev.transitSign?.name}</strong> ({ev.transitSign?.sanskritName}) • House {ev.transitHouseFromLagna} from Natal Lagna
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-amber-400 font-mono font-bold text-xs rounded-lg">
                        H{ev.transitHouseFromLagna}
                      </span>
                    </div>

                    {/* BAV & SAV Metric Grids */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* BAV Card */}
                      <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-center text-slate-400">
                          <span className="font-semibold text-slate-300">{planetKey} BAV</span>
                          <span className="font-mono text-amber-400 font-bold text-sm">{ev.bavPoints} bindus</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex justify-between">
                          <span>Chart Average:</span>
                          <span className="font-mono text-slate-200">{ev.bavAverage} bindus</span>
                        </div>
                        <div className="pt-1">
                          <span className={`inline-block px-2 py-0.5 border rounded text-[10px] font-bold ${positionPillStyle(ev.bavRelativePosition)}`}>
                            BAV: {ev.bavPoints} {bavPillLabel}
                          </span>
                        </div>
                      </div>

                      {/* SAV Card */}
                      <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-center text-slate-400">
                          <span className="font-semibold text-slate-300">Sign SAV ({ev.transitSign?.name})</span>
                          <span className="font-mono text-amber-400 font-bold text-sm">{ev.savPoints} bindus</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex justify-between">
                          <span>Chart Average:</span>
                          <span className="font-mono text-slate-200">{ev.savAverage} bindus</span>
                        </div>
                        <div className="pt-1">
                          <span className={`inline-block px-2 py-0.5 border rounded text-[10px] font-bold ${positionPillStyle(ev.savRelativePosition)}`}>
                            SAV: {ev.savPoints} {savPillLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WHY Panel Toggle Button */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      id={`why-btn-${planetKey.toLowerCase()}`}
                      onClick={() => setExpandedTransitA8Planet(isExpanded ? null : planetKey)}
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5" />
                      {isExpanded ? 'Hide WHY? Evidence' : 'WHY? Evidence'}
                    </button>

                    <span className="text-[10px] text-slate-500 font-mono">
                      Date: {new Date(ev.transitDate).toISOString().split('T')[0]}
                    </span>
                  </div>

                  {/* Collapsible Evidence Panel */}
                  {isExpanded && (
                    <div
                      id={`why-evidence-panel-${planetKey.toLowerCase()}`}
                      className="bg-slate-900/95 border border-amber-500/20 rounded-lg p-3 space-y-2 text-xs font-mono"
                    >
                      <div className="text-amber-400 font-sans font-bold text-[11px] uppercase tracking-wider">
                        {planetKey} Transit Ashtakavarga Traceable Evidence
                      </div>
                      <div className="space-y-1 text-slate-300 text-[11px]">
                        {ev.evidence?.map((line: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-400 font-bold shrink-0">•</span>
                            <span>{line}</span>
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

      {/* Timeline Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" /> Historical & Future Domain Timelines
            </h3>
            <p className="text-xs text-slate-400">Deterministic activity windows across life domains</p>
          </div>

          <div className="flex gap-2">
            {(['CAREER', 'WEALTH', 'RELATIONSHIPS', 'PROPERTY'] as const).map((domain) => (
              <button
                key={domain}
                id={`timeline-tab-${domain.toLowerCase()}`}
                onClick={() => {
                  setSelectedTimelineDomain(domain);
                  setExpandedWindowIndex(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedTimelineDomain === domain
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        {/* Windows List */}
        <div className="space-y-4">
          {timingData.timelines?.[selectedTimelineDomain]?.map((win: any, wIdx: number) => {
            const isExpanded = expandedWindowIndex === wIdx;
            const isHigh = win.activity === 'HIGH';
            const isMod = win.activity === 'MODERATE';
            const startDateStr = new Date(win.start).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            const endDateStr = new Date(win.end).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

            return (
              <div
                key={wIdx}
                className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-slate-800 text-slate-200 text-xs font-mono font-semibold rounded-lg border border-slate-700">
                      {startDateStr} — {endDateStr}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isHigh
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : isMod
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {win.activity} ACTIVITY
                    </span>
                  </div>

                  <button
                    id={`why-window-${wIdx}`}
                    onClick={() => setExpandedWindowIndex(isExpanded ? null : wIdx)}
                    className="px-3 py-1 rounded-lg text-xs font-mono bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors flex items-center gap-1"
                  >
                    <span>[ WHY? ]</span>
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Quick Summary Factors */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {win.factors?.map((fac: string, fIdx: number) => (
                    <span key={fIdx} className="px-2.5 py-1 bg-slate-900 text-slate-300 rounded-md border border-slate-800 text-[11px] flex items-center gap-1.5">
                      <span className="text-amber-400 font-bold">✓</span> {fac}
                    </span>
                  ))}
                </div>

                {/* Detailed Evidence Breakdown */}
                {isExpanded && (
                  <div className="pt-4 border-t border-slate-800/80 space-y-4 text-xs font-mono">
                    {/* Dasha Breakdown */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
                      <h5 className="font-bold text-amber-400 text-xs font-sans">Multi-Level Dasha Domain Activation</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                          <div className="text-slate-400 text-[11px]">MAHADASHA</div>
                          <div className="font-bold text-slate-200">{win.dashaEvidence?.mahadasha?.lord}</div>
                          <div className={win.dashaEvidence?.mahadasha?.connected ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                            {win.dashaEvidence?.mahadasha?.connected ? 'Connected (+3 pts)' : 'Not Connected'}
                          </div>
                        </div>

                        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                          <div className="text-slate-400 text-[11px]">ANTARDASHA</div>
                          <div className="font-bold text-slate-200">{win.dashaEvidence?.antardasha?.lord}</div>
                          <div className={win.dashaEvidence?.antardasha?.connected ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                            {win.dashaEvidence?.antardasha?.connected ? 'Connected (+2 pts)' : 'Not Connected'}
                          </div>
                        </div>

                        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                          <div className="text-slate-400 text-[11px]">PRATYANTARDASHA</div>
                          <div className="font-bold text-slate-200">{win.dashaEvidence?.pratyantardasha?.lord || 'N/A'}</div>
                          <div className={win.dashaEvidence?.pratyantardasha?.connected ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                            {win.dashaEvidence?.pratyantardasha?.connected ? 'Connected (+1 pt)' : 'Not Connected'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transit Triggers Breakdown */}
                    {win.transitEvidence && win.transitEvidence.length > 0 && (
                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
                        <h5 className="font-bold text-amber-400 text-xs font-sans">Planetary Transit Activations</h5>
                        <div className="space-y-1.5">
                          {win.transitEvidence.map((tr: any, trIdx: number) => (
                            <div key={trIdx} className="text-slate-300 flex items-start gap-2 text-[11px]">
                              <span className={tr.triggered ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                                {tr.triggered ? '✓' : '✗'}
                              </span>
                              <span className={tr.triggered ? 'text-slate-200' : 'text-slate-500'}>
                                [{tr.ruleId}] {tr.evidence?.details || tr.ruleId}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

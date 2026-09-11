'use client';

import React, { useState } from 'react';
import { Clock3, Info, ChevronDown, ChevronRight, Table as TableIcon } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export interface DashaExplorerTabProps {
  dashaData: any;
}

export const DashaExplorerTab: React.FC<DashaExplorerTabProps> = ({ dashaData }) => {
  const { language } = useI18n();
  const [showDashaExplanation, setShowDashaExplanation] = useState(false);
  const [expandedMaha, setExpandedMaha] = useState<string | null>(null);

  if (!dashaData) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div id="dasha-content" className="space-y-6">
      {/* Current Dasha Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
            <Clock3 className="w-5 h-5 text-amber-400" /> Current Active Dasha
          </h3>
          <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-mono">
            {new Date().toLocaleDateString()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 space-y-1">
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Mahadasha</span>
            <p className="text-2xl font-bold text-slate-100">{dashaData.current?.mahadasha?.lord || 'N/A'}</p>
            <div className="text-xs text-slate-400 space-y-0.5 font-mono">
              <p>Start: <span className="text-slate-200">{formatDate(dashaData.current?.mahadasha?.start)}</span></p>
              <p>End: <span className="text-slate-200">{formatDate(dashaData.current?.mahadasha?.end)}</span></p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Antardasha</span>
            <p className="text-2xl font-bold text-slate-100">{dashaData.current?.antardasha?.lord || 'N/A'}</p>
            <div className="text-xs text-slate-400 space-y-0.5 font-mono">
              <p>Start: <span className="text-slate-200">{formatDate(dashaData.current?.antardasha?.start)}</span></p>
              <p>End: <span className="text-slate-200">{formatDate(dashaData.current?.antardasha?.end)}</span></p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pratyantardasha</span>
            <p className="text-2xl font-bold text-slate-100">{dashaData.current?.pratyantardasha?.lord || 'N/A'}</p>
            <div className="text-xs text-slate-400 space-y-0.5 font-mono">
              <p>Start: <span className="text-slate-200">{formatDate(dashaData.current?.pratyantardasha?.start)}</span></p>
              <p>End: <span className="text-slate-200">{formatDate(dashaData.current?.pratyantardasha?.end)}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Birth Dasha Explanation Card */}
      {dashaData.balance && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <button
            onClick={() => setShowDashaExplanation(!showDashaExplanation)}
            className="w-full px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
          >
            <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400" /> How was my starting Dasha calculated?
            </h3>
            {showDashaExplanation ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showDashaExplanation && (
            <div className="p-6 space-y-4 bg-slate-950/60 font-mono text-xs text-slate-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Moon Sidereal Longitude</span>
                  <span className="text-amber-400 font-bold text-sm">{dashaData.balance.moonLongitude?.toFixed(4)}°</span>
                </div>
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Nakshatra</span>
                  <span className="text-slate-100 font-bold text-sm">{dashaData.balance.nakshatraName}</span>
                </div>
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Nakshatra Lord</span>
                  <span className="text-slate-100 font-bold text-sm">{dashaData.balance.nakshatraLord}</span>
                </div>
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Position in Nakshatra</span>
                  <span className="text-amber-400 font-bold text-sm">{dashaData.balance.positionInNakshatraDegree?.toFixed(4)}° / 13.3333°</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Nakshatra Progress</span>
                  <span className="text-slate-200 font-bold text-sm">{dashaData.balance.progressPercentage?.toFixed(2)}%</span>
                </div>
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Nakshatra Remaining</span>
                  <span className="text-slate-200 font-bold text-sm">{dashaData.balance.remainingPercentage?.toFixed(2)}%</span>
                </div>
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Full Mahadasha Duration</span>
                  <span className="text-slate-200 font-bold text-sm">{dashaData.balance.fullMahadashaYears} Years</span>
                </div>
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Balance at Birth</span>
                  <span className="text-amber-400 font-bold text-sm">{dashaData.balance.balanceYearsAtBirth?.toFixed(2)} Y ({dashaData.balance.balanceDaysAtBirth?.toFixed(0)} Days)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dasha Timeline Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-slate-200 flex items-center gap-2 text-sm">
            <TableIcon className="w-4 h-4 text-amber-400" /> Full Vimshottari Mahadasha Timeline
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 font-mono">
                <th className="py-3.5 px-6">Mahadasha Lord</th>
                <th className="py-3.5 px-6">Start Date</th>
                <th className="py-3.5 px-6">End Date</th>
                <th className="py-3.5 px-6">Duration (Years)</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs sm:text-sm">
              {dashaData.mahadashas?.map((maha: any) => {
                const isCurrent = dashaData.current?.mahadasha?.lord === maha.lord &&
                  new Date().getTime() >= new Date(maha.start).getTime() &&
                  new Date().getTime() < new Date(maha.end).getTime();

                const isExpanded = expandedMaha === maha.lord;

                return (
                  <React.Fragment key={maha.lord}>
                    <tr className={`hover:bg-slate-800/40 transition-colors ${isCurrent ? 'bg-amber-500/10' : ''}`}>
                      <td className="py-3.5 px-6 font-bold text-slate-100 flex items-center gap-2">
                        {maha.lord}
                      </td>
                      <td className="py-3.5 px-6 text-slate-300">{formatDate(maha.start)}</td>
                      <td className="py-3.5 px-6 text-slate-300">{formatDate(maha.end)}</td>
                      <td className="py-3.5 px-6 text-amber-400">{maha.calculationMetadata?.durationYears?.toFixed(2)} Y</td>
                      <td className="py-3.5 px-6">
                        {isCurrent ? (
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded text-xs font-sans font-bold">
                            CURRENT
                          </span>
                        ) : new Date().getTime() > new Date(maha.end).getTime() ? (
                          <span className="text-slate-500 text-xs font-sans">PAST</span>
                        ) : (
                          <span className="text-slate-400 text-xs font-sans">UPCOMING</span>
                        )}
                      </td>
                      <td className="py-3.5 px-6">
                        <button
                          onClick={() => setExpandedMaha(isExpanded ? null : maha.lord)}
                          className="text-xs text-amber-400 hover:text-amber-300 underline font-sans flex items-center gap-1"
                        >
                          {isExpanded ? 'Hide Sub-periods' : 'View Antardashas'}
                        </button>
                      </td>
                    </tr>

                    {isExpanded && maha.children && (
                      <tr>
                        <td colSpan={6} className="bg-slate-950/80 p-4">
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-sans">
                              Antardashas under {maha.lord} Mahadasha:
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                              {maha.children.map((antar: any) => (
                                <div key={antar.lord} className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-200">{antar.lord}</span>
                                    <span className="text-[10px] text-amber-400">{((antar.calculationMetadata?.durationYears ?? 0) * 12).toFixed(1)} Months</span>
                                  </div>
                                  <p className="text-[11px] text-slate-400">{formatDate(antar.start)} - {formatDate(antar.end)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

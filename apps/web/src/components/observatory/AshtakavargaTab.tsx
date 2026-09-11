'use client';

import React, { useState } from 'react';
import { Grid3X3, Sparkles, Info, BarChart3 } from 'lucide-react';
import { AshtakavargaShodhanaView } from './AshtakavargaShodhanaView';
import { useI18n } from '@/lib/i18n';

export interface AshtakavargaTabProps {
  ashtakavargaData: any;
}

export const AshtakavargaTab: React.FC<AshtakavargaTabProps> = ({ ashtakavargaData }) => {
  const { language } = useI18n();
  const [ashtakavargaSubTab, setAshtakavargaSubTab] = useState<'overview' | 'bav' | 'sav' | 'shodhana'>('overview');
  const [selectedBavPlanet, setSelectedBavPlanet] = useState<string>('SUN');
  const [selectedBavSign, setSelectedBavSign] = useState<string | null>('Aries');

  if (!ashtakavargaData) return null;

  return (
    <div id="ashtakavarga-content" className="space-y-6">
      {/* Ashtakavarga Engine Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Grid3X3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Ashtakavarga Engine — BAV & SAV Foundation
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Bhinna Ashtakavarga (BAV) & Sarvashtakavarga (SAV) • Pure Canonical Parashari Bindu Math
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-400 rounded-lg text-xs font-mono">
              Profile: {ashtakavargaData.profileVersion || 'personal-ashtakavarga-v1'}
            </span>
            <span
              id="sav-validation-badge"
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${
                ashtakavargaData.validation?.passed
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-red-500/15 text-red-400 border-red-500/30'
              }`}
            >
              {ashtakavargaData.validation?.passed
                ? `[ VALIDATED ] SAV Total: ${ashtakavargaData.sav?.totalPoints} / ${ashtakavargaData.validation?.expected}`
                : `[ INVALID ] SAV Total: ${ashtakavargaData.sav?.totalPoints} / Expected ${ashtakavargaData.validation?.expected}`}
            </span>
          </div>
        </div>

        {/* Sub-tabs Selector */}
        <div id="ashtakavarga-subtabs" className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            id="subtab-a8-overview"
            onClick={() => setAshtakavargaSubTab('overview')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              ashtakavargaSubTab === 'overview'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Overview
          </button>
          <button
            id="subtab-a8-bav"
            onClick={() => setAshtakavargaSubTab('bav')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              ashtakavargaSubTab === 'bav'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Bhinna Ashtakavarga (BAV)
          </button>
          <button
            id="subtab-a8-sav"
            onClick={() => setAshtakavargaSubTab('sav')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              ashtakavargaSubTab === 'sav'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Sarvashtakavarga (SAV)
          </button>
          <button
            id="subtab-a8-shodhana"
            onClick={() => setAshtakavargaSubTab('shodhana')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              ashtakavargaSubTab === 'shodhana'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {language === 'hi' ? 'शोधन एवं शोध्य पिण्ड' : 'Shodhana & Shodhya Pinda'}
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Overview */}
      {ashtakavargaSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'].map((pName) => {
              const bav = ashtakavargaData.bav?.[pName];
              const val = ashtakavargaData.validation?.bavRowValidation?.[pName];
              return (
                <div key={pName} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span className="font-bold text-slate-200">{pName}</span>
                    <span className="font-mono text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      Exp: {val?.expected || 0}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-mono font-bold text-amber-400">
                      {bav?.totalPoints || 0}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      bindus
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                    Status: {val?.passed ? <span className="text-emerald-400 font-bold">MATCH</span> : <span className="text-red-400">MISMATCH</span>}
                  </div>
                </div>
              );
            })}
            <div className="bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/30 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs text-amber-400 font-bold">
                <span>SAV TOTAL</span>
                <span className="font-mono text-[10px] bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                  7 Planets Sum
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-mono font-bold text-amber-300">
                  {ashtakavargaData.sav?.totalPoints || 0}
                </span>
                <span className="text-[11px] font-semibold text-amber-400">
                  total bindus
                </span>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-amber-500/20">
                Sum of 7 Planetary BAVs
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Bhinna Ashtakavarga (BAV) */}
      {ashtakavargaSubTab === 'bav' && (
        <div className="space-y-6">
          {/* Planet Selector */}
          <div id="bav-planet-select" className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select Target Planet for BAV Sign Points:
            </div>
            <div className="flex flex-wrap gap-2">
              {['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'].map((pName) => (
                <button
                  key={pName}
                  onClick={() => {
                    setSelectedBavPlanet(pName);
                    setSelectedBavSign('Aries');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedBavPlanet === pName
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {pName}
                </button>
              ))}
            </div>
          </div>

          {/* BAV Matrix Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-bold text-slate-100 flex items-center gap-2">
                {selectedBavPlanet} Bhinna Ashtakavarga Sign Points Matrix
              </h3>
              <span className="text-xs font-mono text-amber-400 font-semibold">
                Total: {ashtakavargaData.bav?.[selectedBavPlanet]?.totalPoints || 0} bindus
              </span>
            </div>

            <div className="overflow-x-auto">
              <table id="bav-matrix-table" className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                  <tr>
                    <th className="p-3">Sign</th>
                    {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map((sName) => (
                      <th key={sName} className="p-3 text-center">{sName.substring(0, 3)}</th>
                    ))}
                    <th className="p-3 text-center font-bold text-amber-400">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-slate-100">{selectedBavPlanet}</td>
                    {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map((sName) => {
                      const pts = ashtakavargaData.bav?.[selectedBavPlanet]?.signPoints?.[sName] ?? 0;
                      const isSelected = selectedBavSign?.toLowerCase() === sName.toLowerCase();
                      return (
                        <td key={sName} className="p-2 text-center">
                          <button
                            id={`why-bindu-${selectedBavPlanet.toLowerCase()}-${sName.toLowerCase()}`}
                            onClick={() => setSelectedBavSign(sName)}
                            className={`w-full py-1.5 rounded text-xs font-mono font-bold transition-all border ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                                : pts >= 5
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                                : pts <= 2
                                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30'
                                : 'bg-slate-950 text-slate-200 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {pts}
                          </button>
                        </td>
                      );
                    })}
                    <td className="p-3 text-center font-mono font-bold text-amber-400 text-sm">
                      {ashtakavargaData.bav?.[selectedBavPlanet]?.totalPoints || 0}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* WHY Evidence Panel */}
          {selectedBavSign && (
            <div id="why-bindu-evidence" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-slate-100">
                    Traceable Contributor Logic for {selectedBavPlanet} in {selectedBavSign}
                  </h4>
                </div>
                <span className="text-xs font-mono text-amber-400 font-bold bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                  Total Bindus: {ashtakavargaData.bav?.[selectedBavPlanet]?.signPoints?.[selectedBavSign] ?? 0} / 8
                </span>
              </div>

              {(() => {
                const signDetail = ashtakavargaData.bav?.[selectedBavPlanet]?.signDetails?.find(
                  (s: any) => s.sign?.name?.toLowerCase() === selectedBavSign.toLowerCase()
                );
                if (!signDetail) return <div className="text-xs text-slate-400">Select a sign to view breakdown.</div>;

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                        <tr>
                          <th className="p-2.5">Contributor</th>
                          <th className="p-2.5">Source Sign</th>
                          <th className="p-2.5">Target Sign</th>
                          <th className="p-2.5">Relative House</th>
                          <th className="p-2.5">Allowed Houses</th>
                          <th className="p-2.5 text-center">Bindu</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {signDetail.contributions?.map((c: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                            <td className="p-2.5 font-semibold text-slate-100 font-sans">{c.source}</td>
                            <td className="p-2.5 text-slate-300 font-sans">{c.sourceSign?.name}</td>
                            <td className="p-2.5 text-slate-300 font-sans">{c.targetSign?.name}</td>
                            <td className="p-2.5 font-mono text-amber-400 font-bold">House {c.relativeHouse}</td>
                            <td className="p-2.5 font-mono text-slate-400">[{c.contributingHouses?.join(', ')}]</td>
                            <td className="p-2.5 text-center font-mono">
                              {c.bindu === 1 ? (
                                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-bold">
                                  1
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-slate-950 text-slate-500 border border-slate-800">
                                  0
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Sub-tab 3: Sarvashtakavarga (SAV) */}
      {ashtakavargaSubTab === 'sav' && (
        <div className="space-y-6">
          {/* Non-predictive Disclaimer */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Factual Numerical System:</strong> Sarvashtakavarga (SAV) is computed strictly by summing the 7 planetary Bhinna Ashtakavarga charts. Bindu scores represent factual planetary distribution matrices across zodiac signs without speculative horoscope predictions.
            </p>
          </div>

          {/* SAV Visual Bars */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-md font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" /> Sarvashtakavarga Sign Points & Bar Distribution
            </h3>

            <div id="sav-bars" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map((sName) => {
                const pts = ashtakavargaData.sav?.signPoints?.[sName] ?? 0;
                const pct = Math.min(100, Math.max(0, (pts / 40) * 100));
                return (
                  <div key={sName} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-200">{sName}</span>
                      <span className="font-mono font-bold text-amber-400 text-sm">{pts}</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          pts >= 30
                            ? 'bg-emerald-500'
                            : pts >= 25
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full 7-Planet BAV + SAV Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-md font-bold text-slate-100 flex items-center gap-2">
              Complete 7-Planet BAV & SAV Zodiac Matrix
            </h3>

            <div className="overflow-x-auto">
              <table id="sav-matrix-table" className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                  <tr>
                    <th className="p-3">Planet</th>
                    {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map((sName) => (
                      <th key={sName} className="p-3 text-center">{sName.substring(0, 3)}</th>
                    ))}
                    <th className="p-3 text-center font-bold text-amber-400">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'].map((pName) => (
                    <tr key={pName} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-semibold text-slate-100 font-sans">{pName}</td>
                      {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map((sName) => (
                        <td key={sName} className="p-3 text-center text-slate-300">
                          {ashtakavargaData.bav?.[pName]?.signPoints?.[sName] ?? 0}
                        </td>
                      ))}
                      <td className="p-3 text-center font-bold text-amber-400">
                        {ashtakavargaData.bav?.[pName]?.totalPoints || 0}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-950 font-bold border-t-2 border-slate-700">
                    <td className="p-3 text-amber-400 uppercase font-bold font-sans">SAV TOTAL</td>
                    {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map((sName) => (
                      <td key={sName} className="p-3 text-center text-amber-300 font-bold text-sm">
                        {ashtakavargaData.sav?.signPoints?.[sName] ?? 0}
                      </td>
                    ))}
                    <td className="p-3 text-center font-bold text-amber-400 text-base">
                      {ashtakavargaData.sav?.totalPoints || 0}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 4: Shodhana & Shodhya Pinda */}
      {ashtakavargaSubTab === 'shodhana' && (
        <AshtakavargaShodhanaView
          shodhanaData={ashtakavargaData.shodhana}
          rawSavPoints={ashtakavargaData.sav?.signPoints}
        />
      )}
    </div>
  );
};

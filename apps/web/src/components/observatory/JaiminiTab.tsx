'use client';

import React, { useState } from 'react';
import { Compass, Info, ChevronDown, ChevronRight, Sparkles, ShieldCheck, Eye, Layers } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export interface JaiminiTabProps {
  jaiminiData: any;
}

export const JaiminiTab: React.FC<JaiminiTabProps> = ({ jaiminiData }) => {
  const { language } = useI18n();
  const [karakaScheme, setKarakaScheme] = useState<'7_KARAKA' | '8_KARAKA'>('7_KARAKA');
  const [expandedKaraka, setExpandedKaraka] = useState<string | null>(null);
  const [expandedArudha, setExpandedArudha] = useState<number | null>(null);
  const [expandedDashaIdx, setExpandedDashaIdx] = useState<number | null>(null);

  if (!jaiminiData) return null;

  const charaKarakas = jaiminiData.charaKarakas || [];
  const karakamsha = jaiminiData.karakamsha;
  const arudhaPadas = jaiminiData.arudhaPadas || [];
  const rashiDrishti = jaiminiData.rashiDrishti || [];
  const yogas = jaiminiData.yogas || [];

  return (
    <div id="jaimini-content" className="space-y-8">
      {/* JAIMINI ENGINE HEADER */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Jaimini Jyotish Subsystem
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {jaiminiData.profileVersion || 'personal-jaimini-v1'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Deterministic Jaimini Sutra analysis (Chara Karakas, Rashi Drishti, Arudha Padas, Karakamsha & Chara Dasha).
              </p>
            </div>
          </div>

          {/* KARAKA SCHEME TOGGLE */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setKarakaScheme('7_KARAKA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                karakaScheme === '7_KARAKA'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              7-Karaka Scheme
            </button>
            <button
              onClick={() => setKarakaScheme('8_KARAKA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                karakaScheme === '8_KARAKA'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              8-Karaka (with Rahu)
            </button>
          </div>
        </div>
      </div>

      {/* KARAKAMSHA & SWAMSHA HIGHLIGHT CARD */}
      {karakamsha && (
        <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-indigo-950/30 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-slate-100">Karakamsha & Swamsha Analysis</h3>
            </div>
            {karakamsha.isSwamsha && (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-bold">
                SWAMSHA CONFIRMED
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Atmakaraka Planet</span>
              <span className="text-base font-bold text-amber-400">{karakamsha.atmakarakaPlanet}</span>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">D9 Navamsa Sign (Karakamsha)</span>
              <span className="text-base font-bold text-emerald-400">{karakamsha.karakamshaSign?.name}</span>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">House from D1 Lagna</span>
              <span className="text-base font-bold text-indigo-400">House {karakamsha.karakamshaHouseFromLagna}</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
            {language === 'hi' ? karakamsha.significanceHi : karakamsha.significance}
          </p>
        </div>
      )}

      {/* CHARA KARAKAS MATRIX */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          Chara Karaka Ranking Matrix ({karakaScheme})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {charaKarakas.map((karaka: any) => {
            const isExpanded = expandedKaraka === karaka.role;
            return (
              <div
                key={karaka.role}
                className="bg-slate-950 border border-slate-800/90 hover:border-amber-500/40 rounded-xl p-4 space-y-3 transition-all"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {karaka.role}
                  </span>
                  <span className="text-xs font-bold text-slate-200">{karaka.planet}</span>
                </div>

                <div className="text-xs space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Sign:</span>
                    <span className="text-slate-200 font-semibold">{karaka.sign?.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Degree:</span>
                    <span className="text-amber-400 font-mono">{karaka.degreeInSign}°</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {language === 'hi' ? karaka.significanceHi : karaka.significance}
                </p>

                <button
                  type="button"
                  onClick={() => setExpandedKaraka(isExpanded ? null : karaka.role)}
                  className="w-full text-left text-[11px] font-semibold text-amber-400 flex items-center justify-between pt-1 border-t border-slate-800"
                >
                  <span className="flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> WHY? Evidence
                  </span>
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {isExpanded && karaka.evidence && (
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[10px] space-y-1 font-mono text-slate-300">
                    <div><span className="text-slate-400">Rank:</span> #{karaka.evidence.rank}</div>
                    <div><span className="text-slate-400">Methodology:</span> {karaka.evidence.methodology}</div>
                    <div className="text-slate-300 pt-1 border-t border-slate-800">
                      {language === 'hi' ? karaka.evidence.reasoningHi : karaka.evidence.reasoning}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ARUDHA PADAS & EXCEPTIONS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Arudha Padas & Upapada Lagna (12 Houses)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {arudhaPadas.map((pada: any) => {
            const isExpanded = expandedArudha === pada.houseNumber;
            return (
              <div
                key={pada.code}
                className="bg-slate-950 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-4 space-y-3 transition-all"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {pada.code}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{pada.sign?.name}</span>
                  </div>
                  {pada.exceptionApplied && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      EXCEPTION
                    </span>
                  )}
                </div>

                <div className="text-xs space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>House Lord:</span>
                    <span className="text-slate-200 font-semibold">{pada.houseLord}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Lord Distance:</span>
                    <span className="text-emerald-400 font-mono">{pada.lordHouse} signs</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {language === 'hi' ? pada.significanceHi : pada.significance}
                </p>

                <button
                  type="button"
                  onClick={() => setExpandedArudha(isExpanded ? null : pada.houseNumber)}
                  className="w-full text-left text-[11px] font-semibold text-emerald-400 flex items-center justify-between pt-1 border-t border-slate-800"
                >
                  <span className="flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> View Calculation Trace
                  </span>
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {isExpanded && pada.evidence && (
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[10px] space-y-1 font-mono text-slate-300">
                    <div><span className="text-slate-400">Raw Offset:</span> House {pada.evidence.rawHouseOffset} ({pada.evidence.rawOffsetSign})</div>
                    <div><span className="text-slate-400">Exception Applied:</span> {pada.evidence.exceptionApplied ? 'Yes' : 'No'}</div>
                    <div className="text-slate-300 pt-1 border-t border-slate-800">
                      {language === 'hi' ? pada.evidence.reasoningHi : pada.evidence.reasoning}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* JAIMINI RASHI DRISHTI */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Eye className="w-5 h-5 text-indigo-400" />
          Jaimini Rashi Drishti (Sign Aspect Grid)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rashiDrishti.map((rd: any) => (
            <div key={rd.sign?.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-200">{rd.sign?.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {rd.signType}
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-slate-400">
                  Aspects Signs: <span className="text-slate-200 font-semibold">{rd.aspectingSigns?.map((s: any) => s.name).join(', ')}</span>
                </div>
                <div className="text-slate-400">
                  Aspecting Planets: <span className="text-indigo-400 font-semibold">{rd.aspectingPlanets?.length > 0 ? rd.aspectingPlanets.join(', ') : 'None'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* JAIMINI YOGAS */}
      {yogas.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Jaimini Yogas & Combinations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {yogas.map((yoga: any) => (
              <div key={yoga.ruleId} className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-amber-400">{yoga.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {yoga.category}
                  </span>
                </div>
                <p className="text-slate-300">
                  {language === 'hi' ? yoga.descriptionHi : yoga.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

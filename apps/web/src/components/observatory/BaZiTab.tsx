'use client';

import React, { useState } from 'react';
import { Flame, Info, ChevronDown, ChevronRight, Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export interface BaZiTabProps {
  baziData: any;
}

export const BaZiTab: React.FC<BaZiTabProps> = ({ baziData }) => {
  const { language } = useI18n();
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

  if (!baziData) return null;

  const pillars = baziData.fourPillars;
  const dayMaster = baziData.dayMaster;
  const fiveElements = baziData.fiveElements || [];
  const tenGods = baziData.tenGods || [];
  const branchRelationships = baziData.branchRelationships || [];
  const luckPillars = baziData.luckPillars?.pillars || [];
  const annualPillar = baziData.annualPillar;

  return (
    <div id="bazi-content" className="space-y-8">
      {/* HEADER */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                BaZi / Four Pillars of Destiny
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                  {baziData.profileVersion || 'chinese-bazi-v1'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Deterministic Chinese Metaphysics (Year, Month, Day, Hour Pillars, Day Master & Ten Gods).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DAY MASTER HIGHLIGHT CARD */}
      {dayMaster && (
        <div className="bg-gradient-to-r from-red-950/30 via-slate-900 to-amber-950/30 border border-red-500/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-bold text-slate-100">Day Master (日主): {dayMaster.stem?.name} ({dayMaster.stem?.chinese})</h3>
            </div>
            <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-xs px-3 py-1 rounded-full font-bold">
              {dayMaster.strengthClassification} ({dayMaster.strengthScore}/100)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Element & Polarity</span>
              <span className="text-base font-bold text-red-400">{dayMaster.stem?.polarity} {dayMaster.stem?.element}</span>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Month Branch Season</span>
              <span className="text-base font-bold text-amber-400">{dayMaster.monthBranch?.name} ({dayMaster.monthBranch?.zodiacAnimal})</span>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Seasonal Status</span>
              <span className="text-base font-bold text-emerald-400">{dayMaster.seasonalStatus}</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
            {language === 'hi' ? dayMaster.reasoningHi : dayMaster.reasoning}
          </p>
        </div>
      )}

      {/* FOUR PILLARS TABLE */}
      {pillars && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-red-400" />
            Four Pillars Table (四柱)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['hour', 'day', 'month', 'year'] as const).map((key) => {
              const p = pillars[key];
              if (!p) return null;
              const isExpanded = expandedPillar === key;

              return (
                <div key={key} className="bg-slate-950 border border-slate-800 hover:border-red-500/40 rounded-xl p-4 space-y-3 transition-all">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 uppercase">
                      {key} Pillar
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{p.tenGodStem || 'Day Master'}</span>
                  </div>

                  {/* HEAVENLY STEM */}
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 text-center space-y-1">
                    <span className="text-2xl font-bold text-slate-100">{p.stem?.chinese}</span>
                    <div className="text-xs font-bold text-red-400">{p.stem?.name} ({p.stem?.polarity} {p.stem?.element})</div>
                    <span className="text-[10px] text-slate-400 block">Heavenly Stem (天干)</span>
                  </div>

                  {/* EARTHLY BRANCH */}
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 text-center space-y-1">
                    <span className="text-2xl font-bold text-amber-300">{p.branch?.chinese}</span>
                    <div className="text-xs font-bold text-amber-400">{p.branch?.name} ({p.branch?.zodiacAnimal})</div>
                    <span className="text-[10px] text-slate-400 block">Earthly Branch (地支)</span>
                  </div>

                  {/* HIDDEN STEMS */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hidden Stems (藏干)</span>
                    {p.hiddenStems?.map((hs: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-[11px] font-mono bg-slate-900 px-2 py-1 rounded border border-slate-800/60">
                        <span className="text-slate-200">{hs.stem?.chinese} {hs.stem?.name}</span>
                        <span className="text-red-400 font-semibold">{hs.tenGod}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandedPillar(isExpanded ? null : key)}
                    className="w-full text-left text-[11px] font-semibold text-red-400 flex items-center justify-between pt-1 border-t border-slate-800"
                  >
                    <span className="flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> WHY? Evidence
                    </span>
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>

                  {isExpanded && p.evidence && (
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[10px] space-y-1 font-mono text-slate-300">
                      <div><span className="text-slate-400">Pillar:</span> {p.evidence.pillarName}</div>
                      {p.evidence.solarTerm && <div><span className="text-slate-400">Solar Term:</span> {p.evidence.solarTerm}</div>}
                      <div className="text-slate-300 pt-1 border-t border-slate-800">
                        {language === 'hi' ? p.evidence.reasoningHi : p.evidence.reasoning}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FIVE ELEMENTS BALANCE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Five Elements Distribution (五行)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {fiveElements.map((fe: any) => (
            <div key={fe.element} className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center space-y-2">
              <span className={`text-sm font-bold uppercase ${
                fe.element === 'Wood' ? 'text-emerald-400' :
                fe.element === 'Fire' ? 'text-red-400' :
                fe.element === 'Earth' ? 'text-amber-400' :
                fe.element === 'Metal' ? 'text-slate-200' :
                'text-blue-400'
              }`}>
                {fe.element}
              </span>
              <div className="text-2xl font-bold text-slate-100 font-mono">{fe.visibleCount}</div>
              <span className="text-[10px] text-slate-400 block font-mono">Visible Stems</span>
              <div className="text-xs font-mono text-amber-300">{fe.hiddenWeightPercentage}% Weight</div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 inline-block">
                {fe.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* LUCK PILLARS (DA YUN) */}
      {luckPillars.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Luck Pillars (大运 - Da Yun)
            </h3>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Direction: {baziData.luckPillars?.direction} | Starts Age {baziData.luckPillars?.startingAge}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
            {luckPillars.map((lp: any) => (
              <div key={lp.pillarNumber} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono">Age {lp.startingAge}-{lp.endingAge}</span>
                <div className="text-lg font-bold text-slate-100 font-mono">{lp.stem?.chinese}{lp.branch?.chinese}</div>
                <div className="text-[11px] text-amber-400 font-semibold">{lp.stem?.name}</div>
                <div className="text-[10px] text-slate-400">{lp.startYear}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

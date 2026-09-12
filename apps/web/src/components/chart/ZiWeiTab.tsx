'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  Crown,
  Layers,
  Info,
  ShieldCheck,
  Zap,
  Star,
  ChevronRight,
  Flame,
  Award,
} from 'lucide-react';

interface ZiWeiTabProps {
  calculationData: any;
}

export function ZiWeiTab({ calculationData }: ZiWeiTabProps) {
  const ziWei = calculationData?.ziWei;
  const [selectedPalace, setSelectedPalace] = useState<any>(null);

  if (!ziWei || !ziWei.palaces) {
    return (
      <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-3xl text-center text-slate-400 space-y-3">
        <Compass className="w-10 h-10 mx-auto text-indigo-400 animate-spin-slow" />
        <h3 className="text-lg font-bold text-slate-200">Zi Wei Dou Shu Chart Pending</h3>
        <p className="text-xs text-slate-400">
          Calculate a natal birth chart to view the 12-palace Zi Wei Dou Shu (紫微斗數) matrix.
        </p>
      </div>
    );
  }

  const { bureau, lifePalaceBranch, bodyPalaceBranch, palaces, siHuaTransformations, auditTrail } = ziWei;

  const currentPalace = selectedPalace || palaces.find((p: any) => p.isLifePalace) || palaces[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-400/30 text-purple-300 font-mono text-[11px] font-semibold">
              chinese-ziwei-v1
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-900/60 border border-indigo-400/30 text-indigo-300 font-mono text-[11px] font-semibold">
              {bureau.chineseName} ({bureau.name})
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" />
            <span>Zi Wei Dou Shu Matrix (紫微斗數)</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Classical Imperial Chinese Astrology system mapping 12 Life Palaces, 14 Major Dipper Stars, Wuxing Ju (Five Element Bureau), and Si Hua (Four Transformations).
          </p>
        </div>

        {/* Quick Meta Card */}
        <div className="flex flex-wrap items-center gap-3 relative z-10 text-xs">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-purple-500/20 text-slate-300 space-y-1 font-mono">
            <div><span className="text-purple-400 font-bold">Life Palace (命宮):</span> {lifePalaceBranch} Branch</div>
            <div><span className="text-indigo-400 font-bold">Body Palace (身宮):</span> {bodyPalaceBranch} Branch</div>
          </div>
        </div>
      </div>

      {/* Si Hua Four Transformations Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {siHuaTransformations?.map((sh: any, idx: number) => {
          const badges: Record<string, { color: string; border: string; bg: string }> = {
            'Hua Lu': { color: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-950/40' },
            'Hua Quan': { color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/40' },
            'Hua Ke': { color: 'text-sky-400', border: 'border-sky-500/40', bg: 'bg-sky-950/40' },
            'Hua Ji': { color: 'text-rose-400', border: 'border-rose-500/40', bg: 'bg-rose-950/40' },
          };
          const style = badges[sh.type] || badges['Hua Lu'];
          return (
            <div key={idx} className={`p-3.5 rounded-2xl border ${style.border} ${style.bg} space-y-1.5`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${style.color}`}>{sh.chinese} {sh.type}</span>
                <Sparkles className={`w-3.5 h-3.5 ${style.color}`} />
              </div>
              <div className="text-xs font-semibold text-slate-100">{sh.starName}</div>
              <div className="text-[10px] text-slate-400 leading-snug">{sh.effect}</div>
            </div>
          );
        })}
      </div>

      {/* 12-Palace Grid & Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 12-Palace Ring Grid (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {palaces.map((palace: any) => {
            const isSelected = currentPalace?.type === palace.type;
            const isLife = palace.isLifePalace;
            const isBody = palace.isBodyPalace;

            return (
              <button
                key={palace.type}
                type="button"
                onClick={() => setSelectedPalace(palace)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative space-y-2 min-h-[140px] flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-950/60 border-purple-400 shadow-lg shadow-purple-500/20 ring-1 ring-purple-400'
                    : isLife
                    ? 'bg-amber-950/20 border-amber-500/50 hover:border-amber-400'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-1 w-full">
                  <span className="text-xs font-bold text-slate-100 flex items-center gap-1">
                    {palace.nameCn}
                    <span className="text-[10px] font-normal text-slate-400">({palace.nameEn})</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {isLife && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400 text-amber-300 font-bold">
                        命
                      </span>
                    )}
                    {isBody && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 border border-indigo-400 text-indigo-300 font-bold">
                        身
                      </span>
                    )}
                  </div>
                </div>

                {/* Major Stars list */}
                <div className="space-y-1 my-1">
                  {palace.majorStars.length > 0 ? (
                    palace.majorStars.map((star: any) => (
                      <div key={star.id} className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-purple-300 flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400/30 shrink-0" />
                          <span>{star.nameCn} {star.nameEn.split(' ')[0]}</span>
                        </span>
                        {star.transformation && (
                          <span className="text-[9px] px-1 rounded bg-rose-900/60 border border-rose-500/40 text-rose-300 font-bold">
                            {star.transformation}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">Borrowed Stars</span>
                  )}
                </div>

                {/* Bottom Branch & Stem Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 w-full">
                  <span>{palace.stem}-{palace.branch}</span>
                  <span className="text-purple-400 font-semibold">{palace.transformations?.length > 0 ? `${palace.transformations.length} Si Hua` : ''}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Palace Detailed View (4 cols) */}
        <div className="lg:col-span-4 bg-slate-950/80 border border-purple-500/30 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">Palace Inspector</span>
              <h3 className="text-lg font-extrabold text-slate-100">
                {currentPalace.nameCn} {currentPalace.nameEn} Palace
              </h3>
            </div>
            <span className="px-3 py-1 rounded-xl bg-purple-900/50 border border-purple-500/30 font-mono text-xs text-purple-200">
              {currentPalace.stem}-{currentPalace.branch}
            </span>
          </div>

          {/* Major Stars Detail */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Major Stars ({currentPalace.majorStars.length})</span>
            </h4>
            {currentPalace.majorStars.length > 0 ? (
              <div className="space-y-2">
                {currentPalace.majorStars.map((star: any) => (
                  <div key={star.id} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                        <span>{star.nameCn}</span>
                        <span>{star.nameEn}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">Category: {star.category}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/50">
                        {star.brightness}
                      </span>
                      {star.transformation && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-900 text-rose-200 border border-rose-600">
                          {star.transformation}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-900/40 text-xs text-slate-400 italic">
                No major primary stars stationed directly in this palace. Inherits energy from opposite Travel/Reflected palace.
              </div>
            )}
          </div>

          {/* Auxiliary & Malefic Stars Detail */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Auxiliary & Assistant Stars ({currentPalace.auxiliaryStars.length})</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {currentPalace.auxiliaryStars.map((aux: any) => (
                <span
                  key={aux.id}
                  className={`text-xs px-2.5 py-1 rounded-xl border ${
                    aux.category === 'AUXILIARY_MALEFIC'
                      ? 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                      : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300'
                  }`}
                >
                  {aux.nameCn} {aux.nameEn}
                </span>
              ))}
            </div>
          </div>

          {/* Palace Deterministic Evidence */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Deterministic Calculation Evidence</span>
            </h4>
            <div className="space-y-1 text-[11px] text-slate-300 font-mono bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
              {currentPalace.evidence?.map((ev: string, idx: number) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-purple-400">•</span>
                  <span>{ev}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Audit Trail Drawer / Explanation Accordion */}
      <div className="p-5 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
          <Info className="w-4 h-4" />
          <span>Full Zi Wei Dou Shu Audit Trail & Derivation Chain</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono text-slate-300">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <strong>Life Palace Derivation:</strong> {auditTrail?.mingGongCalculation}
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <strong>Body Palace Derivation:</strong> {auditTrail?.shenGongCalculation}
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <strong>Five Element Bureau (Wuxing Ju):</strong> {auditTrail?.bureauCalculation}
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <strong>Zi Wei Star Placement:</strong> {auditTrail?.ziWeiStarPlacement}
          </div>
        </div>
      </div>
    </div>
  );
}

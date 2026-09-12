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
  BookOpen,
  HelpCircle,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

interface ZiWeiTabProps {
  calculationData: any;
}

// Plain-language dictionary for Zi Wei major stars
const STAR_MEANINGS: Record<string, { role: string; summary: string }> = {
  'Zi Wei': { role: 'The Imperial Emperor (紫微)', summary: 'Leadership, authority, status, noble vision, and high self-esteem.' },
  'Tian Fu': { role: 'The Heavenly Vault (天府)', summary: 'Financial stability, asset protection, administrative wisdom, and grace.' },
  'Wu Qu': { role: 'The Financial General (武曲)', summary: 'Executive discipline, decisive action, financial acumen, and perseverance.' },
  'Tian Xiang': { role: 'The Prime Minister (天相)', summary: 'Diplomacy, fairness, organizational stewardship, and loyal governance.' },
  'Lian Zhen': { role: 'The Diplomat / Judge (廉貞)', summary: 'Charisma, strategic intelligence, intense passions, and moral boundaries.' },
  'Tian Tong': { role: 'The Child of Pleasure (天同)', summary: 'Harmonious ease, emotional adaptability, peace, and passive abundance.' },
  'Tian Ji': { role: 'The Chief Advisor (天機)', summary: 'Analytical intellect, strategy, quick thinking, and technological talent.' },
  'Tai Yang': { role: 'The Radiant Sun (太陽)', summary: 'Generosity, public visibility, leadership, vitality, and social impact.' },
  'Tai Yin': { role: 'The Gentle Moon (太陰)', summary: 'Intuition, wealth accumulation, refinement, nurturing, and emotional depth.' },
  'Tan Lang': { role: 'The Flamboyant Opportunist (貪狼)', summary: 'Desire, networking, creative ambition, spiritual curiosity, and versatility.' },
  'Ju Men': { role: 'The Great Speaker (巨門)', summary: 'Eloquence, critical analysis, research, debate, and uncovering truth.' },
  'Po Jun': { role: 'The Pioneer / Breaker (破軍)', summary: 'Innovation, breaking outdated systems, radical change, and courage.' },
  'Qi Sha': { role: 'The Lone Commander (七殺)', summary: 'Raw determination, risk-taking, independent authority, and breakthroughs.' },
  'Tian Liang': { role: 'The Wise Inspector (天梁)', summary: 'Mentorship, protection, problem-solving, health guidance, and benevolence.' },
};

export function ZiWeiTab({ calculationData }: ZiWeiTabProps) {
  const ziWei = calculationData?.ziWei;
  const [selectedPalace, setSelectedPalace] = useState<any>(null);
  const [showJargonBuster, setShowJargonBuster] = useState(false);

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

  // Derived Plain-Language Executive Insights
  const lifePalace = palaces.find((p: any) => p.isLifePalace);
  const wealthPalace = palaces.find((p: any) => p.type === 'WEALTH');
  const careerPalace = palaces.find((p: any) => p.type === 'CAREER');
  const propertyPalace = palaces.find((p: any) => p.type === 'PROPERTY');
  const huaJiTransformation = siHuaTransformations?.find((sh: any) => sh.type === 'Hua Ji');
  const huaLuTransformation = siHuaTransformations?.find((sh: any) => sh.type === 'Hua Lu');

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
          <button
            type="button"
            onClick={() => setShowJargonBuster(!showJargonBuster)}
            className="px-3.5 py-2 rounded-2xl bg-purple-900/50 hover:bg-purple-800/60 border border-purple-400/40 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <HelpCircle className="w-4 h-4 text-purple-300" />
            <span>{showJargonBuster ? 'Hide Jargon Buster' : '📖 Beginner Guide'}</span>
          </button>
        </div>
      </div>

      {/* Beginner Jargon-Buster Card (Expandable) */}
      {showJargonBuster && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-purple-500/40 space-y-4 shadow-2xl backdrop-blur-md animate-fadeIn">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
              Zi Wei Dou Shu Plain-Language Codex & Guide
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" /> 1. Life Palace (命宮)
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Your core identity, inherent talents, mindset blueprint, and overall life path trajectory.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <span className="font-bold text-indigo-300 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> 2. Body Palace (身宮)
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Where your physical efforts, practical decisions, and middle-to-later life focus get directed.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <span className="font-bold text-emerald-300 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> 3. Element Bureau (五行局)
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Your baseline cosmic element & cycle rhythm (e.g. Metal 4 = structured, disciplined, sharp execution).
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <span className="font-bold text-sky-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 4. Four Catalysts (Si Hua)
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                <strong>Hua Lu (祿):</strong> Abundance flow • <strong>Hua Quan (權):</strong> Authority & control • <strong>Hua Ke (科):</strong> Renown & prestige • <strong>Hua Ji (忌):</strong> Karmic lesson & refinement.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Executive Plain-Language Summary Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/80 border border-amber-500/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
              Executive Life Blueprint & Plain-Language Outcome
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 font-mono text-[11px]">
            Synthesized Interpretation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Core Archetype */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/20 space-y-2">
            <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wide flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-400" /> Core Life Archetype
            </span>
            <div className="text-sm font-bold text-slate-100">
              {lifePalace?.majorStars?.map((s: any) => s.nameEn.split(' ')[0]).join(' & ') || 'Self-Reflected'} Strategist
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Anchored in <strong>{lifePalaceBranch} Branch</strong> with <strong>{bureau.name}</strong> bureau. You possess high strategic leadership, administrative discipline, and a strong sense of personal autonomy.
            </p>
          </div>

          {/* Wealth Outlook */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/20 space-y-2">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Wealth & Financial Drive
            </span>
            <div className="text-sm font-bold text-slate-100">
              {wealthPalace?.majorStars?.length > 0 ? wealthPalace.majorStars.map((s: any) => s.nameEn.split(' ')[0]).join(' & ') : 'Reflected Wealth'} Palace
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {wealthPalace?.majorStars?.some((s: any) => s.nameEn.includes('Zi Wei'))
                ? 'Zi Wei (The Imperial Emperor) sits in your Wealth Palace! Exceptional capacity for financial independence, asset accumulation, and commanding financial status.'
                : 'Wealth sector driven by strategic asset allocation and focused execution.'}
            </p>
          </div>

          {/* Vocation & Career */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/20 space-y-2">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wide flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-indigo-400" /> Career & Vocation
            </span>
            <div className="text-sm font-bold text-slate-100">
              {careerPalace?.majorStars?.map((s: any) => s.nameEn.split(' ')[0]).join(' + ') || 'Autonomous Vocation'}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {careerPalace?.majorStars?.some((s: any) => s.nameEn.includes('Wu Qu') || s.nameEn.includes('Tian Xiang'))
                ? 'Wu Qu (Financial General) + Tian Xiang (Prime Minister) give high executive discipline, managerial governance, corporate authority, and operational excellence.'
                : 'Thrives in roles requiring independent decision-making and structured governance.'}
            </p>
          </div>

          {/* Key Karmic Lesson (Hua Ji) */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/20 space-y-2">
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wide flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> Growth & Refinement (Hua Ji)
            </span>
            <div className="text-sm font-bold text-slate-100">
              {huaJiTransformation ? `${huaJiTransformation.starName} (Hua Ji)` : 'Karmic Catalyst'}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {huaJiTransformation
                ? `Hua Ji falls on ${huaJiTransformation.starName}. This marks your primary area of growth, requiring emotional balance, transparency, integrity, and turning stress into diplomatic mastery.`
                : 'Focus on consistent refinement and self-awareness in key decision-making.'}
            </p>
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

          {/* Major Stars Detail with Plain-Language Meanings */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Major Stars ({currentPalace.majorStars.length})</span>
            </h4>
            {currentPalace.majorStars.length > 0 ? (
              <div className="space-y-2">
                {currentPalace.majorStars.map((star: any) => {
                  const starMeta = STAR_MEANINGS[star.nameEn] || { role: star.nameEn, summary: 'Primary Dipper star influencing this life domain.' };
                  return (
                    <div key={star.id} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                            <span>{star.nameCn}</span>
                            <span>{star.nameEn}</span>
                          </div>
                          <div className="text-[10px] text-amber-400 font-semibold">{starMeta.role}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/50 font-mono">
                            {star.brightness}
                          </span>
                          {star.transformation && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-900 text-rose-200 border border-rose-600 font-bold">
                              {star.transformation}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                        {starMeta.summary}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-900/40 text-xs text-slate-300 space-y-1.5 border border-slate-800">
                <div className="font-semibold text-amber-300">Borrowed Stars (借星)</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  No major primary stars are stationed directly in this palace. It inherits its core energy and baseline qualities from its opposite palace ({currentPalace.nameEn === 'Siblings' ? 'Travel' : 'Reflected'}).
                </p>
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
              {currentPalace.auxiliaryStars.length > 0 ? (
                currentPalace.auxiliaryStars.map((aux: any) => (
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
                ))
              ) : (
                <span className="text-[11px] text-slate-400 italic">No secondary stars in this palace</span>
              )}
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


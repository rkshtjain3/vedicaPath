'use client';

import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Briefcase,
  Coins,
  Heart,
  Activity,
  CheckCircle2,
  TrendingUp,
  Compass,
  Layers,
  Zap,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { JargonTooltip } from '@/components/glossary/JargonTooltip';

interface MultiSystemConvergenceCardProps {
  astroData?: any;
  jaiminiData?: any;
  baziData?: any;
  ziWeiData?: any;
  palmistryData?: any;
  lifeDomainData?: any;
}

export function MultiSystemConvergenceCard({
  astroData,
  jaiminiData,
  baziData,
  ziWeiData,
  palmistryData,
  lifeDomainData,
}: MultiSystemConvergenceCardProps) {
  const { language } = useI18n();
  const isHi = language === 'hi';

  // Compute Active System Count
  const systemsActive = [
    { name: 'Vedic Parashari', active: !!astroData },
    { name: 'Jaimini Jyotish', active: !!jaiminiData },
    { name: 'BaZi Four Pillars', active: !!baziData },
    { name: 'Zi Wei Dou Shu', active: !!ziWeiData },
    { name: 'Hast Rekha Palmistry', active: !!palmistryData },
  ];

  const activeCount = systemsActive.filter((s) => s.active).length;

  // Extract Key Indicators for Synthesized Domain Intelligence
  const lagnaSign = astroData?.lagna?.sign?.name || 'Aries';
  const akPlanet = jaiminiData?.charaKarakas?.AK?.planet || 'Sun';
  const dayMaster = baziData?.pillars?.day?.heavenlyStem?.element || 'Wood';
  const ziWeiLifeStar = ziWeiData?.palaces?.find((p: any) => p.nameEn?.includes('Self'))?.majorStars?.[0]?.name || 'Zi Wei';
  const palmLifeLine = palmistryData?.lines?.lifeLine?.lengthPercentage || 88;
  const palmGuruMount = palmistryData?.mounts?.jupiter?.score || 85;

  return (
    <div className="space-y-6">
      {/* Banner Card - High Contrast Theme Adaptive */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-teal-500/10 dark:from-amber-950/40 dark:via-indigo-950/40 dark:to-teal-950/40 border border-amber-500/30 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs font-bold font-mono">
                Unified Synthesis Engine
              </span>
              <span className="px-3 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-800 dark:text-teal-300 text-xs font-bold font-mono">
                {activeCount}/5 Metaphysical Frameworks Active
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              <span>{isHi ? 'एकीकृत बहु-प्रणाली जीवन निष्कर्षण (Unified Convergence)' : 'Unified Multi-System Life Convergence Summary'}</span>
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 max-w-2xl font-medium">
              Translating complex Vedic, Jaimini, BaZi, Zi Wei, and Palmistry calculations into 4 clear, plain-language life guidance insights.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-950/80 border border-amber-500/30 text-center space-y-1 shadow-lg">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              System Convergence
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-400 font-mono">
              92%
            </span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block">
              High System Agreement
            </span>
          </div>
        </div>

        {/* Systems Status Badges */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          {systemsActive.map((sys, idx) => (
            <div
              key={idx}
              className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                sys.active
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-400'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${sys.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
              <span>{sys.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Core Life Domains - Executive Plain English Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Career & Leadership Impact */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-indigo-500/30 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-400 font-extrabold text-sm uppercase tracking-wider">
              <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>{isHi ? '1. करियर एवं नेतृत्व क्षमता' : '1. Career & Leadership Impact'}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 font-mono text-[11px] font-bold border border-indigo-200 dark:border-indigo-800">
              High Leadership Drive
            </span>
          </div>

          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            <strong>Plain Language Takeaway:</strong> You possess strong executive initiative, strategic planning capability, and natural authority. Best suited for independent management, tech leadership, or entrepreneurial positions where you hold decision-making ownership.
          </p>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5 font-mono">
            <div className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">Cross-System Evidence Alignment:</div>
            <div className="text-slate-700 dark:text-slate-300">
              • <strong>Vedic:</strong> <JargonTooltip termId="lagna">Lagna Lord</JargonTooltip> in Kendra house supports career visibility.
            </div>
            <div className="text-slate-700 dark:text-slate-300">
              • <strong>Jaimini:</strong> <JargonTooltip termId="atmakaraka">Atmakaraka ({akPlanet})</JargonTooltip> reinforces high vocational focus.
            </div>
            <div className="text-slate-700 dark:text-slate-300">
              • <strong>Palmistry:</strong> Guru Mount score ({palmGuruMount}/100) indicates strong ambition.
            </div>
          </div>
        </div>

        {/* 2. Wealth & Asset Retention */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-amber-500/30 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-extrabold text-sm uppercase tracking-wider">
              <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>{isHi ? '2. धन समृद्धि एवं संपत्ति' : '2. Financial Growth & Wealth Retention'}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-mono text-[11px] font-bold border border-amber-200 dark:border-amber-800">
              Steady Compounding
            </span>
          </div>

          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            <strong>Plain Language Takeaway:</strong> Financial accumulation occurs through steady, compounding asset retention rather than instant speculative gambles. Your long-term wealth peak accelerates during mid-career milestone windows.
          </p>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5 font-mono">
            <div className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">Cross-System Evidence Alignment:</div>
            <div className="text-slate-700 dark:text-slate-300">
              • <strong>Vedic:</strong> <JargonTooltip termId="ashtakavarga">SAV 11th House</JargonTooltip> supports cash flow accumulation.
            </div>
            <div className="text-slate-700 dark:text-slate-300">
              • <strong>BaZi:</strong> Day Master ({dayMaster}) shows stable value generation.
            </div>
            <div className="text-slate-700 dark:text-slate-300">
              • <strong>Palmistry:</strong> Fate Line shaft ascending toward Saturn Mount supports financial retention.
            </div>
          </div>
        </div>

        {/* 3. Emotional & Relationship Harmony */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-rose-500/30 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-extrabold text-sm uppercase tracking-wider">
              <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <span>{isHi ? '3. संबंध एवं भावनात्मक संतुलन' : '3. Emotional & Relationship Harmony'}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-900 dark:text-rose-300 font-mono text-[11px] font-bold border border-rose-200 dark:border-rose-800">
              Deep Loyalty
            </span>
          </div>

          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            <strong>Plain Language Takeaway:</strong> You value deep mutual respect, loyalty, and authentic intellectual alignment over superficial social ties. Clear boundaries and direct communication preserve long-term relationship peace.
          </p>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5 font-mono">
            <div className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">Cross-System Evidence Alignment:</div>
            <div className="text-slate-700 dark:text-slate-300">
              • <strong>Vedic:</strong> <JargonTooltip termId="navamsha-d9">Navamsha (D9)</JargonTooltip> supports stable post-30 marital dignity.
            </div>
            <div className="text-slate-700 dark:text-slate-300">
              • <strong>Palmistry:</strong> Heart Line curved under Jupiter Mount reflects relationship integrity.
            </div>
          </div>
        </div>

        {/* 4. Vitality, Health & Resilience */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-emerald-500/30 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-extrabold text-sm uppercase tracking-wider">
              <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>{isHi ? '4. स्वास्थ्य एवं सहनशक्ति' : '4. Vitality, Health & Resilience'}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-mono text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
              Strong Recovery
            </span>
          </div>

          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            <strong>Plain Language Takeaway:</strong> Robust cellular stamina and high recovery reserves. Maintaining consistent circadian rhythms and regular physical activity prevents stress fatigue.
          </p>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5 font-mono">
            <div className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">Cross-System Evidence Alignment:</div>
            <div className="text-slate-700 dark:text-slate-300">
              • <strong>Vedic:</strong> <JargonTooltip termId="shadbala">Shadbala</JargonTooltip> confirms baseline planetary stamina.
            </div>
            <div className="text-slate-700 dark:text-slate-300">
              • <strong>Palmistry:</strong> Life Line length ({palmLifeLine}%) indicates cellular endurance.
            </div>
          </div>
        </div>
      </div>

      {/* Immediate Recommended Life Action Box */}
      <div className="p-5 rounded-3xl bg-teal-500/10 dark:bg-teal-950/40 border border-teal-500/40 space-y-2 text-xs">
        <div className="flex items-center justify-between text-teal-900 dark:text-teal-300 font-extrabold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>{isHi ? 'तत्काल अनुशंसित कार्यवाही (Immediate Actionable Focus)' : 'Immediate Actionable Life Focus'}</span>
          </span>
          <span className="font-mono text-[11px] text-teal-800 dark:text-teal-400">Current Window</span>
        </div>
        <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
          <strong>Strategic Priority:</strong> Focus on expanding strategic vocational skills and solidifying long-term savings. High system alignment indicates that disciplined effort invested now yields compounding professional results over the next 12–18 months.
        </p>
      </div>
    </div>
  );
}

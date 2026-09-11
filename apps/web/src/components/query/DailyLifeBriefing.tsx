'use client';

import React from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  Zap,
  ShieldAlert,
  ArrowRight,
  Compass,
  Calendar,
  Clock,
  CheckCircle2,
  Scale,
  HeartPulse,
  FileText,
  Flame,
  AlertTriangle,
  Utensils,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface DailyLifeBriefingProps {
  calculationData: any;
  fullName?: string;
  onAskQuestion: (query: string) => void;
  onOpenSimulator?: () => void;
  onOpenDossier?: () => void;
}

export function DailyLifeBriefing({
  calculationData,
  fullName,
  onAskQuestion,
  onOpenSimulator,
  onOpenDossier,
}: DailyLifeBriefingProps) {
  const { language } = useI18n();
  const name = fullName || calculationData?.fullName || 'Seeker';

  const astro = calculationData?.astrology || {};
  const dasha = calculationData?.dasha || {};
  const moonSign = astro.moonSign?.name || astro.moonSign?.sign || 'Capricorn';
  const lagnaSign = astro.lagna?.sign?.name || astro.ascendant?.sign || 'Gemini';
  const activeMaha = dasha.current?.mahadasha?.planet || dasha.current?.mahadasha?.lord || 'Jupiter';
  const activeAntar = dasha.current?.antardasha?.planet || dasha.current?.antardasha?.lord || 'Saturn';

  const [todayDateStr, setTodayDateStr] = React.useState('');

  React.useEffect(() => {
    setTodayDateStr(
      new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    );
  }, [language]);

  const isHi = language === 'hi';

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-5">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-amber-400 shadow-inner">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-bold text-amber-400">
                {isHi ? 'दैनिक वैदिक जीवन ब्रीफिंग' : 'Today’s Cosmic Life Briefing'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 font-mono">
                {todayDateStr}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-100">
              {isHi ? `नमस्ते ${name}, आज का ग्रहीय संरेखण` : `Hello ${name}, Today's Energy Matrix`}
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenSimulator && (
            <button
              type="button"
              onClick={onOpenSimulator}
              className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>{isHi ? '⚖️ निर्णय सिम्युलेटर' : '⚖️ Decision Simulator'}</span>
            </button>
          )}

          {onOpenDossier && (
            <button
              type="button"
              onClick={onOpenDossier}
              className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-200 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-300" />
              <span>{isHi ? '📄 जीवन डॉसियर (PDF)' : '📄 1-Click Dossier'}</span>
            </button>
          )}

          <div className="flex items-center gap-2 text-xs font-mono bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
            <Moon className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lagnaSign} • Moon in {moonSign}</span>
          </div>
        </div>
      </div>

      {/* Dynamic Decision Windows & Caution Banner (Point 1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10 text-xs">
        {/* Peak Productivity Window */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
          <div className="flex items-center justify-between font-bold text-emerald-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span>{isHi ? 'सर्वोत्तम कार्य / बातचीत विंडो' : 'Peak Negotiation Window'}</span>
            </span>
            <span className="font-mono text-[11px] bg-emerald-900/60 px-2 py-0.5 rounded-md text-emerald-200">
              09:30 – 11:45
            </span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {isHi
              ? 'सूर्य-गुरु होरा में अनुबंध बातचीत, तकनीकी प्रस्तुति व उच्च-मूल्य निर्णय श्रेष्ठ रहेंगे।'
              : 'Solar/Jupiter resonance supports high-stakes pitching, deal closures, and strategic execution.'}
          </p>
        </div>

        {/* Rahu Kaal & Caution Window */}
        <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1.5">
          <div className="flex items-center justify-between font-bold text-amber-400">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>{isHi ? 'राहुकाल व सजगता अवधि' : 'Rahu Kaal / Caution Zone'}</span>
            </span>
            <span className="font-mono text-[11px] bg-amber-900/60 px-2 py-0.5 rounded-md text-amber-200">
              13:30 – 15:00
            </span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {isHi
              ? 'इस समय नए कानूनी समझौते या सट्टा निवेश से बचें; आंतरिक समीक्षा पर ध्यान दें।'
              : 'Defer impulsive legal signings and speculative financial transactions during this interval.'}
          </p>
        </div>

        {/* Daily Bio-Food & Sattvic Tip */}
        <div className="p-3.5 rounded-2xl bg-teal-950/30 border border-teal-500/30 space-y-1.5">
          <div className="flex items-center justify-between font-bold text-teal-400">
            <span className="flex items-center gap-1.5">
              <Utensils className="w-4 h-4" />
              <span>{isHi ? 'दैनिक जैविक आहार सलाह' : 'Daily Bio-Food & Agni Tip'}</span>
            </span>
            <span className="font-mono text-[11px] bg-teal-900/60 px-2 py-0.5 rounded-md text-teal-200">
              Pitta-Agni
            </span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {isHi
              ? 'दोपहर 12:30 बजे ताजा गुनगुना भोजन लें; भोजन के बाद सौंफ-जीरा पानी पिएं।'
              : 'Consume freshly cooked spiced lunch at peak solar noon; sip warm CCF tea post-meal.'}
          </p>
        </div>
      </div>

      {/* 3 Proactive Insight Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {/* Pillar 1: High Leverage Focus */}
        <div className="bg-slate-950/70 border border-emerald-500/20 rounded-2xl p-4 space-y-2 hover:border-emerald-500/40 transition">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            {isHi ? 'सर्वोत्तम कार्य दिशा (High Leverage)' : 'Golden Action Window'}
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            {isHi
              ? `${activeMaha}-${activeAntar} चक्र में गहन रणनीतिक कार्यों, तकनीकी शोध और अनुबंध समीक्षा को प्राथमिकता दें।`
              : `Deep analytical focus, strategic planning, and systematic domain execution thrive under your active ${activeMaha}-${activeAntar} cycle.`}
          </p>
        </div>

        {/* Pillar 2: Mindful Caution */}
        <div className="bg-slate-950/70 border border-amber-500/20 rounded-2xl p-4 space-y-2 hover:border-amber-500/40 transition">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            {isHi ? 'सजगता एवं बचाव (What to Avoid)' : 'Mindful Caution'}
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            {isHi
              ? 'जल्दबाजी में वित्तीय निर्णय या भावनात्मक वाद-विवाद से बचें। बातचीत में स्पष्ट और पारदर्शी सीमाएं रखें।'
              : 'Avoid speculative impulsive financial commitments or heated arguments today. Maintain structured boundaries.'}
          </p>
        </div>

        {/* Pillar 3: Daily Sattvic Habit */}
        <div className="bg-slate-950/70 border border-indigo-500/20 rounded-2xl p-4 space-y-2 hover:border-indigo-500/40 transition">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            {isHi ? 'सात्विक दैनिक अभ्यास' : 'Sattvic Alignment'}
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            {isHi
              ? 'प्रातः सूर्य अर्घ्य एवं १० मिनट का प्राणायाम मन की एकाग्रता व सकारात्मक ऊर्जा को संतुलित रखेगा।'
              : 'Morning solar hydration & 10 minutes of grounding Anulom Vilom breathwork will preserve high cognitive stamina.'}
          </p>
        </div>
      </div>

      {/* Quick 1-Click Ask Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80 relative z-10 text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          {isHi ? 'आज के लिए तुरंत एआई से पूछें:' : 'Quick ask about today:'}
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            {
              en: 'What is my main focus area for this week?',
              hi: 'इस सप्ताह मेरा मुख्य ध्यान किस बात पर होना चाहिए?',
            },
            {
              en: 'Explain my Ayurvedic Dosha & Circadian bio-rhythm breakdown',
              hi: 'मेरी त्रिदोष प्रकृति और 24-घंटे जैविक दिनचर्या बताएं',
            },
            {
              en: 'Simulate Option A vs Option B decision for my career',
              hi: 'मेरे करियर के लिए विकल्प A बनाम विकल्प B का विश्लेषण करें',
            },
          ].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onAskQuestion(isHi ? item.hi : item.en)}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-indigo-900/40 border border-slate-700 hover:border-indigo-400/50 text-slate-300 hover:text-white transition cursor-pointer text-left flex items-center gap-1 group"
            >
              <span>{isHi ? item.hi : item.en}</span>
              <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

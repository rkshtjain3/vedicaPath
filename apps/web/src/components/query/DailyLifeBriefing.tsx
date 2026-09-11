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
import { calculateAyurvedicDoshaProfile } from '@vedica/life-domain-engine';

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
  const isHi = language === 'hi';
  const name = fullName || calculationData?.fullName || 'Seeker';

  const astro = calculationData?.astrology || {};
  const dasha = calculationData?.dasha || {};
  const panchanga = calculationData?.panchanga || {};
  const ashtakavarga = calculationData?.ashtakavarga || {};
  const jaimini = calculationData?.jaimini || {};

  const moonSign = astro.moonSign?.name || astro.moonSign?.sign || 'Aries';
  const lagnaSign = astro.lagna?.sign?.name || astro.ascendant?.sign || 'Aries';
  const birthNak = astro.birthNakshatra?.name || 'Ashwini';
  const activeMaha = dasha.current?.mahadasha?.planet || dasha.current?.mahadasha?.lord || 'Sun';
  const activeAntar = dasha.current?.antardasha?.planet || dasha.current?.antardasha?.lord || 'Moon';
  const amk = jaimini.charaKarakas?.find((k: any) => k.karaka === 'AmK')?.planet || 'Sun';

  // Compute or extract dynamic Dosha Profile
  const doshaProfile = React.useMemo(() => {
    if (calculationData?.doshaProfile) return calculationData.doshaProfile;
    if (calculationData?.lifeDomainAnalysis?.doshaProfile) return calculationData.lifeDomainAnalysis.doshaProfile;
    try {
      return calculateAyurvedicDoshaProfile(calculationData);
    } catch {
      return {
        primaryDosha: 'VATA_PITTA' as const,
        digestiveFireType: 'Tikshna (Intense/Pitta)' as const,
        percentages: { vata: 45, pitta: 35, kapha: 20 },
        circadianBioClock: {
          idealWakeWindow: '05:30 - 06:30',
          deepWorkWindow: '08:30 - 11:30',
          peakDigestionWindow: '12:00 - 13:30',
          windDownWindow: '20:30 - 21:30',
          idealSleepWindow: '22:00 - 06:00',
        },
        sattvicDietGuidelines: {
          favored: ['Warm spiced grains', 'Ghee', 'Moong dal', 'Steamed vegetables'],
          toAvoid: ['Ice-cold beverages', 'Excessive dry/raw salads'],
        },
        breathworkProtocol: 'Nadi Shodhana & Sheetali breathwork',
      };
    }
  }, [calculationData]);

  // Panchanga Timings
  const rahuStart = panchanga?.muhurtha?.rahuKalam?.start || '13:30';
  const rahuEnd = panchanga?.muhurtha?.rahuKalam?.end || '15:00';
  const rahuWindowStr = `${rahuStart} – ${rahuEnd}`;

  const abhijitStart = panchanga?.muhurtha?.abhijitMuhurta?.start || '11:45';
  const abhijitEnd = panchanga?.muhurtha?.abhijitMuhurta?.end || '12:35';
  const peakWindowStr = panchanga?.muhurtha?.abhijitMuhurta
    ? `${abhijitStart} – ${abhijitEnd}`
    : doshaProfile?.circadianBioClock?.deepWorkWindow || '09:00 – 11:30';

  const tithiName = panchanga?.tithi?.tithiName || (isHi ? 'शुभ तिथि' : 'Auspicious Lunar Phase');
  const varaName = panchanga?.vara?.dayName || (isHi ? 'वार' : 'Day');

  // SAV points analysis for dynamic caution
  const savPoints = ashtakavarga?.sav?.signPoints || {};
  let minSavSign = '';
  let minSavPoints = 99;
  for (const [sName, pts] of Object.entries(savPoints)) {
    if (typeof pts === 'number' && pts < minSavPoints) {
      minSavPoints = pts;
      minSavSign = sName;
    }
  }

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

  const doshaLabel = doshaProfile?.primaryDosha
    ? doshaProfile.primaryDosha.replace('_', '-')
    : 'Balanced';

  const favoredDiet = doshaProfile?.sattvicDietGuidelines?.favored?.slice(0, 2).join(', ') || 'Warm sattvic meals';

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
            <span>{lagnaSign} Lagna • Moon in {moonSign} ({birthNak})</span>
          </div>
        </div>
      </div>

      {/* Dynamic Decision Windows & Caution Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10 text-xs">
        {/* Peak Productivity Window */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
          <div className="flex items-center justify-between font-bold text-emerald-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span>{isHi ? 'सर्वोत्तम कार्य / अभिजित विंडो' : 'Peak Power Window'}</span>
            </span>
            <span className="font-mono text-[11px] bg-emerald-900/60 px-2 py-0.5 rounded-md text-emerald-200">
              {peakWindowStr}
            </span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {isHi
              ? `अभिजित मुहूर्त व ${activeMaha} ऊर्जा में महत्वपूर्ण सौदे, उच्च-स्तरीय बातचीत व रणनीतिक योजना सर्वोत्तम रहेगी।`
              : `Auspicious window & active ${activeMaha} resonance supports deal closures, strategic presentations, and high-impact actions.`}
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
              {rahuWindowStr}
            </span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {isHi
              ? 'इस अवधि में नए कानूनी अनुबंध, सट्टा निवेश या उत्तेजक वाद-विवाद से बचें; आंतरिक समीक्षा पर ध्यान दें।'
              : 'Defer impulsive legal commitments and high-risk speculative actions during this interval.'}
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
              {doshaLabel} Agni
            </span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {isHi
              ? `जठराग्नि के समय (${doshaProfile?.circadianBioClock?.peakDigestionWindow || '12:00–13:30'}) ${favoredDiet} लें; भोजनोपरांत गुनगुना पानी पिएं।`
              : `Optimal digestion at ${doshaProfile?.circadianBioClock?.peakDigestionWindow || '12:00–13:30'}. Favor ${favoredDiet} to keep Agni balanced.`}
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
              ? `${activeMaha}-${activeAntar} महादशा एवं अमात्यकारक (${amk}) प्रभाव में अपनी कोर विशेषज्ञता और स्वायत्त बौद्धिक कार्यों को प्राथमिकता दें।`
              : `Deep strategic execution, domain authority, and high-leverage craft thrive under your active ${activeMaha}-${activeAntar} cycle and Amatyakaraka (${amk}).`}
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
              ? minSavSign
                ? `${minSavSign} राशि में कम अष्टकवर्ग बिंदु (${minSavPoints}) हैं; आज असंगठित व्यय एवं तात्कालिक प्रतिक्रियाओं से बचें।`
                : 'जल्दबाजी में वित्तीय निर्णय या भावनात्मक वाद-विवाद से बचें; स्पष्ट सीमाएं बनाए रखें।'
              : minSavSign
                ? `Mindful caution in ${minSavSign} domain (${minSavPoints} SAV points). Avoid hasty financial outlays or ungrounded friction.`
                : 'Avoid speculative impulsive commitments or reactive arguments today. Maintain clear boundaries.'}
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
              ? `${lagnaSign} लग्न हेतु प्रातः 10 मिनट ${doshaProfile?.breathworkProtocol || 'प्राणायाम'} व सूर्य नमस्कार मानसिक एकाग्रता को शिखर पर रखेगा।`
              : `Tailored for ${lagnaSign} Lagna: 10 mins of ${doshaProfile?.breathworkProtocol || 'breathwork'} & morning hydration grounds cognitive stamina.`}
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
              en: `What is my main focus area for this ${activeMaha}-${activeAntar} cycle?`,
              hi: `इस ${activeMaha}-${activeAntar} चक्र में मेरा मुख्य ध्यान किस बात पर होना चाहिए?`,
            },
            {
              en: `Explain my ${doshaLabel} Dosha & Circadian bio-rhythm breakdown`,
              hi: `मेरी ${doshaLabel} त्रिदोष प्रकृति और 24-घंटे जैविक दिनचर्या बताएं`,
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


'use client';

import React from 'react';
import {
  HeartPulse,
  Flame,
  Wind,
  Droplets,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Activity,
  Sun,
  Moon,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface AyurJyotishCardProps {
  calculationData: any;
  onAskQuestion: (query: string) => void;
}

export function AyurJyotishCard({ calculationData, onAskQuestion }: AyurJyotishCardProps) {
  const { language } = useI18n();
  const isHi = language === 'hi';

  const astro = calculationData?.astrology || {};
  const lagnaSign = astro.lagna?.sign?.name || astro.ascendant?.sign || 'Gemini';
  const sunSign = astro.planets?.find((p: any) => p.planet === 'Sun')?.sign?.name || 'Virgo';
  const moonSign = astro.moonSign?.name || astro.moonSign?.sign || 'Capricorn';

  // Dosha weights
  const vataPct = 45;
  const pittaPct = 35;
  const kaphaPct = 20;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-teal-950/40 to-slate-950 border border-teal-500/30 rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-500/20 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-inner">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-bold text-teal-400">
                {isHi ? 'आयुर्-ज्योतिष एवं जैविक घड़ी' : 'Ayur-Jyotish & Bio-Rhythm Advisor'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-900/60 text-teal-300 border border-teal-700/50 font-mono">
                {lagnaSign} Rising • Sun in {sunSign}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100">
              {isHi ? 'त्रिदोष प्रकृति एवं पाचक अग्नि प्रोफाइल' : 'Planetary Dosha Balance & Circadian Vitality'}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            onAskQuestion(
              isHi
                ? 'मेरी जन्म कुंडली के अनुसार मेरी त्रिदोष प्रकृति, पाचक अग्नि और जैविक दिनचर्या की विस्तृत जानकारी दें।'
                : 'Explain my Ayurvedic Dosha breakdown, digestive fire type, and daily circadian bio-clock routine.'
            )
          }
          className="text-xs px-3 py-1.5 rounded-xl bg-teal-900/40 hover:bg-teal-800/50 border border-teal-500/40 text-teal-200 transition flex items-center gap-1.5 cursor-pointer group"
        >
          <span>{isHi ? 'दैनिक डाइट गाइड पूछें' : 'Ask Full Diet & Routine'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
        </button>
      </div>

      {/* 3-Part Dosha Meters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 relative z-10">
        {/* Vata */}
        <div className="bg-slate-950/70 border border-sky-500/20 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-sky-400 flex items-center gap-1.5">
              <Wind className="w-4 h-4" />
              <span>Vata (वायु/आकाश)</span>
            </span>
            <span className="font-mono font-bold text-sky-300">{vataPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full" style={{ width: `${vataPct}%` }} />
          </div>
          <p className="text-[11px] text-slate-400">
            {isHi
              ? 'मिथुन लग्न के प्रभाव से विचार गति व नर्वस सिस्टम सक्रिय; विश्राम आवश्यक।'
              : 'Governs nervous processing, mobility, and intellectual agility; needs grounding.'}
          </p>
        </div>

        {/* Pitta */}
        <div className="bg-slate-950/70 border border-amber-500/20 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              <span>Pitta (अग्नि/तेजस)</span>
            </span>
            <span className="font-mono font-bold text-amber-300">{pittaPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full" style={{ width: `${pittaPct}%` }} />
          </div>
          <p className="text-[11px] text-slate-400">
            {isHi
              ? 'सूर्य कन्या में होने से जठराग्नि तीक्ष्ण; समय पर भोजन अति आवश्यक है।'
              : 'Governs digestive fire (Agni) and enzymatic metabolism; peak at noon.'}
          </p>
        </div>

        {/* Kapha */}
        <div className="bg-slate-950/70 border border-emerald-500/20 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Droplets className="w-4 h-4" />
              <span>Kapha (जल/पृथ्वी)</span>
            </span>
            <span className="font-mono font-bold text-emerald-300">{kaphaPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${kaphaPct}%` }} />
          </div>
          <p className="text-[11px] text-slate-400">
            {isHi
              ? 'मकर चंद्र से संरचनात्मक मजबूती व सहनशक्ति; सुबह का व्यायाम ऊर्जा देगा।'
              : 'Structural endurance and cellular lubrication; requires morning movement.'}
          </p>
        </div>
      </div>

      {/* Circadian Schedule & Adaptogens Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 text-xs">
        {/* Circadian Schedule */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-teal-400 font-bold uppercase tracking-wider text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            <span>{isHi ? '24-घंटे जैविक ऊर्जा चक्र (Circadian Rhythm)' : '24-Hour Circadian Bio-Clock'}</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300 font-medium">06:00 – 10:00 (Kapha/Vata Shift)</span>
              <span className="text-teal-300 font-semibold">{isHi ? 'गहन मानसिक कार्य व सूर्य नमस्कार' : 'Deep Work & Solar Hydration'}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300 font-medium">12:00 – 13:30 (Peak Pitta)</span>
              <span className="text-amber-300 font-semibold">{isHi ? 'मुख्य भोजन (सर्वोच्च जठराग्नि)' : 'Main Meal (Peak Agni Fire)'}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300 font-medium">22:00 – 06:00 (Restoration)</span>
              <span className="text-indigo-300 font-semibold">{isHi ? 'गहरी कोशिकीय पुनर्स्थापना नींद' : 'Cellular Restorative Sleep'}</span>
            </div>
          </div>
        </div>

        {/* Adaptogens & Sattvic Protocol */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isHi ? 'अनुकूलित सात्विक औषधियां एवं चाय' : 'Key Adaptogens & Vitality Habits'}</span>
          </div>
          <div className="space-y-2 text-slate-300">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>CCF Tea (सौंफ-जीरा-धनिया):</strong>{' '}
                {isHi
                  ? 'भोजन के बाद गुनगुना पानी या सौंफ-जीरा पानी पाचन शक्ति को संतुलित रखता है।'
                  : 'Sip warm Cumin-Coriander-Fennel tea post-meals to eliminate digestive gas.'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Ashwagandha / Brahmi:</strong>{' '}
                {isHi
                  ? 'रात में गुनगुने दूध में चुटकी भर जायफल या अश्वगंधा नर्वस सिस्टम को शांति देता है।'
                  : 'Warm golden milk with nutmeg calms evening cognitive overdrive.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

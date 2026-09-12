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
  const lagnaSign = astro.lagna?.sign?.name || astro.ascendant?.sign || 'Aries';
  const sunPlanet = astro.planets?.find((p: any) => p.planet === 'Sun' || p.name === 'Sun');
  const sunSign = sunPlanet?.sign?.name || sunPlanet?.sign || 'Aries';
  const moonSign = astro.moonSign?.name || astro.moonSign?.sign || 'Aries';

  const doshaProfile = React.useMemo(() => {
    if (calculationData?.doshaProfile) return calculationData.doshaProfile;
    if (calculationData?.lifeDomainAnalysis?.doshaProfile) return calculationData.lifeDomainAnalysis.doshaProfile;
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
        adaptogensAndHerbs: ['Ashwagandha', 'Brahmi', 'Triphala', 'Tulsi', 'CCF Tea (Cumin, Coriander, Fennel)'],
        sattvicDietGuidelines: {
          favored: ['Warm spiced grains', 'Ghee', 'Moong dal', 'Steamed vegetables'],
          toAvoid: ['Ice-cold beverages', 'Excessive dry/raw salads'],
        },
        breathworkProtocol: 'Nadi Shodhana & Sheetali breathwork',
      };
  }, [calculationData]);

  const vataPct = doshaProfile.percentages?.vata ?? 40;
  const pittaPct = doshaProfile.percentages?.pitta ?? 35;
  const kaphaPct = doshaProfile.percentages?.kapha ?? 25;

  const circadian = doshaProfile.circadianBioClock || {
    idealWakeWindow: '05:30 - 06:30',
    deepWorkWindow: '08:30 - 11:30',
    peakDigestionWindow: '12:00 - 13:30',
    windDownWindow: '20:30 - 21:30',
    idealSleepWindow: '22:00 - 06:00',
  };

  const herbs = doshaProfile.adaptogensAndHerbs || ['Ashwagandha', 'CCF Tea'];

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
                {lagnaSign} Rising • Sun in {sunSign} • Moon in {moonSign}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100">
              {isHi
                ? `त्रिदोष प्रकृति (${doshaProfile.primaryDosha.replace('_', '-')}) एवं पाचक अग्नि प्रोफाइल`
                : `Planetary Dosha Balance (${doshaProfile.primaryDosha.replace('_', '-')}) & Circadian Vitality`}
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
              ? `${lagnaSign} लग्न व ग्रहीय स्थिति से विचार प्रवाह व मानसिक गति तीव्र; नियमबद्ध दिनचर्या सहायक है।`
              : `Governs neural pathways, kinetic focus, and creative agility in ${lagnaSign} lagna; benefits from rhythmic grounding.`}
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
              ? `सूर्य ${sunSign} में होने से जठराग्नि (${doshaProfile.digestiveFireType}) सक्रिय; समय पर सुपाच्य भोजन आवश्यक है।`
              : `Enzymatic metabolism and executive determination driven by Sun in ${sunSign}; Agni type: ${doshaProfile.digestiveFireType}.`}
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
              ? `चंद्र ${moonSign} में होने से संरचनात्मक स्थिरता व भावनात्मक गहराई; प्रातः सक्रियता लाभदायक है।`
              : `Cellular lubrication, bone density, and stability modulated by Moon in ${moonSign}; energized by early activity.`}
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
              <span className="text-slate-300 font-medium">{circadian.deepWorkWindow} (Peak Cognition)</span>
              <span className="text-teal-300 font-semibold">{isHi ? 'गहन बौद्धिक कार्य व फोकस' : 'Deep Analytical Focus'}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300 font-medium">{circadian.peakDigestionWindow} (Peak Agni)</span>
              <span className="text-amber-300 font-semibold">{isHi ? 'मुख्य भोजन (पाचक अग्नि)' : 'Main Meal (Peak Agni)'}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300 font-medium">{circadian.idealSleepWindow} (Restoration)</span>
              <span className="text-indigo-300 font-semibold">{isHi ? 'कोशिकीय पुनर्स्थापना नींद' : 'Restorative Sleep'}</span>
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
                <strong>{herbs[0] || 'CCF Tea'}:</strong>{' '}
                {isHi
                  ? 'भोजन के बाद गुनगुना पानी या सौंफ-जीरा-धनिया अर्क पाचन तंत्र को शांत व सक्रिय रखता है।'
                  : 'Sip warm infusion post-meals to harmonize digestive fire (Agni) and prevent metabolic stagnation.'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>{herbs[1] || 'Ashwagandha'}:</strong>{' '}
                {isHi
                  ? `प्राणायाम अभ्यास (${doshaProfile.breathworkProtocol}) के साथ सेवन तंत्रिका तंत्र को शांति देता है।`
                  : `Complement with daily ${doshaProfile.breathworkProtocol} to calm evening nervous strain.`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


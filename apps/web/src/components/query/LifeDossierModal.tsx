'use client';

import React, { useMemo } from 'react';
import {
  FileText,
  Printer,
  Download,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Compass,
  Briefcase,
  Heart,
  Coins,
  Home,
  HeartPulse,
  Sun,
  Moon,
  Clock,
  BookOpen,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface LifeDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculationData: any;
  fullName?: string;
}

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export function LifeDossierModal({
  isOpen,
  onClose,
  calculationData,
  fullName,
}: LifeDossierModalProps) {
  const { language } = useI18n();
  const isHi = language === 'hi';
  const name = fullName || calculationData?.fullName || 'Seeker';

  const astro = calculationData?.astrology || {};
  const dasha = calculationData?.dasha || {};
  const milestones = calculationData?.milestones || {};
  const storybook = calculationData?.lifeStorybook || {};
  const jaimini = calculationData?.jaimini || {};
  const struggles = calculationData?.struggles || {};
  const ashtakavarga = calculationData?.ashtakavarga || {};

  const lagnaSign = astro.lagna?.sign?.name || astro.ascendant?.sign || 'Aries';
  const moonSign = astro.moonSign?.name || astro.moonSign?.sign || 'Aries';
  const birthNak = astro.birthNakshatra?.name || 'Ashwini';
  const sunSign = astro.planets?.find((p: any) => p.planet === 'Sun')?.sign?.name || 'Aries';

  const activeMaha = dasha.current?.mahadasha?.planet || dasha.current?.mahadasha?.lord || 'Sun';
  const activeAntar = dasha.current?.antardasha?.planet || dasha.current?.antardasha?.lord || 'Moon';
  const antardashaEndDate = dasha.current?.antardasha?.endDate
    ? (typeof dasha.current.antardasha.endDate === 'string'
        ? dasha.current.antardasha.endDate.split('T')[0]
        : dasha.current.antardasha.endDate.toISOString().split('T')[0])
    : '2027-03-01';

  const archetype = storybook?.primaryArchetype || `${lagnaSign} Strategic Leader`;
  const mission = storybook?.coreLifeMission || 'Mastery through autonomy, intellectual foresight, and building enduring scalable systems.';

  // Dynamic House & SAV calculations
  const dynamicHouses = useMemo(() => {
    const lagnaIdx = Math.max(0, ZODIAC_SIGNS.indexOf(lagnaSign));
    const fourthSign = ZODIAC_SIGNS[(lagnaIdx + 3) % 12];
    const seventhSign = ZODIAC_SIGNS[(lagnaIdx + 6) % 12];
    const tenthSign = ZODIAC_SIGNS[(lagnaIdx + 9) % 12];
    const eleventhSign = ZODIAC_SIGNS[(lagnaIdx + 10) % 12];
    const twelfthSign = ZODIAC_SIGNS[(lagnaIdx + 11) % 12];

    const sav = ashtakavarga?.sav?.signPoints || {};
    const fourthPts = sav[fourthSign] || 28;
    const seventhPts = sav[seventhSign] || 28;
    const tenthPts = sav[tenthSign] || 32;
    const eleventhPts = sav[eleventhSign] || 33;
    const twelfthPts = sav[twelfthSign] || 27;

    const netSurplus = eleventhPts - twelfthPts;

    const amkPlanet = jaimini.charaKarakas?.find((k: any) => k.karaka === 'AmK')?.planet || 'Sun';
    const dkPlanet = jaimini.charaKarakas?.find((k: any) => k.karaka === 'DK')?.planet || 'Venus';

    // Milestone date fallbacks
    const careerMile = milestones?.careerLeap?.window || milestones?.careerLeap?.period || '2026–2028';
    const propertyMile = milestones?.propertyPurchase?.window || milestones?.propertyPurchase?.period || '2027–2029';
    const marriageMile = milestones?.marriage?.window || milestones?.marriage?.period || '2026–2028';

    return {
      fourthSign, fourthPts,
      seventhSign, seventhPts,
      tenthSign, tenthPts,
      eleventhSign, eleventhPts,
      twelfthSign, twelfthPts,
      netSurplus,
      amkPlanet, dkPlanet,
      careerMile, propertyMile, marriageMile
    };
  }, [lagnaSign, ashtakavarga, jaimini, milestones]);

  // Dynamic Dosha Profile
  const doshaProfile = useMemo(() => {
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
        adaptogensAndHerbs: ['Ashwagandha', 'CCF Tea', 'Triphala'],
        sattvicDietGuidelines: {
          favored: ['Warm spiced grains', 'Ghee', 'Moong dal'],
          toAvoid: ['Ice-cold beverages', 'Excessive dry/raw salads'],
        },
        breathworkProtocol: 'Nadi Shodhana & Sheetali breathwork',
      };
  }, [calculationData]);

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      {/* Container with print styles */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-9 shadow-2xl text-slate-100 my-8 space-y-7 print:border-none print:shadow-none print:bg-white print:text-black print:p-0 print:m-0">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4 print:hidden">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>{isHi ? 'वेदिका एआई • सम्पूर्ण जीवन रोडमैप डॉसियर' : 'Vedica AI • Executive Life Roadmap Dossier'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isHi ? 'पीडीएफ डाउनलोड / प्रिंट करें' : 'Download PDF / Print'}</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="space-y-6 print:space-y-4">
          {/* Header Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-4 print:border print:border-gray-300 print:bg-gray-50 print:text-black">
            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-amber-400 print:text-amber-800">
                {isHi ? 'प्रमाणित वैदिक जीवन डॉसियर' : 'Verified Vedic Natal Blueprint & Life Roadmap'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 print:text-black mt-1">
                {name}
              </h2>
              <p className="text-xs text-indigo-300 print:text-gray-700 font-medium mt-1">
                {archetype} — {mission}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-1.5 text-xs font-mono text-slate-300 print:text-black">
              <div className="bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800 print:bg-white print:border-gray-300">
                <strong>Lagna:</strong> {lagnaSign} | <strong>Moon:</strong> {moonSign} ({birthNak})
              </div>
              <div className="bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800 print:bg-white print:border-gray-300">
                <strong>Sun:</strong> {sunSign} | <strong>Dasha:</strong> {activeMaha}-{activeAntar} (until {antardashaEndDate})
              </div>
            </div>
          </div>

          {/* 4 Life Horizon Quadrants */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 print:text-amber-800 flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>{isHi ? '१. प्रमुख जीवन क्षेत्र एवं मील के पत्थर (Life Horizons)' : '1. Core Strategic Horizons & Milestone Windows'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Career */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 print:bg-white print:border-gray-300 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 print:text-emerald-800">
                  <Briefcase className="w-4 h-4" />
                  <span>{isHi ? 'करियर एवं नेतृत्व (Career Elevation)' : 'Career & Executive Authority'}</span>
                </div>
                <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed">
                  {isHi
                    ? `दशम भाव (${dynamicHouses.tenthSign}) में ${dynamicHouses.tenthPts} बिंदु व अमात्यकारक (${dynamicHouses.amkPlanet}) स्वायत्त भूमिकाओं, तकनीकी वास्तुकला और रणनीतिक नेतृत्व में उच्च साख दिलाते हैं।`
                    : `10th House in ${dynamicHouses.tenthSign} (${dynamicHouses.tenthPts} SAV bindus) and Amatyakaraka (${dynamicHouses.amkPlanet}) empower sovereign craft and executive authority.`}
                </p>
                <div className="text-[11px] font-mono text-emerald-300 print:text-emerald-900 font-semibold">
                  Prime Leap Window: {typeof dynamicHouses.careerMile === 'string' ? dynamicHouses.careerMile : JSON.stringify(dynamicHouses.careerMile)}
                </div>
              </div>

              {/* Wealth */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 print:bg-white print:border-gray-300 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 print:text-amber-800">
                  <Coins className="w-4 h-4" />
                  <span>{isHi ? 'धन एवं पूंजी संचय (Wealth Surplus)' : 'Wealth & Capital Retention'}</span>
                </div>
                <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed">
                  {isHi
                    ? `लाभ भाव (${dynamicHouses.eleventhSign}, ${dynamicHouses.eleventhPts} बिंदु) व्यय भाव (${dynamicHouses.twelfthSign}, ${dynamicHouses.twelfthPts} बिंदु) से बली है। व्यवस्थित संचय से स्थायी वित्तीय सुरक्षा बनेगी।`
                    : `11th House of Gains (${dynamicHouses.eleventhSign}, ${dynamicHouses.eleventhPts} bindus) outweighs 12th House (${dynamicHouses.twelfthSign}, ${dynamicHouses.twelfthPts} bindus), confirming net surplus compounding.`}
                </p>
                <div className="text-[11px] font-mono text-amber-300 print:text-amber-900 font-semibold">
                  Capital Surplus Ratio: {dynamicHouses.netSurplus >= 0 ? `+${dynamicHouses.netSurplus} Net SAV Bindus (Favorable)` : `${dynamicHouses.netSurplus} Net SAV Bindus`}
                </div>
              </div>

              {/* Foreign & Relocation */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 print:bg-white print:border-gray-300 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400 print:text-sky-800">
                  <Compass className="w-4 h-4" />
                  <span>{isHi ? 'विदेश यात्रा / निवास (Relocation)' : 'Foreign Travel & Global Residence'}</span>
                </div>
                <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed">
                  {isHi
                    ? `${lagnaSign} लग्न और 12वें भाव (${dynamicHouses.twelfthSign}) में ${dynamicHouses.twelfthPts} बिंदु अंतरराष्ट्रीय कार्यभार, बहुराष्ट्रीय सहयोग और विदेशी यात्रा को सक्रिय करते हैं।`
                    : `${lagnaSign} Lagna alignment with 12th House (${dynamicHouses.twelfthSign}, ${dynamicHouses.twelfthPts} bindus) facilitates cross-border operations and global relocation.`}
                </p>
                <div className="text-[11px] font-mono text-sky-300 print:text-sky-900 font-semibold">
                  Active Dasha Alignment: {activeMaha}-{activeAntar}
                </div>
              </div>

              {/* Marriage & Sanctuary */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 print:bg-white print:border-gray-300 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 print:text-rose-800">
                  <Heart className="w-4 h-4" />
                  <span>{isHi ? 'विवाह एवं गृह सुख (Union & Property)' : 'Matrimonial Union & Domestic Sanctuary'}</span>
                </div>
                <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed">
                  {isHi
                    ? `सप्तम भाव (${dynamicHouses.seventhSign}) व दाराकारक (${dynamicHouses.dkPlanet}) व्यावहारिक साथी का संकेत देते हैं। चतुर्थ भाव (${dynamicHouses.fourthSign}, ${dynamicHouses.fourthPts} बिंदु) गृह निर्माण के अनुकूल है।`
                    : `7th House in ${dynamicHouses.seventhSign} & Darakaraka (${dynamicHouses.dkPlanet}) indicate mutually supportive partnership. 4th House (${dynamicHouses.fourthSign}, ${dynamicHouses.fourthPts} bindus) anchors domestic peace.`}
                </p>
                <div className="text-[11px] font-mono text-rose-300 print:text-rose-900 font-semibold">
                  Sanctuary Horizon: {typeof dynamicHouses.propertyMile === 'string' ? dynamicHouses.propertyMile : JSON.stringify(dynamicHouses.propertyMile)}
                </div>
              </div>
            </div>
          </div>

          {/* Ayur-Jyotish & Circadian Matrix */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400 print:text-teal-800 flex items-center gap-2">
              <HeartPulse className="w-4 h-4" />
              <span>{isHi ? '२. आयुर्-ज्योतिष एवं जैविक स्वास्थ्य (Ayur-Jyotish Matrix)' : '2. Ayur-Jyotish & Bio-Rhythm Constitution'}</span>
            </h3>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 print:bg-white print:border-gray-300 space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <span><strong>Primary Dosha:</strong> {doshaProfile.primaryDosha.replace('_', '-')} ({doshaProfile.percentages.vata}% Vata, {doshaProfile.percentages.pitta}% Pitta, {doshaProfile.percentages.kapha}% Kapha)</span>
                <span><strong>Digestive Fire (Agni):</strong> {doshaProfile.digestiveFireType}</span>
                <span><strong>Constitution:</strong> {lagnaSign} Lagna + Sun in {sunSign}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300 print:text-gray-800">
                <div>
                  <strong>Circadian Energy Schedule:</strong> Deep Work ({doshaProfile.circadianBioClock.deepWorkWindow}) • Main Meal ({doshaProfile.circadianBioClock.peakDigestionWindow}) • Sleep ({doshaProfile.circadianBioClock.idealSleepWindow}).
                </div>
                <div>
                  <strong>Sattvic Adaptogens:</strong> {doshaProfile.adaptogensAndHerbs?.join(', ') || 'CCF Tea, Ashwagandha'}.
                </div>
              </div>
            </div>
          </div>

          {/* Action Protocol & Remedial Practice */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 print:text-indigo-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{isHi ? '३. सात्विक कर्म एवं दैनिक उपाय (Sattvic Action Protocol)' : '3. Sattvic Remedial Protocol & Daily Habits'}</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-white print:border-gray-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 print:text-gray-800">
                  <strong>Daily Solar & Breath Practice:</strong> {isHi ? `प्रातः तांबे के लोटे से सूर्य अर्घ्य एवं ${doshaProfile.breathworkProtocol} मन की एकाग्रता व ओजस को संतुलित रखता है।` : `Morning solar hydration & 10 mins of ${doshaProfile.breathworkProtocol} preserves cognitive stamina and vitality.`}
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-white print:border-gray-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 print:text-gray-800">
                  <strong>Strategic Sovereign Compounding:</strong> {isHi ? `दशम भाव (${dynamicHouses.tenthSign}) और महादशा (${activeMaha}-${activeAntar}) के प्रभाव में तात्कालिक सट्टेबाजी से बचें; अपनी दुर्लभ विशेषज्ञता पर केंद्रित रहें।` : `Leverage active ${activeMaha}-${activeAntar} cycle and 10th House in ${dynamicHouses.tenthSign}; prioritize deep rare skill compounding over short-term speculative noise.`}
                </span>
              </div>
            </div>
          </div>

          {/* Classical Footnote */}
          <div className="text-[10px] text-slate-400 print:text-gray-600 border-t border-slate-800 pt-3 flex items-center justify-between font-mono">
            <span>Generated deterministically by VedicaPath Hybrid RAG Engine</span>
            <span>Brihat Parashara Hora Shastra & Jaimini Sutras</span>
          </div>
        </div>
      </div>
    </div>
  );
}

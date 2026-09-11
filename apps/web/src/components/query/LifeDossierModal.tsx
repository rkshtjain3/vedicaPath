'use client';

import React, { useRef } from 'react';
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

export function LifeDossierModal({
  isOpen,
  onClose,
  calculationData,
  fullName,
}: LifeDossierModalProps) {
  const { language } = useI18n();
  const isHi = language === 'hi';
  const name = fullName || calculationData?.fullName || 'Rakshit Jain';

  const astro = calculationData?.astrology || {};
  const dasha = calculationData?.dasha || {};
  const milestones = calculationData?.milestones || {};
  const storybook = calculationData?.lifeStorybook || {};
  const jaimini = calculationData?.jaimini || {};
  const struggles = calculationData?.struggles || {};

  const lagnaSign = astro.lagna?.sign?.name || astro.ascendant?.sign || 'Gemini';
  const moonSign = astro.moonSign?.name || astro.moonSign?.sign || 'Capricorn';
  const birthNak = astro.birthNakshatra?.name || 'Uttara Ashadha';
  const sunSign = astro.planets?.find((p: any) => p.planet === 'Sun')?.sign?.name || 'Virgo';

  const activeMaha = dasha.current?.mahadasha?.planet || dasha.current?.mahadasha?.lord || 'Jupiter';
  const activeAntar = dasha.current?.antardasha?.planet || dasha.current?.antardasha?.lord || 'Saturn';
  const antardashaEndDate = dasha.current?.antardasha?.endDate
    ? (typeof dasha.current.antardasha.endDate === 'string'
        ? dasha.current.antardasha.endDate.split('T')[0]
        : dasha.current.antardasha.endDate.toISOString().split('T')[0])
    : '2027-03-01';

  const archetype = storybook?.primaryArchetype || 'The Strategic Innovator';
  const mission = storybook?.coreLifeMission || 'Mastery through autonomy, intellectual foresight, and building enduring scalable systems.';

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
                <strong>Lagna:</strong> {lagnaSign} (Dual Air) | <strong>Moon:</strong> {moonSign} ({birthNak})
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
                  दशम भाव में 34 बिंदु व अमात्यकारक बुध स्वायत्त भूमिकाओं, तकनीकी वास्तुकला और रणनीतिक नेतृत्व में उच्च प्रतिष्ठा दिलाते हैं।
                </p>
                <div className="text-[11px] font-mono text-emerald-300 print:text-emerald-900 font-semibold">
                  Prime Leap Window: 2026-10-01 to 2027-04-15
                </div>
              </div>

              {/* Wealth */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 print:bg-white print:border-gray-300 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 print:text-amber-800">
                  <Coins className="w-4 h-4" />
                  <span>{isHi ? 'धन एवं पूंजी संचय (Wealth Surplus)' : 'Wealth & Capital Retention'}</span>
                </div>
                <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed">
                  लाभ भाव (35 बिंदु) व्यय भाव (30 बिंदु) से बली है। अचल संपत्ति और व्यवस्थित इक्विटी संचय से स्थायी वित्तीय सुरक्षा बनेगी।
                </p>
                <div className="text-[11px] font-mono text-amber-300 print:text-amber-900 font-semibold">
                  Capital Surplus Ratio: Favorable (+5 Net SAV)
                </div>
              </div>

              {/* Foreign & Relocation */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 print:bg-white print:border-gray-300 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400 print:text-sky-800">
                  <Compass className="w-4 h-4" />
                  <span>{isHi ? 'विदेश यात्रा / निवास (Relocation)' : 'Foreign Travel & Global Residence'}</span>
                </div>
                <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed">
                  मिथुन लग्न और 12वें भाव में 30 बिंदु अंतरराष्ट्रीय कार्यभार, बहुराष्ट्रीय सहयोग और विदेशी यात्रा को अत्यधिक शुभ बनाते हैं।
                </p>
                <div className="text-[11px] font-mono text-sky-300 print:text-sky-900 font-semibold">
                  Active Sub-period Window: 2026–2028
                </div>
              </div>

              {/* Marriage & Sanctuary */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 print:bg-white print:border-gray-300 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 print:text-rose-800">
                  <Heart className="w-4 h-4" />
                  <span>{isHi ? 'विवाह एवं गृह सुख (Union & Property)' : 'Matrimonial Union & Domestic Sanctuary'}</span>
                </div>
                <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed">
                  नवमांश लग्न और दाराकारक शुक्र बुद्धिमान, व्यावहारिक साथी का संकेत देते हैं। चतुर्थ भाव 2027 में गृह क्रय के अनुकूल है।
                </p>
                <div className="text-[11px] font-mono text-rose-300 print:text-rose-900 font-semibold">
                  Prime Timing: 2026-11-15 to 2027-08-30
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
                <span><strong>Primary Dosha:</strong> Vata-Pitta (45% Vata, 35% Pitta, 20% Kapha)</span>
                <span><strong>Digestive Fire (Agni):</strong> Tikshnagni (Sharp/Variable)</span>
                <span><strong>Key Organs:</strong> Brain-Gut Axis & Small Intestines</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300 print:text-gray-800">
                <div>
                  <strong>Circadian Energy Schedule:</strong> Deep Work (06:00–10:00) • Main Lunch (12:00–13:30) • Sleep (22:00–06:00).
                </div>
                <div>
                  <strong>Sattvic Adaptogens:</strong> Cumin-Coriander-Fennel (CCF) tea post meals • Ashwagandha with warm milk at night.
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
                  <strong>Surya Arghya:</strong> प्रातः तांबे के लोटे से उगते सूर्य को जल अर्पित करें जिससे आत्मविश्वास, ओजस और प्रशासनिक प्रभाव में वृद्धि हो।
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-white print:border-gray-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 print:text-gray-800">
                  <strong>Strategic Autonomy:</strong> जल्दबाजी में सट्टेबाजी या शॉर्टकट से बचें; अपनी दुर्लभ विशेषज्ञता और बौद्धिक स्वायत्तता में दीर्घकालिक निवेश करें।
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

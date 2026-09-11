'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import {
  Sun,
  Moon,
  Compass,
  Clock,
  Sparkles,
  Shield,
  Droplets,
  Flame,
  Wind,
  Globe,
  Feather,
  Info,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export interface PanchangaCardProps {
  panchanga: any;
}

export const PanchangaCard: React.FC<PanchangaCardProps> = ({ panchanga }) => {
  const { language } = useI18n();
  const [showEvidence, setShowEvidence] = useState(false);

  if (!panchanga) return null;

  const { tithi, vara, nakshatra, yoga, karana, muhurtha, upagrahas, summary, evidence } = panchanga;

  const elementIcons: Record<string, any> = {
    JALA: Droplets,
    AGNI: Flame,
    VAYU: Wind,
    AKASHA: Globe,
    PRITHVI: Feather,
  };

  const getElementLabel = (elem: string) => {
    if (language === 'hi') {
      const hiMap: Record<string, string> = {
        JALA: 'जल तत्त्व',
        AGNI: 'अग्नि तत्त्व',
        VAYU: 'वायु तत्त्व',
        AKASHA: 'आकाश तत्त्व',
        PRITHVI: 'पृथ्वी तत्त्व',
      };
      return hiMap[elem] || elem;
    }
    return elem.charAt(0) + elem.slice(1).toLowerCase();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6" id="panchanga-section">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-500/20">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {language === 'hi' ? 'वैदिक पञ्चाङ्ग एवं दैनिक काल चक्र' : 'Vedic Panchanga & Daily Cosmic Rhythm'}
              </h3>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                {language === 'hi' ? '५ शास्त्रीय अङ्ग' : '5 CLASSICAL LIMBS'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {summary?.title} • {language === 'hi' ? 'शुद्ध पराशरीय खगोलीय स्थिति' : 'Pure Astronomical Sidereal Alignments'}
            </p>
          </div>
        </div>

        <button
          id="panchanga-evidence-btn"
          onClick={() => setShowEvidence(!showEvidence)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
            showEvidence
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>{showEvidence ? (language === 'hi' ? 'प्रमाण छिपाएं' : 'Hide Evidence') : (language === 'hi' ? 'शास्त्रीय प्रमाण' : 'WHY?')}</span>
          {showEvidence ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 5 Limbs Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3" id="panchanga-limbs-grid">
        {/* 1. TITHI */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2 hover:border-amber-500/40 transition-all">
          <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
            <span className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              {language === 'hi' ? '१. तिथि' : '1. Tithi'}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 font-mono">
              {getElementLabel(tithi?.element || 'JALA')}
            </span>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {language === 'hi' ? tithi?.sanskritName : tithi?.name}
            </div>
            <div className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
              {tithi?.pakshaName?.split(' ')[0]} ({tithi?.nature})
            </div>
          </div>
          <div className="space-y-1 text-[10px] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-1.5">
            <div className="flex justify-between">
              <span>{language === 'hi' ? 'देवता:' : 'Deity:'}</span>
              <strong className="text-slate-800 dark:text-slate-200">{tithi?.deity}</strong>
            </div>
            <div className="flex justify-between">
              <span>{language === 'hi' ? 'स्वामी:' : 'Lord:'}</span>
              <strong className="text-slate-800 dark:text-slate-200">{tithi?.rulingPlanet}</strong>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
              <div
                className="bg-blue-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(0, tithi?.percentageElapsed || 0))}%` }}
              />
            </div>
            <div className="text-[9px] text-slate-500 dark:text-slate-400 text-right">
              {tithi?.percentageElapsed?.toFixed(1)}% {language === 'hi' ? 'बीता' : 'elapsed'}
            </div>
          </div>
        </div>

        {/* 2. VARA */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2 hover:border-amber-500/40 transition-all">
          <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              {language === 'hi' ? '२. वार' : '2. Vara'}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-300 font-mono">
              {getElementLabel(vara?.element || 'AGNI')}
            </span>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {language === 'hi' ? vara?.sanskritName : vara?.name}
            </div>
            <div className="text-[10px] text-rose-700 dark:text-rose-400 font-medium">
              {language === 'hi' ? 'स्वामी:' : 'Lord:'} {vara?.lord}
            </div>
          </div>
          <div className="space-y-1 text-[10px] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-1.5">
            <div className="flex justify-between">
              <span>{language === 'hi' ? 'गुण:' : 'Guna:'}</span>
              <strong className="text-slate-800 dark:text-slate-200">{vara?.guna}</strong>
            </div>
            <div className="text-[9.5px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mt-1">
              {vara?.recommendation}
            </div>
          </div>
        </div>

        {/* 3. NAKSHATRA */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2 hover:border-amber-500/40 transition-all">
          <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
            <span className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-emerald-500" />
              {language === 'hi' ? '३. नक्षत्र' : '3. Nakshatra'}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono">
              {getElementLabel(nakshatra?.element || 'VAYU')}
            </span>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {language === 'hi' ? nakshatra?.sanskritName : nakshatra?.name}
            </div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
              {language === 'hi' ? 'पाद' : 'Pada'} {nakshatra?.pada} ({nakshatra?.gana} Gana)
            </div>
          </div>
          <div className="space-y-1 text-[10px] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-1.5">
            <div className="flex justify-between">
              <span>{language === 'hi' ? 'देवता:' : 'Deity:'}</span>
              <strong className="text-slate-800 dark:text-slate-200 truncate max-w-[90px]">{nakshatra?.deity}</strong>
            </div>
            <div className="flex justify-between">
              <span>{language === 'hi' ? 'स्वामी:' : 'Lord:'}</span>
              <strong className="text-slate-800 dark:text-slate-200">{nakshatra?.lord}</strong>
            </div>
            <div className="flex justify-between text-[9.5px]">
              <span>{language === 'hi' ? 'पशु:' : 'Yoni:'}</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">{nakshatra?.animal}</span>
            </div>
          </div>
        </div>

        {/* 4. YOGA */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2 hover:border-amber-500/40 transition-all">
          <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-purple-500" />
              {language === 'hi' ? '४. योग' : '4. Yoga'}
            </span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
              yoga?.isAuspicious
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
            }`}>
              {yoga?.isAuspicious ? (language === 'hi' ? 'शुभ' : 'Auspicious') : (language === 'hi' ? 'सतर्क' : 'Caution')}
            </span>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {language === 'hi' ? yoga?.sanskritName : yoga?.name}
            </div>
            <div className="text-[10px] text-purple-700 dark:text-purple-400 font-medium">
              {getElementLabel(yoga?.element || 'AKASHA')}
            </div>
          </div>
          <div className="space-y-1 text-[10px] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-1.5">
            <div className="flex justify-between">
              <span>{language === 'hi' ? 'देवता:' : 'Deity:'}</span>
              <strong className="text-slate-800 dark:text-slate-200">{yoga?.deity}</strong>
            </div>
            <div className="text-[9.5px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mt-1">
              {yoga?.meaning}
            </div>
          </div>
        </div>

        {/* 5. KARANA */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2 hover:border-amber-500/40 transition-all">
          <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
            <span className="flex items-center gap-1">
              <Feather className="w-3.5 h-3.5 text-amber-500" />
              {language === 'hi' ? '५. करण' : '5. Karana'}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono">
              {karana?.type}
            </span>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>{language === 'hi' ? karana?.sanskritName : karana?.karanaName}</span>
              {karana?.isVishtiBhadra && (
                <span className="text-[8px] px-1 bg-rose-500/20 text-rose-600 dark:text-rose-300 font-bold rounded">
                  BHADRA
                </span>
              )}
            </div>
            <div className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
              {getElementLabel(karana?.element || 'PRITHVI')}
            </div>
          </div>
          <div className="space-y-1 text-[10px] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-1.5">
            <div className="flex justify-between">
              <span>{language === 'hi' ? 'देवता:' : 'Deity:'}</span>
              <strong className="text-slate-800 dark:text-slate-200">{karana?.deity}</strong>
            </div>
            <div className="text-[9.5px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mt-1">
              {karana?.auspiciousness}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Muhurtha & Cosmic Time Windows */}
      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3" id="muhurtha-windows-section">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            {language === 'hi' ? 'दैनिक मुहूर्त एवं काल विभाजन' : 'Daily Muhurtha & Time Windows'}
          </h4>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            {language === 'hi' ? 'मानक ८-भाग दिन चक्र' : 'Standard 8-Part Diurnal Arc'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {/* Abhijit Muhurta (Golden) */}
          <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-lg p-2.5 space-y-1">
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {language === 'hi' ? 'अभिजित् मुहूर्त' : 'Abhijit Muhurta'}
            </div>
            <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
              {muhurtha?.abhijitMuhurta?.start} – {muhurtha?.abhijitMuhurta?.end}
            </div>
            <div className="text-[9px] text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'सर्वकार्य सिद्धि कारक' : 'Peak Auspicious Window'}
            </div>
          </div>

          {/* Brahma Muhurta */}
          <div className="bg-white dark:bg-slate-900 border border-purple-500/30 rounded-lg p-2.5 space-y-1">
            <div className="text-[10px] text-purple-700 dark:text-purple-400 font-bold flex items-center gap-1">
              <Sun className="w-3 h-3" />
              {language === 'hi' ? 'ब्रह्म मुहूर्त' : 'Brahma Muhurta'}
            </div>
            <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
              {muhurtha?.brahmaMuhurta?.start} – {muhurtha?.brahmaMuhurta?.end}
            </div>
            <div className="text-[9px] text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'ध्यान व आत्म-ज्ञान' : 'Meditation & Clarity'}
            </div>
          </div>

          {/* Rahu Kalam (Caution) */}
          <div className="bg-white dark:bg-slate-900 border border-rose-500/30 rounded-lg p-2.5 space-y-1">
            <div className="text-[10px] text-rose-700 dark:text-rose-400 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {language === 'hi' ? 'राहुकाल (वर्ज्य)' : 'Rahu Kalam (Caution)'}
            </div>
            <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
              {muhurtha?.rahuKalam?.start} – {muhurtha?.rahuKalam?.end}
            </div>
            <div className="text-[9px] text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'नवीन कार्य आरम्भ न करें' : 'Avoid New Undertakings'}
            </div>
          </div>

          {/* Yamaganda */}
          <div className="bg-white dark:bg-slate-900 border border-amber-500/30 rounded-lg p-2.5 space-y-1">
            <div className="text-[10px] text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {language === 'hi' ? 'यमगण्ड' : 'Yamaganda'}
            </div>
            <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
              {muhurtha?.yamaganda?.start} – {muhurtha?.yamaganda?.end}
            </div>
            <div className="text-[9px] text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'महत्वपूर्ण यात्रा से बचें' : 'Travel Caution'}
            </div>
          </div>

          {/* Gulika Kalam */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 space-y-1">
            <div className="text-[10px] text-slate-600 dark:text-slate-300 font-bold flex items-center gap-1">
              <Shield className="w-3 h-3" />
              {language === 'hi' ? 'गुलिक काल' : 'Gulika Kalam'}
            </div>
            <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
              {muhurtha?.gulikaKalam?.start} – {muhurtha?.gulikaKalam?.end}
            </div>
            <div className="text-[9px] text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'शनि का अंश' : 'Saturn\'s Segment'}
            </div>
          </div>
        </div>
      </div>

      {/* Upagrahas Strip (Mandi & Gulika) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="font-bold text-slate-900 dark:text-slate-200">
            {language === 'hi' ? 'शास्त्रीय उपग्रह स्थिति (Upagrahas):' : 'Classical Upagraha Sphutas:'}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <div>
            <span className="text-slate-500 dark:text-slate-400">{language === 'hi' ? 'गुलिक:' : 'Gulika:'} </span>
            <strong className="text-amber-700 dark:text-amber-400">{upagrahas?.gulikaSign} {upagrahas?.gulikaDegreeFormatted}</strong>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">{language === 'hi' ? 'मान्दि:' : 'Mandi:'} </span>
            <strong className="text-amber-700 dark:text-amber-400">{upagrahas?.mandiSign} {upagrahas?.mandiDegreeFormatted}</strong>
          </div>
        </div>
      </div>

      {/* Expandable WHY Evidence Panel */}
      {showEvidence && (
        <div
          id="why-evidence-panchanga"
          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 text-xs font-mono text-slate-700 dark:text-slate-300"
        >
          <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2 pb-1 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            {language === 'hi' ? 'पञ्चाङ्ग गणितीय प्रमाण एवं शास्त्रीय सन्दर्भ' : 'Panchanga Mathematical Trace & Classical Sources'}
          </div>
          <div className="space-y-1 bg-white dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800/80 max-h-64 overflow-y-auto text-[11px]">
            {evidence?.map((line: string, idx: number) => (
              <div
                key={idx}
                className={
                  line.startsWith('===')
                    ? 'font-bold text-amber-800 dark:text-amber-300 pt-1'
                    : line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.') || line.startsWith('5.')
                    ? 'text-slate-900 dark:text-slate-200 font-semibold pl-2'
                    : 'text-slate-600 dark:text-slate-400 pl-4'
                }
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

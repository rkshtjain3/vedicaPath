'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  Moon,
  Sun,
  Flame,
  Award,
  BookOpen,
  Anchor,
  Zap,
  Activity,
  ChevronRight,
  ShieldCheck,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface YoginiPeriod {
  level: string;
  yogini: string;
  hindiName: string;
  sanskritName: string;
  lord: string;
  nature: 'BENEFIC' | 'MALEFIC';
  deity: string;
  significations: string;
  start: string | Date;
  end: string | Date;
  children?: YoginiPeriod[];
  calculationMetadata?: {
    durationYears: number;
    durationDays: number;
  };
}

interface YoginiDashaProps {
  yoginiData?: {
    balance?: {
      nakshatraName: string;
      startingYogini: {
        name: string;
        hindiName: string;
        sanskritName: string;
        lord: string;
        years: number;
        nature: string;
        deity: string;
      };
      balanceYearsAtBirth: number;
      balanceDaysAtBirth: number;
      remainingPercentage: number;
    };
    mahadashas?: YoginiPeriod[];
    current?: {
      mahadasha?: YoginiPeriod;
      antardasha?: YoginiPeriod;
    };
    totalCycles?: number;
  };
}

const YOGINI_METADATA_MAP: Record<
  string,
  {
    icon: any;
    color: string;
    bg: string;
    border: string;
    barColor: string;
    years: number;
    hiTitle: string;
    enTitle: string;
    hiDesc: string;
    enDesc: string;
  }
> = {
  MANGALA: {
    icon: Moon,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    barColor: 'bg-emerald-500',
    years: 1,
    hiTitle: 'मंगला (चंद्र) • १ वर्ष',
    enTitle: 'Mangala (Moon) • 1 Year',
    hiDesc: 'मानसिक शांति, कल्याण, शुभ शुरुआत, पारिवारिक सुख एवं मन की शुचिता।',
    enDesc: 'Peace of mind, auspicious beginnings, mental clarity, and domestic tranquility.',
  },
  PINGALA: {
    icon: Sun,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    barColor: 'bg-amber-500',
    years: 2,
    hiTitle: 'पिंगला (सूर्य) • २ वर्ष',
    enTitle: 'Pingala (Sun) • 2 Years',
    hiDesc: 'आत्म-तेज, अधिकार चुनौती, शारीरिक ऊर्जा, प्रशासनिक व्यस्तता एवं हृदय शुद्धि।',
    enDesc: 'Self-radiance, authority dynamics, physical energy, and purification through action.',
  },
  DHANYA: {
    icon: Award,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    barColor: 'bg-yellow-400',
    years: 3,
    hiTitle: 'धान्या (बृहस्पति) • ३ वर्ष',
    enTitle: 'Dhanya (Jupiter) • 3 Years',
    hiDesc: 'धन-धान्य, ज्ञानार्जन, धर्म, आध्यात्मिक उत्थान एवं गुरु कृपा।',
    enDesc: 'Abundance, wealth multiplication, spiritual wisdom, ethical expansion, and grace.',
  },
  BHRAMARI: {
    icon: Flame,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    barColor: 'bg-rose-500',
    years: 4,
    hiTitle: 'भ्रामरी (मंगल) • ४ वर्ष',
    enTitle: 'Bhramari (Mars) • 4 Years',
    hiDesc: 'यात्राएं, परिवर्तन, प्रतिस्पर्धा, साहसिक कार्य एवं त्वरित निर्णय।',
    enDesc: 'Travel, dynamic movement, intense competitive ambition, and swift courageous action.',
  },
  BHADRIKA: {
    icon: BookOpen,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/30',
    barColor: 'bg-teal-500',
    years: 5,
    hiTitle: 'भद्रिका (बुध) • ५ वर्ष',
    enTitle: 'Bhadrika (Mercury) • 5 Years',
    hiDesc: 'बुद्धि, व्यापार, संचार कौशल, पारिवारिक सौहार्द एवं वार्ता में सफलता।',
    enDesc: 'Intellectual brilliance, commerce, communicative fluency, and family harmony.',
  },
  ULKA: {
    icon: Anchor,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    barColor: 'bg-indigo-500',
    years: 6,
    hiTitle: 'उल्का (शनि) • ६ वर्ष',
    enTitle: 'Ulka (Saturn) • 6 Years',
    hiDesc: 'कठिन परिश्रम, कर्म शुद्धि, अनुशासन, विलंब व धैर्य से स्थायी निर्माण।',
    enDesc: 'Discipline, perseverance, karmic debt settlement, and enduring endurance.',
  },
  SIDDHA: {
    icon: Sparkles,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    barColor: 'bg-pink-400',
    years: 7,
    hiTitle: 'सिद्ध (शुक्र) • ७ वर्ष',
    enTitle: 'Siddha (Venus) • 7 Years',
    hiDesc: 'सिद्धि, कार्य-सफलता, भौतिक ऐश्वर्य, कलात्मक आनंद एवं सर्वतोमुखी विजय।',
    enDesc: 'Fulfillment, artistic accomplishment, luxury, victory, and joyful abundance.',
  },
  SANKATA: {
    icon: Zap,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    barColor: 'bg-violet-500',
    years: 8,
    hiTitle: 'संकटा (राहु) • ८ वर्ष',
    enTitle: 'Sankata (Rahu) • 8 Years',
    hiDesc: 'गहन परिवर्तन, साधना, संकट-निवारण, अज्ञात भय पर विजय एवं आध्यात्मिक कायाकल्प।',
    enDesc: 'Radical transformation, spiritual sadhana, crisis overcoming, and karmic breakthroughs.',
  },
};

const formatDate = (val: any) => {
  if (!val) return '';
  if (typeof val === 'string') return val.split('T')[0];
  if (val instanceof Date) return val.toISOString().split('T')[0];
  return String(val);
};

export const YoginiDashaView: React.FC<YoginiDashaProps> = ({ yoginiData }) => {
  const { language, translatePlanet } = useI18n();
  const [selectedCycle, setSelectedCycle] = useState<number>(1);
  const [selectedMahadasha, setSelectedMahadasha] = useState<YoginiPeriod | null>(null);

  if (!yoginiData || !yoginiData.mahadashas || yoginiData.mahadashas.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
        <Activity className="w-12 h-12 mx-auto mb-3 text-cyan-400 animate-pulse" />
        <h3 className="text-lg font-bold text-slate-200">
          {language === 'hi' ? 'योगिनी दशा डेटा उपलब्ध नहीं' : 'Yogini Dasha Not Computed'}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {language === 'hi'
            ? 'कुंडली की पुनः गणना करें।'
            : 'Recalculate birth chart to load 36-year cyclical Yogini Dasha.'}
        </p>
      </div>
    );
  }

  const { balance, mahadashas, current } = yoginiData;
  const currentMaha = current?.mahadasha;
  const currentAntar = current?.antardasha;

  // Split into 3 cycles (8 periods per 36y cycle)
  const cycle1 = mahadashas.slice(0, 8);
  const cycle2 = mahadashas.slice(8, 16);
  const cycle3 = mahadashas.slice(16, 24);

  const activeCyclePeriods =
    selectedCycle === 1 ? cycle1 : selectedCycle === 2 ? cycle2 : cycle3;

  const currentMahaMeta = currentMaha?.yogini
    ? YOGINI_METADATA_MAP[currentMaha.yogini] || YOGINI_METADATA_MAP.MANGALA
    : YOGINI_METADATA_MAP.MANGALA;

  const currentAntarMeta = currentAntar?.yogini
    ? YOGINI_METADATA_MAP[currentAntar.yogini] || YOGINI_METADATA_MAP.MANGALA
    : YOGINI_METADATA_MAP.MANGALA;

  return (
    <div className="space-y-6" id="yogini-dasha-container">
      {/* 1. HERO BANNER: ACTIVE YOGINI STATUS & BALANCE AT BIRTH */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-teal-400" />
              <span className="text-xs font-bold tracking-wider text-teal-400 uppercase">
                {language === 'hi' ? '३६-वर्षीय शास्त्रीय योगिनी कालचक्र' : 'Classical 36-Year Yogini Dasha Cycle'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mt-1 tracking-tight">
              {language === 'hi' ? 'योगिनी दशा प्रणाली' : 'Yogini Dasha System'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {language === 'hi'
                ? '८ योगिनियों का ३६-वर्षीय सूक्ष्म कालचक्र जो तीव्र जीवन घटनाओं, आध्यात्मिक साधना व शुभाशुभ फलों को प्रकट करता है।'
                : 'The 36-year 8-Yogini cycle revealing acute energy shifts, transformation windows, and precise spiritual rhythms.'}
            </p>
          </div>

          {/* Starting Balance at Birth Badge */}
          {balance && (
            <div className="bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-slate-400">
                {language === 'hi' ? 'जन्म कालीन दशा शेष:' : 'Birth Balance:'}
              </div>
              <div className="text-xs font-bold text-teal-300">
                {language === 'hi'
                  ? `${balance.startingYogini.hindiName} (${balance.balanceYearsAtBirth.toFixed(2)} वर्ष शेष)`
                  : `${balance.startingYogini.name} (${balance.balanceYearsAtBirth.toFixed(2)} yrs left)`}
              </div>
              <div className="text-[10px] text-slate-500">
                {language === 'hi'
                  ? `जन्म नक्षत्र: ${balance.nakshatraName} • ${balance.remainingPercentage.toFixed(1)}% शेष`
                  : `Janma Nakshatra: ${balance.nakshatraName} • ${balance.remainingPercentage.toFixed(1)}% remaining`}
              </div>
            </div>
          )}
        </div>

        {/* Current Active Yogini Mahadasha & Antardasha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Active Yogini Mahadasha */}
          <div className="bg-slate-950/80 border border-teal-500/30 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
                  {language === 'hi' ? 'सक्रिय योगिनी महादशा' : 'Active Yogini Mahadasha'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-500/40">
                  {currentMaha?.nature === 'BENEFIC'
                    ? language === 'hi' ? 'शुभ' : 'BENEFIC'
                    : language === 'hi' ? 'क्रूर / परिवर्तनकारी' : 'MALEFIC / INTENSE'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${currentMahaMeta.bg} ${currentMahaMeta.color}`}>
                  {React.createElement(currentMahaMeta.icon, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-100">
                    {language === 'hi'
                      ? currentMaha?.hindiName || currentMaha?.yogini
                      : currentMaha?.yogini}
                  </h4>
                  <span className="text-xs text-teal-300 font-medium">
                    {language === 'hi'
                      ? `स्वामी: ${translatePlanet(currentMaha?.lord)} • अधिष्ठात्री देवी: ${currentMaha?.deity}`
                      : `Lord: ${currentMaha?.lord} • Deity: ${currentMaha?.deity}`}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {language === 'hi' ? currentMahaMeta.hiDesc : currentMahaMeta.enDesc}
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-800/80 mt-3 flex justify-between">
              <span>{formatDate(currentMaha?.start)}</span>
              <span>—</span>
              <span>{formatDate(currentMaha?.end)}</span>
            </div>
          </div>

          {/* Active Yogini Antardasha */}
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  {language === 'hi' ? 'सक्रिय योगिनी अंतर्दशा' : 'Active Yogini Antardasha'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                  {currentAntar?.nature === 'BENEFIC'
                    ? language === 'hi' ? 'शुभ फल' : 'BENEFIC'
                    : language === 'hi' ? 'सजगता' : 'VIGILANCE'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${currentAntarMeta.bg} ${currentAntarMeta.color}`}>
                  {React.createElement(currentAntarMeta.icon, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-100">
                    {language === 'hi'
                      ? currentAntar?.hindiName || currentAntar?.yogini
                      : currentAntar?.yogini}
                  </h4>
                  <span className="text-xs text-amber-300 font-medium">
                    {language === 'hi'
                      ? `स्वामी: ${translatePlanet(currentAntar?.lord)} • ${currentMaha?.hindiName} के अंतर्गत`
                      : `Lord: ${currentAntar?.lord} • Under ${currentMaha?.yogini}`}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {language === 'hi' ? currentAntarMeta.hiDesc : currentAntarMeta.enDesc}
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-800/80 mt-3 flex justify-between">
              <span>{formatDate(currentAntar?.start)}</span>
              <span>—</span>
              <span>{formatDate(currentAntar?.end)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 36-YEAR CYCLES SELECTOR & JOURNEY MAP */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              {language === 'hi' ? '३६-वर्षीय योगिनी चक्र चयन' : '36-Year Cycle Explorer'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'योगिनी चक्र प्रत्येक ३६ वर्ष में दोहराया जाता है। अपनी आयु के अनुसार चक्र चुनें।'
                : 'The Yogini cycle repeats every 36 years. Select a cycle corresponding to your life stage.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((cyc) => {
              const startAge = (cyc - 1) * 36;
              const endAge = cyc * 36;
              return (
                <button
                  key={cyc}
                  id={`yogini-cycle-${cyc}-btn`}
                  type="button"
                  onClick={() => {
                    setSelectedCycle(cyc);
                    setSelectedMahadasha(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCycle === cyc
                      ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-100 border border-slate-800'
                  }`}
                >
                  {language === 'hi'
                    ? `चक्र ${cyc} (आयु ${startAge}–${endAge})`
                    : `Cycle ${cyc} (Age ${startAge}–${endAge})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* 8 Yoginis in Cycle Visualizer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {activeCyclePeriods.map((period, idx) => {
            const meta = YOGINI_METADATA_MAP[period.yogini] || YOGINI_METADATA_MAP.MANGALA;
            const Icon = meta.icon;
            const isNow =
              currentMaha &&
              new Date(period.start).getTime() <= new Date().getTime() &&
              new Date(period.end).getTime() > new Date().getTime();
            const isSelected = selectedMahadasha?.yogini === period.yogini && selectedMahadasha?.start === period.start;

            return (
              <div
                key={idx}
                id={`yogini-card-${period.yogini}-${idx}`}
                onClick={() => setSelectedMahadasha(isSelected ? null : period)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between shadow-md ${
                  isNow
                    ? 'bg-slate-900 border-teal-500 shadow-teal-500/10 ring-1 ring-teal-500/40'
                    : isSelected
                    ? 'bg-slate-900 border-cyan-500 ring-1 ring-cyan-500/30'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${meta.bg} ${meta.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-100">
                          {language === 'hi' ? period.hindiName : period.yogini}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {translatePlanet(period.lord)} • {meta.years}{language === 'hi' ? ' वर्ष' : 'y'}
                        </div>
                      </div>
                    </div>

                    {isNow && (
                      <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[9px] font-bold border border-teal-500/40">
                        {language === 'hi' ? 'सक्रिय' : 'NOW'}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {language === 'hi' ? meta.hiDesc : meta.enDesc}
                  </p>
                </div>

                <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80 mt-2 flex justify-between">
                  <span>{formatDate(period.start).split('-')[0]}</span>
                  <span>—</span>
                  <span>{formatDate(period.end).split('-')[0]}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Mahadasha Antardasha Inspector */}
        {selectedMahadasha && selectedMahadasha.children && (
          <div className="bg-slate-950/90 border border-teal-500/30 rounded-2xl p-5 mt-4 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <h4 className="text-sm font-bold text-slate-100">
                  {language === 'hi'
                    ? `${selectedMahadasha.hindiName} महादशा की अंतर्दशाएं`
                    : `Antardashas of ${selectedMahadasha.yogini} Mahadasha`}
                </h4>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {formatDate(selectedMahadasha.start)} — {formatDate(selectedMahadasha.end)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {selectedMahadasha.children.map((antar, aIdx) => {
                const aMeta = YOGINI_METADATA_MAP[antar.yogini] || YOGINI_METADATA_MAP.MANGALA;
                const aIcon = aMeta.icon;
                const isAntarNow =
                  new Date(antar.start).getTime() <= new Date().getTime() &&
                  new Date(antar.end).getTime() > new Date().getTime();

                return (
                  <div
                    key={aIdx}
                    className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                      isAntarNow
                        ? 'bg-slate-900 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          {React.createElement(aIcon, { className: `w-3.5 h-3.5 ${aMeta.color}` })}
                          <span className="font-bold text-slate-200">
                            {language === 'hi' ? antar.hindiName : antar.yogini}
                          </span>
                        </div>
                        {isAntarNow && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">
                            {language === 'hi' ? 'सक्रिय' : 'NOW'}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {translatePlanet(antar.lord)} ({antar.nature})
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80 mt-2">
                      {formatDate(antar.start)} – {formatDate(antar.end)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. EIGHT YOGINIS CLASSICAL CODEX & SIGNIFICATIONS */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookOpen className="w-4 h-4 text-teal-400" />
          <h3 className="text-base font-bold text-slate-100">
            {language === 'hi' ? '८ योगिनी संहिता व देवी स्वरूप' : 'The 8 Yogini Codex & Classical Deities'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(YOGINI_METADATA_MAP).map(([key, item]) => {
            const Icon = item.icon;
            return (
              <div
                key={key}
                className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex gap-3.5 items-start"
              >
                <div className={`p-2.5 rounded-xl ${item.bg} ${item.color} shrink-0 mt-0.5`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-200">
                      {language === 'hi' ? item.hiTitle : item.enTitle}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'hi' ? item.hiDesc : item.enDesc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

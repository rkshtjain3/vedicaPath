'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Sun,
  Moon,
  TrendingUp,
  Shield,
  Clock,
  Compass,
  Zap,
  ChevronLeft,
  ChevronRight,
  Heart,
  Briefcase,
  DollarSign,
  Activity,
  Brain,
  AlertTriangle,
  Award,
  BookOpen,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface MonthlyTransitPlanet {
  planet: string;
  sign: string;
  signId: number;
  houseFromLagna: number;
  houseFromMoon: number;
  isRetrograde: boolean;
  dignity?: string;
  savPointsInHouse?: number;
}

interface MonthlyKeyDate {
  date: string;
  dayNumber: number;
  titleEn: string;
  titleHi: string;
  category: string;
  descriptionEn: string;
  descriptionHi: string;
  planetsInvolved: string[];
}

interface DomainPulseItem {
  score: number;
  trend: 'RISING' | 'PEAK' | 'STABLE' | 'CONSOLIDATING';
  keyFactorEn: string;
  keyFactorHi: string;
}

interface MonthlyHoroscopeData {
  year: number;
  month: number;
  monthNameEn: string;
  monthNameHi: string;
  startDate: string;
  endDate: string;
  isCurrentMonth: boolean;
  dashaClimate: {
    mahadashaLord: string;
    antardashaLord: string;
    pratyantardashaLord?: string;
    themeTitleEn: string;
    themeTitleHi: string;
    descriptionEn: string;
    descriptionHi: string;
  };
  cosmicWeather: {
    rating: string;
    titleEn: string;
    titleHi: string;
    score: number;
    summaryEn: string;
    summaryHi: string;
  };
  solarIngress: {
    sign: string;
    signId: number;
    houseFromLagna: number;
    houseFromMoon: number;
    sankrantiNameEn: string;
    sankrantiNameHi: string;
    focusThemeEn: string;
    focusThemeHi: string;
    savPoints: number;
  };
  transits: MonthlyTransitPlanet[];
  domainPulse: {
    career: DomainPulseItem;
    wealth: DomainPulseItem;
    relationships: DomainPulseItem;
    health: DomainPulseItem;
    focus: DomainPulseItem;
  };
  keyDates: MonthlyKeyDate[];
  favorableWindows: Array<{ startDay: number; endDay: number; focusEn: string; focusHi: string }>;
  cautionWindows: Array<{ startDay: number; endDay: number; adviceEn: string; adviceHi: string }>;
  sattvicFocus: {
    element: string;
    habitTitleEn: string;
    habitTitleHi: string;
    habitDescriptionEn: string;
    habitDescriptionHi: string;
    colorResonance: string;
    mindfulnessKeyEn: string;
    mindfulnessKeyHi: string;
  };
  astrologicalWhy: Array<{
    factorEn: string;
    factorHi: string;
    ruleSource: string;
    evidenceStrength: string;
  }>;
}

interface YearlyHoroscopeForecast {
  targetYear: number;
  months: MonthlyHoroscopeData[];
  yearlySummaryEn: string;
  yearlySummaryHi: string;
  peakMonths: number[];
  cautionMonths: number[];
}

interface MonthlyHoroscopeTabProps {
  monthlyForecast?: YearlyHoroscopeForecast;
  onSelectYear?: (year: number) => void;
}

export const MonthlyHoroscopeTab: React.FC<MonthlyHoroscopeTabProps> = ({
  monthlyForecast,
}) => {
  const { language } = useI18n();
  const isHi = language === 'hi';

  const months = monthlyForecast?.months || [];
  const currentMonthIdx = months.findIndex((m) => m.isCurrentMonth);
  const initialMonthIdx = currentMonthIdx >= 0 ? currentMonthIdx : Math.min(new Date().getMonth(), Math.max(0, months.length - 1));

  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(initialMonthIdx);

  if (!monthlyForecast || months.length === 0) {
    return (
      <div className="p-8 text-center bg-card/60 backdrop-blur-md rounded-2xl border border-border">
        <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3 animate-pulse" />
        <h3 className="text-lg font-semibold text-foreground">
          {isHi ? 'मासिक राशिफल डेटा उपलब्ध नहीं है' : 'Monthly Horoscope Data Not Available'}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {isHi
            ? 'कृपया अपनी जन्म कुंडली की गणना करें।'
            : 'Please calculate your birth chart to generate the month-by-month astrological forecast.'}
        </p>
      </div>
    );
  }

  const selectedMonth = months[selectedMonthIdx] || months[0];

  const getWeatherColor = (rating: string) => {
    switch (rating) {
      case 'GOLDEN_OPPORTUNITY':
        return 'from-amber-500/20 via-yellow-500/10 to-transparent border-amber-500/40 text-amber-500 dark:text-amber-400';
      case 'DYNAMIC_MOMENTUM':
        return 'from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-500/40 text-emerald-600 dark:text-emerald-400';
      case 'STRUCTURAL_DISCIPLINE':
        return 'from-purple-500/20 via-indigo-500/10 to-transparent border-purple-500/40 text-purple-600 dark:text-purple-400';
      default:
        return 'from-blue-500/20 via-cyan-500/10 to-transparent border-blue-500/40 text-blue-600 dark:text-blue-400';
    }
  };

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'PEAK':
        return <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">★ {isHi ? 'शिखर' : 'Peak'}</span>;
      case 'RISING':
        return <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">▲ {isHi ? 'उन्नति' : 'Rising'}</span>;
      case 'CONSOLIDATING':
        return <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30">◆ {isHi ? 'स्थिरीकरण' : 'Refining'}</span>;
      default:
        return <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30">● {isHi ? 'स्थिर' : 'Steady'}</span>;
    }
  };

  return (
    <div className="space-y-8" id="monthly-horoscope-container">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-card via-card/90 to-primary/5 border border-border shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5" />
              {isHi ? 'मासिक ज्योतिषीय मौसम व राशिफल' : 'Monthly Horoscope & Cosmic Forecast'}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {isHi ? `वर्ष ${monthlyForecast.targetYear} का संपूर्ण मासिक राशिफल` : `Year ${monthlyForecast.targetYear} Astrological Journey`}
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
              {isHi ? monthlyForecast.yearlySummaryHi : monthlyForecast.yearlySummaryEn}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedMonthIdx((prev) => Math.max(0, prev - 1))}
              disabled={selectedMonthIdx === 0}
              className="p-2.5 rounded-xl border border-border bg-card/80 hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>

            <span className="font-semibold text-sm md:text-base text-foreground min-w-[120px] text-center">
              {isHi ? selectedMonth.monthNameHi : selectedMonth.monthNameEn}
            </span>

            <button
              onClick={() => setSelectedMonthIdx((prev) => Math.min(months.length - 1, prev + 1))}
              disabled={selectedMonthIdx === months.length - 1}
              className="p-2.5 rounded-xl border border-border bg-card/80 hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next Month"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* 12-Month Carousel / Pills */}
        <div className="mt-6 pt-6 border-t border-border/60 overflow-x-auto pb-2 scrollbar-thin">
          <div className="flex items-center gap-2 min-w-max">
            {months.map((m, idx) => {
              const isSelected = idx === selectedMonthIdx;
              const isPeak = monthlyForecast.peakMonths.includes(m.month);
              const isCurrent = m.isCurrentMonth;

              return (
                <button
                  key={m.month}
                  onClick={() => setSelectedMonthIdx(idx)}
                  className={`relative px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105 z-10'
                      : 'bg-card/70 hover:bg-accent/60 text-muted-foreground hover:text-foreground border-border/80'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {isCurrent && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white animate-pulse' : 'bg-primary animate-pulse'}`} />
                    )}
                    <span>{isHi ? m.monthNameHi.split(' ')[0] : m.monthNameEn.split(' ')[0]}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] opacity-85">
                    <span>{m.cosmicWeather.score}/100</span>
                    {isPeak && <span>★</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Month Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Weather, Dasha Climate & Domain Pulse */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cosmic Weather Card */}
          <div className={`rounded-2xl p-6 border bg-gradient-to-br ${getWeatherColor(selectedMonth.cosmicWeather.rating)} bg-card shadow-md`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {isHi ? 'ब्रह्मांडीय वातावरण' : 'Cosmic Weather & Atmosphere'}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mt-1">
                  {isHi ? selectedMonth.cosmicWeather.titleHi : selectedMonth.cosmicWeather.titleEn}
                </h3>
              </div>

              <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-border/80 shadow-sm self-start sm:self-auto">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">
                    {isHi ? 'अनुकूलता स्कोर' : 'Favorable Score'}
                  </div>
                  <div className="text-2xl font-black text-foreground">
                    {selectedMonth.cosmicWeather.score}
                    <span className="text-xs font-normal text-muted-foreground">/100</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>

            <p className="text-sm text-foreground/90 mt-3 leading-relaxed">
              {isHi ? selectedMonth.cosmicWeather.summaryHi : selectedMonth.cosmicWeather.summaryEn}
            </p>

            {/* Dasha & Solar Ingress Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 pt-5 border-t border-border/50">
              <div className="p-3.5 rounded-xl bg-card/60 backdrop-blur-sm border border-border/70">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isHi ? 'सक्रिय महादशा-अंतर्दशा' : 'Active Dasha Climate'}</span>
                </div>
                <div className="font-bold text-foreground text-sm">
                  {selectedMonth.dashaClimate.mahadashaLord} — {selectedMonth.dashaClimate.antardashaLord}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {isHi ? selectedMonth.dashaClimate.themeTitleHi : selectedMonth.dashaClimate.themeTitleEn}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-card/60 backdrop-blur-sm border border-border/70">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                  <Sun className="w-3.5 h-3.5" />
                  <span>{isHi ? 'मासिक सूर्य संक्रांति' : 'Solar Ingress (Sankranti)'}</span>
                </div>
                <div className="font-bold text-foreground text-sm">
                  {isHi ? selectedMonth.solarIngress.sankrantiNameHi.split('(')[0] : selectedMonth.solarIngress.sankrantiNameEn.split('(')[0]}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {isHi ? `जन्म भाव ${selectedMonth.solarIngress.houseFromLagna} (${selectedMonth.solarIngress.savPoints} SAV बिंदु)` : `House ${selectedMonth.solarIngress.houseFromLagna} (${selectedMonth.solarIngress.savPoints} SAV Points)`}
                </div>
              </div>
            </div>
          </div>

          {/* 5-Domain Pulse Meters */}
          <div className="rounded-2xl p-6 bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary" />
                {isHi ? 'मासिक जीवन क्षेत्र तत्परता' : 'Monthly Domain Pulse & Readiness'}
              </h3>
              <span className="text-xs text-muted-foreground">
                {isHi ? '5 प्रमुख क्षेत्रों का विश्लेषण' : '5-Pillar Astrological Assessment'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Career */}
              <div className="p-4 rounded-xl border border-border/70 bg-card/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    <span className="font-bold text-sm text-foreground">{isHi ? 'करियर व नेतृत्व' : 'Career & Leadership'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendBadge(selectedMonth.domainPulse.career.trend)}
                    <span className="font-black text-sm text-foreground">{selectedMonth.domainPulse.career.score}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${selectedMonth.domainPulse.career.score}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {isHi ? selectedMonth.domainPulse.career.keyFactorHi : selectedMonth.domainPulse.career.keyFactorEn}
                </p>
              </div>

              {/* Wealth */}
              <div className="p-4 rounded-xl border border-border/70 bg-card/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-sm text-foreground">{isHi ? 'धन व संपत्ति' : 'Wealth & Finance'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendBadge(selectedMonth.domainPulse.wealth.trend)}
                    <span className="font-black text-sm text-foreground">{selectedMonth.domainPulse.wealth.score}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${selectedMonth.domainPulse.wealth.score}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {isHi ? selectedMonth.domainPulse.wealth.keyFactorHi : selectedMonth.domainPulse.wealth.keyFactorEn}
                </p>
              </div>

              {/* Relationships */}
              <div className="p-4 rounded-xl border border-border/70 bg-card/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span className="font-bold text-sm text-foreground">{isHi ? 'संबंध व परिवार' : 'Relationships & Family'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendBadge(selectedMonth.domainPulse.relationships.trend)}
                    <span className="font-black text-sm text-foreground">{selectedMonth.domainPulse.relationships.score}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${selectedMonth.domainPulse.relationships.score}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {isHi ? selectedMonth.domainPulse.relationships.keyFactorHi : selectedMonth.domainPulse.relationships.keyFactorEn}
                </p>
              </div>

              {/* Health */}
              <div className="p-4 rounded-xl border border-border/70 bg-card/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-sm text-foreground">{isHi ? 'स्वास्थ्य व ऊर्जा' : 'Health & Vitality'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendBadge(selectedMonth.domainPulse.health.trend)}
                    <span className="font-black text-sm text-foreground">{selectedMonth.domainPulse.health.score}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${selectedMonth.domainPulse.health.score}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {isHi ? selectedMonth.domainPulse.health.keyFactorHi : selectedMonth.domainPulse.health.keyFactorEn}
                </p>
              </div>

              {/* Mental Focus */}
              <div className="p-4 rounded-xl border border-border/70 bg-card/50 space-y-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <span className="font-bold text-sm text-foreground">{isHi ? 'मानसिक एकाग्रता व निर्णय' : 'Cognitive Focus & Strategy'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendBadge(selectedMonth.domainPulse.focus.trend)}
                    <span className="font-black text-sm text-foreground">{selectedMonth.domainPulse.focus.score}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${selectedMonth.domainPulse.focus.score}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {isHi ? selectedMonth.domainPulse.focus.keyFactorHi : selectedMonth.domainPulse.focus.keyFactorEn}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Key Dates, Favorable Windows & Sattvic Focus */}
        <div className="space-y-6">
          {/* Key Milestones & Highlight Days */}
          <div className="rounded-2xl p-6 bg-card border border-border shadow-sm space-y-4">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              {isHi ? 'मासिक मुख्य तिथियां व गोचर' : 'Key Planetary Ingresses & Milestones'}
            </h3>

            <div className="space-y-3">
              {selectedMonth.keyDates.map((kd, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                      {isHi ? `दिन ${kd.dayNumber}` : `Day ${kd.dayNumber}`}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                      {kd.category}
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-foreground">
                    {isHi ? kd.titleHi : kd.titleEn}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {isHi ? kd.descriptionHi : kd.descriptionEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Favorable vs Caution Windows */}
          <div className="rounded-2xl p-6 bg-card border border-border shadow-sm space-y-4">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              {isHi ? 'शुभ व संयम की समयावधि' : 'Favorable & Caution Windows'}
            </h3>

            {/* Favorable */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                {isHi ? 'अनुकूल कार्य सिद्धि काल' : 'Favorable Execution Windows'}
              </div>
              {selectedMonth.favorableWindows.map((fw, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-foreground">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 mr-1.5">
                    {isHi ? `दिन ${fw.startDay}–${fw.endDay}:` : `Days ${fw.startDay}–${fw.endDay}:`}
                  </span>
                  {isHi ? fw.focusHi : fw.focusEn}
                </div>
              ))}
            </div>

            {/* Caution */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                {isHi ? 'धैर्य व संतुलन की अवधि' : 'Mindfulness & Caution Windows'}
              </div>
              {selectedMonth.cautionWindows.map((cw, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-foreground">
                  <span className="font-bold text-amber-700 dark:text-amber-300 mr-1.5">
                    {isHi ? `दिन ${cw.startDay}–${cw.endDay}:` : `Days ${cw.startDay}–${cw.endDay}:`}
                  </span>
                  {isHi ? cw.adviceHi : cw.adviceEn}
                </div>
              ))}
            </div>
          </div>

          {/* Sattvic Lifestyle Focus Card */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-card via-card to-primary/5 border border-primary/30 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm text-foreground">
                {isHi ? 'सात्विक जीवनशैली व ध्यान' : 'Sattvic Lifestyle & Mindfulness Focus'}
              </h3>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/80 space-y-1.5">
              <div className="font-bold text-xs text-foreground">
                {isHi ? selectedMonth.sattvicFocus.habitTitleHi : selectedMonth.sattvicFocus.habitTitleEn}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isHi ? selectedMonth.sattvicFocus.habitDescriptionHi : selectedMonth.sattvicFocus.habitDescriptionEn}
              </p>
              <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground font-medium">{isHi ? 'मूल सूत्र:' : 'Key Mantra:'}</span>
                <span className="font-semibold text-primary">
                  {isHi ? selectedMonth.sattvicFocus.mindfulnessKeyHi : selectedMonth.sattvicFocus.mindfulnessKeyEn}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Traceable Astrological Why Section */}
      <div className="rounded-2xl p-6 bg-card border border-border shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          {isHi ? 'ज्योतिषीय प्रमाण व सूत्र (Traceable Astrological Evidence)' : 'Traceable Astrological Evidence & Foundations'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {selectedMonth.astrologicalWhy.map((w, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-primary">{w.ruleSource}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                  {w.evidenceStrength} EVIDENCE
                </span>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed">
                {isHi ? w.factorHi : w.factorEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import {
  Compass,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Sparkles,
  Calculator,
  Table as TableIcon,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Info,
  Clock3,
  Lightbulb,
  Layers,
  Check,
  CheckCircle2,
  X,
  Shield,
  Briefcase,
  Grid3X3,
  BarChart3,
  User,
  FileText,
  HelpCircle,
  Bot,
} from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import { BirthChartTab } from '@/components/chart/BirthChartTab';
import { PrintablePersonalReport } from '@/components/report/PrintablePersonalReport';
import { LifeAnalysisTab } from '@/components/life-analysis/LifeAnalysisTab';
import { LifeStorybookTab } from '@/components/life-analysis/LifeStorybookTab';
import { TimelineTab } from '@/components/timeline/TimelineTab';
import { GocharTab } from '@/components/transit/GocharTab';
import { AskVedicaTab } from '@/components/query/AskVedicaTab';
import { JargonBusterTab } from '@/components/glossary/JargonBusterTab';
import { AstrologyWithoutSuperstitionModal } from '@/components/glossary/AstrologyWithoutSuperstitionModal';
import { PanchangaCard } from '@/components/panchanga/PanchangaCard';
import { DivisionalChartsTab } from '@/components/divisional/DivisionalChartsTab';
import {
  PositionsTab,
  AnalysisTab,
  StrengthTab,
  AshtakavargaTab,
  RulesTab,
  TimingTab,
  InsightsTab,
  DashaExplorerTab,
  NumerologyTab,
  YogasTab,
} from '@/components/observatory';
import { BookOpen, ShieldCheck } from 'lucide-react';
import '@/styles/print.css';



interface PlanetData {
  planet: string;
  longitude: number;
  sign: { name: string; sanskritName: string };
  degreeInSign: number;
  formattedDegree: string;
  nakshatra: { name: string; pada: number; ruler: string };
  isRetrograde: boolean;
}

interface AstrologyResult {
  calculationProfile: {
    version: string;
    name: string;
    zodiac: string;
    ayanamsa: string;
    nodeType: string;
    houseSystem: string;
  };
  ayanamsaValue: number;
  lagna: {
    sign: { name: string; sanskritName: string };
    degreeInSign: number;
    formattedDegree: string;
    nakshatra: { name: string; pada: number };
  };
  moonSign: { name: string; sanskritName: string };
  birthNakshatra: { name: string; pada: number };
  planets: PlanetData[];
}

interface DashaPeriod {
  level: 'MAHADASHA' | 'ANTARDASHA' | 'PRATYANTARDASHA';
  lord: string;
  start: string;
  end: string;
  parentLord?: string;
  children?: DashaPeriod[];
  calculationMetadata?: {
    durationYears: number;
    durationDays: number;
    durationBasis?: string;
  };
}

interface StartingBalance {
  moonLongitude: number;
  nakshatraIndex: number;
  nakshatraName: string;
  nakshatraLord: string;
  positionInNakshatraDegree: number;
  progressPercentage: number;
  remainingPercentage: number;
  fullMahadashaYears: number;
  balanceYearsAtBirth: number;
  balanceDaysAtBirth: number;
}

interface DashaResults {
  balance: StartingBalance;
  mahadashas: DashaPeriod[];
  current: {
    instant: string;
    mahadasha?: DashaPeriod;
    antardasha?: DashaPeriod;
    pratyantardasha?: DashaPeriod;
  };
  yogini?: any;
}


interface ReductionStep {
  stepNumber: number;
  description: string;
  expression: string;
  result: number;
}

interface NumerologyItem {
  title: string;
  finalNumber: number;
  isMasterNumber: boolean;
  formulaSteps: ReductionStep[];
}

interface NumerologyResults {
  lifePath: NumerologyItem;
  birthday: NumerologyItem;
  attitude: NumerologyItem;
  personalYear: NumerologyItem;
  personalMonth: NumerologyItem;
  personalDay: NumerologyItem;
  nameAnalysis?: {
    fullName: string;
    normalizedName: string;
    profileVersion: string;
    system: string;
    expressionNumber: any;
    soulUrgeNumber: any;
    personalityNumber: any;
  } | null;
}


function formatDate(isoStr?: string): string {
  if (!isoStr) return 'N/A';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return 'N/A';
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

export default function HomePage() {
  const {
    t,
    language,
    translatePlanet,
    translateSign,
    translateDignity,
    translateStrength,
    translateRelationship,
    translateNakshatra,
  } = useI18n();
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('1996-09-23');
  const [timeOfBirth, setTimeOfBirth] = useState('23:00:00');
  const [locationName, setLocationName] = useState('Panipat, Haryana, India');
  const [latitude, setLatitude] = useState('29.38747');
  const [longitude, setLongitude] = useState('76.96825');
  const [timezone, setTimezone] = useState('Asia/Kolkata');


  // Location resolution state
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [countriesList, setCountriesList] = useState<{ code: string; name: string }[]>([
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'CA', name: 'Canada' },
    { code: 'DE', name: 'Germany' },
    { code: 'JP', name: 'Japan' },
    { code: 'AE', name: 'United Arab Emirates' },
  ]);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [citySearchResults, setCitySearchResults] = useState<any[]>([]);
  const [isSearchingCities, setIsSearchingCities] = useState(false);
  const [selectedBirthLocation, setSelectedBirthLocation] = useState<any>({
    countryCode: 'IN',
    countryName: 'India',
    city: 'New Delhi',
    region: 'Delhi',
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 'Asia/Kolkata',
    displayName: 'New Delhi, Delhi, India',
    source: 'DEFAULT',
  });
  const [manualOverride, setManualOverride] = useState(false);
  const [showAdvancedLocation, setShowAdvancedLocation] = useState(false);

  // Fetch country list on mount
  React.useEffect(() => {
    fetch('/api/locations/countries')
      .then((res) => res.json())
      .then((data) => {
        if (data.countries && Array.isArray(data.countries)) {
          setCountriesList(data.countries);
        }
      })
      .catch((err) => console.warn('Failed loading countries:', err));
  }, []);

  // Handle city search autocomplete
  const handleCitySearch = async (query: string) => {
    setCitySearchQuery(query);
    if (!query.trim() || query.trim().length < 2) {
      setCitySearchResults([]);
      return;
    }

    setIsSearchingCities(true);
    try {
      const res = await fetch(
        `/api/locations/search?q=${encodeURIComponent(query)}&country=${selectedCountry}`
      );
      const data = await res.json();
      if (data.results && Array.isArray(data.results)) {
        setCitySearchResults(data.results);
      }
    } catch (err) {
      console.warn('City search failed:', err);
    } finally {
      setIsSearchingCities(false);
    }
  };

  const handleSelectLocation = (loc: any) => {
    setSelectedBirthLocation(loc);
    setLocationName(loc.displayName);
    setLatitude(loc.latitude.toString());
    setLongitude(loc.longitude.toString());
    setTimezone(loc.timezone);
    setCitySearchResults([]);
    setCitySearchQuery(loc.city);
  };

  const [activeTab, setActiveTab] = useState<
    'storybook' | 'birthChart' | 'lifeAnalysis' | 'timeline' | 'transits' | 'astrology' | 'analysis' | 'divisional' | 'strength' | 'ashtakavarga' | 'rules' | 'timing' | 'interpretation' | 'dasha' | 'numerology' | 'yogas' | 'report' | 'query' | 'codex'
  >('storybook');
  const [showSuperstitionModal, setShowSuperstitionModal] = useState(false);
  const [selectedCodexTerm, setSelectedCodexTerm] = useState<string | null>(null);
  const [showObservatoryTabs, setShowObservatoryTabs] = useState(true);
  const [isFormCollapsed, setIsFormCollapsed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialAskQuery, setInitialAskQuery] = useState<string>('');

  const [astroData, setAstroData] = useState<AstrologyResult | null>(null);
  const [analysisData, setAnalysisData] = useState<any | null>(null);
  const [yogaData, setYogaData] = useState<any | null>(null);
  const [reportData, setReportData] = useState<any | null>(null);
  const [divisionalData, setDivisionalData] = useState<any | null>(null);
  const [shodashavargaData, setShodashavargaData] = useState<any | null>(null);
  const [vimsopakaBalaData, setVimsopakaBalaData] = useState<any | null>(null);
  const [jaiminiData, setJaiminiData] = useState<any | null>(null);
  const [vargaComparisonData, setVargaComparisonData] = useState<any | null>(null);
  const [dashamsaComparisonData, setDashamsaComparisonData] = useState<any | null>(null);
  const [crossChartData, setCrossChartData] = useState<any | null>(null);
  const [strengthData, setStrengthData] = useState<any | null>(null);
  const [shadbalaData, setShadbalaData] = useState<any | null>(null);
  const [panchangaData, setPanchangaData] = useState<any | null>(null);
  const [ashtakavargaData, setAshtakavargaData] = useState<any | null>(null);
  const [transitAshtakavargaData, setTransitAshtakavargaData] = useState<any | null>(null);
  const [rulesData, setRulesData] = useState<any | null>(null);
  const [careerD10Data, setCareerD10Data] = useState<any | null>(null);
  const [timingData, setTimingData] = useState<any | null>(null);
  const [interpretationData, setInterpretationData] = useState<any | null>(null);
  const [lifeDomainData, setLifeDomainData] = useState<any | null>(null);
  const [timelineData, setTimelineData] = useState<any | null>(null);
  const [monthlyForecastData, setMonthlyForecastData] = useState<any | null>(null);
  const [transitData, setTransitData] = useState<any | null>(null);
  const [convergenceData, setConvergenceData] = useState<any | null>(null);
  const [transitDate, setTransitDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dashaData, setDashaData] = useState<DashaResults | null>(null);
  const [numData, setNumData] = useState<NumerologyResults | null>(null);
  const [milestonesData, setMilestonesData] = useState<any | null>(null);
  const [strugglesData, setStrugglesData] = useState<any | null>(null);
  const [lifeStorybookData, setLifeStorybookData] = useState<any | null>(null);

  const [auditData, setAuditData] = useState<any | null>(null);
  const [dstOccurrencePref, setDstOccurrencePref] = useState<'FIRST' | 'SECOND'>('FIRST');
  const [dstAmbiguousWarning, setDstAmbiguousWarning] = useState<string | null>(null);
  const [dstNonExistentError, setDstNonExistentError] = useState<string | null>(null);
  const [showCalculationDetails, setShowCalculationDetails] = useState(false);

  const SAMPLE_PROFILES = [
    {
      id: 'jobs',
      label: t('sample.jobs'),
      name: 'Steve Jobs',
      dob: '1955-02-24',
      time: '19:15',
      city: 'San Francisco, California, United States',
      lat: 37.7749,
      lon: -122.4194,
      tz: 'America/Los_Angeles',
      country: 'US',
    },
    {
      id: 'kalam',
      label: t('sample.kalam'),
      name: 'Dr. APJ Abdul Kalam',
      dob: '1931-10-15',
      time: '01:15',
      city: 'Rameswaram, Tamil Nadu, India',
      lat: 9.2876,
      lon: 79.3129,
      tz: 'Asia/Kolkata',
      country: 'IN',
    },
    {
      id: 'contemporary',
      label: t('sample.contemporary'),
      name: 'Rakshit Jain',
      dob: '1996-09-23',
      time: '23:00:00',
      city: 'Panipat, Haryana, India',
      lat: 29.38747,
      lon: 76.96825,
      tz: 'Asia/Kolkata',
      country: 'IN',
      dstOccurrencePreference: 'FIRST' as const,
    },
  ];

  const executeCalculate = async (overrideParams?: {
    fullName?: string;
    dateOfBirth?: string;
    timeOfBirth?: string;
    locationName?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
    dstOccurrencePreference?: 'FIRST' | 'SECOND';
  }) => {
    setLoading(true);
    setError(null);
    setDstNonExistentError(null);
    setDstAmbiguousWarning(null);

    const fName = overrideParams?.fullName !== undefined ? overrideParams.fullName : fullName;
    const dob = overrideParams?.dateOfBirth || dateOfBirth;
    const tob = overrideParams?.timeOfBirth || timeOfBirth;
    const locName = overrideParams?.locationName || locationName;
    const lat = overrideParams?.latitude !== undefined ? overrideParams.latitude : parseFloat(latitude);
    const lon = overrideParams?.longitude !== undefined ? overrideParams.longitude : parseFloat(longitude);
    const tz = overrideParams?.timezone || timezone;

    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fName?.trim() || undefined,
          dateOfBirth: dob,
          timeOfBirth: tob,
          locationName: locName,
          latitude: lat,
          longitude: lon,
          timezone: tz,
          dstOccurrencePreference: overrideParams?.dstOccurrencePreference || dstOccurrencePref,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'NON_EXISTENT_LOCAL_TIME') {
          setDstNonExistentError(data.reason || 'This local time did not exist due to a daylight-saving transition.');
          throw new Error('This local time did not exist due to a daylight-saving transition.');
        }
        throw new Error(data.error || 'Failed to compute calculations');
      }

      setAstroData(data.data.astrology);
      setAnalysisData(data.data.analysis);
      setYogaData(data.data.yogaAnalysis);
      setReportData(data.data.report);
      setDivisionalData(data.data.divisionalCharts);
      setShodashavargaData(data.data.shodashavarga);
      setVimsopakaBalaData(data.data.vimsopakaBala);
      setJaiminiData(data.data.jaimini);
      setVargaComparisonData(data.data.vargaComparison?.navamsa || data.data.vargaComparison);
      setDashamsaComparisonData(data.data.dashamsaComparison || data.data.vargaComparison?.dashamsa);
      setCrossChartData(data.data.crossChartAnalysis);
      setStrengthData(data.data.strengthAnalysis);
      setShadbalaData(data.data.shadbala);
      setPanchangaData(data.data.panchanga);
      setAshtakavargaData(data.data.ashtakavarga);
      setTransitAshtakavargaData(data.data.transitAshtakavarga);
      setRulesData(data.data.rules);
      setCareerD10Data(data.data.rules?.careerD10 || null);
      setTimingData(data.data.timing);
      setInterpretationData(data.data.interpretation);
      setLifeDomainData(data.data.lifeDomainAnalysis);
      setTimelineData(data.data.timelineAnalysis);
      setMonthlyForecastData(data.data.monthlyForecast);
      setTransitData(data.data.transitAnalysis);
      setConvergenceData(data.data.natalDashaTransitConvergence);
      setDashaData(data.data.dasha);
      setNumData(data.data.numerology);
      setMilestonesData(data.data.milestones);
      setStrugglesData(data.data.struggles);
      setLifeStorybookData(data.data.lifeStorybook);
      setAuditData(data.data.audit);
      setIsFormCollapsed(true);
      if (data.data.audit?.dstWarning) {
        setDstAmbiguousWarning(data.data.audit.dstWarning);
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeCalculate();
  };

  const handleApplySample = async (sample: typeof SAMPLE_PROFILES[0]) => {
    setFullName(sample.name);
    setDateOfBirth(sample.dob);
    setTimeOfBirth(sample.time);
    setLocationName(sample.city);
    setLatitude(sample.lat.toString());
    setLongitude(sample.lon.toString());
    setTimezone(sample.tz);
    setSelectedCountry(sample.country);
    if ((sample as any).dstOccurrencePreference) {
      setDstOccurrencePref((sample as any).dstOccurrencePreference);
    }
    setSelectedBirthLocation({
      countryCode: sample.country,
      city: sample.city.split(',')[0],
      displayName: sample.city,
      latitude: sample.lat,
      longitude: sample.lon,
      timezone: sample.tz,
      source: 'SAMPLE',
    });

    await executeCalculate({
      fullName: sample.name,
      dateOfBirth: sample.dob,
      timeOfBirth: sample.time,
      locationName: sample.city,
      latitude: sample.lat,
      longitude: sample.lon,
      timezone: sample.tz,
      dstOccurrencePreference: (sample as any).dstOccurrencePreference || 'FIRST',
    });
  };

  const handleTransitDateChange = async (newDateStr: string) => {
    setTransitDate(newDateStr);
    if (!astroData) return;
    setLoading(true);
    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim() || undefined,
          dateOfBirth,
          timeOfBirth,
          locationName,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          timezone,
          transitDate: newDateStr,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTransitData(data.data.transitAnalysis);
        setConvergenceData(data.data.natalDashaTransitConvergence);
      }
    } catch (err: any) {
      console.error('Failed to update transit date:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-3 py-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <header className="space-y-3 sm:space-y-4 pt-2 sm:pt-4 border-b border-slate-800 pb-4 sm:pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] sm:text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> {t('app.phase_tag')}
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                id="header-superstition-btn"
                type="button"
                onClick={() => setShowSuperstitionModal(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {t('app.superstition_btn')}
              </button>
              <Link
                href="/benchmark"
                suppressHydrationWarning
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4 transition"
              >
                {t('app.benchmark_link')}
              </Link>
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </div>

          <div className="text-center space-y-1 sm:space-y-2">
            <h1 id="app-header" className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              {t('app.title')}
            </h1>
            <p className="text-slate-400 text-xs sm:text-base max-w-2xl mx-auto px-2">
              {t('app.subtitle')}
            </p>
          </div>
        </header>

        {/* 1-Click Archetype Quick-Load Bar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 shadow-lg" id="sample-profiles-bar">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {t('sample.title')}
          </span>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {SAMPLE_PROFILES.map((p) => (
              <button
                key={p.id}
                id={`sample-profile-${p.id}`}
                type="button"
                onClick={() => handleApplySample(p)}
                className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-[11px] sm:text-xs text-slate-200 hover:text-amber-300 font-medium transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Profile Summary Card when collapsed */}
        {isFormCollapsed && (astroData || dashaData) ? (
          <div
            className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-3.5 sm:p-4 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200"
            id="collapsed-profile-card"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs sm:text-sm shrink-0">
                {fullName ? fullName.charAt(0).toUpperCase() : '👤'}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-slate-100">
                    {fullName || 'Natal Profile'}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                    Active
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span>📅 {dateOfBirth}</span>
                  <span>⏰ {timeOfBirth}</span>
                  <span className="truncate max-w-[140px] sm:max-w-xs">📍 {locationName}</span>
                  {astroData?.lagna?.sign?.name && (
                    <span className="text-amber-300 font-medium hidden sm:inline">
                      Lagna: {astroData.lagna.sign.name} • Moon: {astroData.moonSign?.name || ''}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              id="expand-profile-form-btn"
              type="button"
              onClick={() => setIsFormCollapsed(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/50 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ml-auto sm:ml-0"
            >
              <span>✏️ {t('form.edit_profile') || 'Edit Birth Details'}</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCalculate} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-8 backdrop-blur-md shadow-2xl space-y-5 sm:space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm sm:text-base">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{t('form.header')}</span>
              </div>
              {(astroData || dashaData) && (
                <button
                  type="button"
                  onClick={() => setIsFormCollapsed(true)}
                  className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
                >
                  <span>Hide Form</span>
                  <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                </button>
              )}
            </div>

          {/* FULL NAME (OPTIONAL) */}
          <div>
            <label htmlFor="full-name-input" className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-400" /> {t('form.full_name')} <span className="text-slate-400 font-normal lowercase">({t('form.optional')})</span>
            </label>
            <input
              id="full-name-input"
              name="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Rakshit Jain"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              {t('form.full_name_help')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="dob-input" className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" /> {t('form.birth_date')}
              </label>
              <input
                id="dob-input"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              />
            </div>


            <div>
              <label htmlFor="tob-input" className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" /> {t('form.birth_time')}
              </label>
              <input
                id="tob-input"
                type="time"
                step="1"
                value={timeOfBirth}
                onChange={(e) => setTimeOfBirth(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              />
            </div>

            {/* Country Selector */}
            <div>
              <label htmlFor="country-select" className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-slate-400" /> {t('form.country')}
              </label>
              <select
                id="country-select"
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setCitySearchResults([]);
                  if (citySearchQuery) handleCitySearch(citySearchQuery);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              >
                {countriesList.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Birth City Autocomplete Search */}
            <div className="relative">
              <label htmlFor="city-search-input" className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" /> {t('form.birth_city')}
              </label>
              <input
                id="city-search-input"
                type="text"
                value={citySearchQuery}
                onChange={(e) => handleCitySearch(e.target.value)}
                placeholder="Type city name (e.g. Panipat, New York, London)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              />
              {isSearchingCities && (
                <div className="absolute right-3 top-9 text-xs text-amber-400 animate-pulse">
                  Searching...
                </div>
              )}

              {/* City Suggestions Dropdown */}
              {citySearchResults.length > 0 && (
                <div id="city-search-results" className="absolute z-50 left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-slate-800">
                  {citySearchResults.map((loc, idx) => (
                    <button
                      key={loc.id || idx}
                      type="button"
                      onClick={() => handleSelectLocation(loc)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-800/80 transition-colors flex flex-col gap-0.5"
                    >
                      <span className="text-sm font-semibold text-amber-300">
                        {loc.displayName}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {loc.latitude >= 0 ? `${loc.latitude.toFixed(4)}°N` : `${Math.abs(loc.latitude).toFixed(4)}°S`}, {' '}
                        {loc.longitude >= 0 ? `${loc.longitude.toFixed(4)}°E` : `${Math.abs(loc.longitude).toFixed(4)}°W`} | {loc.timezone}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Location Card */}
            <div className="sm:col-span-2 lg:col-span-1 bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-center gap-1.5" id="selected-location-summary">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Selected Birth Location
              </span>
              <span className="text-sm font-bold text-amber-300 truncate">
                {selectedBirthLocation?.displayName || locationName}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Lat: {latitude}° | Lon: {longitude}° | TZ: {timezone}
              </span>
            </div>
          </div>

          {/* Advanced Location Details Toggle & Container */}
          <div className="border-t border-slate-800/60 pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowAdvancedLocation(!showAdvancedLocation)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                {showAdvancedLocation ? <ChevronDown className="w-4 h-4 text-amber-400" /> : <ChevronRight className="w-4 h-4 text-amber-400" />}
                <span>Advanced Location Details & Manual Override</span>
              </button>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  id="manual-override-checkbox"
                  type="checkbox"
                  checked={manualOverride}
                  onChange={(e) => setManualOverride(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500/40"
                />
                <span>Use Manual Coordinates</span>
              </label>
            </div>

            {manualOverride && (
              <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 text-amber-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  Warning: Manual location values may produce incorrect astrology calculations if they are inaccurate.
                </span>
              </div>
            )}

            {(showAdvancedLocation || manualOverride) && (
              <div id="advanced-location-details" className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                <div>
                  <label htmlFor="latitude" className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Latitude (° N/S)
                  </label>
                  <input
                    id="latitude"
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    readOnly={!manualOverride}
                    required
                    className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 ${
                      !manualOverride ? 'opacity-70 cursor-not-allowed' : 'focus:ring-2 focus:ring-amber-500/50'
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="longitude" className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Longitude (° E/W)
                  </label>
                  <input
                    id="longitude"
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    readOnly={!manualOverride}
                    required
                    className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 ${
                      !manualOverride ? 'opacity-70 cursor-not-allowed' : 'focus:ring-2 focus:ring-amber-500/50'
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="timezone" className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                    Timezone (IANA)
                  </label>
                  <input
                    id="timezone"
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    readOnly={!manualOverride}
                    required
                    className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 ${
                      !manualOverride ? 'opacity-70 cursor-not-allowed' : 'focus:ring-2 focus:ring-amber-500/50'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* DST Non-Existent Time Alert */}
          {dstNonExistentError && (
            <div id="dst-non-existent-banner" className="bg-red-950/60 border border-red-500/40 rounded-xl p-3.5 text-xs text-red-300 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{dstNonExistentError}</span>
            </div>
          )}

          {/* DST Ambiguous Time Selection Prompt */}
          {dstAmbiguousWarning && (
            <div id="dst-ambiguous-prompt" className="bg-amber-950/60 border border-amber-500/40 rounded-xl p-3.5 text-xs text-amber-300 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{dstAmbiguousWarning}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <span className="text-slate-400">Select Daylight Saving occurrence:</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="dstOccurrence"
                    value="FIRST"
                    checked={dstOccurrencePref === 'FIRST'}
                    onChange={() => setDstOccurrencePref('FIRST')}
                    className="text-amber-500 bg-slate-950 border-slate-700 focus:ring-amber-500"
                  />
                  <span>1st Occurrence (Daylight Time)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="dstOccurrence"
                    value="SECOND"
                    checked={dstOccurrencePref === 'SECOND'}
                    onChange={() => setDstOccurrencePref('SECOND')}
                    className="text-amber-500 bg-slate-950 border-slate-700 focus:ring-amber-500"
                  />
                  <span>2nd Occurrence (Standard Time)</span>
                </label>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {(astroData || dashaData) && (
              <button
                type="button"
                onClick={() => setIsFormCollapsed(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Hide Form
              </button>
            )}
            <div className="flex justify-end ml-auto">
              <button
                id="calculate-btn"
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-200 flex items-center justify-center gap-2 text-sm uppercase tracking-wider disabled:opacity-50"
              >
                <Calculator className="w-4 h-4" />
                {loading ? t('form.calculating') : t('form.calculate')}
              </button>
            </div>
          </div>
        </form>
        )}

        {error && (
          <div id="error-banner" className="bg-red-950/50 border border-red-800/80 rounded-xl p-4 text-red-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {auditData && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3" id="calculation-audit-details">
            <button
              type="button"
              onClick={() => setShowCalculationDetails(!showCalculationDetails)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-400 hover:text-slate-200 uppercase tracking-wider"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Calculation Details & Input Fingerprint
              </span>
              {showCalculationDetails ? <ChevronDown className="w-4 h-4 text-amber-400" /> : <ChevronRight className="w-4 h-4 text-amber-400" />}
            </button>

            {showCalculationDetails && (
              <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-300">
                <div><span className="text-slate-500">Birth Date:</span> {auditData.birthLocalDate}</div>
                <div><span className="text-slate-500">Birth Time:</span> {auditData.birthLocalTime}</div>
                <div><span className="text-slate-500">Selected Location:</span> {auditData.location.displayName}</div>
                <div><span className="text-slate-500">Coordinates:</span> {auditData.location.latitude.toFixed(4)}°, {auditData.location.longitude.toFixed(4)}°</div>
                <div><span className="text-slate-500">Timezone (IANA):</span> {auditData.location.timezone}</div>
                <div><span className="text-slate-500">UTC Birth Instant:</span> {auditData.resolvedUTC}</div>
                <div><span className="text-slate-500">Calculation Profile:</span> {auditData.calculationProfile}</div>
                <div><span className="text-slate-500">Local Time Status:</span> {auditData.localTimeResolution}</div>
                <div className="sm:col-span-2"><span className="text-slate-500">Input Fingerprint:</span> <span className="text-amber-300 font-bold break-all" id="input-fingerprint-display">{auditData.inputFingerprint}</span></div>
                <div className="sm:col-span-2"><span className="text-slate-500">Reproducibility Hash:</span> <span className="text-emerald-300 font-bold break-all" id="reproducibility-hash-display">{auditData.reproducibilityHash}</span></div>
              </div>
            )}
          </div>
        )}

        {(astroData || dashaData || numData) && (
          <div className="space-y-6">
            {/* Two-Tier Navigation System */}
            <div className="space-y-3">
              {/* Perspective Header / Mode Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-amber-400" />
                    {t('mode.compass')}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                    {t('mode.badge_compass')}
                  </span>
                </div>

                <button
                  id="toggle-observatory-tabs"
                  type="button"
                  onClick={() => setShowObservatoryTabs(!showObservatoryTabs)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                    showObservatoryTabs
                      ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t('mode.observatory')}</span>
                  {showObservatoryTabs ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Primary Compass Tabs (Personal Guidance) */}
              <div className="flex border-b border-slate-800 gap-3 overflow-x-auto pb-1" id="results-tabs">
                <button
                  id="tab-storybook"
                  onClick={() => setActiveTab('storybook')}
                  className={`pb-3 px-4 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
                    activeTab === 'storybook'
                      ? 'border-indigo-500 text-indigo-300 font-bold bg-indigo-500/10 rounded-t-lg'
                      : 'border-transparent text-slate-300 hover:text-slate-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-indigo-400" /> {t('tabs.storybook')}
                </button>
                <button
                  id="tab-life-analysis"
                  onClick={() => setActiveTab('lifeAnalysis')}
                  className={`pb-3 px-4 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
                    activeTab === 'lifeAnalysis'
                      ? 'border-amber-500 text-amber-300 font-bold bg-amber-500/10 rounded-t-lg'
                      : 'border-transparent text-slate-300 hover:text-slate-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" /> {t('tabs.life_navigator')}
                </button>
                <button
                  id="tab-query"
                  onClick={() => setActiveTab('query')}
                  className={`pb-3 px-4 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
                    activeTab === 'query'
                      ? 'border-amber-500 text-amber-400 font-bold bg-amber-500/10 rounded-t-lg'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Bot className="w-4 h-4 text-amber-400" />
                  <span>{language === 'hi' ? '🤖 वेदिका एआई सलाहकार' : '🤖 Vedica AI Agent'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono hidden sm:inline-block">
                    LIVE
                  </span>
                </button>
                <button
                  id="tab-timeline"
                  onClick={() => setActiveTab('timeline')}
                  className={`pb-3 px-4 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
                    activeTab === 'timeline'
                      ? 'border-cyan-500 text-cyan-400 font-bold bg-cyan-500/10 rounded-t-lg'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Clock className="w-4 h-4 text-cyan-400" /> {t('tabs.timeline')}
                </button>
                <button
                  id="tab-birth-chart"
                  onClick={() => setActiveTab('birthChart')}
                  className={`pb-3 px-4 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
                    activeTab === 'birthChart'
                      ? 'border-indigo-500 text-indigo-400 font-bold bg-indigo-500/10 rounded-t-lg'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Compass className="w-4 h-4 text-indigo-400" /> {t('tabs.birth_chart')}
                </button>
                <button
                  id="tab-transits"
                  onClick={() => setActiveTab('transits')}
                  className={`pb-3 px-4 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
                    activeTab === 'transits'
                      ? 'border-cyan-500 text-cyan-400 font-bold bg-cyan-500/10 rounded-t-lg'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" /> {t('tabs.transits')}
                </button>
                <button
                  id="tab-codex"
                  onClick={() => setActiveTab('codex')}
                  className={`pb-3 px-4 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
                    activeTab === 'codex'
                      ? 'border-emerald-500 text-emerald-300 font-bold bg-emerald-500/10 rounded-t-lg'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" /> {t('tabs.codex')}
                </button>
                <button
                  id="tab-report"
                  onClick={() => setActiveTab('report')}
                  className={`pb-3 px-4 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
                    activeTab === 'report'
                      ? 'border-indigo-500 text-indigo-300 font-bold bg-indigo-500/10 rounded-t-lg'
                      : 'border-transparent text-indigo-400 hover:text-indigo-200'
                  }`}
                >
                  <FileText className="w-4 h-4 text-indigo-400" /> {t('tabs.personal_report')}
                </button>
              </div>

              {/* Secondary Astrological Observatory Toolbar */}
              <div 
                id="observatory-tabs-container"
                className={`bg-slate-950/90 border border-slate-800/90 rounded-xl p-2.5 flex items-center gap-2 overflow-x-auto ${
                  showObservatoryTabs ? 'flex animate-in fade-in duration-200' : 'hidden'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-slate-500 px-2 shrink-0 font-mono">
                  {t('mode.badge_observatory')}:
                </span>
                <button
                  id="tab-astrology"
                  onClick={() => setActiveTab('astrology')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'astrology'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" /> {t('tabs.positions')}
                </button>
                <button
                  id="tab-analysis"
                  onClick={() => setActiveTab('analysis')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'analysis'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" /> {t('tabs.facts_yogas')}
                </button>
                <button
                  id="tab-divisional"
                  onClick={() => setActiveTab('divisional')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'divisional'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" /> {t('tabs.divisional')}
                </button>
                <button
                  id="tab-strength"
                  onClick={() => setActiveTab('strength')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'strength'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" /> {t('tabs.strength')}
                </button>
                <button
                  id="tab-ashtakavarga"
                  onClick={() => setActiveTab('ashtakavarga')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'ashtakavarga'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Grid3X3 className="w-3.5 h-3.5" /> {t('tabs.ashtakavarga')}
                </button>
                <button
                  id="tab-rules"
                  onClick={() => setActiveTab('rules')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'rules'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> {t('tabs.rules')}
                </button>
                <button
                  id="tab-timing"
                  onClick={() => setActiveTab('timing')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'timing'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" /> {t('tabs.timing_transits')}
                </button>
                <button
                  id="tab-interpretation"
                  onClick={() => setActiveTab('interpretation')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'interpretation'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" /> {t('tabs.insights')}
                </button>
                <button
                  id="tab-dasha"
                  onClick={() => setActiveTab('dasha')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'dasha'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Clock3 className="w-3.5 h-3.5" /> {t('tabs.dasha')}
                </button>
                <button
                  id="tab-numerology"
                  onClick={() => setActiveTab('numerology')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'numerology'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" /> {t('tabs.numerology')}
                </button>
                <button
                  id="tab-yogas"
                  onClick={() => setActiveTab('yogas')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'yogas'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> {t('tabs.yogas')}
                </button>
              </div>
            </div>

            {activeTab === 'birthChart' && (
              <div id="birth-chart-tab-content">
                <BirthChartTab
                  calculationResult={{
                    data: {
                      astrology: astroData,
                      divisionalCharts: divisionalData,
                      shodashavarga: shodashavargaData,
                      transits: transitData,
                      crossChartAnalysis: crossChartData,
                      vargaComparison: vargaComparisonData,
                      strengthAnalysis: strengthData,
                      shadbala: shadbalaData,
                      panchanga: panchangaData,
                      yogaAnalysis: yogaData,
                      rules: rulesData,
                      audit: auditData,
                      fullName,
                    },
                  }}
                />
              </div>
            )}

            {activeTab === 'storybook' && (
              <div id="storybook-tab-content">
                <LifeStorybookTab
                  lifeStorybook={lifeStorybookData}
                  milestones={milestonesData}
                  struggles={strugglesData}
                  fullName={fullName}
                  astroData={astroData}
                  onNavigateTab={(tab, queryPrompt) => {
                    if (queryPrompt && tab === 'query') {
                      setInitialAskQuery(queryPrompt);
                    }
                    setActiveTab(tab as any);
                  }}
                />
              </div>
            )}

            {activeTab === 'lifeAnalysis' && (
              <div id="life-analysis-tab-content">
                <LifeAnalysisTab
                  lifeDomainAnalysis={lifeDomainData}
                  fullName={fullName}
                  astroData={astroData}
                  dashaData={dashaData}
                  transitData={transitData}
                  yogaData={yogaData}
                  onNavigateTab={(tab, queryPrompt) => {
                    if (queryPrompt && tab === 'query') {
                      setInitialAskQuery(queryPrompt);
                    }
                    setActiveTab(tab as any);
                  }}
                />
              </div>
            )}

            {activeTab === 'timeline' && (
              <div id="timeline-tab-content">
                <TimelineTab
                  timelineData={timelineData}
                  monthlyForecast={monthlyForecastData}
                  yoginiData={dashaData?.yogini}
                />
              </div>
            )}


            {activeTab === 'transits' && (
              <div id="transits-tab-content">
                <GocharTab
                  transitData={transitData}
                  convergenceData={convergenceData}
                  onDateChange={handleTransitDateChange}
                  isLoading={loading}
                />
              </div>
            )}

            {activeTab === 'query' && (
              <div id="query-tab-content">
                <AskVedicaTab
                  calculationData={{
                    astrology: astroData,
                    analysis: analysisData,
                    yogaAnalysis: yogaData,
                    divisionalCharts: divisionalData,
                    vargaComparison: vargaComparisonData,
                    strengthAnalysis: strengthData,
                    shadbala: shadbalaData,
                    ashtakavarga: ashtakavargaData,
                    transitAshtakavarga: transitAshtakavargaData,
                    rules: rulesData,
                    careerD10: careerD10Data,
                    lifeDomainAnalysis: lifeDomainData,
                    timelineAnalysis: timelineData,
                    transitAnalysis: transitData,
                    natalDashaTransitConvergence: convergenceData,
                    dasha: dashaData,
                    numerology: numData,
                    fullName,
                    reproducibilityHash: auditData?.reproducibilityHash,
                  }}
                  fullName={fullName}
                  transitDate={transitDate}
                  initialQuery={initialAskQuery}
                />
              </div>
            )}

            {activeTab === 'codex' && (
              <div id="codex-tab-content">
                <JargonBusterTab initialTermId={selectedCodexTerm} />
              </div>
            )}

            {activeTab === 'astrology' && astroData && (
              <PositionsTab astroData={astroData} panchangaData={panchangaData} />
            )}

            {activeTab === 'analysis' && analysisData && (
              <AnalysisTab analysisData={analysisData} />
            )}

            {activeTab === 'divisional' && (
              <DivisionalChartsTab
                shodashavargaData={shodashavargaData}
                vimsopakaBalaData={vimsopakaBalaData}
                jaiminiData={jaiminiData}
                vargaComparisonData={vargaComparisonData}
                dashamsaComparisonData={dashamsaComparisonData}
                careerCrossChartData={crossChartData?.career}
                lang={language}
              />
            )}

            {activeTab === 'strength' && strengthData && (
              <StrengthTab strengthData={strengthData} shadbalaData={shadbalaData} />
            )}

            {activeTab === 'ashtakavarga' && ashtakavargaData && (
              <AshtakavargaTab ashtakavargaData={ashtakavargaData} />
            )}

            {activeTab === 'rules' && rulesData && (
              <RulesTab rulesData={rulesData} careerD10Data={careerD10Data} />
            )}

            {activeTab === 'timing' && timingData && (
              <TimingTab timingData={timingData} transitAshtakavargaData={transitAshtakavargaData} />
            )}

            {activeTab === 'interpretation' && interpretationData && (
              <InsightsTab interpretationData={interpretationData} />
            )}

            {activeTab === 'dasha' && dashaData && (
              <DashaExplorerTab dashaData={dashaData} />
            )}

            {activeTab === 'numerology' && numData && (
              <NumerologyTab numData={numData} />
            )}

            {activeTab === 'yogas' && (yogaData || analysisData) && (
              <YogasTab yogaData={yogaData} analysisData={analysisData} />
            )}

            {activeTab === 'report' && (astroData || reportData) && (
              <div id="report-content" className="space-y-8">
                <PrintablePersonalReport
                  calculationResult={{
                    data: {
                      astrology: astroData,
                      analysis: analysisData,
                      yogaAnalysis: yogaData,
                      divisionalCharts: divisionalData,
                      vargaComparison: vargaComparisonData,
                      strengthAnalysis: strengthData,
                      shadbala: shadbalaData,
                      ashtakavarga: ashtakavargaData,
                      transitAshtakavarga: transitAshtakavargaData,
                      rules: rulesData,
                      timing: timingData,
                      dasha: dashaData,
                      numerology: numData,
                      lifeDomainAnalysis: lifeDomainData,
                      report: reportData,
                      audit: auditData,
                    },
                  }}
                  userProfile={{ fullName }}
                />
              </div>
            )}

          </div>
        )}
      </div>

      {/* Astrology Without Superstition Modal */}
      <AstrologyWithoutSuperstitionModal
        isOpen={showSuperstitionModal}
        onClose={() => setShowSuperstitionModal(false)}
        onOpenCodexTab={() => {
          setShowSuperstitionModal(false);
          setActiveTab('codex');
        }}
      />
    </main>
  );
}

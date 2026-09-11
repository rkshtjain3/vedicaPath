'use client';

import React, { useState, useEffect } from 'react';
import {
  ChartStyle,
  ChartType,
  ChartPlanet,
  ChartHouse,
  buildChartViewModel,
  NorthIndianChart,
  SouthIndianChart,
  AccessibilityTable,
  getPlanetaryAspects,
} from '@vedica/chart-renderer';
import { PlanetDetailPanel } from './PlanetDetailPanel';
import { HouseDetailPanel } from './HouseDetailPanel';
import { Layers, Eye, Sparkles, Orbit, Table, Compass, ChevronDown, Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export interface VedicChartContainerProps {
  calculationResult: any;
  defaultChartType?: ChartType;
  className?: string;
}

const STORAGE_KEY_STYLE = 'vedica_chart_style_preference';

const ALL_VARGAS: { id: ChartType; labelEn: string; labelHi: string; desc: string }[] = [
  { id: 'D1', labelEn: 'D1 Rashi', labelHi: 'डी१ राशि', desc: 'Physical Body, Self & Life Path' },
  { id: 'D2', labelEn: 'D2 Hora', labelHi: 'डी२ होरा', desc: 'Wealth, Liquid Assets & Resources' },
  { id: 'D3', labelEn: 'D3 Drekkana', labelHi: 'डी३ द्रेष्काण', desc: 'Siblings, Courage & Initiative' },
  { id: 'D4', labelEn: 'D4 Chaturthamsa', labelHi: 'डी४ चतुर्थांश', desc: 'Fixed Assets, Land & Home' },
  { id: 'D7', labelEn: 'D7 Saptamsa', labelHi: 'डी७ सप्तांश', desc: 'Children & Creative Progeny' },
  { id: 'D9', labelEn: 'D9 Navamsa', labelHi: 'डी९ नवांश', desc: 'Dharma, Marriage & Soul Destiny' },
  { id: 'D10', labelEn: 'D10 Dashamsa', labelHi: 'डी१० दशांश', desc: 'Career, Status & Profession' },
  { id: 'D12', labelEn: 'D12 Dwadasamsa', labelHi: 'डी१२ द्वादशांश', desc: 'Parents & Ancestral Lineage' },
  { id: 'D16', labelEn: 'D16 Shodashamsa', labelHi: 'डी१६ षोडशांश', desc: 'Vehicles, Luxuries & Happiness' },
  { id: 'D20', labelEn: 'D20 Vimsamsa', labelHi: 'डी२० विंशांश', desc: 'Spiritual Progress & Sadhana' },
  { id: 'D24', labelEn: 'D24 Chaturvimsamsa', labelHi: 'डी२४ चतुर्विंशांश', desc: 'Higher Learning & Intellect' },
  { id: 'D27', labelEn: 'D27 Saptavimsamsa', labelHi: 'डी२७ सप्तविंशांश', desc: 'Strengths & Weaknesses' },
  { id: 'D30', labelEn: 'D30 Trimsamsa', labelHi: 'डी३० त्रिंशांश', desc: 'Karmic Evils & Afflictions' },
  { id: 'D40', labelEn: 'D40 Khavedamsa', labelHi: 'डी४० खवेदांश', desc: 'Auspicious & Inauspicious Results' },
  { id: 'D45', labelEn: 'D45 Akshavedamsa', labelHi: 'डी४५ अक्षावेदांश', desc: 'Moral Character & General Well-being' },
  { id: 'D60', labelEn: 'D60 Shashtyamsa', labelHi: 'डी६० षष्ट्यंश', desc: 'Past-Life Karma & Micro-Destiny' },
];

export const VedicChartContainer: React.FC<VedicChartContainerProps> = ({
  calculationResult,
  defaultChartType = 'D1',
  className = '',
}) => {
  const { language, translateSign } = useI18n();
  const [chartType, setChartType] = useState<ChartType>(defaultChartType);
  const [chartStyle, setChartStyle] = useState<ChartStyle>('NORTH_INDIAN');
  const [showAccessibilityTable, setShowAccessibilityTable] = useState<boolean>(false);
  const [showAspectRays, setShowAspectRays] = useState<boolean>(true);
  const [showTransitOverlay, setShowTransitOverlay] = useState<boolean>(false);
  const [selectedPlanet, setSelectedPlanet] = useState<ChartPlanet | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<ChartHouse | null>(null);
  const [isVargaDropdownOpen, setIsVargaDropdownOpen] = useState<boolean>(false);

  // Load style preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STYLE);
      if (saved === 'NORTH_INDIAN' || saved === 'SOUTH_INDIAN') {
        setChartStyle(saved);
      }
    } catch {
      // Ignore localStorage read errors in SSR/restricted environments
    }
  }, []);

  const handleStyleChange = (newStyle: ChartStyle) => {
    setChartStyle(newStyle);
    try {
      localStorage.setItem(STORAGE_KEY_STYLE, newStyle);
    } catch {
      // Ignore write errors
    }
  };

  // Build ViewModel deterministically from existing calculation result and optional transit data
  const transitData = calculationResult?.data?.transits || calculationResult?.transits;
  const viewModel = buildChartViewModel(
    calculationResult?.data || calculationResult,
    chartType,
    chartStyle,
    {
      showTransitOverlay,
      transitData,
    }
  );

  // Compute aspects for currently selected planet to show in summary banner
  const selectedPlanetAspects =
    selectedPlanet && showAspectRays
      ? getPlanetaryAspects(selectedPlanet.planet.replace(/^T-/, ''), selectedPlanet.house)
      : [];

  return (
    <div id="chart-container" className={`space-y-6 ${className}`}>
      {/* Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        {/* Quick Varga Selector & Shodashavarga Dropdown */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['D1', 'D9', 'D10', 'D60'] as ChartType[]).map((type) => {
              const item = ALL_VARGAS.find((v) => v.id === type)!;
              const isActive = chartType === type;

              return (
                <button
                  key={type}
                  id={`chart-type-${type.toLowerCase()}`}
                  onClick={() => {
                    setChartType(type);
                    setSelectedPlanet(null);
                    setSelectedHouse(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {language === 'hi' ? item.labelHi : item.labelEn}
                </button>
              );
            })}
          </div>

          {/* More Varga Selector Dropdown */}
          <div className="relative">
            <button
              id="chart-varga-dropdown-btn"
              onClick={() => setIsVargaDropdownOpen(!isVargaDropdownOpen)}
              className={`px-3 py-2 rounded-xl border font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                !['D1', 'D9', 'D10', 'D60'].includes(chartType)
                  ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <span>
                {language === 'hi'
                  ? ALL_VARGAS.find((v) => v.id === chartType)?.labelHi || 'षोडशवर्ग'
                  : ALL_VARGAS.find((v) => v.id === chartType)?.labelEn || 'All 16 Varga Charts'}
              </span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isVargaDropdownOpen && (
              <div
                id="chart-varga-dropdown-menu"
                className="absolute left-0 mt-2 w-64 max-h-80 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 space-y-1"
                onMouseLeave={() => setIsVargaDropdownOpen(false)}
              >
                <div className="px-2 py-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'hi' ? 'समस्त १६ षोडशवर्ग चक्र' : 'Complete 16 Shodashavarga Charts'}
                </div>
                {ALL_VARGAS.map((v) => (
                  <button
                    key={v.id}
                    id={`chart-varga-option-${v.id.toLowerCase()}`}
                    onClick={() => {
                      setChartType(v.id);
                      setIsVargaDropdownOpen(false);
                      setSelectedPlanet(null);
                      setSelectedHouse(null);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                      chartType === v.id
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div>
                      <span className="font-bold">{language === 'hi' ? v.labelHi : v.labelEn}</span>
                      <span className="block text-[10px] opacity-75">{v.desc}</span>
                    </div>
                    {chartType === v.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Feature Toggles & Style Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Aspect Drishti Rays Toggle */}
          <button
            id="chart-aspect-rays-btn"
            onClick={() => setShowAspectRays(!showAspectRays)}
            className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
              showAspectRays
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            title="Toggle Aspect (Drishti) Visual Rays"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language === 'hi' ? 'दृष्टि किरणें' : 'Aspect Rays'}</span>
          </button>

          {/* Transit Gochar Overlay Toggle */}
          <button
            id="chart-transit-overlay-btn"
            onClick={() => setShowTransitOverlay(!showTransitOverlay)}
            className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
              showTransitOverlay
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            title="Toggle Transit (Gochar) Overlay"
          >
            <Orbit className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'hi' ? 'गोचर ओवरले' : 'Transit Overlay'}</span>
          </button>

          {/* North / South Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              id="chart-style-north-btn"
              onClick={() => handleStyleChange('NORTH_INDIAN')}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                chartStyle === 'NORTH_INDIAN'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {language === 'hi' ? 'उत्तर भारतीय' : 'North Indian'}
            </button>
            <button
              id="chart-style-south-btn"
              onClick={() => handleStyleChange('SOUTH_INDIAN')}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                chartStyle === 'SOUTH_INDIAN'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {language === 'hi' ? 'दक्षिण भारतीय' : 'South Indian'}
            </button>
          </div>

          {/* Accessibility Table Toggle */}
          <button
            id="chart-accessibility-btn"
            onClick={() => setShowAccessibilityTable(!showAccessibilityTable)}
            className={`p-2 rounded-xl border font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
              showAccessibilityTable
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle Accessible Screen Reader Table"
          >
            <Table className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'hi' ? 'सारणी' : 'Accessible Table'}</span>
          </button>
        </div>
      </div>

      {/* Main Chart Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Center: Visual Chart Diagram */}
        <div className="lg:col-span-7 bg-slate-950/60 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white font-mono">{viewModel.title}</h3>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30">
              {language === 'hi' ? 'लग्न:' : 'Lagna:'} {translateSign(viewModel.ascendantSign, language)}
            </span>
          </div>

          {/* SVG Diagram */}
          {chartStyle === 'NORTH_INDIAN' ? (
            <NorthIndianChart
              viewModel={viewModel}
              selectedPlanet={selectedPlanet?.planet}
              selectedHouse={selectedHouse?.house}
              showAspectRays={showAspectRays}
              onSelectPlanet={(p) => {
                setSelectedPlanet(p);
                setSelectedHouse(null);
              }}
              onSelectHouse={(h) => {
                setSelectedHouse(h);
                setSelectedPlanet(null);
              }}
            />
          ) : (
            <SouthIndianChart
              viewModel={viewModel}
              selectedPlanet={selectedPlanet?.planet}
              selectedHouse={selectedHouse?.house}
              showAspectRays={showAspectRays}
              onSelectPlanet={(p) => {
                setSelectedPlanet(p);
                setSelectedHouse(null);
              }}
              onSelectHouse={(h) => {
                setSelectedHouse(h);
                setSelectedPlanet(null);
              }}
            />
          )}

          {/* Aspect Drishti Summary Banner when Planet is Selected */}
          {selectedPlanet && showAspectRays && selectedPlanetAspects.length > 0 && (
            <div id="aspect-summary-banner" className="w-full mt-4 bg-cyan-950/40 border border-cyan-500/30 rounded-xl p-3 text-xs font-mono text-cyan-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  <strong className="text-white">{selectedPlanet.planet}</strong> in House {selectedPlanet.house} casts Graha Drishti on:
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedPlanetAspects.map((a, i) => (
                  <span
                    key={i}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      a.specialAspect
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    House {a.targetHouse} {a.specialAspect ? '★' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Help Hint */}
          <p className="text-[11px] font-mono text-slate-500 text-center mt-3">
            {language === 'hi'
              ? 'किसी भी ग्रह या भाव पर क्लिक करके शास्त्रीय स्थिति व दृष्टि विवरण देखें।'
              : 'Click any planet or house polygon to inspect factual placement evidence and Graha Drishti.'}
          </p>
        </div>

        {/* Right Column: Planet / House Explorer Inspector Panels */}
        <div className="lg:col-span-5 space-y-4">
          {selectedPlanet ? (
            <PlanetDetailPanel
              planet={selectedPlanet}
              calculationResult={calculationResult}
              onClose={() => setSelectedPlanet(null)}
            />
          ) : selectedHouse ? (
            <HouseDetailPanel
              house={selectedHouse}
              calculationResult={calculationResult}
              onSelectPlanet={(p) => {
                setSelectedPlanet(p);
                setSelectedHouse(null);
              }}
              onClose={() => setSelectedHouse(null)}
            />
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
              <Layers className="w-8 h-8 text-indigo-400/60 mx-auto" />
              <h4 className="text-sm font-bold text-slate-300 font-mono">
                {language === 'hi' ? 'इंटरएक्टिव कुण्डली विश्लेषक' : 'Interactive Chart Inspector'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                {language === 'hi'
                  ? 'कुण्डली में किसी भी ग्रह या भाव पर क्लिक करके सूक्ष्म भोगांश, नवांश, षड्बल, तथा दृष्टि संबंध देखें।'
                  : 'Select a planet badge or house compartment inside the chart to inspect calculated longitudes, Nakshatras, dignities, and cross-chart facts.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Accessible Table Fallback Section */}
      {showAccessibilityTable && (
        <AccessibilityTable
          viewModel={viewModel}
          onSelectPlanet={(p) => setSelectedPlanet(p)}
          onSelectHouse={(h) => setSelectedHouse(h)}
        />
      )}
    </div>
  );
};

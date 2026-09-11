'use client';

import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Layers,
  Award,
  Crown,
  Shield,
  Briefcase,
  Heart,
  BookOpen,
  Zap,
  Activity,
  ChevronRight,
  Eye,
  Info,
} from 'lucide-react';
export type DivisionalChartType =
  | 'D1'
  | 'D2'
  | 'D3'
  | 'D4'
  | 'D7'
  | 'D9'
  | 'D10'
  | 'D12'
  | 'D16'
  | 'D20'
  | 'D24'
  | 'D27'
  | 'D30'
  | 'D40'
  | 'D45'
  | 'D60';

export interface VargaClientProfile {
  type: DivisionalChartType;
  division: number;
  name: string;
  sanskritName: string;
  significance: string;
  significanceHi: string;
  vimsopakaWeight: { shodashavarga: number };
}

export const DIVISIONAL_PROFILES: Record<DivisionalChartType, VargaClientProfile> = {
  D1: {
    type: 'D1',
    division: 1,
    name: 'Rashi',
    sanskritName: 'राशी',
    significance: 'Physical body, general destiny, overt traits',
    significanceHi: 'शारीरिक संरचना, समग्र भाग्य एवं प्रत्यक्ष व्यक्तित्व',
    vimsopakaWeight: { shodashavarga: 3.5 },
  },
  D2: {
    type: 'D2',
    division: 2,
    name: 'Hora',
    sanskritName: 'होरा',
    significance: 'Wealth, financial accumulation, liquid assets',
    significanceHi: 'धन, आर्थिक संचय एवं चल संपत्ति',
    vimsopakaWeight: { shodashavarga: 1.0 },
  },
  D3: {
    type: 'D3',
    division: 3,
    name: 'Drekkana',
    sanskritName: 'द्रेष्काण',
    significance: 'Siblings, courage, vitality, initiative',
    significanceHi: 'भाई-बहन, पराक्रम, साहस एवं आंतरिक शक्ति',
    vimsopakaWeight: { shodashavarga: 1.0 },
  },
  D4: {
    type: 'D4',
    division: 4,
    name: 'Chaturthamsa',
    sanskritName: 'चतुर्थांश (तुर्यांश)',
    significance: 'Fixed assets, landed property, real estate, domestic fortune',
    significanceHi: 'स्थाई संपत्ति, भूमि-भवन, वाहन एवं पारिवारिक सुख',
    vimsopakaWeight: { shodashavarga: 0.5 },
  },
  D7: {
    type: 'D7',
    division: 7,
    name: 'Saptamsa',
    sanskritName: 'सप्तांश',
    significance: 'Progeny, children, grandchildren, creative lineage',
    significanceHi: 'संतान सुख, वंश वृद्धि एवं सृजनात्मक सामर्थ्य',
    vimsopakaWeight: { shodashavarga: 0.5 },
  },
  D9: {
    type: 'D9',
    division: 9,
    name: 'Navamsa',
    sanskritName: 'नवांश',
    significance: 'Spouse, marriage, inner potential, soul destiny, dharma',
    significanceHi: 'विवाह, जीवनसाथी, आत्मिक बल एवं धर्म-भाग्य',
    vimsopakaWeight: { shodashavarga: 3.0 },
  },
  D10: {
    type: 'D10',
    division: 10,
    name: 'Dashamsa',
    sanskritName: 'दशांश',
    significance: 'Career, profession, status, social impact, fame',
    significanceHi: 'कर्म, आजीविका, पद-प्रतिष्ठा एवं सामाजिक प्रभाव',
    vimsopakaWeight: { shodashavarga: 0.5 },
  },
  D12: {
    type: 'D12',
    division: 12,
    name: 'Dwadashamsa',
    sanskritName: 'द्वादशांश',
    significance: 'Parents, ancestral lineage, heritage, paternal legacy',
    significanceHi: 'माता-पिता, पैतृक संबंध एवं पूर्वजों का आशीर्वाद',
    vimsopakaWeight: { shodashavarga: 0.5 },
  },
  D16: {
    type: 'D16',
    division: 16,
    name: 'Shodashamsa',
    sanskritName: 'षोडशांश (कलाम)',
    significance: 'Vehicles, conveyances, luxuries, happiness from comforts',
    significanceHi: 'वाहन सुख, भौतिक सुख-सुविधाएं एवं आनंद',
    vimsopakaWeight: { shodashavarga: 2.0 },
  },
  D20: {
    type: 'D20',
    division: 20,
    name: 'Vimsamsa',
    sanskritName: 'विंशांश',
    significance: 'Spiritual practices, upasana, meditation, devotion, mantra siddhi',
    significanceHi: 'आध्यात्मिक साधना, उपासना, ध्यान एवं मंत्र सिद्धि',
    vimsopakaWeight: { shodashavarga: 0.5 },
  },
  D24: {
    type: 'D24',
    division: 24,
    name: 'Chaturvimsamsa',
    sanskritName: 'चतुर्विंशांश (सिद्धांश)',
    significance: 'Higher learning, academic success, intellect, scholarship',
    significanceHi: 'उच्च शिक्षा, बौद्धिक क्षमता, विद्या एवं ज्ञान',
    vimsopakaWeight: { shodashavarga: 0.5 },
  },
  D27: {
    type: 'D27',
    division: 27,
    name: 'Saptavimsamsa',
    sanskritName: 'सप्तविंशांश (भंशा/नक्षत्रांश)',
    significance: 'Physical strength, stamina, fortitude, hidden vulnerabilities',
    significanceHi: 'शारीरिक बल, सहनशक्ति, ऊर्जा एवं सूक्ष्म कमजोरियां',
    vimsopakaWeight: { shodashavarga: 0.5 },
  },
  D30: {
    type: 'D30',
    division: 30,
    name: 'Trimsamsa',
    sanskritName: 'त्रिंशांश',
    significance: 'Misfortunes, health hazards, obstacles, subconscious shadows',
    significanceHi: 'अनिष्ट, रोग, बाधाएं एवं गुप्त चुनौतियां',
    vimsopakaWeight: { shodashavarga: 1.0 },
  },
  D40: {
    type: 'D40',
    division: 40,
    name: 'Khavedamsa',
    sanskritName: 'खवेदांश (चत्वारिंशांश)',
    significance: 'Auspicious and inauspicious karmic effects, maternal legacy',
    significanceHi: 'शुभ-अशुभ फल, मातृकुल प्रभाव एवं संचित संस्कार',
    vimsopakaWeight: { shodashavarga: 0.5 },
  },
  D45: {
    type: 'D45',
    division: 45,
    name: 'Akshavedamsa',
    sanskritName: 'अक्षवेदांश',
    significance: 'General character, moral purity, ethical fortitude',
    significanceHi: 'चरित्र, आचरण शुद्धि, सत्यनिष्ठा एवं समग्र कल्याण',
    vimsopakaWeight: { shodashavarga: 0.5 },
  },
  D60: {
    type: 'D60',
    division: 60,
    name: 'Shashtyamsa',
    sanskritName: 'षष्ट्यंश',
    significance: 'Past-life karma, supreme micro-destiny, root causes of fortune',
    significanceHi: 'पूर्वजन्म संचित कर्म, सूक्ष्म प्रारब्ध एवं भाग्य का मूल स्रोत',
    vimsopakaWeight: { shodashavarga: 4.0 },
  },
};

interface DivisionalChartsTabProps {
  shodashavargaData: Record<DivisionalChartType, any> | null;
  vimsopakaBalaData: any | null;
  jaiminiData: any | null;
  vargaComparisonData: any | null;
  dashamsaComparisonData: any | null;
  careerCrossChartData: any | null;
  lang: 'en' | 'hi';
}

type MainSubTab = 'shodashavarga' | 'vimsopaka' | 'jaimini' | 'vargottama' | 'careerCross';

const VARGA_GROUPS = [
  {
    name: 'General, Wealth & Vitality',
    nameHi: 'सामान्य, धन एवं पराक्रम',
    vargas: ['D1', 'D2', 'D3', 'D4'] as DivisionalChartType[],
  },
  {
    name: 'Family, Soul & Profession',
    nameHi: 'परिवार, आत्मबल एवं कर्म',
    vargas: ['D7', 'D9', 'D10', 'D12'] as DivisionalChartType[],
  },
  {
    name: 'Luxuries, Devotion & Intellect',
    nameHi: 'सुख-साधन, उपासना एवं विद्या',
    vargas: ['D16', 'D20', 'D24', 'D27'] as DivisionalChartType[],
  },
  {
    name: 'Karma, Hazards & High Harmonics',
    nameHi: 'कर्म प्रारब्ध, अनिष्ट एवं सूक्ष्म संस्कार',
    vargas: ['D30', 'D40', 'D45', 'D60'] as DivisionalChartType[],
  },
];

export function DivisionalChartsTab({
  shodashavargaData,
  vimsopakaBalaData,
  jaiminiData,
  vargaComparisonData,
  dashamsaComparisonData,
  careerCrossChartData,
  lang,
}: DivisionalChartsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<MainSubTab>('shodashavarga');
  const [selectedVarga, setSelectedVarga] = useState<DivisionalChartType>('D9');
  const [expandedPlanetBala, setExpandedPlanetBala] = useState<string | null>(null);

  const isHindi = lang === 'hi';

  const currentChart = shodashavargaData?.[selectedVarga];
  const currentProfile = DIVISIONAL_PROFILES[selectedVarga];

  return (
    <div className="space-y-8" id="divisional-engine-container">
      {/* Top Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-semibold text-amber-400 mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>{isHindi ? 'षोडशवर्ग एवं जैमिनी ज्योतिष' : 'Complete 16-Varga & Jaimini Engine'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              {isHindi ? 'षोडशवर्ग (D1–D60), विंशोपक बल एवं जैमिनी सूत्र' : 'Shodashavarga (D1–D60), Vimsopaka Bala & Jaimini'}
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {isHindi
                ? 'महर्षि पराशर के सभी १६ वर्ग चार्ट, विंशोपक बल (२० अंक सामर्थ्य) एवं महर्षि जैमिनी के चर कारक व आरूढ़ पदों का सटीक गणितीय विश्लेषण।'
                : 'Canonical 16 divisional charts according to Brihat Parasara Hora Shastra with 20-point Vimsopaka strength and Jaimini Chara Karakas & Arudha Padas.'}
            </p>
          </div>
        </div>

        {/* Primary Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            id="subtab-shodashavarga"
            onClick={() => setActiveSubTab('shodashavarga')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'shodashavarga'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{isHindi ? '१६ वर्ग चार्ट्स (D1–D60)' : '16 Shodashavarga (D1–D60)'}</span>
          </button>

          <button
            id="subtab-vimsopaka"
            onClick={() => setActiveSubTab('vimsopaka')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'vimsopaka'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{isHindi ? 'विंशोपक बल (२० अंक)' : 'Vimsopaka Bala (20 Pts)'}</span>
          </button>

          <button
            id="subtab-jaimini"
            onClick={() => setActiveSubTab('jaimini')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'jaimini'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>{isHindi ? 'जैमिनी चर कारक व आरूढ़' : 'Jaimini Karakas & Padas'}</span>
          </button>

          <button
            id="subtab-vargottama"
            onClick={() => setActiveSubTab('vargottama')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'vargottama'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isHindi ? 'वर्गोत्तम विश्लेषण' : 'Vargottama Analysis'}</span>
          </button>

          <button
            id="subtab-career-cross"
            onClick={() => setActiveSubTab('careerCross')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'careerCross'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>{isHindi ? 'दशांश (D10) करियर क्रॉस' : 'D10 Career Cross-Chart'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: 16 SHODASHAVARGA CHARTS SELECTOR & DETAILS */}
      {activeSubTab === 'shodashavarga' && (
        <div className="space-y-6" id="shodashavarga-view">
          {/* 16-Varga Grouped Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                {isHindi ? '१६ षोडशवर्ग तालिका चयन' : 'Select Shodashavarga Chart'}
              </h3>
              <span className="text-xs text-amber-400/90 font-medium">
                {isHindi ? 'सक्रिय वर्ग:' : 'Active Varga:'} {selectedVarga} — {currentProfile?.name}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {VARGA_GROUPS.map((group, gIdx) => (
                <div key={gIdx} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-2">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    {isHindi ? group.nameHi : group.name}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {group.vargas.map((vKey) => {
                      const prof = DIVISIONAL_PROFILES[vKey];
                      const isSelected = selectedVarga === vKey;
                      return (
                        <button
                          key={vKey}
                          id={`varga-btn-${vKey}`}
                          onClick={() => setSelectedVarga(vKey)}
                          className={`p-2 rounded-lg text-left transition-all flex flex-col justify-between border ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10'
                              : 'bg-slate-900/80 border-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{vKey}</span>
                            <span className="text-[9px] px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">
                              1/{prof.division}
                            </span>
                          </div>
                          <div className="text-[11px] font-medium text-slate-200 truncate mt-1">
                            {isHindi ? prof.sanskritName : prof.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Varga Chart Inspector */}
          {currentChart && currentProfile && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg text-xs font-bold">
                      {selectedVarga} • Division {currentProfile.division}
                    </span>
                    <h3 className="text-xl font-bold text-slate-100">
                      {isHindi ? currentProfile.sanskritName : currentProfile.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {isHindi ? currentProfile.significanceHi : currentProfile.significance}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300">
                    <span className="text-slate-500">{isHindi ? 'विंशोपक भार:' : 'Vimsopaka Weight:'}</span>{' '}
                    <span className="font-bold text-amber-400">{currentProfile.vimsopakaWeight.shodashavarga} / 20 pts</span>
                  </div>
                </div>
              </div>

              {/* Ascendant & Quick Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">
                    {isHindi ? 'लग्न राशि (Ascendant)' : `${selectedVarga} Ascendant Lagna`}
                  </div>
                  <div className="text-lg font-bold text-amber-400 mt-1">
                    {currentChart.ascendant.sign.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {currentChart.ascendant.formattedDegree} • {isHindi ? 'भाग' : 'Div'} {currentChart.ascendant.divisionNumber}
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">
                    {isHindi ? 'लग्न स्वामी (Lagna Lord)' : 'Divisional Lagna Lord'}
                  </div>
                  <div className="text-lg font-bold text-slate-200 mt-1">
                    {currentChart.ascendant.sign.ruler}
                  </div>
                  <div className="text-xs text-slate-400">
                    {isHindi ? 'प्रथम भाव का स्वामी' : 'Rules 1st House in this Varga'}
                  </div>
                </div>

                {selectedVarga === 'D60' ? (
                  <div className="bg-slate-950/70 border border-amber-500/30 rounded-2xl p-4 bg-amber-500/5">
                    <div className="text-[11px] text-amber-400 uppercase font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {isHindi ? 'षष्ट्यंश देवता (D60 Deity)' : 'Ascendant D60 Deity'}
                    </div>
                    <div className="text-lg font-bold text-amber-300 mt-1">
                      {currentChart.ascendant.deityName || 'Deva'}
                    </div>
                    <div className="text-xs text-slate-300">
                      {currentChart.ascendant.isAuspicious ? (
                        <span className="text-emerald-400 font-semibold">{isHindi ? 'शुभ (Auspicious)' : 'Subha (Auspicious)'}</span>
                      ) : (
                        <span className="text-rose-400 font-semibold">{isHindi ? 'अशुभ (Challenging)' : 'Asubha (Challenging)'}</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">
                      {isHindi ? 'वर्ग विभाजन आकार' : 'Division Arc Size'}
                    </div>
                    <div className="text-lg font-bold text-slate-200 mt-1">
                      {(30 / currentProfile.division).toFixed(2)}°
                    </div>
                    <div className="text-xs text-slate-400">
                      {Math.floor(30 / currentProfile.division)}° {Math.round(((30 / currentProfile.division) % 1) * 60)}' arc per slice
                    </div>
                  </div>
                )}
              </div>

              {/* 12 Whole Sign Houses Grid */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  {isHindi ? `${selectedVarga} द्वादश भाव व्यवस्था` : `${selectedVarga} 12 Whole-Sign Houses`}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {currentChart.houses.map((house: any) => (
                    <div
                      key={house.house}
                      className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-400">
                          {isHindi ? `भाव ${house.house}` : `House ${house.house}`}
                        </span>
                        <span className="text-slate-400 text-[11px] font-medium">{house.sign.name}</span>
                      </div>
                      <div className="mt-2 text-xs text-slate-400">
                        <span className="text-[10px] text-slate-500">{isHindi ? 'स्वामी:' : 'Lord:'}</span> {house.lord}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {house.occupants.length > 0 ? (
                          house.occupants.map((occ: string) => (
                            <span
                              key={occ}
                              className="px-1.5 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded text-[10px] font-semibold"
                            >
                              {occ}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-600 italic">{isHindi ? 'रिक्त' : 'Empty'}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Planetary Positions Table in this Varga */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  {isHindi ? `${selectedVarga} ग्रह स्थिति तालिका` : `${selectedVarga} Planetary Coordinates`}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3">Planet</th>
                        <th className="p-3">Divisional Sign</th>
                        <th className="p-3">Degree In Sign</th>
                        <th className="p-3">Division #</th>
                        {selectedVarga === 'D60' && <th className="p-3">D60 Deity</th>}
                        {selectedVarga === 'D60' && <th className="p-3">Nature</th>}
                        <th className="p-3">Original D1 Longitude</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {Object.entries(currentChart.planets).map(([pName, pPos]: [string, any]) => (
                        <tr key={pName} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-semibold text-slate-100">{pName}</td>
                          <td className="p-3 text-amber-400 font-bold">{pPos.sign.name}</td>
                          <td className="p-3 text-slate-300">{pPos.formattedDegree || `${pPos.longitudeInSign.toFixed(2)}°`}</td>
                          <td className="p-3 text-slate-400">{pPos.divisionNumber} / {currentProfile.division}</td>
                          {selectedVarga === 'D60' && (
                            <td className="p-3 font-medium text-amber-300">{pPos.deityName || '—'}</td>
                          )}
                          {selectedVarga === 'D60' && (
                            <td className="p-3">
                              {pPos.isAuspicious ? (
                                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold">
                                  Subha
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded text-[10px] font-bold">
                                  Asubha
                                </span>
                              )}
                            </td>
                          )}
                          <td className="p-3 text-slate-400">{pPos.sourceLongitude.toFixed(2)}°</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: VIMSOPAKA BALA (20-POINT DIVISIONAL STRENGTH) */}
      {activeSubTab === 'vimsopaka' && (
        <div className="space-y-6" id="vimsopaka-view">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="text-xl font-bold text-slate-100">
                    {isHindi ? 'विंशोपक बल (२० अंक षोडशवर्ग सामर्थ्य)' : 'Vimsopaka Bala — 20-Point Divisional Strength'}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  {isHindi
                    ? 'महर्षि पराशर अनुसार १६ वर्गों में ग्रहों की उच्च, स्वक्षेत्र, मित्र, शत्रु स्थिति के आधार पर २० अंकों में समग्र सामर्थ्य का निर्धारण।'
                    : 'Weighted composite strength across all 16 Shodashavarga charts (D1 to D60), reflecting ultimate planetary efficacy and potency.'}
                </p>
              </div>

              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-semibold">
                Scheme: {vimsopakaBalaData?.scheme || 'SHODASHAVARGA (16 Vargas)'}
              </span>
            </div>

            {/* Planetary Strength Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vimsopakaBalaData?.ranking?.map((rankItem: any) => {
                const planetData = vimsopakaBalaData.planets[rankItem.planet];
                const isExpanded = expandedPlanetBala === rankItem.planet;
                const score = planetData.score;
                const pct = planetData.percentage;

                let gradeBadge = 'bg-slate-800 text-slate-300 border-slate-700';
                if (planetData.grade === 'EXCELLENT') gradeBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                else if (planetData.grade === 'GOOD') gradeBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                else if (planetData.grade === 'MODERATE') gradeBadge = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
                else gradeBadge = 'bg-rose-500/20 text-rose-300 border-rose-500/40';

                return (
                  <div
                    key={rankItem.planet}
                    className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-base">{rankItem.planet}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${gradeBadge}`}>
                        {planetData.grade}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-400">{isHindi ? 'विंशोपक अंक:' : 'Score:'}</span>
                        <span className="font-bold text-amber-400 text-sm">{score.toFixed(2)} / 20.00</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-right text-slate-500 mt-1">{pct}% potency</div>
                    </div>

                    <button
                      onClick={() => setExpandedPlanetBala(isExpanded ? null : rankItem.planet)}
                      className="w-full py-1.5 px-3 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded-xl text-xs text-slate-300 flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>{isExpanded ? (isHindi ? 'विवरण छुपाएं' : 'Hide 16-Varga Breakdown') : (isHindi ? '१६ वर्ग विवरण देखें' : 'View 16-Varga Breakdown')}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                          {planetData.vargaScores.map((vScore: any) => (
                            <div
                              key={vScore.chartType}
                              className="flex items-center justify-between py-1 px-2 bg-slate-900/60 rounded text-[11px]"
                            >
                              <span className="font-bold text-amber-300">{vScore.chartType}</span>
                              <span className="text-slate-400">{vScore.sign.name}</span>
                              <span className="text-slate-300 font-medium">{vScore.dignity}</span>
                              <span className="text-emerald-400 font-semibold">{vScore.weightedScore.toFixed(2)} pts</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: JAIMINI ASTROLOGY (CHARA KARAKAS, KARAKAMSHA, ARUDHA PADAS, RASHI DRISHTI) */}
      {activeSubTab === 'jaimini' && (
        <div className="space-y-6" id="jaimini-view">
          {/* Karakamsha Soul Card */}
          {jaiminiData?.karakamsha && (
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <h3 className="text-xl font-bold text-slate-100">
                      {isHindi ? 'कारकांश लग्न एवं आत्मकारक विश्लेषण' : 'Karakamsha & Atmakaraka Soul Destiny'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {isHindi
                      ? jaiminiData.karakamsha.significanceHi
                      : jaiminiData.karakamsha.significance}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Atmakaraka (AK)</div>
                    <div className="text-base font-bold text-amber-400">{jaiminiData.karakamsha.atmakarakaPlanet}</div>
                  </div>
                  <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Karakamsha Sign</div>
                    <div className="text-base font-bold text-emerald-400">{jaiminiData.karakamsha.karakamshaSign.name}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7 Chara Karakas Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              {isHindi ? 'सप्त चर कारक तालिका (महर्षि जैमिनी सूत्र)' : '7 Chara Karakas (Jaimini Sutras)'}
            </h3>
            <p className="text-xs text-slate-400">
              {isHindi
                ? 'राशियों में ग्रहों के अंशों के घटते क्रम अनुसार आत्मकारक, अमात्यकारक, भ्रातृकारक आदि का निर्धारण।'
                : 'Planets ranked in descending order of longitudinal advancement within their signs, defining life themes and soul roles.'}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300" id="jaimini-karakas-table">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Role</th>
                    <th className="p-3">Karaka Name</th>
                    <th className="p-3">Assigned Planet</th>
                    <th className="p-3">Degree In Sign</th>
                    <th className="p-3">Sign</th>
                    <th className="p-3">Significance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {jaiminiData?.charaKarakas?.map((kItem: any) => (
                    <tr key={kItem.role} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[10px] font-bold">
                          {kItem.role}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-100">
                        {isHindi ? kItem.nameHi : kItem.name}
                      </td>
                      <td className="p-3 text-amber-300 font-bold">{kItem.planet}</td>
                      <td className="p-3 text-slate-300">{kItem.degreeInSign.toFixed(2)}°</td>
                      <td className="p-3 text-slate-400">{kItem.sign.name}</td>
                      <td className="p-3 text-slate-400 text-[11px] max-w-md">
                        {isHindi ? kItem.significanceHi : kItem.significance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 12 Arudha Padas Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400" />
                  {isHindi ? 'द्वादश आरूढ़ पद (AL, UL, A1–A12)' : '12 Arudha Padas (AL, UL, A1 to A12)'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isHindi
                    ? 'प्रत्यक्ष जगत में सांसारिक प्रतिबिंब व प्रतिष्ठा (प्रथम व सप्तम भाव अपवाद नियमों सहित)।'
                    : 'The manifestation of the 12 houses in the physical realm of perception and maya.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" id="arudha-padas-grid">
              {jaiminiData?.arudhaPadas?.map((pada: any) => (
                <div
                  key={pada.code}
                  className={`p-4 rounded-2xl border transition-all ${
                    pada.code === 'AL' || pada.code === 'UL'
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : 'bg-slate-950/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-slate-800 text-amber-400 rounded text-xs font-bold">
                      {pada.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {isHindi ? `भाव ${pada.houseNumber}` : `House ${pada.houseNumber}`}
                    </span>
                  </div>

                  <div className="mt-2 text-sm font-bold text-slate-100">
                    {isHindi ? pada.nameHi : pada.name}
                  </div>

                  <div className="mt-2 text-xs text-slate-400 space-y-1">
                    <div>
                      <span className="text-slate-500">{isHindi ? 'आरूढ़ राशि:' : 'Falls in:'}</span>{' '}
                      <span className="text-amber-400 font-bold">{pada.sign.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">{isHindi ? 'भाव स्वामी:' : 'House Lord:'}</span>{' '}
                      <span className="text-slate-200">{pada.houseLord} ({pada.lordHouse}th house away)</span>
                    </div>
                  </div>

                  {pada.exceptionApplied && (
                    <div className="mt-2 text-[10px] text-amber-400/90 italic bg-amber-500/10 px-2 py-1 rounded">
                      {isHindi ? '★ पराशर अपवाद नियम लागू (१० भाव विस्थापन)' : '★ Parashara exception applied (10-house jump)'}
                    </div>
                  )}

                  <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                    {isHindi ? pada.significanceHi : pada.significance}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Jaimini Rashi Drishti (Sign Aspects) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              {isHindi ? 'जैमिनी राशि दृष्टि (Sign Aspects)' : 'Jaimini Rashi Drishti (Sign Aspects)'}
            </h3>
            <p className="text-xs text-slate-400">
              {isHindi
                ? 'चर राशियां अपने सम्मुख स्थिर राशियों को (समीपवर्ती छोड़कर), स्थिर राशियां चर को, एवं द्विस्वभाव राशियां परस्पर दृष्टिपात करती हैं।'
                : 'Movable signs aspect Fixed signs (except adjacent), Fixed aspect Movable (except adjacent), and Dual signs mutually aspect all other Dual signs.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {jaiminiData?.rashiDrishti?.map((dItem: any) => (
                <div
                  key={dItem.sign.name}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-amber-400">{dItem.sign.name} ({dItem.sign.modality})</span>
                    <span className="text-slate-500 text-[10px]">Sign #{dItem.sign.id}</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    <span className="text-slate-500">{isHindi ? 'दृष्टि राशियां:' : 'Aspects:'}</span>{' '}
                    <span className="text-slate-200">{dItem.aspectingSigns.map((s: any) => s.name).join(', ')}</span>
                  </div>
                  {dItem.aspectingPlanets.length > 0 && (
                    <div className="text-emerald-400 text-[11px]">
                      <span className="text-slate-500">{isHindi ? 'आस्पेक्टेड ग्रह:' : 'Aspects Planets:'}</span>{' '}
                      {dItem.aspectingPlanets.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: VARGOTTAMA ANALYSIS */}
      {activeSubTab === 'vargottama' && vargaComparisonData && (
        <div className="space-y-6" id="vargottama-view">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  {isHindi ? 'लग्न एवं ग्रह वर्गोत्तम स्थिति' : 'Vargottama Ascendant & Planetary Detection'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isHindi
                    ? 'जब लग्न या कोई ग्रह D1 राशि और D9 नवांश में एक ही राशि में स्थित हो, तो वह वर्गोत्तम होकर अत्यंत शुभ व दृढ़ फल प्रदान करता है।'
                    : 'A planet or ascendant is Vargottama when occupying the identical zodiac sign in both D1 Rashi and D9 Navamsa.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vargaComparisonData.items.map((item: any) => (
                <div
                  key={item.entity}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.isVargottama
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : 'bg-slate-950/50 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-200">{item.entity}</span>
                    {item.isVargottama ? (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold">
                        VARGOTTAMA
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px]">
                        STANDARD
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-slate-400 space-y-1">
                    <div>D1 Sign: <span className="text-slate-200 font-semibold">{item.d1Sign.name}</span></div>
                    <div>D9 Sign: <span className="text-slate-200 font-semibold">{item.d9Sign.name}</span></div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 italic">
                    {item.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: D10 CAREER CROSS-CHART FACTS */}
      {activeSubTab === 'careerCross' && careerCrossChartData && (
        <div className="space-y-6" id="career-cross-view">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                {isHindi ? 'दशांश (D10) करियर क्रॉस-चार्ट समन्वय' : 'Career Cross-Chart Synthesis (D1 vs D10)'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isHindi
                  ? 'D1 राशि और D10 दशांश के कर्मेश (१०वें भाव के स्वामी), षष्ठेश एवं लाभेश का एकीकृत तुलनात्मक विश्लेषण।'
                  : 'Synthesized factual comparison between D1 Rashi and D10 Dashamsa for career indicators, 10th lords, and status markers.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {careerCrossChartData.crossChartPlanets?.map((cItem: any) => (
                <div
                  key={cItem.planet}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100">{cItem.planet}</span>
                    {cItem.sameD1D10Sign && (
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-[10px] font-bold">
                        Same Sign
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>D1: {cItem.d1Sign.name} (House {cItem.d1House}) • {cItem.d1Dignity}</div>
                    <div>D10: {cItem.d10Sign.name} (House {cItem.d10House}) • {cItem.d10Dignity}</div>
                  </div>
                  {cItem.whyEvidence && cItem.whyEvidence.length > 0 && (
                    <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                      {cItem.whyEvidence.join(' • ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

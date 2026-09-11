'use client';

import React, { useState } from 'react';
import {
  Shield,
  Table as TableIcon,
  Compass,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export interface StrengthTabProps {
  strengthData: any;
  shadbalaData?: any;
}

export const StrengthTab: React.FC<StrengthTabProps> = ({ strengthData, shadbalaData }) => {
  const { language, translatePlanet, translateDignity, translateStrength, translateRelationship } = useI18n();

  const [expandedStrengthPlanet, setExpandedStrengthPlanet] = useState<string | null>(null);
  const [selectedRelationshipPlanet, setSelectedRelationshipPlanet] = useState<string>('Sun');
  const [expandedShadbalaPlanet, setExpandedShadbalaPlanet] = useState<string | null>(null);

  if (!strengthData) return null;

  return (
    <div id="strength-content" className="space-y-6 sm:space-y-8">
      {/* Engine Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                {language === 'hi' ? 'ग्रहीय बल एवं संबंध विश्लेषण इंजन' : 'Planetary Strength & Relationship Engine'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {language === 'hi'
                  ? 'पारदर्शी एवं स्पष्ट बल गणना • पंचधा मैत्री संयुक्त संबंध'
                  : 'Transparent & Traceable Strength Scoring • Panchadha Maitri Compound Relationships'}
              </p>
            </div>
          </div>

          <div className="font-mono text-[11px] self-start sm:self-auto">
            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 rounded-md">
              Profile: {strengthData.profileVersion}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {language === 'hi'
            ? 'यह बल इंजन D1 और D9 कुण्डली की ग्रह स्थिति, केंद्र/त्रिकोण/उपचय/दुस्थान भाव, नैसर्गिक, तात्कालिक व पंचधा मैत्री संबंध, अस्त, वक्री व वर्गोत्तम स्थिति का विशुद्ध गणितीय मूल्यांकन करता है। प्रत्येक गणना १००% पारदर्शी व प्रामाणिक है।'
            : 'The Strength Engine evaluates D1 & D9 dignities, house placement categories (Kendra, Trikona, Upachaya, Dusthana), Naisargika (Natural), Tatkalika (Temporary), and Panchadha Maitri (Compound) planetary relationships, combustion, retrograde status, aspect influences, and Vargottama placements. Every score contribution is 100% explicit and traceable.'}
        </p>
      </div>

      {/* Planet Strength Cards Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          {language === 'hi' ? 'ग्रह बल विहंगावलोकन (Planetary Strength Overview)' : 'Planetary Strength Overview'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="planet-strength-cards">
          {strengthData.planets?.map((p: any) => {
            const isExpanded = expandedStrengthPlanet === p.planet;
            const badgeColor =
              p.overallStrength === 'VERY_STRONG'
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                : p.overallStrength === 'STRONG'
                ? 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30'
                : p.overallStrength === 'MODERATE'
                ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/30'
                : p.overallStrength === 'WEAK'
                ? 'bg-orange-500/20 text-orange-800 dark:text-orange-300 border-orange-500/30'
                : 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30';

            return (
              <div
                key={p.planet}
                className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 sm:p-5 space-y-3 transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-slate-900 dark:text-slate-100">
                    {translatePlanet(p.planet)}
                  </span>
                  <span className={`px-2.5 py-0.5 border rounded text-[11px] font-bold tracking-wider ${badgeColor}`}>
                    {translateStrength(p.overallStrength)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-800/60">
                  <span className="text-slate-600 dark:text-slate-400">
                    {language === 'hi' ? 'बल स्कोर:' : 'Strength Score:'}
                  </span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400 text-sm">
                    {p.score > 0 ? `+${p.score}` : p.score}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <div>
                    {language === 'hi' ? 'लग्न कुण्डली स्थिति (D1):' : 'D1 Dignity:'}{' '}
                    <span className="text-slate-900 dark:text-slate-200 font-semibold">{translateDignity(p.d1Dignity)}</span>
                  </div>
                  <div>
                    {language === 'hi' ? 'भाव स्थिति:' : 'House Placement:'}{' '}
                    <span className="text-slate-900 dark:text-slate-200 font-semibold">
                      {language === 'hi' ? `${p.house}वां भाव` : `House ${p.house}`} ({p.houseCategories?.join(', ') || 'Rashi'})
                    </span>
                  </div>
                  {p.d9Dignity && (
                    <div>
                      {language === 'hi' ? 'नवमांश स्थिति (D9):' : 'D9 Placement:'}{' '}
                      <span className="text-slate-700 dark:text-slate-300">{translateDignity(p.d9Dignity)}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.isVargottama && (
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-semibold">
                      {language === 'hi' ? 'वर्गोत्तम' : 'VARGOTTAMA'}
                    </span>
                  )}
                  {p.isCombust && (
                    <span className="px-2 py-0.5 bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 rounded text-[10px] font-semibold">
                      {language === 'hi' ? 'अस्त' : 'COMBUST'}
                    </span>
                  )}
                  {p.isRetrograde && (
                    <span className="px-2 py-0.5 bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30 rounded text-[10px] font-semibold">
                      {language === 'hi' ? 'वक्री' : 'RETROGRADE'}
                    </span>
                  )}
                </div>

                <button
                  id={`why-strength-${p.planet.toLowerCase()}`}
                  onClick={() => setExpandedStrengthPlanet(isExpanded ? null : p.planet)}
                  className="w-full mt-2 py-1.5 px-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-800"
                >
                  <span>
                    {isExpanded
                      ? (language === 'hi' ? 'विवरण छिपाएं' : 'Hide Factors')
                      : (language === 'hi' ? 'शास्त्रीय प्रमाण देखें' : 'WHY? View Strength Factors')}
                  </span>
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-2 text-xs text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/60 p-3 rounded-lg">
                    <div className="font-semibold text-slate-900 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-1">
                      {language === 'hi' ? `${translatePlanet(p.planet)} के गणितीय बल घटक:` : `Traceable Factors for ${p.planet}:`}
                    </div>
                    {p.factors?.map((f: any) => (
                      <div key={f.id} className="space-y-1 pb-2 border-b border-slate-200 dark:border-slate-800/40 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between font-semibold">
                          <span className={f.effect === 'SUPPORTIVE' ? 'text-emerald-700 dark:text-emerald-400' : f.effect === 'CHALLENGING' ? 'text-rose-700 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}>
                            {f.effect === 'SUPPORTIVE' ? '✓ ' : f.effect === 'CHALLENGING' ? '⚠ ' : '• '} {f.category}
                          </span>
                          <span className="font-mono text-amber-700 dark:text-amber-400">
                            {f.scoreContribution > 0 ? `+${f.scoreContribution}` : f.scoreContribution}
                          </span>
                        </div>
                        {f.evidence?.map((ev: string, idx: number) => (
                          <div key={idx} className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                            {ev}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Planet Comparison Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
          <TableIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          {language === 'hi' ? 'ग्रह बल एवं गुण तुलना सारणी' : 'Planet Strength & Attribute Comparison'}
        </h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300 min-w-[640px]" id="strength-comparison-table">
            <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="p-3">{language === 'hi' ? 'ग्रह' : 'Planet'}</th>
                <th className="p-3">{language === 'hi' ? 'समग्र बल' : 'Overall Strength'}</th>
                <th className="p-3">{language === 'hi' ? 'स्कोर' : 'Score'}</th>
                <th className="p-3">{language === 'hi' ? 'D1 स्थिति' : 'D1 Dignity'}</th>
                <th className="p-3">{language === 'hi' ? 'D9 स्थिति' : 'D9 Placement'}</th>
                <th className="p-3">{language === 'hi' ? 'भाव' : 'House'}</th>
                <th className="p-3">{language === 'hi' ? 'वर्गोत्तम' : 'Vargottama'}</th>
                <th className="p-3">{language === 'hi' ? 'अस्त' : 'Combust'}</th>
                <th className="p-3">{language === 'hi' ? 'वक्री' : 'Retrograde'}</th>
                <th className="p-3">{language === 'hi' ? 'प्रमाण' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {strengthData.planets?.map((p: any) => (
                <tr key={p.planet} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{translatePlanet(p.planet)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.overallStrength === 'VERY_STRONG'
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                        : p.overallStrength === 'STRONG'
                        ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                        : p.overallStrength === 'MODERATE'
                        ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                        : p.overallStrength === 'WEAK'
                        ? 'bg-orange-500/20 text-orange-800 dark:text-orange-300'
                        : 'bg-red-500/20 text-red-700 dark:text-red-300'
                    }`}>
                      {translateStrength(p.overallStrength)}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-amber-700 dark:text-amber-400">{p.score > 0 ? `+${p.score}` : p.score}</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">{translateDignity(p.d1Dignity)}</td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">{translateDignity(p.d9Dignity) || '—'}</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">{language === 'hi' ? `${p.house}वां भाव` : `House ${p.house}`}</td>
                  <td className="p-3">
                    {p.isVargottama ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">{language === 'hi' ? 'हाँ' : 'YES'}</span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500">{language === 'hi' ? 'नहीं' : 'NO'}</span>
                    )}
                  </td>
                  <td className="p-3">
                    {p.isCombust ? (
                      <span className="text-rose-700 dark:text-rose-400 font-bold">{language === 'hi' ? 'हाँ' : 'YES'}</span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500">{language === 'hi' ? 'नहीं' : 'NO'}</span>
                    )}
                  </td>
                  <td className="p-3">
                    {p.isRetrograde ? (
                      <span className="text-sky-700 dark:text-sky-400 font-bold">{language === 'hi' ? 'हाँ' : 'YES'}</span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500">{language === 'hi' ? 'नहीं' : 'NO'}</span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setExpandedStrengthPlanet(expandedStrengthPlanet === p.planet ? null : p.planet)}
                      className="text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 text-[11px] font-semibold underline"
                    >
                      {language === 'hi' ? 'प्रमाण देखें' : 'View Factors'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Planetary Relationship Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6" id="relationship-matrix-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              {language === 'hi' ? 'पंचधा मैत्री संबंध चक्र (Panchadha Maitri)' : 'Planetary Relationship Matrix (Panchadha Maitri)'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {language === 'hi'
                ? 'नैसर्गिक और तात्कालिक संबंधों को मिलाकर ५ संयुक्त संबंध श्रेणियों की गणना।'
                : 'Combines Natural (Naisargika) and Temporary (Tatkalika) relationships to compute 5 Compound relationship categories.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="relationship-planet-select" className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
              {language === 'hi' ? 'ग्रह चुनें:' : 'Select Planet:'}
            </label>
            <select
              id="relationship-planet-select"
              value={selectedRelationshipPlanet}
              onChange={(e) => setSelectedRelationshipPlanet(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 text-xs rounded-lg px-3 py-2 font-bold focus:outline-none focus:border-amber-500"
            >
              {['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].map((pl) => (
                <option key={pl} value={pl}>{translatePlanet(pl)}</option>
              ))}
            </select>
          </div>
        </div>

        {strengthData.relationships?.[selectedRelationshipPlanet] && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="relationship-cards">
            {Object.entries(strengthData.relationships[selectedRelationshipPlanet])
              .filter(([otherPlanet]) => otherPlanet !== selectedRelationshipPlanet)
              .map(([otherPlanet, rel]: [string, any]) => {
                const compoundColor =
                  rel.compoundRelationship === 'GREAT_FRIEND'
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                    : rel.compoundRelationship === 'FRIEND'
                    ? 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30'
                    : rel.compoundRelationship === 'NEUTRAL'
                    ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/30'
                    : rel.compoundRelationship === 'ENEMY'
                    ? 'bg-orange-500/20 text-orange-800 dark:text-orange-300 border-orange-500/30'
                    : 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30';

                return (
                  <div key={otherPlanet} className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/60 pb-2">
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-200">
                        {translatePlanet(selectedRelationshipPlanet)} → <span className="text-amber-700 dark:text-amber-400">{translatePlanet(otherPlanet)}</span>
                      </div>
                      <span className={`px-2 py-0.5 border rounded text-[10px] font-bold ${compoundColor}`}>
                        {translateRelationship(rel.compoundRelationship)}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <div className="flex justify-between">
                        <span>{language === 'hi' ? 'नैसर्गिक संबंध:' : 'Natural (Naisargika):'}</span>
                        <span className="text-slate-900 dark:text-slate-200 font-semibold">{translateRelationship(rel.naturalRelationship)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === 'hi' ? 'तात्कालिक संबंध:' : 'Temporary (Tatkalika):'}</span>
                        <span className="text-slate-900 dark:text-slate-200 font-semibold">{translateRelationship(rel.temporaryRelationship)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === 'hi' ? 'पंचधा संबंध:' : 'Compound (Panchadha):'}</span>
                        <span className="text-amber-700 dark:text-amber-400 font-bold">{translateRelationship(rel.compoundRelationship)}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 italic">
                      {rel.explanation}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* 9. SHADBALA ENGINE SECTION */}
      {shadbalaData && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6" id="shadbala-section">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  {language === 'hi' ? '९. षड्बल — शास्त्रीय गणितीय समग्र बल' : '9. SHADBALA — Classical 6-Fold Planetary Strength'}
                </h3>
                <span id="shadbala-status-badge" className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  shadbalaData.completeness === 'COMPLETE'
                    ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                }`}>
                  {shadbalaData.completeness === 'COMPLETE'
                    ? (language === 'hi' ? 'पूर्ण पराशरीय षड्बल (६/६ घटक)' : 'COMPLETE PARASHARI BALA (6/6 COMPONENTS)')
                    : (language === 'hi' ? 'आधारभूत / आंशिक गणना' : 'FOUNDATION / PARTIAL')}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {language === 'hi'
                  ? `प्रामाणिक बृहत्पाराशर होरा शास्त्र (अध्याय २७) • प्रोफ़ाइल: ${shadbalaData.profileVersion} (१ रूप = ६० विरूपा)`
                  : `Canonical Brihat Parasara Hora Shastra (BPHS Ch. 27) • Profile: ${shadbalaData.profileVersion} (1 Rupa = 60 Virupas)`}
              </p>
            </div>
          </div>

          {/* Status Notice Banner */}
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-4 text-xs text-emerald-900 dark:text-emerald-300 space-y-1">
            <div className="font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              {language === 'hi' ? 'पूर्ण शास्त्रीय षड्बल गणना सक्रिय:' : 'Complete Classical Shadbala System Active:'}
            </div>
            <p className="text-emerald-800 dark:text-emerald-300/90 leading-relaxed">
              {language === 'hi'
                ? 'सभी ६ शास्त्रीय घटक (स्थान बल, दिग्बल, काल बल, चेष्टा बल, नैसर्गिक बल, एवं दृग्बल) सप्तवर्गज (D1-D30) व पराशरीय दृष्टि नियमों के साथ पूर्णतः गणितीय रूप से मूल्यांकित हैं।'
                : 'All 6 classical components (Sthana Bala with 7 Vargas, Dig Bala, Kaala Bala with 6 subcomponents, Cheshta Bala, Naisargika Bala, and Drik Bala with continuous Parashari Drushti) are fully evaluated mathematically according to BPHS.'}
            </p>
          </div>

          {/* Formula Validation Status Table */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3" id="shadbala-formula-validation-table">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {language === 'hi' ? 'षड्बल घटक कार्यान्वयन स्थिति' : 'Shadbala Component Methodology Status'}
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                JHora Benchmark: {shadbalaData.validation?.benchmarkStatus || 'PARTIALLY_VALIDATED'}
              </span>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                    <th className="py-1.5 px-2 font-medium">{language === 'hi' ? 'घटक' : 'Component'}</th>
                    <th className="py-1.5 px-2 font-medium">{language === 'hi' ? 'कार्यान्वयन स्थिति' : 'Implementation Status'}</th>
                    <th className="py-1.5 px-2 font-medium">{language === 'hi' ? 'शास्त्रीय आधार' : 'Classical Source'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono text-[11px]">
                  {Object.entries(shadbalaData.validation?.methodologyStatus || {
                    UCHCHA_BALA: 'IMPLEMENTED_UNBENCHMARKED',
                    OJAYUGMA_BALA: 'IMPLEMENTED_UNBENCHMARKED',
                    KENDRADI_BALA: 'IMPLEMENTED_UNBENCHMARKED',
                    DREKKANA_BALA: 'IMPLEMENTED_UNBENCHMARKED',
                    DIG_BALA: 'IMPLEMENTED_UNBENCHMARKED',
                    NAISARGIKA_BALA: 'BENCHMARK_VALIDATED',
                    SAPTAVARGAJA_BALA: 'IMPLEMENTED_UNBENCHMARKED',
                    CHESHTA_BALA: 'IMPLEMENTED_UNBENCHMARKED',
                    KAALA_BALA: 'IMPLEMENTED_UNBENCHMARKED',
                    DRIK_BALA: 'IMPLEMENTED_UNBENCHMARKED',
                  }).map(([comp, st]: [string, any]) => (
                    <tr key={comp} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50">
                      <td className="py-1.5 px-2 font-sans font-semibold text-slate-800 dark:text-slate-300">
                        {comp.replace(/_/g, ' ')}
                      </td>
                      <td className="py-1.5 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          st === 'BENCHMARK_VALIDATED'
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : st === 'IMPLEMENTED_UNBENCHMARKED'
                            ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                        }`}>
                          {st}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-slate-600 dark:text-slate-400 text-[10px]">
                        {language === 'hi' ? 'बृहत्पाराशर होरा शास्त्र (अध्याय २७)' : 'Brihat Parasara Hora Shastra (Ch. 27)'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Planet Shadbala Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="shadbala-cards">
            {shadbalaData.planets?.map((p: any) => {
              const isExpanded = expandedShadbalaPlanet === p.planet;
              const reqFact = shadbalaData.requiredStrength?.[p.planet];
              const isStrong = p.isStrong ?? (p.totalVirupas >= (reqFact?.requiredVirupas || 300));
              const ratioPercent = p.shadbalaRatio !== undefined ? (p.shadbalaRatio * 100).toFixed(1) : (((p.totalVirupas || 0) / (reqFact?.requiredVirupas || 300)) * 100).toFixed(1);

              return (
                <div key={p.planet} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-lg">
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800/80 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {translatePlanet(p.planet)}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isStrong
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                        }`}>
                          {isStrong ? (language === 'hi' ? 'बली (STRONG)' : 'STRONG / BALI') : (language === 'hi' ? 'निर्बल (DEFICIENT)' : 'DEFICIENT')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        {language === 'hi' ? 'समग्र षड्बल:' : 'Total Shadbala:'}{' '}
                        <span className="font-bold text-amber-700 dark:text-amber-400">{(p.totalVirupas ?? p.partialTotalVirupas)?.toFixed(2)} Virupas</span> ({(p.totalRupas ?? p.partialTotalRupas)?.toFixed(2)} Rupas)
                        <span className="ml-2 font-mono text-[10px] text-slate-500 dark:text-slate-400">({ratioPercent}% req)</span>
                      </div>
                    </div>

                    <button
                      id={`why-btn-shadbala-${p.planet.toLowerCase()}`}
                      onClick={() => setExpandedShadbalaPlanet(isExpanded ? null : p.planet)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                        isExpanded
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                          : 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{isExpanded ? (language === 'hi' ? 'प्रमाण छिपाएं' : 'Hide Evidence') : (language === 'hi' ? 'शास्त्रीय प्रमाण' : 'WHY?')}</span>
                    </button>
                  </div>

                  {/* 6 Components Breakdown Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    {/* 1. Sthana Bala */}
                    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 space-y-1">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{language === 'hi' ? '१. स्थान बल' : '1. Sthana Bala'}</div>
                      <div className="font-bold text-slate-900 dark:text-slate-200 text-xs">
                        {p.components?.sthana?.virupas?.toFixed(1) || '0.0'}v
                      </div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400">
                        Uchcha + 7 Vargas
                      </div>
                    </div>

                    {/* 2. Dig Bala */}
                    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 space-y-1">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{language === 'hi' ? '२. दिग्बल' : '2. Dig Bala'}</div>
                      <div className="font-bold text-slate-900 dark:text-slate-200 text-xs">
                        {p.components?.dig?.virupas?.toFixed(1) || '0.0'}v
                      </div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate">
                        {p.components?.dig?.inputs?.strongestDirection} (H{p.components?.dig?.inputs?.strongestHouse})
                      </div>
                    </div>

                    {/* 3. Kaala Bala */}
                    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 space-y-1">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{language === 'hi' ? '३. काल बल' : '3. Kaala Bala'}</div>
                      <div className="font-bold text-slate-900 dark:text-slate-200 text-xs">
                        {p.components?.kaala?.virupas?.toFixed(1) || '0.0'}v
                      </div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400">
                        6 Subcomponents
                      </div>
                    </div>

                    {/* 4. Cheshta Bala */}
                    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 space-y-1">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{language === 'hi' ? '४. चेष्टा बल' : '4. Cheshta Bala'}</div>
                      <div className="font-bold text-slate-900 dark:text-slate-200 text-xs">
                        {p.components?.cheshta?.virupas?.toFixed(1) || '0.0'}v
                      </div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400">
                        {p.components?.cheshta?.retrograde ? 'Retrograde (+)' : 'Direct'}
                      </div>
                    </div>

                    {/* 5. Naisargika Bala */}
                    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 space-y-1">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{language === 'hi' ? '५. नैसर्गिक बल' : '5. Naisargika'}</div>
                      <div className="font-bold text-slate-900 dark:text-slate-200 text-xs">
                        {p.components?.naisargika?.virupas?.toFixed(1) || '0.0'}v
                      </div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400">
                        Natural Light
                      </div>
                    </div>

                    {/* 6. Drik Bala */}
                    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 space-y-1">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{language === 'hi' ? '६. दृग्बल' : '6. Drik Bala'}</div>
                      <div className={`font-bold text-xs ${
                        (p.components?.drik?.virupas || 0) >= 0 ? 'text-slate-900 dark:text-slate-200' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {p.components?.drik?.virupas !== undefined ? `${p.components.drik.virupas >= 0 ? '+' : ''}${p.components.drik.virupas.toFixed(1)}v` : '0.0v'}
                      </div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400">
                        Parashari Drushti
                      </div>
                    </div>
                  </div>

                  {/* Required Strength Benchmark status */}
                  {reqFact && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex justify-between items-center text-[11px] text-slate-600 dark:text-slate-400">
                      <span>
                        {language === 'hi' ? 'आवश्यक मानक बल:' : 'Required Minimum:'}{' '}
                        <strong className="text-slate-800 dark:text-slate-300">{reqFact.requiredVirupas} Virupas</strong> ({reqFact.requiredRupas} Rupas)
                      </span>
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        isStrong
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      }`}>
                        {ratioPercent}% of standard
                      </span>
                    </div>
                  )}

                  {/* Expandable WHY Panel */}
                  {isExpanded && (
                    <div
                      id={`why-evidence-shadbala-${p.planet.toLowerCase()}`}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 mt-3 text-xs font-mono text-slate-700 dark:text-slate-300"
                    >
                      <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2 pb-1 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" />
                        {language === 'hi' ? `विस्तृत ६-आयामी गणना प्रमाण (${translatePlanet(p.planet)})` : `Full 6-Fold Calculation Trace & Evidence (${p.planet})`}
                      </div>
                      <div className="space-y-1 bg-slate-50 dark:bg-slate-950/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800/80 max-h-64 overflow-y-auto text-[11px]">
                        {p.evidence?.map((line: string, idx: number) => (
                          <div
                            key={idx}
                            className={
                              line.startsWith('===')
                                ? 'font-bold text-amber-800 dark:text-amber-300 pt-1'
                                : line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.') || line.startsWith('5.') || line.startsWith('6.') || line.startsWith('Total') || line.startsWith('Shadbala Ratio')
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
            })}
          </div>
        </div>
      )}
    </div>
  );
};

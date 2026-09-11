'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  ShieldAlert, 
  Layers, 
  Clock, 
  Shield, 
  CheckCircle, 
  Table, 
  Compass, 
  ArrowRight,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { CODEX_ENTRIES, CODEX_CATEGORIES, CodexEntry } from './codexData';
import { AstrologyWithoutSuperstitionModal } from './AstrologyWithoutSuperstitionModal';

interface JargonBusterTabProps {
  initialTermId?: string | null;
}

export const JargonBusterTab: React.FC<JargonBusterTabProps> = ({
  initialTermId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(initialTermId || null);
  const [showSuperstitionModal, setShowSuperstitionModal] = useState(false);

  // Filter entries based on search and category
  const filteredEntries = useMemo(() => {
    return CODEX_ENTRIES.filter((entry) => {
      const matchesCategory = selectedCategory === 'ALL' || entry.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        entry.term.toLowerCase().includes(q) ||
        entry.sanskrit.toLowerCase().includes(q) ||
        entry.plainEnglish.toLowerCase().includes(q) ||
        entry.summary.toLowerCase().includes(q) ||
        entry.practicalMeaning.toLowerCase().includes(q) ||
        (entry.mythVsReality && (
          entry.mythVsReality.myth.toLowerCase().includes(q) ||
          entry.mythVsReality.reality.toLowerCase().includes(q)
        ))
      );
    });
  }, [searchQuery, selectedCategory]);

  const categoryIconMap: Record<string, React.ReactNode> = {
    ALL: <Sparkles className="w-3.5 h-3.5" />,
    PHILOSOPHY: <Compass className="w-3.5 h-3.5" />,
    HOUSES_ARCH: <Layers className="w-3.5 h-3.5" />,
    TIMING_DASHA: <Clock className="w-3.5 h-3.5" />,
    STRENGTH_BALA: <Shield className="w-3.5 h-3.5" />,
    YOGAS_DOSHAS: <CheckCircle className="w-3.5 h-3.5" />,
    DIVISIONAL: <Table className="w-3.5 h-3.5" />,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Superstition Debunking Modal */}
      <AstrologyWithoutSuperstitionModal
        isOpen={showSuperstitionModal}
        onClose={() => setShowSuperstitionModal(false)}
      />

      {/* Hero Header & Quick Actions */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/30 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" /> Plain-English Astrological Codex
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
              The Jargon-Buster & Vedic Wisdom Archive
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Astrology without fear, cryptic gatekeeping, or commercial priests. Discover the true observational mechanics and psychological meaning behind classical Sanskrit concepts.
            </p>
          </div>

          {/* Quick Action Button to Open Superstition Manifesto */}
          <button
            id="open-superstition-manifesto-btn"
            type="button"
            onClick={() => setShowSuperstitionModal(true)}
            className="shrink-0 px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2.5 group"
          >
            <ShieldAlert className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="block font-bold">Astrology Without Superstition</span>
              <span className="block text-[10px] text-emerald-400/80 font-normal">Read the Freedom Manifesto</span>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 ml-1" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="codex-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts, Sanskrit terms, or myths (e.g., 'Manglik', 'Kendra', 'Sade Sati', 'Shadbala', 'Karma')..."
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/80 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 bg-slate-800 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1 scrollbar-none" id="codex-category-filters">
          {CODEX_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`filter-codex-${cat.id.toLowerCase()}`}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shrink-0 transition-all ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {categoryIconMap[cat.id]}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Quick Stats */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing <strong>{filteredEntries.length}</strong> concepts {selectedCategory !== 'ALL' ? `in ${selectedCategory}` : ''}</span>
        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Click any card to expand full analysis & myths
        </span>
      </div>

      {/* Concept Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="codex-entries-grid">
        {filteredEntries.map((entry) => {
          const isExpanded = expandedCardId === entry.id;

          return (
            <div
              key={entry.id}
              id={`codex-card-${entry.id}`}
              className={`bg-slate-900/70 border rounded-2xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between ${
                isExpanded
                  ? 'border-amber-500/50 shadow-xl shadow-amber-500/5 bg-slate-900/90 ring-1 ring-amber-500/20'
                  : 'border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/80'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-100">
                        {entry.term}
                      </h3>
                      <span className="font-serif text-amber-400/90 text-sm font-semibold">
                        {entry.sanskrit}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                      ✦ {entry.plainEnglish}
                    </span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-slate-800/80 text-slate-400 border border-slate-700/60 shrink-0">
                    {entry.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Summary */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {entry.summary}
                </p>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-800 space-y-4 animate-in fade-in duration-200">
                    {/* Practical Meaning */}
                    <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 space-y-1">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                        What This Means in Real Life
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {entry.practicalMeaning}
                      </p>
                    </div>

                    {/* Myth vs Reality Debunking Banner */}
                    {entry.mythVsReality && (
                      <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs uppercase tracking-wider">
                          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Superstitious Myth vs. Vedic Reality</span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <p className="text-slate-300">
                            <strong className="text-red-400">Common Fear:</strong> {entry.mythVsReality.myth}
                          </p>
                          <p className="text-emerald-300">
                            <strong className="text-emerald-400">Vedic Truth:</strong> {entry.mythVsReality.reality}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Everyday Empowerment Action */}
                    <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3.5 space-y-1">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        Everyday Empowerment Action
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {entry.empowermentAction}
                      </p>
                    </div>

                    {/* Related Terms */}
                    {entry.relatedTerms && entry.relatedTerms.length > 0 && (
                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Related:</span>
                        {entry.relatedTerms.map((t, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSearchQuery(t);
                              window.scrollTo({ top: 300, behavior: 'smooth' });
                            }}
                            className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 hover:text-amber-300 hover:bg-slate-700/60 transition-colors"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Toggle Button */}
              <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between">
                <button
                  id={`toggle-card-${entry.id}`}
                  type="button"
                  onClick={() => setExpandedCardId(isExpanded ? null : entry.id)}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                  <span>{isExpanded ? 'Collapse Analysis' : 'Expand Full Meaning & Reality Check'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl p-8 space-y-3">
          <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
          <h4 className="text-base font-bold text-slate-300">No matching concepts found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try searching for common terms like &ldquo;Lagna&rdquo;, &ldquo;Saturn&rdquo;, &ldquo;Kendra&rdquo;, &ldquo;Sade Sati&rdquo;, or &ldquo;Free Will&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

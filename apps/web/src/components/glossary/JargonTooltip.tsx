'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle, Sparkles, BookOpen, X, ShieldAlert } from 'lucide-react';
import { getCodexEntry, CodexEntry } from './codexData';
import { useI18n } from '../../lib/i18n';

interface JargonTooltipProps {
  termId: string;
  children?: React.ReactNode;
  fallbackLabel?: string;
  onOpenCodex?: (termId: string) => void;
  inline?: boolean;
}

export const JargonTooltip: React.FC<JargonTooltipProps> = ({
  termId,
  children,
  fallbackLabel,
  onOpenCodex,
  inline = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; placeAbove: boolean }>({
    top: 0,
    left: 0,
    placeAbove: true,
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoverOpenedRef = useRef(false);
  const entry: CodexEntry | undefined = getCodexEntry(termId);
  const { language } = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update fixed position on open, window resize, or scroll
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = Math.min(360, window.innerWidth - 24);
    const tooltipHeight = 260;
    const gap = 8;

    // Horizontal positioning: center on trigger, clamped to screen bounds
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - tooltipWidth - 12));

    // Vertical positioning: check space above vs space below
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceAbove >= tooltipHeight + gap || spaceAbove > spaceBelow;
    
    let top = placeAbove
      ? Math.max(12, rect.top - tooltipHeight - gap)
      : Math.max(12, Math.min(window.innerHeight - tooltipHeight - 12, rect.bottom + gap));

    setCoords({ top, left, placeAbove });
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleScrollOrResize = () => updatePosition();
      window.addEventListener('resize', handleScrollOrResize, { passive: true });
      window.addEventListener('scroll', handleScrollOrResize, { passive: true, capture: true });

      let timer: NodeJS.Timeout;
      function handleClickOutside(event: MouseEvent | TouchEvent) {
        const target = event.target as Node;
        if (
          triggerRef.current &&
          !triggerRef.current.contains(target) &&
          tooltipRef.current &&
          !tooltipRef.current.contains(target)
        ) {
          setIsOpen(false);
          hoverOpenedRef.current = false;
        }
      }

      timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside, { passive: true });
      }, 50);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleScrollOrResize);
        window.removeEventListener('scroll', handleScrollOrResize, { capture: true });
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [isOpen, updatePosition]);

  const label = children || fallbackLabel || (entry ? (language === 'hi' && entry.sanskrit ? entry.sanskrit : entry.term) : termId);

  return (
    <span className={`relative ${inline ? 'inline-flex items-center' : 'block'}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          updatePosition();
          if (hoverOpenedRef.current) {
            // Tooltip was opened by mouseenter; click should keep it open, not toggle closed
            hoverOpenedRef.current = false;
            // Already open, so do nothing
          } else {
            setIsOpen((prev) => !prev);
          }
        }}
        onMouseEnter={() => {
          if (!isOpen) {
            hoverOpenedRef.current = true;
            updatePosition();
            setIsOpen(true);
          }
        }}
        onMouseLeave={() => {
          // If tooltip was opened by hover only, close it with a delay
          // so user can move mouse into the portal tooltip
          if (hoverOpenedRef.current) {
            // Keep open — tooltip's own onMouseEnter/Leave handles it
          }
        }}
        className="inline-flex items-center gap-1 text-inherit border-b border-dashed border-amber-500/50 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-300 transition-colors cursor-help focus:outline-none focus:ring-1 focus:ring-amber-500/50 rounded-sm"
        aria-expanded={isOpen}
        aria-label={`Explanation for ${entry ? entry.term : termId}`}
      >
        <span>{label}</span>
        <HelpCircle className="w-3 h-3 text-amber-600/70 dark:text-amber-400/70 shrink-0 inline hover:text-amber-600 dark:hover:text-amber-300 transition-colors" />
      </button>

      {/* Render via Portal to document.body to prevent clipping inside outer box shells */}
      {mounted && isOpen && entry && createPortal(
        <div
          ref={tooltipRef}
          role="tooltip"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            width: `${Math.min(360, window.innerWidth - 24)}px`,
            maxHeight: '80vh',
            overflowY: 'auto',
            zIndex: 99999,
          }}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-amber-500/40 shadow-2xl backdrop-blur-xl text-left text-xs pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 mb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-700 dark:text-amber-300 text-sm">{entry.term}</span>
                <span className="font-serif text-amber-800 dark:text-amber-400/90 text-xs font-semibold">{entry.sanskrit}</span>
              </div>
              <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                ✦ {entry.plainEnglish}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded transition-colors"
              aria-label="Close tooltip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Body */}
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-2.5">
            {entry.summary}
          </p>

          {/* Myth vs Reality Check snippet if available */}
          {entry.mythVsReality && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/20 rounded-lg p-2.5 mb-2.5 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                <ShieldAlert className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                {language === 'hi' ? 'भ्रम बनाम शास्त्रीय सत्य' : 'Myth vs. Reality'}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-snug">
                <strong className="text-slate-900 dark:text-slate-400 font-semibold">{language === 'hi' ? 'भ्रम:' : 'Myth:'}</strong> {entry.mythVsReality.myth}
              </p>
              <p className="text-emerald-800 dark:text-emerald-300 text-[11px] leading-snug">
                <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">{language === 'hi' ? 'वैदिक सत्य:' : 'Vedic Truth:'}</strong> {entry.mythVsReality.reality}
              </p>
            </div>
          )}

          {/* Actionable empowerment */}
          <div className="bg-slate-50 dark:bg-slate-950/60 rounded-lg p-2.5 border border-slate-200 dark:border-slate-800/80 mb-2.5">
            <span className="text-[10px] text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
              <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" /> {language === 'hi' ? 'दैनिक व्यावहारिक संरेखण' : 'Everyday Empowerment'}
            </span>
            <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
              {entry.empowermentAction}
            </p>
          </div>

          {/* Footer Action */}
          {onOpenCodex && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onOpenCodex(entry.id);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 border border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-300 font-semibold text-[11px] transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              {language === 'hi' ? 'ज्योतिष शब्दकोश में पूर्ण संदर्भ देखें' : 'Explore Full Context in Jargon Buster'}
            </button>
          )}
        </div>,
        document.body
      )}
    </span>
  );
};

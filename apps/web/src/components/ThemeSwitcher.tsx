'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../lib/theme';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle"
      type="button"
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 dark:border-slate-700/80 dark:bg-slate-900/90 dark:hover:bg-slate-800 dark:text-amber-400 transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm cursor-pointer active:scale-95"
    >
      {theme === 'dark' ? (
        <>
          <Moon className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Dark</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden sm:inline text-slate-800 font-bold">Light</span>
        </>
      )}
    </button>
  );
}

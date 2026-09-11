'use client';

import React from 'react';
import { useI18n } from '../lib/i18n';

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex space-x-2">
      <button
        id="lang-btn-en"
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition ${
          language === 'en' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
        }`}
      >
        English
      </button>
      <button
        id="lang-btn-hi"
        onClick={() => setLanguage('hi')}
        className={`px-3 py-1 rounded text-sm font-medium transition ${
          language === 'hi' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
        }`}
      >
        हिंदी
      </button>
    </div>
  );
}

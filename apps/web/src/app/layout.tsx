import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Personal Vedic Astrology & Numerology Analyzer',
  description: 'Accurate Vedic astrology and numerology analysis foundation with transparent calculations.',
};

import { I18nProvider } from '@/lib/i18n';
import { ThemeProvider } from '@/lib/theme';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950 transition-colors duration-300"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Download, Upload, ExternalLink, Play, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function BenchmarkDashboard() {
  const [jhoraCases, setJhoraCases] = useState<any[]>([]);
  const [legacyCases, setLegacyCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const { t } = useI18n();

  const fetchAllCases = async () => {
    try {
      setLoading(true);
      const jRes = await fetch('/api/benchmarks/jhora');
      const jData = await jRes.json();
      if (jData.success) setJhoraCases(jData.cases || []);

      try {
        const lRes = await fetch('/api/benchmarks');
        if (lRes.ok) {
          const lData = await lRes.json();
          if (lData.success) setLegacyCases(lData.cases || []);
        }
      } catch (err) {
        // Optional legacy benchmarks ignored if missing
      }
    } catch (err) {
      console.error('Failed to load JHora benchmarks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCases();
  }, []);

  const handleExportJSON = async () => {
    try {
      const res = await fetch('/api/benchmarks/jhora/export');
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jhora-benchmark-dataset-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Failed to export dataset JSON');
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        setImporting(true);
        const parsed = JSON.parse(evt.target?.result as string);
        const res = await fetch('/api/benchmarks/jhora/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed),
        });
        const data = await res.json();
        if (data.success) {
          alert(`Import Success!\nCreated: ${data.created}, Updated: ${data.updated}, Skipped: ${data.skipped}`);
          fetchAllCases();
        } else {
          alert('Import Error: ' + data.error);
        }
      } catch (err: any) {
        alert('Invalid JSON file format: ' + err?.message);
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(file);
  };

  const totalCount = jhoraCases.length + legacyCases.length;
  const passCount = jhoraCases.filter((c) => c.status === 'PASS').length + legacyCases.filter((c) => c.status?.includes('PASS')).length;
  const failCount = jhoraCases.filter((c) => c.status === 'FAIL').length + legacyCases.filter((c) => c.status?.includes('FAIL')).length;
  const notValidatedCount = jhoraCases.filter((c) => c.status === 'NOT_VALIDATED').length + legacyCases.filter((c) => c.status === 'NOT_VALIDATED').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-6 pt-2">
          <div>
            <div className="text-xs uppercase font-mono text-amber-400 font-bold tracking-wider mb-1">
              Cross-Engine Reference Validation
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">{t('dashboard.title')}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <button
              id="export-dataset-btn"
              onClick={handleExportJSON}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" /> Export JSON
            </button>
            <label
              id="import-dataset-label"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" /> {importing ? 'Importing...' : 'Import JSON'}
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
            <Link
              href="/benchmark/shadbala"
              suppressHydrationWarning
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition"
            >
              {t('dashboard.legacy_tool')}
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-amber-400 font-mono animate-pulse">Loading benchmark engine statistics...</div>
        ) : (
          <>
            {/* STATS OVERVIEW */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-1">
                <h3 className="text-xs font-mono uppercase text-slate-400">{t('dashboard.total_cases')}</h3>
                <p className="text-3xl font-extrabold text-slate-100">{totalCount}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-1">
                <h3 className="text-xs font-mono uppercase text-emerald-400">{t('dashboard.validated')}</h3>
                <p className="text-3xl font-extrabold text-emerald-400">{passCount}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-1">
                <h3 className="text-xs font-mono uppercase text-red-400">{t('dashboard.mismatches')}</h3>
                <p className="text-3xl font-extrabold text-red-400">{failCount}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-1">
                <h3 className="text-xs font-mono uppercase text-slate-400">{t('dashboard.not_validated')}</h3>
                <p className="text-3xl font-extrabold text-slate-300">{notValidatedCount}</p>
              </div>
            </div>

            {/* REAL JHORA BENCHMARK SUITE */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm space-y-4 p-6">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-2">
                <div>
                  <h2 className="font-bold text-lg text-slate-100">Real Jagannatha Hora (JHora) Benchmark Suite</h2>
                  <p className="text-xs text-slate-400">12 Precision Scenarios (Lahiri Ayanamsha, Whole Sign House System)</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold">
                  {jhoraCases.length} Cases Loaded
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase font-mono bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Case ID</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Scenario Name</th>
                      <th className="px-4 py-3">Location & Birth Time</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                    {jhoraCases.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3.5 font-bold text-amber-400">{c.id}</td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 border border-slate-700 text-slate-300">
                            {c.category}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-sans font-semibold text-slate-100">{c.name}</td>
                        <td className="px-4 py-3.5 text-slate-400">
                          {c.input?.location} ({c.input?.birthDate} {c.input?.birthTime})
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              c.status === 'PASS'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : c.status === 'FAIL'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <Link
                            id={`view-jhora-case-${c.id}`}
                            href={`/benchmark/jhora/${c.id}`}
                            suppressHydrationWarning
                            className="text-amber-400 hover:text-amber-300 font-bold underline underline-offset-4 flex items-center gap-1"
                          >
                            Inspect / Run <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

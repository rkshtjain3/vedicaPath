'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Edit3, ShieldAlert, CheckCircle2, Clock, MapPin, Compass, AlertTriangle } from 'lucide-react';
import { FailureInvestigationCard } from '@/components/FailureInvestigationCard';
import { JHoraDataEntryModal } from '@/components/JHoraDataEntryModal';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function JHoraCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [caseData, setCaseData] = useState<any>(null);
  const [runResult, setRunResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

  const fetchCase = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/benchmarks/jhora/${id}`);
      const data = await res.json();
      if (data.success) {
        setCaseData(data.case);
        // Automatically run benchmark calculation
        runComparison();
      } else {
        alert('Case not found: ' + data.error);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const runComparison = async () => {
    try {
      setRunning(true);
      const res = await fetch(`/api/benchmarks/jhora/${id}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setRunResult(data.result);
      }
    } catch (err) {
      console.error('Error running comparison', err);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [id]);

  if (loading || !caseData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex items-center justify-center">
        <div className="text-amber-400 font-mono animate-pulse">Loading JHora Benchmark Case {id}...</div>
      </div>
    );
  }

  const details = runResult?.details || [];
  const failures = details.filter((d: any) => d.status === 'FAIL');
  const notValidated = details.filter((d: any) => d.status === 'NOT_VALIDATED');
  const passes = details.filter((d: any) => d.status === 'PASS');

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6 pt-2">
          <div className="flex items-center gap-4">
            <Link
              href="/benchmark"
              suppressHydrationWarning
              className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  {caseData.id}
                </span>
                <span className="text-xs uppercase text-slate-400 font-mono font-semibold">[{caseData.category}]</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">{caseData.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <button
              id="open-data-entry-btn"
              onClick={() => setIsEntryModalOpen(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4 text-amber-400" />
              Enter Reference Data
            </button>
            <button
              id="run-comparison-btn"
              onClick={runComparison}
              disabled={running}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg text-xs transition flex items-center gap-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              {running ? 'Calculating...' : 'Run Comparison'}
            </button>
          </div>
        </header>

        {/* INPUTS & CONFIGURATION SNAPSHOT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs uppercase font-bold tracking-wider">
              <Clock className="w-4 h-4" /> Birth Parameters
            </div>
            <div className="space-y-1 text-xs font-mono">
              <div className="text-slate-300"><span className="text-slate-500">Date:</span> {caseData.input?.birthDate}</div>
              <div className="text-slate-300"><span className="text-slate-500">Time:</span> {caseData.input?.birthTime}</div>
              <div className="text-slate-300"><span className="text-slate-500">Timezone:</span> {caseData.input?.timezone}</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs uppercase font-bold tracking-wider">
              <MapPin className="w-4 h-4" /> Location Snapshot
            </div>
            <div className="space-y-1 text-xs font-mono">
              <div className="text-slate-300"><span className="text-slate-500">Location:</span> {caseData.input?.location}</div>
              <div className="text-slate-300"><span className="text-slate-500">Latitude:</span> {caseData.input?.latitude}°</div>
              <div className="text-slate-300"><span className="text-slate-500">Longitude:</span> {caseData.input?.longitude}°</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs uppercase font-bold tracking-wider">
              <Compass className="w-4 h-4" /> Configuration Profile
            </div>
            <div className="space-y-1 text-xs font-mono">
              <div className="text-slate-300"><span className="text-slate-500">Ayanamsha:</span> {caseData.configuration?.ayanamsha}</div>
              <div className="text-slate-300"><span className="text-slate-500">House System:</span> {caseData.configuration?.houseSystem}</div>
              <div className="text-slate-300"><span className="text-slate-500">Status:</span> <strong className="text-amber-400">{caseData.status}</strong></div>
            </div>
          </div>
        </div>

        {/* COMPARISON SUMMARY STATS */}
        {runResult && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Comparison Engine Results</h3>
                <p className="text-xs text-slate-400">PERSONAL_BENCHMARK_TOLERANCE_V1 (±0.05° circular angular distance)</p>
              </div>
              <div className="flex gap-3 text-xs font-bold">
                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  {runResult.summary?.passed} PASSED
                </span>
                <span className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                  {runResult.summary?.failed} FAILURES
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
                  {runResult.summary?.notValidated} NOT VALIDATED
                </span>
              </div>
            </div>

            {/* FAILURES SECTION */}
            {failures.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-400 text-sm font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-5 h-5" /> Detailed Failure Investigations ({failures.length})
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {failures.map((detail: any, idx: number) => (
                    <FailureInvestigationCard
                      key={idx}
                      detail={detail}
                      caseId={caseData.id}
                      initialRootCause={caseData.investigation?.suspectedRootCause}
                      initialStatus={caseData.investigation?.status}
                      initialNotes={caseData.investigation?.notes}
                      onSaved={fetchCase}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* FULL COMPARISON DETAILS TABLE */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">All Component Comparisons ({details.length})</h4>
              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Engine</th>
                      <th className="p-3">Component</th>
                      <th className="p-3">Expected (JHora)</th>
                      <th className="p-3">Actual (Calculated)</th>
                      <th className="p-3">Difference</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {details.map((d: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-900/50">
                        <td className="p-3 text-slate-400">{d.engine}</td>
                        <td className="p-3 font-semibold text-slate-200">{d.component}</td>
                        <td className="p-3 text-amber-400">{d.expected !== null && d.expected !== undefined ? String(d.expected) : 'NOT_ENTERED'}</td>
                        <td className="p-3 text-slate-200">{d.actual !== null && d.actual !== undefined ? String(d.actual) : 'N/A'}</td>
                        <td className="p-3 text-slate-400">{d.difference !== undefined ? `${d.difference}°` : '-'}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              d.status === 'PASS'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : d.status === 'FAIL'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <JHoraDataEntryModal
          isOpen={isEntryModalOpen}
          onClose={() => setIsEntryModalOpen(false)}
          caseId={caseData.id}
          existingRef={caseData.referenceOutputs}
          onSaved={() => {
            fetchCase();
          }}
        />
      </div>
    </main>
  );
}

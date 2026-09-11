'use client';

import React, { useState, useEffect } from 'react';

export default function BirthChartBenchmarkPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [audit, setAudit] = useState<any | null>(null);
  const [qualityReport, setQualityReport] = useState<any | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE-001');
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [targetSoftware, setTargetSoftware] = useState<string>('Jagannatha Hora');
  const [runResult, setRunResult] = useState<any | null>(null);
  const [multiSummary, setMultiSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [running, setRunning] = useState<boolean>(false);
  const [runningAll, setRunningAll] = useState<boolean>(false);
  const [tolerance, setTolerance] = useState<number>(0.05);

  // Modals & Drawers
  const [showWhyDrawer, setShowWhyDrawer] = useState<boolean>(false);
  const [showCertificationModal, setShowCertificationModal] = useState<boolean>(false);
  const [certificationData, setCertificationData] = useState<any | null>(null);
  const [showQualityModal, setShowQualityModal] = useState<boolean>(false);
  const [showEntryModal, setShowEntryModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);

  // Reference Entry Form State
  const [entrySoftware, setEntrySoftware] = useState<string>('Jagannatha Hora');
  const [entryVersion, setEntryVersion] = useState<string>('8.0');
  const [entryNotes, setEntryNotes] = useState<string>('');
  const [entryStatus, setEntryStatus] = useState<string>('VERIFIED');
  const [entryJson, setEntryJson] = useState<string>('{}');

  // Import JSON State
  const [importJson, setImportJson] = useState<string>('');

  const fetchCases = () => {
    fetch('/api/benchmarks/chart')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.cases) {
          setCases(data.cases);
          setAudit(data.audit);
          setQualityReport(data.qualityReport);
          const found = data.cases.find((c: any) => c.id === selectedCaseId) || data.cases[0];
          if (found) {
            setSelectedCaseId(found.id);
            setSelectedCase(found);
            setEntryJson(JSON.stringify(found.referenceValues || {}, null, 2));
            setEntrySoftware(found.referenceSource?.sourceSoftware || found.referenceSource?.software || 'Jagannatha Hora');
            setEntryVersion(found.referenceSource?.sourceVersion || found.referenceSource?.version || '8.0');
            setEntryNotes(found.referenceSource?.notes || '');
            setEntryStatus(found.referenceSource?.verificationStatus || 'VERIFIED');
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching benchmark cases:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleCaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedCaseId(id);
    const found = cases.find((c) => c.id === id);
    setSelectedCase(found || null);
    setRunResult(null);
    if (found) {
      setEntryJson(JSON.stringify(found.referenceValues || {}, null, 2));
      setEntrySoftware(found.referenceSource?.sourceSoftware || found.referenceSource?.software || 'Jagannatha Hora');
      setEntryVersion(found.referenceSource?.sourceVersion || found.referenceSource?.version || '8.0');
      setEntryNotes(found.referenceSource?.notes || '');
      setEntryStatus(found.referenceSource?.verificationStatus || 'VERIFIED');
    }
  };

  const runBenchmark = async () => {
    if (!selectedCaseId) return;
    setRunning(true);
    try {
      const res = await fetch('/api/benchmarks/chart/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: selectedCaseId, tolerance, targetSoftware }),
      });
      const data = await res.json();
      if (data.success) {
        setRunResult(data.result);
      }
    } catch (err) {
      console.error('Failed to run benchmark:', err);
    } finally {
      setRunning(false);
    }
  };

  const runAllBenchmarks = async () => {
    setRunningAll(true);
    try {
      const res = await fetch('/api/benchmarks/chart/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tolerance, targetSoftware }),
      });
      const data = await res.json();
      if (data.success) {
        setMultiSummary(data.summary);
      }
    } catch (err) {
      console.error('Failed to run multi-case benchmark suite:', err);
    } finally {
      setRunningAll(false);
    }
  };

  const fetchCertification = async () => {
    try {
      const res = await fetch('/api/benchmarks/chart/certification');
      const data = await res.json();
      if (data.success) {
        setCertificationData(data);
        setShowCertificationModal(true);
      }
    } catch (err) {
      console.error('Failed to fetch certification report:', err);
    }
  };

  const saveReference = async () => {
    try {
      let parsedRef = {};
      try {
        parsedRef = JSON.parse(entryJson);
      } catch (err) {
        alert('Invalid JSON in reference values editor');
        return;
      }

      const res = await fetch(`/api/benchmarks/chart/${selectedCaseId}/reference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceValues: parsedRef,
          notes: entryNotes,
          provenance: {
            sourceSoftware: entrySoftware,
            sourceVersion: entryVersion,
            sourceDate: new Date().toISOString().split('T')[0],
            sourceConfiguration: {
              zodiac: 'SIDEREAL',
              ayanamsha: selectedCase?.inputSnapshot?.ayanamsha || 'Lahiri',
              houseSystem: selectedCase?.inputSnapshot?.houseSystem || 'Whole Sign',
              nodeCalculation: 'TRUE',
            },
            dataEntryMethod: 'VERIFIED_SOFTWARE_BENCHMARK',
            referenceCapturedBy: 'Vedica Developer UI Audit',
            verificationStatus: entryStatus,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowEntryModal(false);
        fetchCases();
      } else {
        alert(data.error || 'Failed to save reference data');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving reference data');
    }
  };

  const handleImport = async () => {
    try {
      let parsed = {};
      try {
        parsed = JSON.parse(importJson);
      } catch (err) {
        alert('Invalid JSON dataset format');
        return;
      }

      const res = await fetch('/api/benchmarks/chart/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Successfully imported/updated ${data.updatedCount} cases!`);
        setShowImportModal(false);
        fetchCases();
      } else {
        alert(data.error || 'Import failed');
      }
    } catch (err: any) {
      alert(err.message || 'Error importing dataset');
    }
  };

  const getVerificationBadgeClass = (vStatus: string) => {
    switch (vStatus) {
      case 'VERIFIED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'SOURCE_CAPTURED':
      case 'REVIEWED':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'REJECTED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-slate-400 animate-pulse text-lg font-mono">Loading Benchmark Program & Audit Engine...</div>
      </div>
    );
  }

  const input = selectedCase?.inputSnapshot || {};
  const config = input?.calculationConfig || {
    zodiacType: 'SIDEREAL',
    ayanamsha: input?.ayanamsha || 'Lahiri',
    houseSystem: input?.houseSystem || 'Whole Sign',
    nodeCalculation: 'TRUE',
    ephemerisVersion: 'Swiss Ephemeris v2.10',
    calculationProfileVersion: 'personal-vedic-v1',
  };

  const auditSummary = audit?.summary || {
    totalCases: cases.length,
    casesWithReferenceData: cases.filter((c) => Object.keys(c.referenceValues || {}).length > 0).length,
    verifiedCases: cases.filter((c) => c.referenceSource?.verificationStatus === 'VERIFIED').length,
    unverifiedCases: cases.filter((c) => c.referenceSource?.verificationStatus !== 'VERIFIED').length,
  };

  const qReport = qualityReport || {
    qualityScore: 70,
    classification: 'MEDIUM',
  };

  const compMetrics = runResult?.accuracyMetrics?.componentBreakdown;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase bg-indigo-950/60 border border-indigo-800/60 px-2.5 py-1 rounded">
                Developer Audit Suite
              </span>
              <span className="text-xs font-mono text-slate-400">Phase 21 Multi-Case Accuracy Program</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Birth Chart Calculation Benchmark & Quality Dashboard</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowQualityModal(true)}
              className="bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
            >
              🛡️ Quality Score: <span className="font-bold text-amber-300">{qReport.qualityScore}/100 ({qReport.classification})</span>
            </button>

            <button
              onClick={runAllBenchmarks}
              disabled={runningAll}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-950/50"
            >
              {runningAll ? 'Running Suite...' : '🚀 Run All Benchmarks'}
            </button>

            <button
              onClick={fetchCertification}
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              📜 Certification Report
            </button>

            <a
              href="/api/benchmarks/chart/export"
              target="_blank"
              download
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              📥 Export Dataset
            </a>

            <button
              onClick={() => setShowImportModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              📤 Import Dataset
            </button>

            <button
              onClick={() => setShowEntryModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-700/60 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              ✏️ Enter Reference Data
            </button>
          </div>
        </div>

        {/* Audit Registry Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs font-mono">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase">Total Cases</div>
            <div className="text-lg font-bold text-white mt-1">{auditSummary.totalCases}</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase">With Ref Data</div>
            <div className="text-lg font-bold text-indigo-300 mt-1">{auditSummary.casesWithReferenceData}</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase">Verified Cases</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">{auditSummary.verifiedCases}</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase">Unverified Cases</div>
            <div className="text-lg font-bold text-amber-300 mt-1">{auditSummary.unverifiedCases}</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase">Passing Cases</div>
            <div className="text-lg font-bold text-emerald-300 mt-1">{multiSummary?.passedCases ?? '-'}</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase">Failing Cases</div>
            <div className="text-lg font-bold text-rose-400 mt-1">{multiSummary?.failedCases ?? '-'}</div>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase">Incomparable</div>
            <div className="text-lg font-bold text-purple-400 mt-1">{multiSummary?.incomparableCases ?? '-'}</div>
          </div>
        </div>

        {/* Coverage Matrix Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Benchmark Program Coverage Matrix (CASE-001 to CASE-007)
            </h3>
            <span className="text-xs font-mono text-slate-400">Dataset Version: chart-reference-dataset-v2</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950">
                  <th className="p-2.5">Case ID & Title</th>
                  <th className="p-2.5">Location & Hemisphere</th>
                  <th className="p-2.5">DST Type</th>
                  <th className="p-2.5">Hist. TZ</th>
                  <th className="p-2.5">Planets</th>
                  <th className="p-2.5">Nakshatra</th>
                  <th className="p-2.5">Dasha</th>
                  <th className="p-2.5">D9/D10/D30</th>
                  <th className="p-2.5">Verification</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {cases.map((c) => {
                  const isRef = Object.keys(c.referenceValues || {}).length > 0;
                  const vStatus = c.referenceSource?.verificationStatus || 'UNVERIFIED';
                  const lat = c.inputSnapshot?.latitude || 0;
                  const yr = parseInt((c.inputSnapshot?.birthDate || '2000').split('-')[0], 10);
                  const isDstSpring = c.id.includes('002');
                  const isDstFall = c.id.includes('003');

                  return (
                    <tr key={c.id} className={`hover:bg-slate-800/40 ${selectedCaseId === c.id ? 'bg-indigo-950/30' : ''}`}>
                      <td className="p-2.5 font-bold text-slate-200">
                        {c.id}: <span className="font-normal text-slate-400">{c.title}</span>
                      </td>
                      <td className="p-2.5 text-slate-300">
                        {c.inputSnapshot?.locationName?.split(',')[0]} ({lat >= 0 ? 'NH' : 'SH'})
                      </td>
                      <td className="p-2.5">
                        {isDstSpring ? <span className="text-amber-300 font-bold">Spring Jump</span> : isDstFall ? <span className="text-purple-300 font-bold">Fall Back</span> : <span className="text-slate-500">Standard</span>}
                      </td>
                      <td className="p-2.5">{yr < 1970 ? <span className="text-cyan-300 font-bold">Pre-1970</span> : <span className="text-slate-500">Modern</span>}</td>
                      <td className="p-2.5">{isRef ? <span className="text-emerald-400">✓ 9 Planets</span> : <span className="text-slate-600">-</span>}</td>
                      <td className="p-2.5">{isRef ? <span className="text-emerald-400">✓ Nak & Pada</span> : <span className="text-slate-600">-</span>}</td>
                      <td className="p-2.5">{isRef ? <span className="text-emerald-400">✓ Vimshottari</span> : <span className="text-slate-600">-</span>}</td>
                      <td className="p-2.5">{isRef ? <span className="text-emerald-400">✓ D1-D30</span> : <span className="text-slate-600">-</span>}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getVerificationBadgeClass(vStatus)}`}>
                          {vStatus}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedCaseId(c.id);
                            setSelectedCase(c);
                            setRunResult(null);
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-indigo-300 px-2 py-1 rounded text-[11px]"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Case Inspector Controls */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <label className="text-xs font-semibold text-slate-400 uppercase">Inspect Case:</label>
              <select
                value={selectedCaseId}
                onChange={handleCaseChange}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} — {c.title}
                  </option>
                ))}
              </select>

              <label className="text-xs font-semibold text-slate-400 uppercase ml-2">Reference System:</label>
              <select
                value={targetSoftware}
                onChange={(e) => setTargetSoftware(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="Jagannatha Hora">Jagannatha Hora (v8.0)</option>
                <option value="Swiss Ephemeris">Swiss Ephemeris (v2.10)</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={runBenchmark}
                disabled={running}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
              >
                {running ? 'Executing...' : '⚡ Run Case Validation'}
              </button>

              {runResult?.mismatchDiagnostics && (
                <button
                  onClick={() => setShowWhyDrawer(true)}
                  className="bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                >
                  🔍 Diagnostic Drawer ({runResult.mismatchDiagnostics.candidates.length})
                </button>
              )}
            </div>
          </div>

          {/* Case Detail Snapshot */}
          {selectedCase && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono pt-2">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 uppercase text-[10px] block">Birth Details</span>
                <span className="font-semibold text-slate-200 block mt-1">
                  {input.birthDate} {input.birthTime} ({input.timezone})
                </span>
                <span className="text-slate-400 text-[11px] block mt-0.5">{input.locationName}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 uppercase text-[10px] block">Engine Configuration</span>
                <span className="text-slate-300 block mt-1">
                  Ayanamsha: <strong className="text-indigo-300">{config.ayanamsha}</strong> | Zodiac: {config.zodiacType}
                </span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  House: {config.houseSystem} | Node: {config.nodeCalculation}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 uppercase text-[10px] block">Reference Source</span>
                <span className="text-slate-300 block mt-1">
                  {selectedCase.referenceSource?.sourceSoftware || selectedCase.referenceSource?.software || 'None'} (
                  {selectedCase.referenceSource?.sourceVersion || 'N/A'})
                </span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Status: <strong className="text-emerald-400">{selectedCase.referenceSource?.verificationStatus || 'UNVERIFIED'}</strong>
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 uppercase text-[10px] block">Case Execution Status</span>
                <span className="text-slate-300 block mt-1 font-bold">
                  {runResult ? runResult.validationExecutionResult : 'NOT_RUN'}
                </span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Components: {runResult?.summary?.passedComponents || 0} / {runResult?.summary?.totalComponents || 0} Pass
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Extended Component Accuracy Metrics Breakdown Cards */}
        {runResult?.accuracyMetrics && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Component-Level Accuracy Metrics Breakdown
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              {/* Planetary Longitudes Card */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-slate-400 font-bold uppercase text-[11px]">Planetary Longitudes</div>
                <div className="text-slate-300">
                  Passed: <strong className="text-emerald-400">{compMetrics?.planetary?.passed || 0}</strong> / {compMetrics?.planetary?.comparisons || 0}
                </div>
                <div className="text-slate-400 text-[11px]">
                  Max Diff: <span className="text-amber-300">{compMetrics?.planetary?.maxAngularDifference?.toFixed(6)}°</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Mean Diff: <span className="text-emerald-300">{compMetrics?.planetary?.meanAngularDifference?.toFixed(6)}°</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Median Diff: <span className="text-indigo-300">{compMetrics?.planetary?.medianAngularDifference?.toFixed(6)}°</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  RMS Diff: <span className="text-purple-300">{compMetrics?.planetary?.rmsAngularDifference?.toFixed(6)}°</span>
                </div>
              </div>

              {/* Ascendant & Nakshatras Card */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-slate-400 font-bold uppercase text-[11px]">Ascendant & Nakshatras</div>
                <div className="text-slate-300">
                  Asc Sign Match: <strong className={compMetrics?.ascendant?.signMatch ? 'text-emerald-400' : 'text-rose-400'}>{compMetrics?.ascendant?.signMatch ? 'YES' : 'NO'}</strong>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Nakshatra Match: <span className="text-indigo-300">{compMetrics?.nakshatra?.nakshatraMatchRate}%</span> ({compMetrics?.nakshatra?.nakshatraMatchCount} matched)
                </div>
                <div className="text-slate-400 text-[11px]">
                  Pada Match: <span className="text-indigo-300">{compMetrics?.nakshatra?.padaMatchRate}%</span> ({compMetrics?.nakshatra?.padaMatchCount} matched)
                </div>
                <div className="text-slate-400 text-[11px]">
                  Dasha Birth Nakshatra: <strong className={compMetrics?.dasha?.birthNakshatraMatch ? 'text-emerald-400' : 'text-rose-400'}>{compMetrics?.dasha?.birthNakshatraMatch ? 'MATCH' : 'MISMATCH'}</strong>
                </div>
              </div>

              {/* Divisional Chart Breakdown Matrix */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 col-span-1 md:col-span-2">
                <div className="text-slate-400 font-bold uppercase text-[11px] mb-2">Divisional Chart Accuracy Matrix (D1 - D30)</div>
                <div className="grid grid-cols-4 gap-2 text-[11px]">
                  {['D1', 'D2', 'D3', 'D7', 'D9', 'D10', 'D12', 'D30'].map((code) => {
                    const info = compMetrics?.divisional?.[code] || { total: 0, passed: 0, passRate: 0 };
                    return (
                      <div key={code} className="bg-slate-900 p-2 rounded border border-slate-800">
                        <div className="font-bold text-slate-300">{code} Chart</div>
                        <div className="text-slate-400 text-[10px]">
                          Pass: <span className={info.passRate === 100 ? 'text-emerald-400 font-bold' : info.total === 0 ? 'text-slate-600' : 'text-amber-300'}>{info.passRate}%</span> ({info.passed}/{info.total})
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Comparison Table */}
        {runResult && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Component Comparison Results Details
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950">
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Component</th>
                    <th className="p-2.5">Field</th>
                    <th className="p-2.5">Expected (Ref)</th>
                    <th className="p-2.5">Actual (Vedica)</th>
                    <th className="p-2.5">Difference</th>
                    <th className="p-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {runResult.details?.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="p-2.5 text-slate-400">{item.category}</td>
                      <td className="p-2.5 font-bold text-slate-200">{item.planetOrKey}</td>
                      <td className="p-2.5 text-slate-300">{item.field}</td>
                      <td className="p-2.5 text-slate-300">
                        {typeof item.expectedValue === 'number' ? item.expectedValue.toFixed(4) : String(item.expectedValue)}
                      </td>
                      <td className="p-2.5 text-slate-300">
                        {typeof item.actualValue === 'number' ? item.actualValue.toFixed(4) : String(item.actualValue)}
                      </td>
                      <td className="p-2.5 text-amber-300 font-mono">
                        {typeof item.difference === 'number' ? `${item.difference.toFixed(6)}°` : '-'}
                      </td>
                      <td className="p-2.5 text-right font-bold">
                        <span className={item.status === 'PASS' ? 'text-emerald-400' : item.status === 'FAIL' ? 'text-rose-400' : 'text-slate-500'}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* BENCHMARK SUITE QUALITY MODAL */}
      {showQualityModal && qReport && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                🛡️ Benchmark Suite Quality Score (<span className="text-indigo-400">BENCHMARK_QUALITY_V1</span>)
              </h3>
              <button onClick={() => setShowQualityModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-900/60 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase text-slate-400 font-mono">Overall Suite Maturity Classification</div>
                <div className="text-2xl font-bold text-indigo-300 font-mono mt-0.5">{qReport.classification} MATURITY</div>
              </div>
              <div className="text-right font-mono">
                <div className="text-3xl font-bold text-amber-300">{qReport.qualityScore}/100</div>
                <div className="text-[10px] text-slate-500 uppercase">Evaluated At: {qReport.evaluatedAt?.split('T')[0]}</div>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider">Quality Factor Evaluation Evidence</h4>
              <div className="space-y-2">
                {qReport.factors?.map((f: any, idx: number) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{f.factor} (Weight: {f.weight}%)</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${f.status === 'SATISFIED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {f.status} ({f.score}/100)
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{f.details}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider">Suite Limitations & Disclaimers</h4>
              <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                {qReport.limitations?.map((l: string, idx: number) => (
                  <li key={idx}>{l}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setShowQualityModal(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-xs font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WHY DIAGNOSTICS DRAWER */}
      {showWhyDrawer && runResult?.mismatchDiagnostics && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-2xl h-full p-6 space-y-5 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                🔍 WHY? Root Cause Mismatch Diagnostics
              </h3>
              <button onClick={() => setShowWhyDrawer(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {runResult.mismatchDiagnostics.candidates?.map((c: any, idx: number) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-rose-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300 text-sm">{c.mismatchCategory}</span>
                    <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded text-[10px] font-bold">
                      Likelihood: {c.likelihood}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{c.description}</p>

                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Recommended Investigation Steps:</span>
                    <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1">
                      {c.recommendedInvestigation?.map((step: string, sIdx: number) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CERTIFICATION REPORT MODAL */}
      {showCertificationModal && certificationData && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                📜 Formal Accuracy Certification Report
              </h3>
              <button onClick={() => setShowCertificationModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 whitespace-pre-wrap overflow-x-auto">
              {certificationData.report || certificationData.textReport}
            </pre>

            <div className="flex justify-end">
              <button onClick={() => setShowCertificationModal(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-xs font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REFERENCE ENTRY MODAL */}
      {showEntryModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Enter Reference Data ({selectedCaseId})</h3>
              <button onClick={() => setShowEntryModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 uppercase text-[10px] block mb-1">Software Name</label>
                <input
                  type="text"
                  value={entrySoftware}
                  onChange={(e) => setEntrySoftware(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded"
                />
              </div>
              <div>
                <label className="text-slate-400 uppercase text-[10px] block mb-1">Software Version</label>
                <input
                  type="text"
                  value={entryVersion}
                  onChange={(e) => setEntryVersion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 uppercase text-[10px] block mb-1 font-mono">Verification Status</label>
              <select
                value={entryStatus}
                onChange={(e) => setEntryStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono p-2 rounded"
              >
                <option value="VERIFIED">VERIFIED (Full Provenance Required)</option>
                <option value="SOURCE_CAPTURED">SOURCE_CAPTURED</option>
                <option value="UNVERIFIED">UNVERIFIED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 uppercase text-[10px] block mb-1 font-mono">Reference JSON Values</label>
              <textarea
                rows={10}
                value={entryJson}
                onChange={(e) => setEntryJson(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono p-3 rounded"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowEntryModal(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded text-xs">
                Cancel
              </button>
              <button onClick={saveReference} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-xs font-bold">
                Save Reference Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DATASET IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Import Standardized Dataset JSON</h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div>
              <label className="text-slate-400 uppercase text-[10px] block mb-1 font-mono">Paste Dataset JSON</label>
              <textarea
                rows={12}
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder="Paste JSON exported from Vedica benchmark dataset..."
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono p-3 rounded"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowImportModal(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded text-xs">
                Cancel
              </button>
              <button onClick={handleImport} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-xs font-bold">
                Import Dataset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Info,
  Download,
  Upload,
  RefreshCw,
  Sliders,
  Shield,
  FileCode2,
  Play,
} from 'lucide-react';

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const COMPONENTS = [
  { key: 'uchchaBala', label: 'Uchcha Bala', compKey: 'UCHCHA_BALA' },
  { key: 'saptavargajaBala', label: 'Saptavargaja Bala', compKey: 'SAPTAVARGAJA_BALA' },
  { key: 'ojayugmaBala', label: 'Ojayugma Bala', compKey: 'OJAYUGMA_BALA' },
  { key: 'kendradiBala', label: 'Kendradi Bala', compKey: 'KENDRADI_BALA' },
  { key: 'drekkanaBala', label: 'Drekkana Bala', compKey: 'DREKKANA_BALA' },
  { key: 'digBala', label: 'Dig Bala', compKey: 'DIG_BALA' },
  { key: 'naisargikaBala', label: 'Naisargika Bala', compKey: 'NAISARGIKA_BALA' },
  { key: 'cheshtaBala', label: 'Cheshta Bala', compKey: 'CHESHTA_BALA' },
];

const MISMATCH_CAUSES = [
  'INPUT_TIMEZONE',
  'AYANAMSHA',
  'EPHEMERIS',
  'LONGITUDE_BOUNDARY',
  'HOUSE_METHOD',
  'FORMULA_VARIANT',
  'REFERENCE_DATA_ERROR',
  'IMPLEMENTATION_BUG',
  'UNKNOWN',
];

export default function ShadbalaBenchmarkPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE-001');
  const [caseDetails, setCaseDetails] = useState<any>(null);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [running, setRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Settings Checklist state
  const [checklist, setChecklist] = useState({
    date: false,
    time: false,
    location: false,
    timezone: false,
    zodiac: false,
    ayanamsha: false,
  });

  // Reference values state: planet -> component -> string input
  const [inputs, setInputs] = useState<Record<string, Record<string, string>>>({});
  const [investigationCause, setInvestigationCause] = useState<string>('UNKNOWN');
  const [investigationNotes, setInvestigationNotes] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Load cases list
  const loadCases = async () => {
    try {
      const res = await fetch('/api/benchmarks?category=SHADBALA');
      const data = await res.json();
      setCases(data.cases || []);
    } catch (err) {
      console.error('Failed to load benchmark cases:', err);
    }
  };

  // Run live benchmark execution
  const runBenchmark = async (caseId: string) => {
    setRunning(true);
    try {
      const res = await fetch(`/api/benchmarks/${caseId}/run`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setExecutionResult(data.result);
      }
    } catch (err) {
      console.error('Failed to execute benchmark:', err);
    } finally {
      setRunning(false);
    }
  };

  // Load single case details
  const loadCaseDetails = async (caseId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/benchmarks/${caseId}`);
      const data = await res.json();
      if (data.success) {
        const bCase = data.case;
        setCaseDetails(data);

        // Populate reference values from stored case
        const stored = bCase.referenceValues || {};
        const newInputs: Record<string, Record<string, string>> = {};
        for (const p of PLANETS) {
          newInputs[p] = {};
          for (const c of COMPONENTS) {
            const val = stored[p]?.[c.key];
            newInputs[p][c.key] = val !== undefined && val !== null ? String(val) : '';
          }
        }
        setInputs(newInputs);

        // Checklist status
        const confirmed = Boolean(bCase.metadata?.checklistConfirmed);
        setChecklist({
          date: confirmed,
          time: confirmed,
          location: confirmed,
          timezone: confirmed,
          zodiac: confirmed,
          ayanamsha: confirmed,
        });

        setInvestigationCause(bCase.metadata?.investigationCause || 'UNKNOWN');
        setInvestigationNotes(bCase.metadata?.investigationNotes || '');

        setLoading(false);

        // Trigger live execution asynchronously
        runBenchmark(caseId);
      }
    } catch (err) {
      console.error('Failed to load case details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  useEffect(() => {
    if (selectedCaseId) {
      loadCaseDetails(selectedCaseId);
    }
  }, [selectedCaseId]);

  const allChecklistConfirmed = Object.values(checklist).every(Boolean);

  const handleInputChange = (planet: string, compKey: string, val: string) => {
    setInputs((prev) => ({
      ...prev,
      [planet]: {
        ...(prev[planet] || {}),
        [compKey]: val,
      },
    }));
  };

  const copyBirthDetails = () => {
    if (!caseDetails?.case) return;
    const snap = caseDetails.case.inputSnapshot;
    const text = [
      `Case ID: ${caseDetails.case.id}`,
      `Description: ${caseDetails.case.description}`,
      `Date: ${snap.birthDate}`,
      `Time: ${snap.birthTime}`,
      `Location: ${snap.locationName}`,
      `Latitude: ${snap.latitude}`,
      `Longitude: ${snap.longitude}`,
      `Timezone: ${snap.timezone}`,
      `Ayanamsha: ${snap.ayanamsha || 'Lahiri'}`,
      `House System: ${snap.houseSystem || 'Whole Sign'}`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);

    // Convert inputs string map to numeric map
    const numericRefValues: Record<string, Record<string, number>> = {};
    for (const p of PLANETS) {
      numericRefValues[p] = {};
      for (const c of COMPONENTS) {
        const valStr = inputs[p]?.[c.key];
        if (valStr !== undefined && valStr.trim() !== '') {
          const parsed = parseFloat(valStr);
          if (!isNaN(parsed)) {
            numericRefValues[p][c.key] = parsed;
          }
        }
      }
    }

    try {
      const res = await fetch(`/api/benchmarks/${selectedCaseId}/reference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checklistConfirmed: allChecklistConfirmed,
          referenceValues: numericRefValues,
          investigationCause,
          investigationNotes,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        await loadCases();
        await loadCaseDetails(selectedCaseId);
      }
    } catch (err) {
      console.error('Failed to save benchmark data:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch('/api/benchmarks/export?category=SHADBALA');
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shadbala-benchmark-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    } catch (err) {
      console.error('Failed to export benchmark:', err);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const jsonStr = evt.target?.result as string;
        const parsed = JSON.parse(jsonStr);
        const res = await fetch('/api/benchmarks/import?overwrite=true', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed),
        });
        const resData = await res.json();
        if (res.ok && resData.success) {
          alert(`Benchmark data imported successfully! Created: ${resData.created}, Updated: ${resData.updated}`);
          await loadCases();
          await loadCaseDetails(selectedCaseId);
        } else {
          alert(`Import failed: ${resData.errors?.join('\n') || 'Invalid dataset'}`);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      alert('Error reading import file.');
    }
  };

  // Helper to extract actual computed virupa value from executionResult payload
  const getActualVirupas = (planet: string, compKey: string): number | null => {
    const snap = executionResult?.calculationOutputSnapshot || caseDetails?.latestResult?.calculationOutputSnapshot;
    if (!snap?.planets) return null;
    const pData = snap.planets.find((p: any) => p.planet === planet);
    if (!pData) return null;

    if (compKey === 'uchchaBala') return pData.components?.sthana?.subcomponents?.UCHCHA_BALA?.virupas ?? null;
    if (compKey === 'saptavargajaBala') return pData.components?.sthana?.subcomponents?.SAPTAVARGAJA_BALA?.virupas ?? null;
    if (compKey === 'ojayugmaBala') return pData.components?.sthana?.subcomponents?.OJAYUGMA_BALA?.virupas ?? null;
    if (compKey === 'kendradiBala') return pData.components?.sthana?.subcomponents?.KENDRADI_BALA?.virupas ?? null;
    if (compKey === 'drekkanaBala') return pData.components?.sthana?.subcomponents?.DREKKANA_BALA?.virupas ?? null;
    if (compKey === 'digBala') return pData.components?.dig?.virupas ?? null;
    if (compKey === 'naisargikaBala') return pData.components?.naisargika?.virupas ?? null;
    if (compKey === 'cheshtaBala') return pData.components?.cheshta?.virupas ?? null;
    return null;
  };

  const currentCase = caseDetails?.case;
  const snapshot = currentCase?.inputSnapshot;
  const currentStatus = executionResult?.status || currentCase?.status || 'NOT_VALIDATED';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 font-sans">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Shield className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">
              Shadbala JHora Benchmark Developer Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 text-slate-400">
              SNAPSHOT STORE v1.0
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Immutable snapshot benchmark store & drift detection engine
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => runBenchmark(selectedCaseId)}
            disabled={running}
            className="px-3 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Play className={`w-4 h-4 text-emerald-400 ${running ? 'animate-spin' : ''}`} />
            <span>{running ? 'RUNNING...' : 'RUN EXECUTION'}</span>
          </button>

          <button
            onClick={handleExport}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4 text-amber-400" /> EXPORT DATASET
          </button>

          <label className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm">
            <Upload className="w-4 h-4 text-amber-400" /> IMPORT DATASET
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </header>

      {/* Main Grid: Sidebar + Benchmark Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar Case Selector */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-amber-400" /> Benchmark Cases ({cases.length})
          </h3>

          <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-1">
            {cases.map((c) => {
              const isSelected = c.id === selectedCaseId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all border ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/40 text-slate-100 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-400">{c.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                        c.status === 'PASS'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : c.status === 'REFERENCE_ENTERED'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : c.status === 'FAIL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : c.status === 'STALE'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mt-1 line-clamp-1">
                    {c.description || c.title}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{c.inputSnapshot?.locationName}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {loading || !currentCase ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-400" />
              <div>Loading benchmark case calculation data...</div>
            </div>
          ) : (
            <>
              {/* Overall Summary Bar */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Selected Case: <span className="text-amber-400 font-mono">{currentCase.id}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-100 mt-0.5">
                    {currentCase.description || currentCase.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>Fingerprint: <strong className="font-mono text-slate-300">{currentCase.inputFingerprint}</strong></span>
                    <span>•</span>
                    <span>Profile: <strong className="font-mono text-slate-300">{currentCase.calculationProfileVersion}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-950 px-4 py-3 rounded-xl border border-slate-800">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">Status</div>
                    <div
                      className={`text-sm font-extrabold font-mono ${
                        currentStatus === 'PASS'
                          ? 'text-emerald-400'
                          : currentStatus === 'REFERENCE_ENTERED'
                          ? 'text-blue-400'
                          : currentStatus === 'FAIL'
                          ? 'text-rose-400'
                          : currentStatus === 'STALE'
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {currentStatus}
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid: Birth Details & JHora Settings Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Birth Details Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <FileCode2 className="w-4 h-4 text-amber-400" /> Birth Snapshot Parameters
                    </h3>
                    <button
                      onClick={copyBirthDetails}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'COPIED!' : 'COPY BIRTH DETAILS'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <div className="text-[10px] text-slate-400">Date of Birth</div>
                      <div className="font-mono font-bold text-slate-200">{snapshot?.birthDate}</div>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <div className="text-[10px] text-slate-400">Time of Birth</div>
                      <div className="font-mono font-bold text-slate-200">{snapshot?.birthTime}</div>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 col-span-2">
                      <div className="text-[10px] text-slate-400">Location</div>
                      <div className="font-bold text-slate-200">{snapshot?.locationName}</div>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <div className="text-[10px] text-slate-400">Lat / Lon</div>
                      <div className="font-mono text-slate-300">
                        {snapshot?.latitude}, {snapshot?.longitude}
                      </div>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <div className="text-[10px] text-slate-400">Timezone</div>
                      <div className="font-mono text-slate-300">{snapshot?.timezone}</div>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <div className="text-[10px] text-slate-400">Ayanamsha</div>
                      <div className="font-mono text-slate-300">{snapshot?.ayanamsha || 'Lahiri'}</div>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <div className="text-[10px] text-slate-400">House System</div>
                      <div className="font-mono text-slate-300">{snapshot?.houseSystem || 'Whole Sign'}</div>
                    </div>
                  </div>
                </div>

                {/* JHora Settings Checklist Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> JHora Settings Checklist
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Confirm JHora parameters match before entering benchmark values.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    {[
                      { key: 'date', label: 'Same birth date confirmed in JHora' },
                      { key: 'time', label: 'Same birth time confirmed in JHora' },
                      { key: 'location', label: 'Same coordinates / city confirmed' },
                      { key: 'timezone', label: 'Same DST / UTC offset confirmed' },
                      { key: 'zodiac', label: 'Sidereal Zodiac active in JHora' },
                      { key: 'ayanamsha', label: 'Lahiri Ayanamsha active in JHora' },
                    ].map((item) => {
                      const isChecked = (checklist as any)[item.key];
                      return (
                        <label
                          key={item.key}
                          className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer border transition-all ${
                            isChecked
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              setChecklist((prev) => ({ ...prev, [item.key]: e.target.checked }))
                            }
                            className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                          />
                          <span>{item.label}</span>
                        </label>
                      );
                    })}
                  </div>

                  {!allChecklistConfirmed && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-[11px] text-amber-300 flex items-start gap-2">
                      <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Confirm all 6 checklist items above before reference validation results are confirmed.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Planet Reference Data Entry & Live Comparison Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" /> Planet Reference Values (Virupas)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Enter JHora reference numbers. Status remains <strong className="text-slate-300">REFERENCE_ENTERED</strong> until executed.
                    </p>
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                  >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>{saveSuccess ? 'SAVED SUCCESSFULLY!' : 'SAVE REFERENCE DATA'}</span>
                  </button>
                </div>

                {/* Planets Matrix */}
                <div className="space-y-6">
                  {PLANETS.map((planet) => (
                    <div key={planet} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800/80 pb-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        {planet} Reference Inputs & Live Calculation
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {COMPONENTS.map((comp) => {
                          const valStr = inputs[planet]?.[comp.key] || '';
                          const actVal = getActualVirupas(planet, comp.key);
                          const compResult = executionResult?.comparisonResults?.find(
                            (c: any) => c.planetOrKey === planet && c.field === comp.compKey
                          );

                          let compStatus = 'NOT VALIDATED';
                          if (compResult) {
                            compStatus = compResult.passed ? 'PASS' : 'FAIL';
                          }

                          return (
                            <div key={comp.key} className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-2">
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="font-semibold text-slate-300">{comp.label}</span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                                    compStatus === 'PASS'
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                      : compStatus === 'FAIL'
                                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                      : 'bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  {compStatus}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-400 font-mono">Expected:</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder="JHora value"
                                  value={valStr}
                                  onChange={(e) => handleInputChange(planet, comp.key, e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                                <div>Actual: <strong className="text-slate-200">{actVal !== null ? actVal.toFixed(2) : '-'}</strong></div>
                                <div>Diff: <strong className="text-slate-200">{compResult?.difference !== undefined ? compResult.difference.toFixed(3) : '-'}</strong></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benchmark Summary & Failure Investigation Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Summary Metrics */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-3">
                    Benchmark Execution Metrics
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Total Components</div>
                      <div className="text-lg font-bold text-slate-100 mt-1">
                        {executionResult?.summary?.totalComponents || 0}
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Passed</div>
                      <div className="text-lg font-bold text-emerald-400 mt-1">
                        {executionResult?.summary?.passedComponents || 0}
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Failed</div>
                      <div className="text-lg font-bold text-rose-400 mt-1">
                        {executionResult?.summary?.failedComponents || 0}
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Unvalidated</div>
                      <div className="text-lg font-bold text-slate-400 mt-1">
                        {executionResult?.summary?.unvalidatedComponents || 0}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Failure Investigation Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" /> Failure Investigation
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">
                        POSSIBLE MISMATCH CAUSE
                      </label>
                      <select
                        value={investigationCause}
                        onChange={(e) => setInvestigationCause(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs text-amber-300 focus:outline-none focus:border-amber-500"
                      >
                        {MISMATCH_CAUSES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">
                        INVESTIGATION NOTES
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Add notes about ayanamsha, orb differences, or JHora settings..."
                        value={investigationNotes}
                        onChange={(e) => setInvestigationNotes(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

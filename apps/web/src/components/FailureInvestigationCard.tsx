'use client';

import React, { useState } from 'react';
import { AlertTriangle, HelpCircle, CheckCircle2, Save } from 'lucide-react';

interface FailureInvestigationCardProps {
  detail: {
    engine: string;
    component: string;
    expected: any;
    actual: any;
    difference?: number;
    tolerance?: number;
    status: string;
    notes?: string;
  };
  caseId: string;
  initialRootCause?: string;
  initialStatus?: string;
  initialNotes?: string;
  onSaved?: () => void;
}

const ROOT_CAUSES = [
  { value: 'UNKNOWN', label: 'UNKNOWN (Uninvestigated)' },
  { value: 'INPUT_TIMEZONE', label: 'INPUT_TIMEZONE — Timezone / DST Offset Mismatch' },
  { value: 'DST_HANDLING', label: 'DST_HANDLING — Daylight Saving Time Transition Discrepancy' },
  { value: 'LOCATION_COORDINATES', label: 'LOCATION_COORDINATES — Latitude/Longitude Coordinate Delta' },
  { value: 'AYANAMSHA', label: 'AYANAMSHA — Ayanamsha Formula / Value Difference' },
  { value: 'EPHEMERIS', label: 'EPHEMERIS — Swiss Ephemeris vs JPL Ephemeris Delta' },
  { value: 'LONGITUDE_BOUNDARY', label: 'LONGITUDE_BOUNDARY — Sign/Nakshatra 00° Boundary Transition' },
  { value: 'DIVISIONAL_CHART_RULE', label: 'DIVISIONAL_CHART_RULE — Varga Calculation Rule Variant' },
  { value: 'DASHA_YEAR_BASIS', label: 'DASHA_YEAR_BASIS — 365.25d vs 360d Dasha Year Standard' },
  { value: 'HOUSE_SYSTEM', label: 'HOUSE_SYSTEM — Whole Sign vs Equal / Placidus House System' },
  { value: 'FORMULA_VARIANT', label: 'FORMULA_VARIANT — Classical Commentary Mathematical Variant' },
  { value: 'REFERENCE_DATA_ERROR', label: 'REFERENCE_DATA_ERROR — Manual JHora Reference Data Entry Error' },
  { value: 'IMPLEMENTATION_BUG', label: 'IMPLEMENTATION_BUG — Internal Engine Code Calculation Bug' },
];

const INVESTIGATION_STATUSES = [
  { value: 'UNINVESTIGATED', label: 'UNINVESTIGATED' },
  { value: 'INVESTIGATING', label: 'INVESTIGATING' },
  { value: 'EXPLAINED', label: 'EXPLAINED' },
  { value: 'FIXED', label: 'FIXED' },
  { value: 'REFERENCE_CORRECTED', label: 'REFERENCE_CORRECTED' },
];

export function FailureInvestigationCard({
  detail,
  caseId,
  initialRootCause = 'UNKNOWN',
  initialStatus = 'UNINVESTIGATED',
  initialNotes = '',
  onSaved,
}: FailureInvestigationCardProps) {
  const [rootCause, setRootCause] = useState(initialRootCause);
  const [invStatus, setInvStatus] = useState(initialStatus);
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg('');
    try {
      const res = await fetch(`/api/benchmarks/jhora/${caseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investigation: {
            status: invStatus,
            suspectedRootCause: rootCause,
            notes,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedMsg('Investigation updated successfully!');
        if (onSaved) onSaved();
      } else {
        alert('Failed to update investigation: ' + data.error);
      }
    } catch (e: any) {
      alert('Error updating investigation: ' + e?.message);
    } finally {
      setSaving(false);
    }
  };

  const isFail = detail.status === 'FAIL';
  const isNotValidated = detail.status === 'NOT_VALIDATED';

  return (
    <div
      id={`failure-card-${detail.component.replace(/\./g, '-')}`}
      className={`rounded-xl p-5 border shadow-sm transition-all ${
        isFail
          ? 'bg-red-950/20 border-red-800/60 text-red-200 dark:bg-red-950/30'
          : isNotValidated
          ? 'bg-slate-900/40 border-slate-800 text-slate-300'
          : 'bg-slate-900/60 border-slate-800 text-slate-200'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          {isFail ? (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          ) : (
            <HelpCircle className="w-5 h-5 text-slate-400 shrink-0" />
          )}
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400">[{detail.engine}]</span>
            <h4 className="font-bold text-slate-100 text-sm">{detail.component}</h4>
          </div>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isFail
              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
              : isNotValidated
              ? 'bg-slate-800 text-slate-400 border border-slate-700'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
          }`}
        >
          {detail.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 block mb-1">Expected (JHora)</span>
          <span className="font-mono font-bold text-amber-400 text-sm">
            {detail.expected !== null && detail.expected !== undefined ? String(detail.expected) : 'NOT_ENTERED'}
          </span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 block mb-1">Actual (Calculated)</span>
          <span className="font-mono font-bold text-slate-100 text-sm">
            {detail.actual !== null && detail.actual !== undefined ? String(detail.actual) : 'UNAVAILABLE'}
          </span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 block mb-1">Difference</span>
          <span className="font-mono font-bold text-red-400 text-sm">
            {detail.difference !== undefined ? `${detail.difference}` : 'N/A'}
          </span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 block mb-1">Tolerance Limit</span>
          <span className="font-mono font-bold text-slate-400 text-sm">
            {detail.tolerance !== undefined ? `±${detail.tolerance}` : 'Exact'}
          </span>
        </div>
      </div>

      {isFail && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
            <span>WHY DIFFERENT? Root Cause Analysis & Investigation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-semibold">Suspected Root Cause</label>
              <select
                id="root-cause-select"
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
              >
                {ROOT_CAUSES.map((rc) => (
                  <option key={rc.value} value={rc.value}>
                    {rc.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-semibold font-mono">Investigation Status</label>
              <select
                id="investigation-status-select"
                value={invStatus}
                onChange={(e) => setInvStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
              >
                {INVESTIGATION_STATUSES.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-semibold">Investigation Notes</label>
            <textarea
              id="investigation-notes-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record technical notes or JHora settings difference..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              id="save-investigation-btn"
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save Investigation Metadata'}
            </button>
            {savedMsg && <span className="text-xs text-emerald-400 font-semibold">{savedMsg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { X, Save, CheckCircle2 } from 'lucide-react';

interface JHoraDataEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  existingRef?: any;
  onSaved?: () => void;
}

export function JHoraDataEntryModal({
  isOpen,
  onClose,
  caseId,
  existingRef = {},
  onSaved,
}: JHoraDataEntryModalProps) {
  const [softwareVersion, setSoftwareVersion] = useState(existingRef.source?.version || '8.0');
  const [lagnaLong, setLagnaLong] = useState(existingRef.astrology?.lagnaLongitude ?? '');
  const [sunLong, setSunLong] = useState(existingRef.astrology?.planetaryLongitudes?.Sun ?? '');
  const [moonLong, setMoonLong] = useState(existingRef.astrology?.planetaryLongitudes?.Moon ?? '');
  const [marsLong, setMarsLong] = useState(existingRef.astrology?.planetaryLongitudes?.Mars ?? '');
  const [mercuryLong, setMercuryLong] = useState(existingRef.astrology?.planetaryLongitudes?.Mercury ?? '');
  const [jupiterLong, setJupiterLong] = useState(existingRef.astrology?.planetaryLongitudes?.Jupiter ?? '');
  const [venusLong, setVenusLong] = useState(existingRef.astrology?.planetaryLongitudes?.Venus ?? '');
  const [saturnLong, setSaturnLong] = useState(existingRef.astrology?.planetaryLongitudes?.Saturn ?? '');

  const [moonNakshatra, setMoonNakshatra] = useState(existingRef.nakshatra?.name || '');
  const [moonPada, setMoonPada] = useState(existingRef.nakshatra?.pada ?? '');

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const refOutputs: any = { ...existingRef };

    if (!refOutputs.astrology) refOutputs.astrology = {};
    if (!refOutputs.astrology.planetaryLongitudes) refOutputs.astrology.planetaryLongitudes = {};

    if (lagnaLong !== '') refOutputs.astrology.lagnaLongitude = parseFloat(lagnaLong);
    if (sunLong !== '') refOutputs.astrology.planetaryLongitudes.Sun = parseFloat(sunLong);
    if (moonLong !== '') refOutputs.astrology.planetaryLongitudes.Moon = parseFloat(moonLong);
    if (marsLong !== '') refOutputs.astrology.planetaryLongitudes.Mars = parseFloat(marsLong);
    if (mercuryLong !== '') refOutputs.astrology.planetaryLongitudes.Mercury = parseFloat(mercuryLong);
    if (jupiterLong !== '') refOutputs.astrology.planetaryLongitudes.Jupiter = parseFloat(jupiterLong);
    if (venusLong !== '') refOutputs.astrology.planetaryLongitudes.Venus = parseFloat(venusLong);
    if (saturnLong !== '') refOutputs.astrology.planetaryLongitudes.Saturn = parseFloat(saturnLong);

    if (!refOutputs.nakshatra) refOutputs.nakshatra = {};
    if (moonNakshatra !== '') refOutputs.nakshatra.name = moonNakshatra;
    if (moonPada !== '') refOutputs.nakshatra.pada = parseInt(moonPada, 10);

    try {
      const res = await fetch(`/api/benchmarks/jhora/${caseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: { software: 'Jagannatha Hora', version: softwareVersion, capturedAt: new Date().toISOString() },
          referenceOutputs: refOutputs,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (onSaved) onSaved();
        onClose();
      } else {
        alert('Error saving reference data: ' + data.error);
      }
    } catch (err: any) {
      alert('Error saving reference data: ' + err?.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs uppercase font-mono text-amber-400 font-bold tracking-wider">JHora Reference Entry</span>
            <h3 className="text-xl font-bold text-slate-100">Manual JHora Benchmark Entry ({caseId})</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          <div className="space-y-4">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-xs border-b border-slate-800 pb-1">1. Reference Metadata</h4>
            <div>
              <label className="block text-slate-400 mb-1">JHora Software Version</label>
              <input
                type="text"
                value={softwareVersion}
                onChange={(e) => setSoftwareVersion(e.target.value)}
                placeholder="e.g. 8.0"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>

            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-xs border-b border-slate-800 pb-1">2. Planetary Longitudes (Degrees 0 - 360)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Ascendant (Lagna) °</label>
                <input
                  id="entry-lagna"
                  type="number"
                  step="0.0001"
                  value={lagnaLong}
                  onChange={(e) => setLagnaLong(e.target.value)}
                  placeholder="e.g. 268.4521"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Sun °</label>
                <input
                  id="entry-sun"
                  type="number"
                  step="0.0001"
                  value={sunLong}
                  onChange={(e) => setSunLong(e.target.value)}
                  placeholder="e.g. 156.8912"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Moon °</label>
                <input
                  id="entry-moon"
                  type="number"
                  step="0.0001"
                  value={moonLong}
                  onChange={(e) => setMoonLong(e.target.value)}
                  placeholder="e.g. 294.1205"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Mars °</label>
                <input
                  type="number"
                  step="0.0001"
                  value={marsLong}
                  onChange={(e) => setMarsLong(e.target.value)}
                  placeholder="e.g. 112.4501"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Mercury °</label>
                <input
                  type="number"
                  step="0.0001"
                  value={mercuryLong}
                  onChange={(e) => setMercuryLong(e.target.value)}
                  placeholder="e.g. 175.2210"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Jupiter °</label>
                <input
                  type="number"
                  step="0.0001"
                  value={jupiterLong}
                  onChange={(e) => setJupiterLong(e.target.value)}
                  placeholder="e.g. 250.3140"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Venus °</label>
                <input
                  type="number"
                  step="0.0001"
                  value={venusLong}
                  onChange={(e) => setVenusLong(e.target.value)}
                  placeholder="e.g. 142.1050"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Saturn °</label>
                <input
                  type="number"
                  step="0.0001"
                  value={saturnLong}
                  onChange={(e) => setSaturnLong(e.target.value)}
                  placeholder="e.g. 355.8900"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-xs border-b border-slate-800 pb-1">3. Moon Nakshatra & Pada</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Nakshatra Name</label>
                <input
                  type="text"
                  value={moonNakshatra}
                  onChange={(e) => setMoonNakshatra(e.target.value)}
                  placeholder="e.g. Dhanishta"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Pada (1 - 4)</label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={moonPada}
                  onChange={(e) => setMoonPada(e.target.value)}
                  placeholder="e.g. 2"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition"
            >
              Cancel
            </button>
            <button
              id="save-jhora-ref-btn"
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save & Run Comparison'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

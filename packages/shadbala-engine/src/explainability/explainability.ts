import { PlanetName } from '@vedica/astrology-core';
import { PlanetShadbala } from '../types/shadbala-types.js';

export function formatPlanetShadbalaExplanation(ps: PlanetShadbala): string[] {
  const trace: string[] = [
    `=== Classical Shadbala Trace for ${ps.planet} ===`,
    `Total Virupas: ${ps.totalVirupas.toFixed(2)} Virupas (${ps.totalRupas.toFixed(2)} Rupas)`,
    `Shadbala Ratio: ${ps.shadbalaRatio !== undefined ? (ps.shadbalaRatio * 100).toFixed(1) + '%' : 'N/A'} (Status: ${ps.isStrong ? 'STRONG / BALI' : 'DEFICIENT / NIRBALA'})`,
    ``,
  ];

  if (ps.components.sthana) {
    trace.push(...ps.components.sthana.evidence);
    trace.push('');
  }

  if (ps.components.dig) {
    trace.push(...ps.components.dig.evidence);
    trace.push('');
  }

  if (ps.components.naisargika) {
    trace.push(...ps.components.naisargika.evidence);
    trace.push('');
  }

  if (ps.components.cheshta) {
    trace.push(...ps.components.cheshta.evidence);
    trace.push('');
  }

  if (ps.components.kaala) {
    trace.push(...ps.components.kaala.evidence);
    trace.push('');
  }

  if (ps.components.drik) {
    trace.push(...ps.components.drik.evidence);
    trace.push('');
  }

  return trace;
}

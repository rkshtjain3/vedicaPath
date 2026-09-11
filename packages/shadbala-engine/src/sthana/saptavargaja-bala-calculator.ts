import { PlanetName, RashiDetails } from '@vedica/astrology-core';
import { ChartAnalysisResult, getPanchadhaMaitri, calculatePlanetDignity, PlanetFact } from '@vedica/analysis-engine';
import { DivisionalChart } from '@vedica/divisional-chart-engine';
import { SthanaBalaSubcomponent } from '../types/shadbala-types.js';
import { virupasToRupas } from '../units/shadbala-units.js';

export interface SaptavargaContext {
  planet: PlanetName;
  d1Fact: PlanetFact;
  analysis: ChartAnalysisResult;
  d1Chart: any; // BirthChart
  d2Chart?: DivisionalChart;
  d3Chart?: DivisionalChart;
  d7Chart?: DivisionalChart;
  d9Chart?: DivisionalChart;
  d12Chart?: DivisionalChart;
  d30Chart?: DivisionalChart;
}

/**
 * Calculates Saptavargaja Bala using the 7 Vargas: D1, D2, D3, D7, D9, D12, D30.
 * Follows BPHS Panchadha Maitri (5-fold relationship) dignity points:
 * - Moolatrikona: 45 Virupas
 * - Swakshetra (Own House): 30 Virupas
 * - Adhi Mitra (Great Friend): 22.5 Virupas
 * - Mitra (Friend): 15 Virupas
 * - Sama (Neutral): 7.5 Virupas
 * - Shatru (Enemy): 3.75 Virupas
 * - Adhi Shatru (Great Enemy): 1.875 Virupas
 */
export function calculateSaptavargajaBala(context: SaptavargaContext): SthanaBalaSubcomponent {
  let totalVirupas = 0;
  const evidence: string[] = [];
  const vargas = ['D1', 'D2', 'D3', 'D7', 'D9', 'D12', 'D30'];
  const missingVargas: string[] = [];

  const getPoints = (vargaName: string, sign: RashiDetails, degreeInSign: number) => {
    // Determine Lord
    const lord = sign.ruler;
    let points = 0;
    let relStr = '';

    // Create a dummy fact to evaluate dignity
    const dummyFact: PlanetFact = {
      ...context.d1Fact,
      sign: sign.name,
      degreeInSign: degreeInSign,
      house: 1, // House doesn't matter for Moolatrikona check except in D1, but D1 has its own fact
    };

    const dignity = calculatePlanetDignity(dummyFact);

    if (dignity.primaryDignity === 'MOOLATRIKONA') {
      points = 45;
      relStr = 'Moolatrikona';
    } else if (dignity.primaryDignity === 'OWN_SIGN') {
      points = 30;
      relStr = 'Own Sign';
    } else {
      // Use Panchadha Maitri
      const targetFact = context.analysis.planetFacts.find((p) => p.planet === lord);
      if (!targetFact) {
        // Fallback to Natural Friendship if target fact is missing (e.g. Nodes sometimes)
        if (dignity.relationshipToSignLord === 'FRIENDLY') {
          points = 15; relStr = 'Mitra (Natural fallback)';
        } else if (dignity.relationshipToSignLord === 'ENEMY') {
          points = 3.75; relStr = 'Shatru (Natural fallback)';
        } else {
          points = 7.5; relStr = 'Sama (Natural fallback)';
        }
      } else {
        const panchadha = getPanchadhaMaitri(context.d1Fact, targetFact);
        switch (panchadha) {
          case 'ADHI_MITRA': points = 22.5; relStr = 'Adhi Mitra (Great Friend)'; break;
          case 'MITRA': points = 15; relStr = 'Mitra (Friend)'; break;
          case 'SAMA': points = 7.5; relStr = 'Sama (Neutral)'; break;
          case 'SHATRU': points = 3.75; relStr = 'Shatru (Enemy)'; break;
          case 'ADHI_SHATRU': points = 1.875; relStr = 'Adhi Shatru (Great Enemy)'; break;
        }
      }
    }

    totalVirupas += points;
    evidence.push(`${vargaName} Sign: ${sign.name} (Lord: ${lord}) -> ${relStr} -> ${points} Virupas`);
  };

  // Evaluate D1
  getPoints('D1', context.d1Chart.planets.find((p: any) => p.planet === context.planet)!.sign, context.d1Fact.degreeInSign);

  // Evaluate other vargas
  const evaluateVarga = (name: string, chart?: DivisionalChart) => {
    if (chart) {
      const pos = chart.planets[context.planet];
      if (pos) {
        getPoints(name, pos.sign, pos.longitudeInSign);
      } else {
        missingVargas.push(name);
      }
    } else {
      missingVargas.push(name);
    }
  };

  evaluateVarga('D2', context.d2Chart);
  evaluateVarga('D3', context.d3Chart);
  evaluateVarga('D7', context.d7Chart);
  evaluateVarga('D9', context.d9Chart);
  evaluateVarga('D12', context.d12Chart);
  evaluateVarga('D30', context.d30Chart);

  const status = missingVargas.length > 0 ? 'PARTIAL' : 'IMPLEMENTED_UNBENCHMARKED';
  const rupas = virupasToRupas(totalVirupas);

  if (missingVargas.length > 0) {
    evidence.push(`Missing Vargas: ${missingVargas.join(', ')}`);
  }
  evidence.push(`Total Saptavargaja Bala: ${totalVirupas.toFixed(3)} Virupas (${rupas.toFixed(3)} Rupas)`);

  return {
    name: 'Saptavargaja Bala',
    subcomponentName: 'SAPTAVARGAJA_BALA',
    virupas: totalVirupas,
    rupas,
    formulaVersion: 'bphs-saptavarga-v1',
    status,
    inputs: {
      planet: context.planet,
      missingVargas
    },
    evidence,
  };
}

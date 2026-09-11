import { PersonalAstrologyReport } from '../types/report-types.js';

export function renderReportSummaryMarkdown(report: PersonalAstrologyReport): string {
  return `
# UNIFIED PERSONAL ASTROLOGY REPORT
**Profile Version**: ${report.profileVersion} | **Generated At**: ${report.generatedAt}

---

## 1. NATAL OVERVIEW
${report.natalOverview.summary}

## 2. PLANETARY STRENGTH & SHADBALA
${report.planetaryStrength.summary}

## 3. CLASSICAL YOGAS
${report.yogas.summary}

## 4. LIFE DOMAIN ANALYSIS

### CAREER
* **Convergence**: ${report.career.convergence.level}
* **Mixed Signals**: ${report.career.mixedSignals ? 'YES' : 'NO'}
* **Framework Confidence**: ${report.career.confidence}
${report.career.summary}

### WEALTH
* **Convergence**: ${report.wealth.convergence.level}
* **Mixed Signals**: ${report.wealth.mixedSignals ? 'YES' : 'NO'}
* **Framework Confidence**: ${report.wealth.confidence}
${report.wealth.summary}

### RELATIONSHIPS
* **Convergence**: ${report.relationships.convergence.level}
* **Mixed Signals**: ${report.relationships.mixedSignals ? 'YES' : 'NO'}
* **Framework Confidence**: ${report.relationships.confidence}
${report.relationships.summary}

### PROPERTY
* **Convergence**: ${report.property.convergence.level}
* **Mixed Signals**: ${report.property.mixedSignals ? 'YES' : 'NO'}
* **Framework Confidence**: ${report.property.confidence}
${report.property.summary}

## 5. CURRENT TIMING
${report.timing.summary}

${report.numerology ? `## 6. NUMEROLOGY\n${report.numerology.summary}\n` : ''}
## 7. CROSS-ENGINE SYNTHESIS
${report.crossEngineSynthesis.overallSummary}

---
*Disclaimer: This report represents evidence synthesis within configured astrological frameworks. It is strictly non-predictive and does not guarantee real-world outcomes.*
  `.trim();
}

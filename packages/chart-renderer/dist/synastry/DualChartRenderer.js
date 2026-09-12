import { buildChartViewModelFromD1 } from '../view-model/chart-view-model-builder.js';
export function renderDualChartSVG(options) {
    const { chartA, nameA, chartB, nameB, style = 'NORTH_INDIAN' } = options;
    const vmA = buildChartViewModelFromD1(chartA, style);
    const vmB = buildChartViewModelFromD1(chartB, style);
    const renderPlanets = (vm) => vm.planets
        .map((p) => `${p.abbreviation} (${p.sign.substring(0, 3)} ${p.formattedDegree})`)
        .join(', ');
    return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 400" width="100%" height="100%">
      <style>
        .title { font-family: system-ui, sans-serif; font-size: 16px; font-weight: bold; fill: #1e293b; text-anchor: middle; }
        .sub { font-family: system-ui, sans-serif; font-size: 12px; fill: #64748b; text-anchor: middle; }
        .box { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; rx: 8; }
        .label { font-family: system-ui, sans-serif; font-size: 11px; fill: #334155; }
      </style>
      
      <!-- Person A Chart Summary -->
      <rect x="20" y="20" width="450" height="360" class="box" />
      <text x="245" y="50" class="title">${nameA}</text>
      <text x="245" y="70" class="sub">Lagna: ${vmA.ascendantSign} (${vmA.formattedAscendantDegree})</text>
      <foreignObject x="35" y="90" width="420" height="270">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: system-ui; font-size: 12px; color: #334155; line-height: 1.6;">
          <strong>Planetary Positions (${style}):</strong><br/>
          ${renderPlanets(vmA)}
        </div>
      </foreignObject>

      <!-- Person B Chart Summary -->
      <rect x="530" y="20" width="450" height="360" class="box" />
      <text x="755" y="50" class="title">${nameB}</text>
      <text x="755" y="70" class="sub">Lagna: ${vmB.ascendantSign} (${vmB.formattedAscendantDegree})</text>
      <foreignObject x="545" y="90" width="420" height="270">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: system-ui; font-size: 12px; color: #334155; line-height: 1.6;">
          <strong>Planetary Positions (${style}):</strong><br/>
          ${renderPlanets(vmB)}
        </div>
      </foreignObject>
    </svg>
  `;
}

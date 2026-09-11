import React from 'react';
import { ChartViewModel, ChartPlanet, ChartHouse } from '../types/chart-renderer-types.js';
import { getPlanetaryAspects, GrahaAspect } from '../aspects/aspect-calculator.js';

export interface NorthIndianChartProps {
  viewModel: ChartViewModel;
  selectedPlanet?: string | null;
  selectedHouse?: number | null;
  showAspectRays?: boolean;
  onSelectPlanet?: (planet: ChartPlanet) => void;
  onSelectHouse?: (house: ChartHouse) => void;
  className?: string;
}

interface HouseGeometry {
  points: string;
  signPos: { x: number; y: number };
  centerPos: { x: number; y: number };
}

const HOUSE_GEOMETRIES: Record<number, HouseGeometry> = {
  1: {
    points: '200,0 300,100 200,200 100,100',
    signPos: { x: 200, y: 35 },
    centerPos: { x: 200, y: 110 },
  },
  2: {
    points: '0,0 200,0 100,100',
    signPos: { x: 160, y: 30 },
    centerPos: { x: 90, y: 45 },
  },
  3: {
    points: '0,0 100,100 0,200',
    signPos: { x: 30, y: 160 },
    centerPos: { x: 45, y: 90 },
  },
  4: {
    points: '0,200 100,100 200,200 100,300',
    signPos: { x: 35, y: 200 },
    centerPos: { x: 100, y: 200 },
  },
  5: {
    points: '0,200 100,300 0,400',
    signPos: { x: 30, y: 240 },
    centerPos: { x: 45, y: 310 },
  },
  6: {
    points: '0,400 100,300 200,400',
    signPos: { x: 160, y: 370 },
    centerPos: { x: 90, y: 355 },
  },
  7: {
    points: '200,400 100,300 200,200 300,300',
    signPos: { x: 200, y: 365 },
    centerPos: { x: 200, y: 290 },
  },
  8: {
    points: '200,400 300,300 400,400',
    signPos: { x: 240, y: 370 },
    centerPos: { x: 310, y: 355 },
  },
  9: {
    points: '400,400 300,300 400,200',
    signPos: { x: 370, y: 240 },
    centerPos: { x: 355, y: 310 },
  },
  10: {
    points: '400,200 300,300 200,200 300,100',
    signPos: { x: 365, y: 200 },
    centerPos: { x: 300, y: 200 },
  },
  11: {
    points: '400,200 300,100 400,0',
    signPos: { x: 370, y: 160 },
    centerPos: { x: 355, y: 90 },
  },
  12: {
    points: '400,0 300,100 200,0',
    signPos: { x: 240, y: 30 },
    centerPos: { x: 310, y: 45 },
  },
};

export const NorthIndianChart: React.FC<NorthIndianChartProps> = ({
  viewModel,
  selectedPlanet,
  selectedHouse,
  showAspectRays = true,
  onSelectPlanet,
  onSelectHouse,
  className = '',
}) => {
  // Compute aspect rays if a planet is selected and rays are enabled
  let activeAspects: GrahaAspect[] = [];
  let sourceHouseNum: number | null = null;

  if (showAspectRays && selectedPlanet) {
    const rawPlanetName = selectedPlanet.replace(/^T-/, '');
    const foundPlanet = viewModel.planets.find(
      (p) =>
        p.planet.toLowerCase() === selectedPlanet.toLowerCase() ||
        p.planet.toLowerCase() === rawPlanetName.toLowerCase() ||
        p.abbreviation.toLowerCase() === selectedPlanet.toLowerCase()
    );

    if (foundPlanet) {
      sourceHouseNum = foundPlanet.house;
      activeAspects = getPlanetaryAspects(rawPlanetName, foundPlanet.house);
    }
  }

  const aspectedHouseNumbers = new Set(activeAspects.map((a) => a.targetHouse));

  return (
    <div className={`relative w-full max-w-[480px] aspect-square mx-auto ${className}`}>
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full select-none"
        role="img"
        aria-label={`${viewModel.title} (${viewModel.ascendantSign} Lagna)`}
      >
        <defs>
          <linearGradient id="northBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="rayGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Aspect Ray Arrow Markers */}
          <marker
            id="aspectArrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#38bdf8" />
          </marker>
          <marker
            id="aspectSpecialArrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#fbbf24" />
          </marker>
        </defs>

        {/* Chart Background */}
        <rect width="400" height="400" fill="url(#northBg)" rx="16" stroke="#334155" strokeWidth="2" />

        {/* Render 12 House Polygons */}
        {viewModel.houses.map((house) => {
          const geom = HOUSE_GEOMETRIES[house.house];
          const isHouseSelected = selectedHouse === house.house;
          const isSourceHouse = sourceHouseNum === house.house;
          const isAspectedHouse = aspectedHouseNumbers.has(house.house);

          const fillColor = isHouseSelected
            ? 'rgba(49, 46, 129, 0.8)'
            : isSourceHouse
            ? 'rgba(69, 26, 3, 0.5)'
            : isAspectedHouse
            ? 'rgba(8, 47, 73, 0.4)'
            : 'rgba(15, 23, 42, 0.4)';

          const strokeColor = isHouseSelected
            ? '#818cf8'
            : isSourceHouse
            ? '#fbbf24'
            : isAspectedHouse
            ? '#38bdf8'
            : 'rgba(99, 102, 241, 0.35)';

          const strokeWidth = isHouseSelected || isSourceHouse || isAspectedHouse ? '2' : '1.5';

          return (
            <polygon
              key={`house-${house.house}`}
              points={geom.points}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              className="cursor-pointer transition-colors hover:opacity-90"
              onClick={() => onSelectHouse?.(house)}
              role="button"
              tabIndex={0}
              aria-label={`House ${house.house}, Sign ${house.sign}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectHouse?.(house);
                }
              }}
            />
          );
        })}

        {/* Fixed Outer & Inner Framework Lines */}
        <rect x="0" y="0" width="400" height="400" fill="none" stroke="#475569" strokeWidth="2" />
        <line x1="0" y1="0" x2="400" y2="400" stroke="#334155" strokeWidth="1.5" />
        <line x1="400" y1="0" x2="0" y2="400" stroke="#334155" strokeWidth="1.5" />
        <polygon points="200,0 400,200 200,400 0,200" fill="none" stroke="#475569" strokeWidth="1.5" />

        {/* Dynamic Aspect Drishti Visual Rays */}
        {sourceHouseNum &&
          activeAspects.map((aspect) => {
            const sourceGeom = HOUSE_GEOMETRIES[sourceHouseNum!];
            const targetGeom = HOUSE_GEOMETRIES[aspect.targetHouse];
            if (!sourceGeom || !targetGeom) return null;

            const isSpecial = !!aspect.specialAspect;
            const strokeColor = isSpecial ? '#fbbf24' : '#38bdf8';
            const marker = isSpecial ? 'url(#aspectSpecialArrow)' : 'url(#aspectArrow)';

            return (
              <g key={`aspect-ray-${aspect.targetHouse}`}>
                <line
                  x1={sourceGeom.centerPos.x}
                  y1={sourceGeom.centerPos.y}
                  x2={targetGeom.centerPos.x}
                  y2={targetGeom.centerPos.y}
                  stroke={strokeColor}
                  strokeWidth="2.2"
                  strokeDasharray="6 3"
                  strokeLinecap="round"
                  filter="url(#rayGlow)"
                  markerEnd={marker}
                  opacity="0.9"
                />
              </g>
            );
          })}

        {/* Render Rashi Sign Numbers and Occupant Planets */}
        {viewModel.houses.map((house) => {
          const geom = HOUSE_GEOMETRIES[house.house];
          const isLagna = house.house === 1;

          return (
            <g key={`house-content-${house.house}`}>
              {/* Rashi Sign Number (Corner) */}
              <text
                x={geom.signPos.x}
                y={geom.signPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#818cf8"
                fontFamily="monospace"
                fontSize="13px"
                fontWeight="bold"
                className="pointer-events-none"
              >
                {house.signId}
              </text>

              {/* Lagna Badge for House 1 */}
              {isLagna && (
                <g transform={`translate(${geom.centerPos.x - 22}, ${geom.centerPos.y - 28})`}>
                  <rect
                    width="44"
                    height="16"
                    rx="8"
                    fill="rgba(245, 158, 11, 0.2)"
                    stroke="rgba(245, 158, 11, 0.8)"
                    strokeWidth="1"
                  />
                  <text
                    x="22"
                    y="9"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fcd34d"
                    fontFamily="monospace"
                    fontSize="10px"
                    fontWeight="bold"
                    letterSpacing="0.05em"
                  >
                    LAGNA
                  </text>
                </g>
              )}

              {/* Occupant Planets Inside House */}
              <g transform={`translate(${geom.centerPos.x}, ${geom.centerPos.y + (isLagna ? 8 : 0)})`}>
                {renderPlanetGroup(
                  house.planets,
                  selectedPlanet,
                  onSelectPlanet,
                  house.house
                )}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

function renderPlanetGroup(
  planets: ChartPlanet[],
  selectedPlanet?: string | null,
  onSelectPlanet?: (planet: ChartPlanet) => void,
  houseNum?: number
) {
  if (!planets || planets.length === 0) return null;

  const count = planets.length;
  const maxPerRow = count > 4 ? 3 : 2;

  return (
    <g>
      {planets.map((p, idx) => {
        const isSelected =
          selectedPlanet?.toLowerCase() === p.planet.toLowerCase() ||
          selectedPlanet?.toLowerCase() === p.abbreviation.toLowerCase();
        const row = Math.floor(idx / maxPerRow);
        const col = idx % maxPerRow;
        const totalInRow = Math.min(maxPerRow, count - row * maxPerRow);

        const xOffset = (col - (totalInRow - 1) / 2) * 28;
        const yOffset = (row - (Math.ceil(count / maxPerRow) - 1) / 2) * 19;

        const isRetro = p.retrograde;
        const isTransit = p.isTransit;

        const badgeFill = isSelected
          ? '#4f46e5'
          : isTransit
          ? 'rgba(6, 78, 59, 0.9)'
          : 'rgba(30, 41, 59, 0.95)';

        const badgeStroke = isSelected
          ? '#a5b4fc'
          : isTransit
          ? '#34d399'
          : '#475569';

        const textFill = isSelected
          ? '#ffffff'
          : isTransit
          ? '#6ee7b7'
          : p.planet === 'Rahu' || p.planet === 'Ketu'
          ? '#fcd34d'
          : '#f1f5f9';

        return (
          <g
            key={`${p.planet}-${p.isTransit ? 'transit' : 'natal'}`}
            transform={`translate(${xOffset}, ${yOffset})`}
            className="cursor-pointer group"
            onClick={(e) => {
              e.stopPropagation();
              onSelectPlanet?.(p);
            }}
            role="button"
            tabIndex={0}
            aria-label={`${p.planet} in House ${houseNum}, ${p.sign}`}
          >
            {/* Planet Badge */}
            <rect
              x={isTransit ? '-14' : '-11'}
              y="-8"
              width={isTransit ? '28' : '22'}
              height="16"
              rx="4"
              fill={badgeFill}
              stroke={badgeStroke}
              strokeWidth={isSelected ? '2' : '1'}
            />
            {/* Planet Abbreviation */}
            <text
              x="0"
              y="1"
              textAnchor="middle"
              dominantBaseline="central"
              fill={textFill}
              fontFamily="monospace"
              fontSize="10px"
              fontWeight="bold"
            >
              {p.abbreviation}
            </text>
            {/* Retrograde Symbol */}
            {isRetro && (
              <text
                x={isTransit ? '11' : '8'}
                y="-4"
                fill="#fb7185"
                fontSize="8px"
                fontWeight="bold"
              >
                R
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

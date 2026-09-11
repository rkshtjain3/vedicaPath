import React from 'react';
import { ChartViewModel, ChartPlanet, ChartHouse } from '../types/chart-renderer-types.js';
import { getPlanetaryAspects, GrahaAspect } from '../aspects/aspect-calculator.js';

export interface SouthIndianChartProps {
  viewModel: ChartViewModel;
  selectedPlanet?: string | null;
  selectedHouse?: number | null;
  showAspectRays?: boolean;
  onSelectPlanet?: (planet: ChartPlanet) => void;
  onSelectHouse?: (house: ChartHouse) => void;
  className?: string;
}

interface SignBoxGeometry {
  signId: number; // 1 to 12
  x: number;
  y: number;
}

// 4x4 Grid Sign Boxes
const SOUTH_SIGN_BOXES: SignBoxGeometry[] = [
  { signId: 12, x: 0, y: 0 }, // Pisces (Top-Left)
  { signId: 1, x: 100, y: 0 }, // Aries
  { signId: 2, x: 200, y: 0 }, // Taurus
  { signId: 3, x: 300, y: 0 }, // Gemini (Top-Right)
  { signId: 4, x: 300, y: 100 }, // Cancer
  { signId: 5, x: 300, y: 200 }, // Leo
  { signId: 6, x: 300, y: 300 }, // Virgo (Bottom-Right)
  { signId: 7, x: 200, y: 300 }, // Libra
  { signId: 8, x: 100, y: 300 }, // Scorpio
  { signId: 9, x: 0, y: 300 }, // Sagittarius (Bottom-Left)
  { signId: 10, x: 0, y: 200 }, // Capricorn
  { signId: 11, x: 0, y: 100 }, // Aquarius
];

export const SouthIndianChart: React.FC<SouthIndianChartProps> = ({
  viewModel,
  selectedPlanet,
  selectedHouse,
  showAspectRays = true,
  onSelectPlanet,
  onSelectHouse,
  className = '',
}) => {
  const ascSignId = viewModel.ascendantSignId;

  // Compute aspect rays if planet selected
  let activeAspects: GrahaAspect[] = [];
  let sourceHouseNum: number | null = null;
  let sourceSignId: number | null = null;

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
      sourceSignId = foundPlanet.signId;
      activeAspects = getPlanetaryAspects(rawPlanetName, foundPlanet.house);
    }
  }

  // Map house numbers to sign IDs for South Indian box highlighting
  const aspectedSignIds = new Set<number>();
  activeAspects.forEach((a) => {
    const targetHouseObj = viewModel.houses.find((h) => h.house === a.targetHouse);
    if (targetHouseObj) {
      aspectedSignIds.add(targetHouseObj.signId);
    }
  });

  return (
    <div className={`relative w-full max-w-[480px] aspect-square mx-auto ${className}`}>
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full select-none"
        role="img"
        aria-label={`${viewModel.title} (South Indian Style)`}
      >
        <defs>
          <linearGradient id="southBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <filter id="rayGlowSouth">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Aspect Ray Arrow Markers */}
          <marker
            id="aspectArrowSouth"
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
            id="aspectSpecialArrowSouth"
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

        {/* Outer Rect */}
        <rect width="400" height="400" fill="url(#southBg)" rx="16" stroke="#334155" strokeWidth="2" />

        {/* Center 2x2 Info Area */}
        <rect x="100" y="100" width="200" height="200" fill="#020617" stroke="#334155" strokeWidth="2" />
        <g transform="translate(200, 200)">
          <text
            y="-15"
            textAnchor="middle"
            fill="#a5b4fc"
            fontFamily="monospace"
            fontSize="13px"
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            {viewModel.title}
          </text>
          <text y="5" textAnchor="middle" fill="#94a3b8" fontFamily="monospace" fontSize="11px">
            Lagna: <tspan fill="#fcd34d" fontWeight="bold">{viewModel.ascendantSign}</tspan>
          </text>
          <text y="24" textAnchor="middle" fill="#64748b" fontFamily="monospace" fontSize="10px">
            South Indian Format
          </text>
        </g>

        {/* 12 Fixed Sign Boxes */}
        {SOUTH_SIGN_BOXES.map((box) => {
          // Find matching house in viewModel
          const house = viewModel.houses.find((h) => h.signId === box.signId);
          const isLagna = box.signId === ascSignId;
          const houseNum = house?.house || 1;
          const isHouseSelected = selectedHouse === houseNum;
          const isSourceBox = sourceSignId === box.signId;
          const isAspectedBox = aspectedSignIds.has(box.signId);

          const fillColor = isHouseSelected
            ? 'rgba(49, 46, 129, 0.8)'
            : isSourceBox
            ? 'rgba(69, 26, 3, 0.5)'
            : isAspectedBox
            ? 'rgba(8, 47, 73, 0.4)'
            : isLagna
            ? 'rgba(69, 26, 3, 0.25)'
            : 'rgba(15, 23, 42, 0.4)';

          const strokeColor = isHouseSelected
            ? '#818cf8'
            : isSourceBox
            ? '#fbbf24'
            : isAspectedBox
            ? '#38bdf8'
            : isLagna
            ? 'rgba(245, 158, 11, 0.6)'
            : 'rgba(99, 102, 241, 0.35)';

          const strokeWidth = isHouseSelected || isSourceBox || isAspectedBox ? '2' : '1.5';

          return (
            <g key={`sign-box-${box.signId}`}>
              {/* Box Rect */}
              <rect
                x={box.x}
                y={box.y}
                width="100"
                height="100"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                className="cursor-pointer transition-colors hover:opacity-90"
                onClick={() => house && onSelectHouse?.(house)}
                role="button"
                tabIndex={0}
                aria-label={`Sign ${house?.sign}, House ${houseNum}`}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && house) {
                    onSelectHouse?.(house);
                  }
                }}
              />

              {/* Diagonal Slash for Lagna Box in South Indian style */}
              {isLagna && (
                <line
                  x1={box.x}
                  y1={box.y}
                  x2={box.x + 30}
                  y2={box.y + 30}
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />
              )}

              {/* Sign Name / House Number (Top Left Corner) */}
              <text
                x={box.x + 8}
                y={box.y + 14}
                fill="#94a3b8"
                fontFamily="monospace"
                fontSize="10px"
                fontWeight="bold"
              >
                H{houseNum} <tspan fill="#818cf8">({box.signId})</tspan>
              </text>

              {/* ASC Badge if Lagna */}
              {isLagna && (
                <text
                  x={box.x + 92}
                  y={box.y + 14}
                  textAnchor="end"
                  fill="#fbbf24"
                  fontFamily="monospace"
                  fontSize="10px"
                  fontWeight="bold"
                >
                  ASC
                </text>
              )}

              {/* Occupant Planets Inside Sign Box */}
              {house && (
                <g transform={`translate(${box.x + 50}, ${box.y + 55})`}>
                  {renderSouthPlanetGroup(
                    house.planets,
                    selectedPlanet,
                    onSelectPlanet,
                    houseNum
                  )}
                </g>
              )}
            </g>
          );
        })}

        {/* Dynamic Aspect Drishti Visual Rays in South Indian Chart */}
        {sourceSignId &&
          activeAspects.map((aspect) => {
            const sourceBox = SOUTH_SIGN_BOXES.find((b) => b.signId === sourceSignId);
            const targetHouseObj = viewModel.houses.find((h) => h.house === aspect.targetHouse);
            if (!targetHouseObj || !sourceBox) return null;

            const targetBox = SOUTH_SIGN_BOXES.find((b) => b.signId === targetHouseObj.signId);
            if (!targetBox) return null;

            const isSpecial = !!aspect.specialAspect;
            const strokeColor = isSpecial ? '#fbbf24' : '#38bdf8';
            const marker = isSpecial ? 'url(#aspectSpecialArrowSouth)' : 'url(#aspectArrowSouth)';

            return (
              <g key={`south-aspect-ray-${aspect.targetHouse}`}>
                <line
                  x1={sourceBox.x + 50}
                  y1={sourceBox.y + 50}
                  x2={targetBox.x + 50}
                  y2={targetBox.y + 50}
                  stroke={strokeColor}
                  strokeWidth="2.2"
                  strokeDasharray="6 3"
                  strokeLinecap="round"
                  filter="url(#rayGlowSouth)"
                  markerEnd={marker}
                  opacity="0.9"
                />
              </g>
            );
          })}
      </svg>
    </div>
  );
};

function renderSouthPlanetGroup(
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

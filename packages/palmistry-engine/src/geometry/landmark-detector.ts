import { DigitalRatios, PalmarLandmarks, PalmistryInputPayload, Point2D } from '../types/palmistry-types.js';

export function calculateDistance(p1: Point2D, p2: Point2D): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function extractPalmarLandmarks(payload: PalmistryInputPayload): PalmarLandmarks {
  const custom = payload.customLandmarks || {};

  // Standard normalized 0 to 1 landmark coordinates for a standard palm photo
  const defaultLandmarks: PalmarLandmarks = {
    wristCenter: { x: 0.50, y: 0.90 },
    thumbBase: { x: 0.25, y: 0.65 },
    thumbTip: { x: 0.12, y: 0.45 },
    indexBase: { x: 0.35, y: 0.30 },
    indexTip: { x: 0.28, y: 0.08 },
    middleBase: { x: 0.48, y: 0.26 },
    middleTip: { x: 0.46, y: 0.04 },
    ringBase: { x: 0.62, y: 0.28 },
    ringTip: { x: 0.63, y: 0.07 },
    pinkyBase: { x: 0.75, y: 0.34 },
    pinkyTip: { x: 0.79, y: 0.18 },
    radialEdge: { x: 0.20, y: 0.50 },
    ulnarEdge: { x: 0.80, y: 0.60 },
  };

  return {
    wristCenter: custom.wristCenter || defaultLandmarks.wristCenter,
    thumbBase: custom.thumbBase || defaultLandmarks.thumbBase,
    thumbTip: custom.thumbTip || defaultLandmarks.thumbTip,
    indexBase: custom.indexBase || defaultLandmarks.indexBase,
    indexTip: custom.indexTip || defaultLandmarks.indexTip,
    middleBase: custom.middleBase || defaultLandmarks.middleBase,
    middleTip: custom.middleTip || defaultLandmarks.middleTip,
    ringBase: custom.ringBase || defaultLandmarks.ringBase,
    ringTip: custom.ringTip || defaultLandmarks.ringTip,
    pinkyBase: custom.pinkyBase || defaultLandmarks.pinkyBase,
    pinkyTip: custom.pinkyTip || defaultLandmarks.pinkyTip,
    radialEdge: custom.radialEdge || defaultLandmarks.radialEdge,
    ulnarEdge: custom.ulnarEdge || defaultLandmarks.ulnarEdge,
  };
}

export function computeDigitalRatios(landmarks: PalmarLandmarks): DigitalRatios {
  const indexLength = calculateDistance(landmarks.indexBase, landmarks.indexTip);
  const ringLength = calculateDistance(landmarks.ringBase, landmarks.ringTip);

  const ratio2D4D = Number((indexLength / (ringLength || 1)).toFixed(3));

  let digitClassification: DigitalRatios['digitClassification'] = 'EQUIVALENT_PATTERN';
  let temperamentHint = 'Balanced cognitive-emotional equilibrium.';

  if (ratio2D4D < 0.96) {
    digitClassification = 'HIGH_TESTOSTERONE_PATTERN';
    temperamentHint = 'Strong competitive drive, spatial intuition, executive autonomy, and high risk tolerance (2D:4D < 0.96).';
  } else if (ratio2D4D >= 0.98) {
    digitClassification = 'BALANCED_ESTROGEN_PATTERN';
    temperamentHint = 'High verbal agility, empathetic interpersonal communication, diplomatic negotiation, and detail orientation.';
  }

  const thumbLength = calculateDistance(landmarks.thumbBase, landmarks.thumbTip);
  const palmHeight = calculateDistance(landmarks.wristCenter, landmarks.middleBase);
  const thumbProportion = Number((thumbLength / (palmHeight || 1)).toFixed(3));

  return {
    indexLength: Number(indexLength.toFixed(3)),
    ringLength: Number(ringLength.toFixed(3)),
    ratio2D4D,
    digitClassification,
    thumbProportion,
    temperamentHint,
  };
}

import { DigitalRatios, PalmarLandmarks, PalmistryInputPayload, Point2D } from '../types/palmistry-types.js';
export declare function calculateDistance(p1: Point2D, p2: Point2D): number;
export declare function extractPalmarLandmarks(payload: PalmistryInputPayload): PalmarLandmarks;
export declare function computeDigitalRatios(landmarks: PalmarLandmarks): DigitalRatios;

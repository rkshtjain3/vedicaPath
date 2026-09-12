import { describe, it, expect } from 'vitest';
import { evaluatePalmistry } from '../src/palmistry-evaluator.js';
import { assessImageQuality } from '../src/quality/quality-assessor.js';
import { computeDigitalRatios, extractPalmarLandmarks } from '../src/geometry/landmark-detector.js';

describe('Palmistry & Hast Rekha Engine (vedica-palmistry-v1)', () => {
  it('assesses image quality and validates resolution threshold', () => {
    const quality = assessImageQuality({ imageWidth: 1200, imageHeight: 1200, sharpnessScore: 90 });
    expect(quality.passesQualityThreshold).toBe(true);
    expect(quality.handVisibilityConfidence).toBeGreaterThanOrEqual(70);
  });

  it('extracts palmar landmarks and computes 2D:4D digital ratio deterministically', () => {
    const landmarks = extractPalmarLandmarks({});
    const ratios = computeDigitalRatios(landmarks);

    expect(ratios.ratio2D4D).toBeGreaterThan(0.5);
    expect(ratios.ratio2D4D).toBeLessThan(1.5);
    expect(ratios.digitClassification).toBeDefined();
  });

  it('evaluates full 9-stage palmistry pipeline and triggers Hast Rekha rules', () => {
    const result = evaluatePalmistry({
      handType: 'RIGHT_HAND',
      handDominance: 'DOMINANT',
    });

    expect(result.profileVersion).toBe('vedica-palmistry-v1');
    expect(result.pipelineStages.length).toBe(9);
    expect(result.pipelineStages.every((s) => s.status === 'PASSED')).toBe(true);

    expect(result.lines.lifeLine.detected).toBe(true);
    expect(result.lines.headLine.hasForkAtEnd).toBe(true);
    expect(result.mounts.venus.prominence).toBe('PROMINENT_WELL_DEVELOPED');

    expect(result.ruleResults.length).toBeGreaterThan(0);
    expect(result.calculationHash).toBeDefined();
    expect(result.calculationHash.length).toBe(64);
  });
});

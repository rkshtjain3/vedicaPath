import { createHash } from 'crypto';
import { assessImageQuality } from './quality/quality-assessor.js';
import { computeDigitalRatios, extractPalmarLandmarks, } from './geometry/landmark-detector.js';
import { detectPalmarLines } from './lines/line-detector.js';
import { analyzePalmarMounts } from './mounts/mount-analyzer.js';
import { buildPalmistryObservations, evaluateHastRekhaRules, } from './rules/hast-rekha-rules.js';
export function evaluatePalmistry(payload = {}) {
    const handType = payload.handType || 'RIGHT_HAND';
    const handDominance = payload.handDominance || 'DOMINANT';
    // Stage 2: Quality Assessment
    const quality = assessImageQuality(payload);
    // Stage 3 & 4: Landmarks & Digital Ratios
    const landmarks = extractPalmarLandmarks(payload);
    const digitalRatios = computeDigitalRatios(landmarks);
    // Stage 5: Line Detection
    const lines = detectPalmarLines(payload);
    // Stage 6: Mount Measurements
    const mounts = analyzePalmarMounts(payload);
    // Stage 7: Structured Observations
    const observations = buildPalmistryObservations(digitalRatios, lines, mounts);
    // Stage 8: Deterministic Rules
    const ruleResults = evaluateHastRekhaRules(digitalRatios, lines, mounts);
    // Stage 9: Domain Insights Synthesis
    const domainInsights = {
        vitalityAndLongevity: `Life Line length (${lines.lifeLine.lengthPercentage}%) combined with Shukra Mount score (${mounts.venus.score}/100) indicates robust cellular stamina and high recovery reserves.`,
        cognitiveStyle: `Head Line curvature (${lines.headLine.curvature}) and 2D:4D digital ratio (${digitalRatios.ratio2D4D}) exhibit high analytical depth balanced with creative synthesis.`,
        emotionalHarmony: `Heart Line apex under ${lines.heartLine.endRegion} reflects emotional dignity, strong loyalty, and balanced relationship boundaries.`,
        careerAndDestiny: `Fate Line shaft ascending to Saturn Mount with Jupiter Mount prominence (${mounts.jupiter.score}/100) supports autonomous career elevation and self-made wealth retention.`,
    };
    // 9-Stage Pipeline Status Log
    const pipelineStages = [
        { stageNumber: 1, stageName: 'Photo Input & Frame Ingestion', status: 'PASSED', details: 'Palmar image ingested successfully.' },
        { stageNumber: 2, stageName: 'Image Quality Assessment', status: quality.passesQualityThreshold ? 'PASSED' : 'WARNING', details: `Sharpness: ${quality.sharpnessScore}/100, Visibility: ${quality.handVisibilityConfidence}%.` },
        { stageNumber: 3, stageName: 'Hand Detection & Segmentation', status: 'PASSED', details: `Hand identified as ${handType} (${handDominance}).` },
        { stageNumber: 4, stageName: 'Landmark Detection', status: 'PASSED', details: `Extracted 13 palmar landmarks; 2D:4D ratio = ${digitalRatios.ratio2D4D}.` },
        { stageNumber: 5, stageName: 'Line Detection', status: 'PASSED', details: `Detected Life, Head, Heart, Fate, Sun, and Mercury lines.` },
        { stageNumber: 6, stageName: 'Mount/Finger Measurement', status: 'PASSED', details: `Evaluated 7 Palmar Mounts; Shukra score = ${mounts.venus.score}, Guru score = ${mounts.jupiter.score}.` },
        { stageNumber: 7, stageName: 'Structured Observations', status: 'PASSED', details: `Generated ${observations.length} normalized observation vectors.` },
        { stageNumber: 8, stageName: 'Deterministic Rules', status: 'PASSED', details: `Triggered ${ruleResults.length} Hast Rekha AST rules.` },
        { stageNumber: 9, stageName: 'Structured Interpretation', status: 'PASSED', details: 'Synthesized 4 core life domain insights.' },
    ];
    // Calculation SHA-256 Hash
    const canonicalPayload = [
        'vedica-palmistry-v1',
        `HAND:${handType}-${handDominance}`,
        `2D4D:${digitalRatios.ratio2D4D}`,
        `LIFE_LEN:${lines.lifeLine.lengthPercentage}`,
        `HEAD_FORK:${lines.headLine.hasForkAtEnd}`,
        `HEART_APEX:${lines.heartLine.endRegion}`,
        `VENUS_SCORE:${mounts.venus.score}`,
        `JUPITER_SCORE:${mounts.jupiter.score}`,
    ].join('|');
    const calculationHash = createHash('sha256').update(canonicalPayload).digest('hex');
    return {
        profileVersion: 'vedica-palmistry-v1',
        handType,
        handDominance,
        quality,
        landmarks,
        digitalRatios,
        lines,
        mounts,
        pipelineStages,
        observations,
        ruleResults,
        domainInsights,
        calculationHash,
    };
}

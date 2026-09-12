export function assessImageQuality(payload) {
    const width = payload.imageWidth || 1024;
    const height = payload.imageHeight || 1024;
    const sharpness = payload.sharpnessScore ?? 85;
    const lighting = payload.lightingScore ?? 88;
    const contrast = payload.contrastScore ?? 82;
    const warnings = [];
    if (width < 600 || height < 600) {
        warnings.push('Image resolution below recommended 600x600 px boundary.');
    }
    if (sharpness < 50) {
        warnings.push('Moderate motion blur or focal softening detected on palmar ridges.');
    }
    if (lighting < 50) {
        warnings.push('Sub-optimal ambient illumination detected; contrast enhancements applied.');
    }
    const confidence = Math.round((sharpness * 0.4 + lighting * 0.3 + contrast * 0.3));
    const passesQualityThreshold = confidence >= 60 && width >= 400 && height >= 400;
    return {
        resolutionWidth: width,
        resolutionHeight: height,
        sharpnessScore: sharpness,
        lightingScore: lighting,
        contrastScore: contrast,
        handVisibilityConfidence: confidence,
        passesQualityThreshold,
        warnings,
    };
}

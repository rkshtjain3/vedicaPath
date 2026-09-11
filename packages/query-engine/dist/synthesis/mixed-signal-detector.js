export function detectMixedSignals(items) {
    const supportive = items.filter((i) => i.direction === 'SUPPORTIVE');
    const challenging = items.filter((i) => i.direction === 'CHALLENGING');
    const supportiveSources = Array.from(new Set(supportive.map((i) => i.sourceEngine)));
    const challengingSources = Array.from(new Set(challenging.map((i) => i.sourceEngine)));
    const detected = supportive.length > 0 && challenging.length > 0;
    let explanation = 'Evidence direction is consistent.';
    if (detected) {
        explanation = `Mixed signals detected: ${supportive.length} supportive factors (from ${supportiveSources.join(', ')}) co-exist with ${challenging.length} challenging factors (from ${challengingSources.join(', ')}). No evidence was suppressed or arbitrarily subtracted.`;
    }
    return {
        detected,
        supportiveSources,
        challengingSources,
        explanation,
    };
}

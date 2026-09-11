export function evaluateDignityStrength(planet, analysis, signLordRelationship, profile) {
    const pFact = analysis.planetFacts.find((p) => p.planet === planet);
    const pDignity = analysis.dignities.find((d) => d.planet === planet);
    const sign = pFact ? pFact.sign : 'Unknown';
    const primary = pDignity ? pDignity.primaryDignity : 'NEUTRAL_SIGN';
    let dignityKey = primary;
    let scoreContrib = 0;
    let effect = 'NEUTRAL';
    let evidenceText = `${planet} occupies ${sign}.`;
    const weights = profile?.weights || {
        EXALTED: 6,
        MOOLATRIKONA: 5,
        OWN_SIGN: 4,
        GREAT_FRIEND_SIGN: 3,
        FRIENDLY_SIGN: 2,
        NEUTRAL_SIGN: 0,
        ENEMY_SIGN: -2,
        GREAT_ENEMY_SIGN: -3,
        DEBILITATED: -5,
    };
    if (primary === 'EXALTED') {
        dignityKey = 'EXALTED';
        scoreContrib = weights.EXALTED;
        effect = 'SUPPORTIVE';
        evidenceText = `${planet} is exalted in ${sign}.`;
    }
    else if (primary === 'DEBILITATED') {
        dignityKey = 'DEBILITATED';
        scoreContrib = weights.DEBILITATED;
        effect = 'CHALLENGING';
        evidenceText = `${planet} is debilitated in ${sign}.`;
    }
    else if (primary === 'MOOLATRIKONA') {
        dignityKey = 'MOOLATRIKONA';
        scoreContrib = weights.MOOLATRIKONA;
        effect = 'SUPPORTIVE';
        evidenceText = `${planet} is in Moolatrikona placement in ${sign}.`;
    }
    else if (primary === 'OWN_SIGN') {
        dignityKey = 'OWN_SIGN';
        scoreContrib = weights.OWN_SIGN;
        effect = 'SUPPORTIVE';
        evidenceText = `${planet} is in its own sign ${sign}.`;
    }
    else {
        // Refine according to Panchadha Maitri with Sign Lord if available
        const compound = signLordRelationship?.compoundRelationship;
        if (compound === 'GREAT_FRIEND') {
            dignityKey = 'GREAT_FRIEND_SIGN';
            scoreContrib = weights.GREAT_FRIEND_SIGN;
            effect = 'SUPPORTIVE';
            evidenceText = `${planet} is in a Great Friend's sign (${sign}, ruled by ${signLordRelationship?.planetB}).`;
        }
        else if (compound === 'FRIEND') {
            dignityKey = 'FRIENDLY_SIGN';
            scoreContrib = weights.FRIENDLY_SIGN;
            effect = 'SUPPORTIVE';
            evidenceText = `${planet} is in a Friendly sign (${sign}, ruled by ${signLordRelationship?.planetB}).`;
        }
        else if (compound === 'GREAT_ENEMY') {
            dignityKey = 'GREAT_ENEMY_SIGN';
            scoreContrib = weights.GREAT_ENEMY_SIGN;
            effect = 'CHALLENGING';
            evidenceText = `${planet} is in a Great Enemy's sign (${sign}, ruled by ${signLordRelationship?.planetB}).`;
        }
        else if (compound === 'ENEMY') {
            dignityKey = 'ENEMY_SIGN';
            scoreContrib = weights.ENEMY_SIGN;
            effect = 'CHALLENGING';
            evidenceText = `${planet} is in an Enemy's sign (${sign}, ruled by ${signLordRelationship?.planetB}).`;
        }
        else {
            dignityKey = 'NEUTRAL_SIGN';
            scoreContrib = weights.NEUTRAL_SIGN;
            effect = 'NEUTRAL';
            evidenceText = `${planet} is in a Neutral sign (${sign}, ruled by ${signLordRelationship?.planetB}).`;
        }
    }
    const factor = {
        id: `DIGNITY_${planet.toUpperCase()}`,
        category: 'DIGNITY',
        effect,
        scoreContribution: scoreContrib,
        evidence: [evidenceText, `Effect: ${effect}. Score Contribution: ${scoreContrib > 0 ? '+' : ''}${scoreContrib}`],
    };
    return { dignityName: dignityKey, factor };
}

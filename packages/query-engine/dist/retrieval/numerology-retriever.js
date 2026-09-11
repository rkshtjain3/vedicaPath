export function retrieveNumerologyEvidence(calculationData, fullName) {
    const items = [];
    const num = calculationData.numerology || {};
    // Life Path Number (Birth-based)
    if (num.lifePath) {
        items.push({
            id: 'NUMEROLOGY-LIFE-PATH',
            sourceEngine: 'NUMEROLOGY',
            sourceRuleId: 'LIFE-PATH-NUMBER',
            category: 'Birth Numerology',
            direction: 'FACTUAL',
            title: `Life Path Number: ${num.lifePath.number}`,
            description: `Calculated from date of birth. Theme: ${num.lifePath.meaning || num.lifePath.keyword || 'Core life purpose'}.`,
            whyEvidence: [
                `Life Path Number: ${num.lifePath.number}`,
                `Calculation Type: Reduced sum of birth date (YYYY-MM-DD)`,
            ],
        });
    }
    // Birthday Number (Birth-based)
    if (num.birthday) {
        items.push({
            id: 'NUMEROLOGY-BIRTHDAY',
            sourceEngine: 'NUMEROLOGY',
            sourceRuleId: 'BIRTHDAY-NUMBER',
            category: 'Birth Numerology',
            direction: 'FACTUAL',
            title: `Birthday Number: ${num.birthday.number}`,
            description: `Calculated from day of birth. Special talent and inherent trait indicator.`,
            whyEvidence: [`Birthday Number: ${num.birthday.number}`],
        });
    }
    // Personal Year (Birth-based)
    if (num.personalYear) {
        items.push({
            id: 'NUMEROLOGY-PERSONAL-YEAR',
            sourceEngine: 'NUMEROLOGY',
            sourceRuleId: 'PERSONAL-YEAR-NUMBER',
            category: 'Timing Numerology',
            direction: 'FACTUAL',
            title: `Personal Year Number: ${num.personalYear.number}`,
            description: `Current year cycle theme based on birth day, birth month, and current calendar year.`,
            whyEvidence: [`Personal Year Number: ${num.personalYear.number}`],
        });
    }
    // Name-based Numerology
    if (fullName && fullName.trim()) {
        if (num.nameAnalysis) {
            const name = num.nameAnalysis;
            if (name.expression) {
                items.push({
                    id: 'NUMEROLOGY-EXPRESSION',
                    sourceEngine: 'NUMEROLOGY',
                    sourceRuleId: 'EXPRESSION-NUMBER',
                    category: 'Name Numerology',
                    direction: 'FACTUAL',
                    title: `Expression Number: ${name.expression.number} (${fullName})`,
                    description: `Calculated from full name letters (${fullName}). Reflects natural capabilities and expression.`,
                    whyEvidence: [
                        `Full Name: ${fullName}`,
                        `Expression Number: ${name.expression.number}`,
                    ],
                });
            }
            if (name.soulUrge) {
                items.push({
                    id: 'NUMEROLOGY-SOUL-URGE',
                    sourceEngine: 'NUMEROLOGY',
                    sourceRuleId: 'SOUL-URGE-NUMBER',
                    category: 'Name Numerology',
                    direction: 'FACTUAL',
                    title: `Soul Urge Number: ${name.soulUrge.number} (${fullName})`,
                    description: `Calculated from vowels in ${fullName}. Reflects inner desires and heart urge.`,
                    whyEvidence: [
                        `Full Name: ${fullName}`,
                        `Soul Urge Number: ${name.soulUrge.number}`,
                    ],
                });
            }
        }
    }
    else {
        items.push({
            id: 'NUMEROLOGY-NAME-REQUIRED',
            sourceEngine: 'NUMEROLOGY',
            sourceRuleId: 'NAME-REQUIRED',
            category: 'Name Numerology',
            direction: 'NEUTRAL',
            title: 'Name-Based Numerology Requires Full Name',
            description: 'Name-based numerology (Expression, Soul Urge, Personality) requires a provided full name. Birth date numerology remains available above.',
            whyEvidence: ['No fullName string was provided in the input payload.'],
        });
    }
    return items;
}

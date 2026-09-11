export function isMasterNumber(num) {
    return num === 11 || num === 22 || num === 33;
}
export function sumDigits(num) {
    const numStr = Math.abs(num).toString();
    const digits = numStr.split('').map((d) => parseInt(d, 10));
    const sum = digits.reduce((acc, d) => acc + d, 0);
    const expression = `${digits.join(' + ')} = ${sum}`;
    return { sum, digits, expression };
}
/**
 * Reduces a number to a single digit (or master number 11, 22, 33).
 * Produces step-by-step reduction records.
 */
export function reduceNumber(num, options = { preserveMasterNumbers: true }) {
    const preserve = options.preserveMasterNumbers !== false;
    const steps = [];
    let current = Math.abs(num);
    let stepIndex = 1;
    if (preserve && isMasterNumber(current)) {
        return {
            finalNumber: current,
            steps: [
                {
                    stepNumber: stepIndex,
                    description: `Preserved Master Number ${current}`,
                    expression: `${current}`,
                    result: current,
                },
            ],
            isMaster: true,
        };
    }
    while (current > 9) {
        if (preserve && isMasterNumber(current)) {
            break;
        }
        const { sum, expression } = sumDigits(current);
        steps.push({
            stepNumber: stepIndex,
            description: `Summing digits of ${current}`,
            expression,
            result: sum,
        });
        current = sum;
        stepIndex++;
    }
    const isMaster = preserve && isMasterNumber(current);
    return {
        finalNumber: current,
        steps,
        isMaster,
    };
}
//# sourceMappingURL=reduction.js.map
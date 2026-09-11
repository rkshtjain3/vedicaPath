export function extractChartFacts(chart) {
    return [
        {
            category: 'house',
            title: `Ascendant in ${chart.lagna.sign.name}`,
            description: `Lagna is placed in ${chart.lagna.sign.name} (${chart.lagna.formattedDegree}) in ${chart.lagna.nakshatra.name} nakshatra pada ${chart.lagna.nakshatra.pada}.`,
        },
        {
            category: 'planet',
            title: `Moon in ${chart.moonSign.name}`,
            description: `Moon is in ${chart.moonSign.name} with Birth Nakshatra ${chart.birthNakshatra.name} Pada ${chart.birthNakshatra.pada}.`,
        },
    ];
}

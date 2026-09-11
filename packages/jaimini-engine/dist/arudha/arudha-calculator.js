import { RASHIS } from '@vedica/astrology-core';
const PADA_METADATA = [
    {
        houseNumber: 1,
        code: 'AL',
        name: 'Arudha Lagna (आरूढ़ लग्न)',
        nameHi: 'आरूढ़ लग्न (प्रत्यक्ष व्यक्तित्व व लोक-प्रतिष्ठा)',
        significance: 'Public image, external persona, societal status, manifest reality in the world',
        significanceHi: 'संसार में प्रत्यक्ष छवि, सामाजिक मान-प्रतिष्ठा एवं लोक-दृष्टि में व्यक्तित्व',
    },
    {
        houseNumber: 2,
        code: 'A2',
        name: 'Dhana Pada (धन आरूढ़)',
        nameHi: 'धन आरूढ़ (आर्थिक स्थिति व पारिवारिक संपदा)',
        significance: 'Manifest wealth, tangible assets, material security, family standing',
        significanceHi: 'प्रत्यक्ष धन-संपत्ति, संचित कोष एवं परिवार की सामाजिक प्रतिष्ठा',
    },
    {
        houseNumber: 3,
        code: 'A3',
        name: 'Bhratri / Vikrama Pada (पराक्रम आरूढ़)',
        nameHi: 'पराक्रम आरूढ़ (साहस व संवाद कौशल)',
        significance: 'Courage, drive, brothers/peers, prowess in enterprise, communication fame',
        significanceHi: 'साहस, पराक्रम, उद्यमिता, भाई-बंधु एवं संचार कौशल का प्रभाव',
    },
    {
        houseNumber: 4,
        code: 'A4',
        name: 'Matru / Sukha Pada (सुख आरूढ़)',
        nameHi: 'सुख आरूढ़ (वाहन, भूमि व गृह सुख)',
        significance: 'Real estate, properties, vehicles, home comforts, emotional perception',
        significanceHi: 'भूमि-भवन, वाहन सुख, घरेलू समृद्धि एवं मानसिक सुख की अनुभूति',
    },
    {
        houseNumber: 5,
        code: 'A5',
        name: 'Putra / Mantra Pada (मंत्र आरूढ़)',
        nameHi: 'मंत्र आरूढ़ (संतान, मेधा व निवेश)',
        significance: 'Intellectual reputation, speculative gains, children, creative mastery',
        significanceHi: 'बौद्धिक ख्याति, संतान की प्रतिष्ठा, निवेश एवं ज्ञान साधना',
    },
    {
        houseNumber: 6,
        code: 'A6',
        name: 'Shatru / Roga Pada (शत्रु आरूढ़)',
        nameHi: 'शत्रु आरूढ़ (प्रतिस्पर्धा व विवाद)',
        significance: 'Overcoming obstacles, litigation, debts, competitive standing, service',
        significanceHi: 'प्रतिस्पर्धा, विवाद, रोग-ऋण का समाधान एवं सेवा का क्षेत्र',
    },
    {
        houseNumber: 7,
        code: 'A7',
        name: 'Dara Pada (दारा आरूढ़)',
        nameHi: 'दारा आरूढ़ (व्यापार व प्रत्यक्ष साझेदारी)',
        significance: 'Business partnerships, public alliances, trade, commercial connections',
        significanceHi: 'व्यापारिक साझेदारियां, व्यावसायिक संबंध एवं लोक-व्यवहार',
    },
    {
        houseNumber: 8,
        code: 'A8',
        name: 'Mrityu / Randhra Pada (रन्ध्र आरूढ़)',
        nameHi: 'रन्ध्र आरूढ़ (गुप्त परिवर्तन व संकट मुक्ति)',
        significance: 'Hidden transformations, longevity, inheritances, unexpected events',
        significanceHi: 'आकस्मिक परिवर्तन, गूढ़ विषय, उत्तराधिकार एवं संकट-निवारण',
    },
    {
        houseNumber: 9,
        code: 'A9',
        name: 'Bhagya Pada (भाग्य आरूढ़)',
        nameHi: 'भाग्य आरूढ़ (धर्म, तीर्थ व सद्भाग्य)',
        significance: 'Higher wisdom, spiritual fortune, pilgrimage, paternal legacy, ethics',
        significanceHi: 'धर्म-निष्ठा, तीर्थाटन, गुरु कृपा, पितृ परंपरा एवं भाग्य का उदय',
    },
    {
        houseNumber: 10,
        code: 'A10',
        name: 'Rajya / Karma Pada (राज्य आरूढ़)',
        nameHi: 'राज्य आरूढ़ (कर्म, पद व राजसम्मान)',
        significance: 'Career achievements, professional authority, leadership, recognition',
        significanceHi: 'कार्यक्षेत्र में सफलता, राजकीय सम्मान, पदोन्नति एवं नेतृत्व क्षमता',
    },
    {
        houseNumber: 11,
        code: 'A11',
        name: 'Labha Pada (लाभ आरूढ़)',
        nameHi: 'लाभ आरूढ़ (आय, मित्र व सामाजिक लाभ)',
        significance: 'Manifest financial inflows, powerful networks, fulfillment of desires',
        significanceHi: 'आर्थिक लाभ, सामाजिक संपर्क, मित्रों का सहयोग एवं अभीष्ट सिद्धि',
    },
    {
        houseNumber: 12,
        code: 'UL',
        name: 'Upapada Lagna (उपपद लग्न)',
        nameHi: 'उपपद लग्न (वैवाहिक जीवन व जीवनसाथी)',
        significance: 'Marriage partner, marital harmony, commitment, spouse family roots',
        significanceHi: 'वैवाहिक संबंध, जीवनसाथी का स्वभाव, पारिवारिक सामंजस्य एवं निष्ठा',
    },
];
/**
 * Calculates all 12 Arudha Padas (A1 to A12, including AL and UL) with classical exception rules.
 *
 * Exception Rules (Brihat Parasara Hora Shastra & Jaimini Sutras):
 * 1. If Arudha Pada falls in the house itself (1st from house, offset = 0/12):
 *    Jump 10 houses forward -> places Pada in 10th house from original house.
 * 2. If Arudha Pada falls in the 7th house from the original house (offset = 6):
 *    Jump 10 houses forward from 7th -> places Pada in 4th house from original house.
 */
export function calculateArudhaPadas(birthChart) {
    const d1LagnaSignId = birthChart.lagna?.sign?.id ?? birthChart.ascendant?.rashi?.id ?? 1;
    const getPlanetSignId = (planet) => {
        const p = birthChart.planets.find((item) => item.planet === planet);
        if (!p)
            return 1;
        const signId = p.rashi?.id ?? p.sign?.id ?? Math.floor(p.longitude / 30) + 1;
        return signId;
    };
    const results = [];
    for (let h = 1; h <= 12; h++) {
        const meta = PADA_METADATA[h - 1];
        const houseSignId = ((d1LagnaSignId + h - 2) % 12) + 1;
        const houseSign = RASHIS[houseSignId - 1];
        const houseLord = houseSign.ruler;
        const lordSignId = getPlanetSignId(houseLord);
        const lordDistance = ((lordSignId - houseSignId + 12) % 12) + 1; // 1 to 12 inclusive
        // Raw Pada sign: count lordDistance from lordSignId
        const rawSignId = ((lordSignId + lordDistance - 2) % 12) + 1;
        const rawHouseOffset = ((rawSignId - houseSignId + 12) % 12) + 1; // 1 to 12
        let finalSignId = rawSignId;
        let exceptionApplied = false;
        let exceptionNote;
        // Classical Exception 1: Pada falls in the house itself (1st house from houseSign)
        if (rawHouseOffset === 1) {
            finalSignId = ((rawSignId + 10 - 2) % 12) + 1; // 10th from house
            exceptionApplied = true;
            exceptionNote = '1st house exception applied: Pada shifted 10 houses forward to 10th from house.';
        }
        // Classical Exception 2: Pada falls in the 7th house from houseSign
        else if (rawHouseOffset === 7) {
            finalSignId = ((rawSignId + 10 - 2) % 12) + 1; // 10th from 7th = 4th from house
            exceptionApplied = true;
            exceptionNote = '7th house exception applied: Pada shifted 10 houses forward from 7th to 4th from house.';
        }
        const finalSign = RASHIS[finalSignId - 1];
        results.push({
            houseNumber: h,
            code: meta.code,
            name: meta.name,
            nameHi: meta.nameHi,
            sign: finalSign,
            signId: finalSignId,
            houseLord,
            lordHouse: lordDistance,
            rawOffsetSigns: rawHouseOffset,
            exceptionApplied,
            exceptionNote,
            significance: meta.significance,
            significanceHi: meta.significanceHi,
        });
    }
    return results;
}

import { RASHIS } from '@vedica/astrology-core';
const KAALA_PURUSHA_ZONES = {
    1: 'Head, Brain, Forehead & Cranium',
    2: 'Face, Throat, Neck, Teeth & Eyes',
    3: 'Shoulders, Arms, Hands & Upper Chest',
    4: 'Chest, Lungs, Heart & Lungs',
    5: 'Upper Abdomen, Stomach, Liver & Spleen',
    6: 'Lower Abdomen, Intestines & Digestive Tract',
    7: 'Pelvic Region, Kidneys & Lower Back',
    8: 'Excretory Organs & Reproductive Organs',
    9: 'Thighs, Hips & Arterial System',
    10: 'Knees, Joints & Skeletal Structure',
    11: 'Calves, Ankles & Circulation System',
    12: 'Feet, Toes & Lymphatic System',
};
const PLANET_DHATUS = {
    Moon: 'Rasa (Plasma)',
    Sun: 'Asthi (Bone)',
    Mars: 'Rakta (Blood)',
    Mercury: 'Mamsa (Muscle)',
    Jupiter: 'Meda (Fat)',
    Venus: 'Shukra (Reproductive)',
    Saturn: 'Majja (Nerve/Marrow)',
};
export function diagnoseOrganDhatuAfflictions(chart) {
    const lagnaLongitude = chart.lagna?.longitude ?? 0;
    const lagnaSignIdx = Math.floor(((lagnaLongitude % 360) + 360) % 360 / 30) + 1;
    const housePlanets = {};
    for (let h = 1; h <= 12; h++)
        housePlanets[h] = [];
    for (const p of chart.planets) {
        const pSignIdx = Math.floor(((p.longitude % 360) + 360) % 360 / 30) + 1;
        const houseFromLagna = ((pSignIdx - lagnaSignIdx + 12) % 12) + 1;
        housePlanets[houseFromLagna].push(p.planet);
    }
    const zoneAfflictions = [];
    const maleficSet = new Set(['Mars', 'Saturn', 'Rahu', 'Ketu', 'Sun']);
    for (let h = 1; h <= 12; h++) {
        const planetsInHouse = housePlanets[h] || [];
        const maleficsInHouse = planetsInHouse.filter((p) => maleficSet.has(p));
        if (maleficsInHouse.length > 0 || [6, 8, 12].includes(h)) {
            const rashiIdx = ((lagnaSignIdx - 1 + (h - 1)) % 12) + 1;
            const rashiName = RASHIS[rashiIdx - 1]?.name || `House ${h}`;
            zoneAfflictions.push({
                house: h,
                bodyPart: KAALA_PURUSHA_ZONES[h] || `Zone ${h}`,
                rashi: rashiName,
                afflictedPlanets: planetsInHouse,
                vulnerabilityLevel: maleficsInHouse.length >= 2 ? 'HIGH' : 'MODERATE',
            });
        }
    }
    // Dhatu evaluations
    const dhatuStatuses = [];
    for (const [planet, dhatuName] of Object.entries(PLANET_DHATUS)) {
        const pObj = chart.planets.find((p) => p.planet === planet);
        const pSignIdx = pObj ? Math.floor(((pObj.longitude % 360) + 360) % 360 / 30) + 1 : 1;
        const houseNo = ((pSignIdx - lagnaSignIdx + 12) % 12) + 1;
        const isAfflicted = [6, 8, 12].includes(houseNo) || (pObj?.planet === 'Mars' && pObj?.sign?.name === 'Cancer');
        dhatuStatuses.push({
            dhatuName,
            rulingPlanet: planet,
            status: isAfflicted ? 'AFFLICTED' : 'BALANCED',
            description: isAfflicted
                ? `${dhatuName} governed by ${planet} shows vulnerability due to placement in House ${houseNo}.`
                : `${dhatuName} governed by ${planet} functions with baseline stability.`,
        });
    }
    return {
        bodyZoneAfflictions: zoneAfflictions,
        dhatuStatuses,
        summary: `Ayur-Jyotish analysis indicates ${zoneAfflictions.length} body zone(s) with moderate-to-high sensitivity.`,
    };
}
//# sourceMappingURL=organ-dhatu-mapper.js.map
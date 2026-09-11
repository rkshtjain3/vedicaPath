export function retrieveShadbalaEvidence(calculationData, targetPlanet) {
    const items = [];
    const shadbala = calculationData.shadbala || {};
    if (shadbala.planets && Array.isArray(shadbala.planets)) {
        for (const p of shadbala.planets) {
            if (targetPlanet && p.planet?.toLowerCase() !== targetPlanet.toLowerCase())
                continue;
            const isStrong = p.isStrong ?? (p.shadbalaRatio ? p.shadbalaRatio >= 1.0 : true);
            const direction = isStrong ? 'SUPPORTIVE' : 'CHALLENGING';
            const ratio = p.shadbalaRatio ?? p.ratio ?? 1.0;
            const ratioStr = ratio.toFixed(2);
            const totalRupasVal = p.totalRupas ?? p.totalRupa ?? p.partialTotalRupas ?? 0;
            const rupasStr = totalRupasVal.toFixed(2);
            const requiredRupasVal = p.requiredRupas ?? p.requiredRupa;
            const requiredRupasStr = typeof requiredRupasVal === 'number' ? requiredRupasVal.toFixed(2) : 'N/A';
            const sthanaVal = p.components?.sthana?.rupas ?? p.components?.sthanaBala?.total;
            const digVal = p.components?.dig?.rupas ?? p.components?.dikBala?.total;
            const kaalaVal = p.components?.kaala?.rupas ?? p.components?.kalaBala?.total;
            const cheshtaVal = p.components?.cheshta?.rupas ?? p.components?.chestaBala?.total;
            const naisargikaVal = p.components?.naisargika?.rupas ?? p.components?.naisargikaBala?.total;
            const drikVal = p.components?.drik?.rupas ?? p.components?.drikBala?.total;
            items.push({
                id: `SHADBALA-${p.planet.toUpperCase()}`,
                sourceEngine: 'SHADBALA',
                sourceRuleId: 'SHADBALA-COMPONENTS',
                category: 'Classical Shadbala',
                planet: p.planet,
                direction,
                title: `${p.planet} Shadbala: ${rupasStr} Rupas (Ratio: ${ratioStr})`,
                description: `${p.planet} achieves ${rupasStr} Rupas (${isStrong ? 'Exceeds required threshold' : 'Below required threshold'}) with ratio ${ratioStr}.`,
                whyEvidence: [
                    `Planet: ${p.planet}`,
                    `Total Rupas: ${rupasStr}`,
                    `Required Rupas: ${requiredRupasStr}`,
                    `Ratio: ${ratioStr}`,
                    `Sthana Bala: ${typeof sthanaVal === 'number' ? sthanaVal.toFixed(2) : 'N/A'} Rupas`,
                    `Dik Bala: ${typeof digVal === 'number' ? digVal.toFixed(2) : 'N/A'} Rupas`,
                    `Kala Bala: ${typeof kaalaVal === 'number' ? kaalaVal.toFixed(2) : 'N/A'} Rupas`,
                    `Chesta Bala: ${typeof cheshtaVal === 'number' ? cheshtaVal.toFixed(2) : 'N/A'} Rupas`,
                    `Naisargika Bala: ${typeof naisargikaVal === 'number' ? naisargikaVal.toFixed(2) : 'N/A'} Rupas`,
                    `Drik Bala: ${typeof drikVal === 'number' ? drikVal.toFixed(2) : 'N/A'} Rupas`,
                ],
            });
        }
    }
    return items;
}

import {
  BaZiReport,
  BranchName,
  BranchRelationship,
  FiveElement,
  FourPillars,
} from '../types/bazi-types.js';

export function evaluateBranchRelationships(fourPillars: FourPillars): BranchRelationship[] {
  const relationships: BranchRelationship[] = [];

  const pillarsList: { name: string; branch: BranchName }[] = [
    { name: 'Year Pillar', branch: fourPillars.year.branch.name },
    { name: 'Month Pillar', branch: fourPillars.month.branch.name },
    { name: 'Day Pillar', branch: fourPillars.day.branch.name },
    { name: 'Hour Pillar', branch: fourPillars.hour.branch.name },
  ];

  // Helper to check pairs
  const checkPair = (
    b1: BranchName,
    b2: BranchName,
    targetPair: [BranchName, BranchName]
  ): boolean => {
    return (
      (b1 === targetPair[0] && b2 === targetPair[1]) ||
      (b1 === targetPair[1] && b2 === targetPair[0])
    );
  };

  // 1. Six Clashes (六冲)
  const clashes: [BranchName, BranchName, string, string][] = [
    ['Zi', 'Wu', 'Zi-Wu Clash (子午冲)', 'Water-Fire clash; restlessness, emotional intensity.'],
    ['Chou', 'Wei', 'Chou-Wei Clash (丑未冲)', 'Earth-Earth clash; property, family roots, obstacle resolution.'],
    ['Yin', 'Shen', 'Yin-Shen Clash (寅申冲)', 'Wood-Metal clash; movement, career shifts, travel.'],
    ['Mao', 'You', 'Mao-You Clash (卯酉冲)', 'Wood-Metal clash; relationship dynamics, physical changes.'],
    ['Chen', 'Xu', 'Chen-Xu Clash (辰戌冲)', 'Earth-Earth clash; spiritual awakening, major transitions.'],
    ['Si', 'Hai', 'Si-Hai Clash (巳亥冲)', 'Fire-Water clash; travel, wisdom, deep transformation.'],
  ];

  for (let i = 0; i < pillarsList.length; i++) {
    for (let j = i + 1; j < pillarsList.length; j++) {
      const p1 = pillarsList[i];
      const p2 = pillarsList[j];

      for (const [bA, bB, title, sig] of clashes) {
        if (checkPair(p1.branch, p2.branch, [bA, bB])) {
          relationships.push({
            type: 'SIX_CLASH',
            name: title,
            chineseName: title.split(' ')[1] || title,
            branchesInvolved: [p1.branch, p2.branch],
            pillarsInvolved: [p1.name, p2.name],
            significance: `${title} between ${p1.name} (${p1.branch}) and ${p2.name} (${p2.branch}). ${sig}`,
            significanceHi: `${p1.name} (${p1.branch}) और ${p2.name} (${p2.branch}) के मध्य ${title}। परिवर्तन व गतिशीलता।`,
          });
        }
      }
    }
  }

  // 2. Six Harmonies (六合)
  const harmonies: [BranchName, BranchName, FiveElement, string][] = [
    ['Zi', 'Chou', 'Earth', 'Zi-Chou Combination (子丑合土) -> Earth'],
    ['Yin', 'Hai', 'Wood', 'Yin-Hai Combination (寅亥合木) -> Wood'],
    ['Mao', 'Xu', 'Fire', 'Mao-Xu Combination (卯戌合火) -> Fire'],
    ['Chen', 'You', 'Metal', 'Chen-You Combination (辰酉合金) -> Metal'],
    ['Si', 'Shen', 'Water', 'Si-Shen Combination (巳申合水) -> Water'],
    ['Wu', 'Wei', 'Fire', 'Wu-Wei Combination (午未合火) -> Fire'],
  ];

  for (let i = 0; i < pillarsList.length; i++) {
    for (let j = i + 1; j < pillarsList.length; j++) {
      const p1 = pillarsList[i];
      const p2 = pillarsList[j];

      for (const [bA, bB, elem, title] of harmonies) {
        if (checkPair(p1.branch, p2.branch, [bA, bB])) {
          relationships.push({
            type: 'SIX_HARMONY',
            name: title,
            chineseName: title.split(' ')[0] || title,
            branchesInvolved: [p1.branch, p2.branch],
            pillarsInvolved: [p1.name, p2.name],
            formedElement: elem,
            significance: `${title} formed between ${p1.name} (${p1.branch}) and ${p2.name} (${p2.branch}). Promotes harmony and alliance.`,
            significanceHi: `${p1.name} (${p1.branch}) और ${p2.name} (${p2.branch}) के मध्य ${title}। सौहार्द एवं संयोजन।`,
          });
        }
      }
    }
  }

  // 3. Three Harmonies / Trines (三合)
  const trines: [BranchName, BranchName, BranchName, FiveElement, string][] = [
    ['Shen', 'Zi', 'Chen', 'Water', 'Shen-Zi-Chen Water Frame (申子辰三合水局)'],
    ['Hai', 'Mao', 'Wei', 'Wood', 'Hai-Mao-Wei Wood Frame (亥卯未三合木局)'],
    ['Yin', 'Wu', 'Xu', 'Fire', 'Yin-Wu-Xu Fire Frame (寅午戌三合火局)'],
    ['Si', 'You', 'Chou', 'Metal', 'Si-You-Chou Metal Frame (巳酉丑三合金局)'],
  ];

  const presentBranches = pillarsList.map((p) => p.branch);

  for (const [b1, b2, b3, elem, title] of trines) {
    if (presentBranches.includes(b1) && presentBranches.includes(b2) && presentBranches.includes(b3)) {
      relationships.push({
        type: 'THREE_HARMONY',
        name: title,
        chineseName: title.split(' ')[0] || title,
        branchesInvolved: [b1, b2, b3],
        pillarsInvolved: pillarsList.filter((p) => [b1, b2, b3].includes(p.branch)).map((p) => p.name),
        formedElement: elem,
        significance: `Full Three Harmonies Trine (${title}) formed in natal chart. Powerful influx of ${elem} element.`,
        significanceHi: `जन्मपत्री में पूर्ण त्रिकोण संयोजन (${title}) सिद्ध। ${elem} तत्व का प्रबल प्रवाह।`,
      });
    }
  }

  // 4. Three Punishments (三刑)
  const punishments: [BranchName, BranchName, string, string][] = [
    ['Yin', 'Si', 'Yin-Si Punishment', 'Ungrateful Punishment (恃势之刑); hidden friction, ambition clashes.'],
    ['Si', 'Shen', 'Si-Shen Punishment', 'Ungrateful Punishment (恃势之刑); relationship tension, adjustments.'],
    ['Chou', 'Wei', 'Chou-Wei Punishment', 'Bullying Punishment (无恩之刑); stubbornness, property friction.'],
    ['Chou', 'Xu', 'Chou-Xu Punishment', 'Bullying Punishment (无恩之刑); stubbornness, justice tests.'],
    ['Zi', 'Mao', 'Zi-Mao Punishment', 'Uncivilized Punishment (无礼之刑); boundary issues, emotional tests.'],
  ];

  for (let i = 0; i < pillarsList.length; i++) {
    for (let j = i + 1; j < pillarsList.length; j++) {
      const p1 = pillarsList[i];
      const p2 = pillarsList[j];

      for (const [bA, bB, title, sig] of punishments) {
        if (checkPair(p1.branch, p2.branch, [bA, bB])) {
          relationships.push({
            type: 'THREE_PUNISHMENT',
            name: title,
            chineseName: title,
            branchesInvolved: [p1.branch, p2.branch],
            pillarsInvolved: [p1.name, p2.name],
            significance: `${title} between ${p1.name} (${p1.branch}) and ${p2.name} (${p2.branch}). ${sig}`,
            significanceHi: `${p1.name} (${p1.branch}) और ${p2.name} (${p2.branch}) के मध्य ${title}।`,
          });
        }
      }
    }
  }

  return relationships;
}

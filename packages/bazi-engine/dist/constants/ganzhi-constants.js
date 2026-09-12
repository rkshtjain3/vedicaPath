export const HEAVENLY_STEMS = {
    Jia: { name: 'Jia', chinese: '甲', pinyin: 'Jiǎ', element: 'Wood', polarity: 'Yang' },
    Yi: { name: 'Yi', chinese: '乙', pinyin: 'Yǐ', element: 'Wood', polarity: 'Yin' },
    Bing: { name: 'Bing', chinese: '丙', pinyin: 'Bǐng', element: 'Fire', polarity: 'Yang' },
    Ding: { name: 'Ding', chinese: '丁', pinyin: 'Dīng', element: 'Fire', polarity: 'Yin' },
    Wu: { name: 'Wu', chinese: '戊', pinyin: 'Wù', element: 'Earth', polarity: 'Yang' },
    Ji: { name: 'Ji', chinese: '己', pinyin: 'Jǐ', element: 'Earth', polarity: 'Yin' },
    Geng: { name: 'Geng', chinese: '庚', pinyin: 'Gēng', element: 'Metal', polarity: 'Yang' },
    Xin: { name: 'Xin', chinese: '辛', pinyin: 'Xīn', element: 'Metal', polarity: 'Yin' },
    Ren: { name: 'Ren', chinese: '壬', pinyin: 'Rén', element: 'Water', polarity: 'Yang' },
    Gui: { name: 'Gui', chinese: '癸', pinyin: 'Guǐ', element: 'Water', polarity: 'Yin' },
};
export const STEM_ORDER = [
    'Jia',
    'Yi',
    'Bing',
    'Ding',
    'Wu',
    'Ji',
    'Geng',
    'Xin',
    'Ren',
    'Gui',
];
export const EARTHLY_BRANCHES = {
    Zi: {
        name: 'Zi',
        chinese: '子',
        pinyin: 'Zǐ',
        zodiacAnimal: 'Rat (鼠)',
        element: 'Water',
        polarity: 'Yang',
        hiddenStems: [
            { stem: HEAVENLY_STEMS.Gui, role: 'MAIN', percentageWeight: 100, tenGod: '' },
        ],
    },
    Chou: {
        name: 'Chou',
        chinese: '丑',
        pinyin: 'Chǒu',
        zodiacAnimal: 'Ox (牛)',
        element: 'Earth',
        polarity: 'Yin',
        hiddenStems: [
            { stem: HEAVENLY_STEMS.Ji, role: 'MAIN', percentageWeight: 60, tenGod: '' },
            { stem: HEAVENLY_STEMS.Gui, role: 'MIDDLE', percentageWeight: 30, tenGod: '' },
            { stem: HEAVENLY_STEMS.Xin, role: 'RESIDUAL', percentageWeight: 10, tenGod: '' },
        ],
    },
    Yin: {
        name: 'Yin',
        chinese: '寅',
        pinyin: 'Yín',
        zodiacAnimal: 'Tiger (虎)',
        element: 'Wood',
        polarity: 'Yang',
        hiddenStems: [
            { stem: HEAVENLY_STEMS.Jia, role: 'MAIN', percentageWeight: 60, tenGod: '' },
            { stem: HEAVENLY_STEMS.Bing, role: 'MIDDLE', percentageWeight: 30, tenGod: '' },
            { stem: HEAVENLY_STEMS.Wu, role: 'RESIDUAL', percentageWeight: 10, tenGod: '' },
        ],
    },
    Mao: {
        name: 'Mao',
        chinese: '卯',
        pinyin: 'Mǎo',
        zodiacAnimal: 'Rabbit (兔)',
        element: 'Wood',
        polarity: 'Yin',
        hiddenStems: [
            { stem: HEAVENLY_STEMS.Yi, role: 'MAIN', percentageWeight: 100, tenGod: '' },
        ],
    },
    Chen: {
        name: 'Chen',
        chinese: '辰',
        pinyin: 'Chén',
        zodiacAnimal: 'Dragon (龙)',
        element: 'Earth',
        polarity: 'Yang',
        hiddenStems: [
            { stem: HEAVENLY_STEMS.Wu, role: 'MAIN', percentageWeight: 60, tenGod: '' },
            { stem: HEAVENLY_STEMS.Yi, role: 'MIDDLE', percentageWeight: 30, tenGod: '' },
            { stem: HEAVENLY_STEMS.Gui, role: 'RESIDUAL', percentageWeight: 10, tenGod: '' },
        ],
    },
    Si: {
        name: 'Si',
        chinese: '巳',
        pinyin: 'Sì',
        zodiacAnimal: 'Snake (蛇)',
        element: 'Fire',
        polarity: 'Yin',
        hiddenStems: [
            { stem: HEAVENLY_STEMS.Bing, role: 'MAIN', percentageWeight: 60, tenGod: '' },
            { stem: HEAVENLY_STEMS.Wu, role: 'MIDDLE', percentageWeight: 30, tenGod: '' },
            { stem: HEAVENLY_STEMS.Geng, role: 'RESIDUAL', percentageWeight: 10, tenGod: '' },
        ],
    },
    Wu: {
        name: 'Wu',
        chinese: '午',
        pinyin: 'Wǔ',
        zodiacAnimal: 'Horse (马)',
        element: 'Fire',
        polarity: 'Yang',
        hiddenStems: [
            { stem: HEAVENLY_STEMS.Ding, role: 'MAIN', percentageWeight: 70, tenGod: '' },
            { stem: HEAVENLY_STEMS.Ji, role: 'MIDDLE', percentageWeight: 30, tenGod: '' },
        ],
    },
    Wei: {
        name: 'Wei',
        chinese: '未',
        pinyin: 'Wèi',
        zodiacAnimal: 'Goat (羊)',
        element: 'Earth',
        polarity: 'Yin',
        hiddenStems: [
            { stem: HEAVENLY_STEMS.Ji, role: 'MAIN', percentageWeight: 60, tenGod: '' },
            { stem: HEAVENLY_STEMS.Ding, role: 'MIDDLE', percentageWeight: 30, tenGod: '' },
            { stem: HEAVENLY_STEMS.Yi, role: 'RESIDUAL', percentageWeight: 10, tenGod: '' },
        ],
    },
    Shen: {
        name: 'Shen',
        chinese: '申',
        pinyin: 'Shēn',
        zodiacAnimal: 'Monkey (猴)',
        element: 'Metal',
        polarity: 'Yang',
        hiddenStems: [
            { stem: HEAVENLY_STEMS.Geng, role: 'MAIN', percentageWeight: 60, tenGod: '' },
            { stem: HEAVENLY_STEMS.Ren, role: 'MIDDLE', percentageWeight: 30, tenGod: '' },
            { stem: HEAVENLY_STEMS.Wu, role: 'RESIDUAL', percentageWeight: 10, tenGod: '' },
        ],
    },
    You: {
        name: 'You',
        chinese: '酉',
        pinyin: 'Yǒu',
        zodiacAnimal: 'Rooster (鸡)',
        element: 'Metal',
        polarity: 'Yin',
        hiddenStems: [
            { stem: HEAVENLY_STEMS.Xin, role: 'MAIN', percentageWeight: 100, tenGod: '' },
        ],
    },
    Xu: {
        name: 'Xu',
        chinese: '戌',
        pinyin: 'Xū',
        zodiacAnimal: 'Dog (狗)',
        element: 'Earth',
        polarity: 'Yang',
        hiddenStems: [
            { stem: HEAVENLY_STEMS.Wu, role: 'MAIN', percentageWeight: 60, tenGod: '' },
            { stem: HEAVENLY_STEMS.Xin, role: 'MIDDLE', percentageWeight: 30, tenGod: '' },
            { stem: HEAVENLY_STEMS.Ding, role: 'RESIDUAL', percentageWeight: 10, tenGod: '' },
        ],
    },
    Hai: {
        name: 'Hai',
        chinese: '亥',
        pinyin: 'Hài',
        zodiacAnimal: 'Pig (猪)',
        element: 'Water',
        polarity: 'Yin',
        hiddenStems: [
            { stem: HEAVENLY_STEMS.Ren, role: 'MAIN', percentageWeight: 70, tenGod: '' },
            { stem: HEAVENLY_STEMS.Jia, role: 'MIDDLE', percentageWeight: 30, tenGod: '' },
        ],
    },
};
export const BRANCH_ORDER = [
    'Zi',
    'Chou',
    'Yin',
    'Mao',
    'Chen',
    'Si',
    'Wu',
    'Wei',
    'Shen',
    'You',
    'Xu',
    'Hai',
];
/**
 * Five Tiger Seek Method (五虎遁): Determines the Month Stem starting from Yin (寅) Month
 * based on the Year Heavenly Stem.
 */
export const FIVE_TIGER_SEEK_START = {
    Jia: 'Bing',
    Ji: 'Bing',
    Yi: 'Wu',
    Geng: 'Wu',
    Bing: 'Geng',
    Xin: 'Geng',
    Ding: 'Ren',
    Ren: 'Ren',
    Wu: 'Jia',
    Gui: 'Jia',
};
/**
 * Five Rat Seek Method (五鼠遁): Determines the Zi Hour (子时) Stem
 * based on the Day Heavenly Stem.
 */
export const FIVE_RAT_SEEK_START = {
    Jia: 'Jia',
    Ji: 'Jia',
    Yi: 'Bing',
    Geng: 'Bing',
    Bing: 'Wu',
    Xin: 'Wu',
    Ding: 'Geng',
    Ren: 'Geng',
    Wu: 'Ren',
    Gui: 'Ren',
};
export const ELEMENT_GENERATING_CYCLE = {
    Wood: 'Fire',
    Fire: 'Earth',
    Earth: 'Metal',
    Metal: 'Water',
    Water: 'Wood',
};
export const ELEMENT_CONTROLLING_CYCLE = {
    Wood: 'Earth',
    Earth: 'Water',
    Water: 'Fire',
    Fire: 'Metal',
    Metal: 'Wood',
};

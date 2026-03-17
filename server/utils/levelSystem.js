const BASE_LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  450,    // Level 4
  700,    // Level 5
  1000,   // Level 6
  1350,   // Level 7
  1750,   // Level 8
  2200,   // Level 9
  2700,   // Level 10
  3250,   // Level 11
  3850,   // Level 12
  4500,   // Level 13
  5200,   // Level 14
  5950,   // Level 15
  6750,   // Level 16
  7600,   // Level 17
  8500,   // Level 18
  9450,   // Level 19
  10450,  // Level 20
  11500,  // Level 21
  12600,  // Level 22
  13750,  // Level 23
  14950,  // Level 24
  16200,  // Level 25
  17500,  // Level 26
  18850,  // Level 27
  20250,  // Level 28
  21700,  // Level 29
  23200   // Level 30
];

// Note: For level 31+: use formula for infinite progression

export const getXPForLevel = (level) => {
    if (level <=30) {
        return BASE_LEVEL_THRESHOLDS[level-1] || 0;
    }

    // Level 31+
    // Formula: XP = 23200 + (level - 30) * 1500 + ((level - 30) * (level - 29) / 2) * 50

    const levelsAbove30 = level - 30;
    const baseXP = 23200;
    const lineaerGrowth = levelsAbove30 * 1500;
    const exponentialGrowth = (levelsAbove30 * (levelsAbove30 + 1) / 2) * 50;

    return baseXP + lineaerGrowth + exponentialGrowth;
};

export const calculateLevel = (xp) => {
    if (xp < 0) return 1;

    for (let i=BASE_LEVEL_THRESHOLDS.length-1; i>=0; i--) {
        if (xp >= BASE_LEVEL_THRESHOLDS[i]) {
            return i + 1;
        }
    }

    if (xp >= 23200) {
        let level = 30;

        while (getXPForLevel(level + 1) <= xp) {
            level++;
            if (level > 10000) break;
        }

        return level;
    }

    return 1;
};

export const getXPForNextLevel = (currentLevel) => {
    return getXPForLevel(currentLevel + 1);
};

export const getXPForCurrentLevel = (currentLevel) => {
    return getXPForLevel(currentLevel);
};

export const getLevelProgress = (currentXP, currentLevel) => {
    const currentLevelXP = getXPForCurrentLevel(currentLevel);
    const nextLevelXP = getXPForNextLevel(currentLevel);
    const xpIntoLevel = currentXP - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;

    return Math.min(100, Math.max(0, (xpIntoLevel / xpNeededForLevel) * 100));
};

export const getXPToNextLevel = (currentXP, currentLevel) => {
    const nextLevelXP = getXPForNextLevel(currentLevel);
    return Math.max(0, nextLevelXP - currentXP);
};

export const getMilestones = () => {
    return [
        { level: 5, xp: getXPForLevel(5), name: 'Mid' },
        { level: 10, xp: getXPForLevel(10), name: 'Minimalist' },
        { level: 15, xp: getXPForLevel(15), name: 'Gamer' },
        { level: 20, xp: getXPForLevel(20), name: 'IMSane' },
        { level: 25, xp: getXPForLevel(25), name: 'Super' },
        { level: 30, xp: getXPForLevel(30), name: 'Boomer' },
        { level: 50, xp: getXPForLevel(50), name: 'Free Bird' },
        { level: 75, xp: getXPForLevel(75), name: 'Legend' },
        { level: 100, xp: getXPForLevel(100), name: 'Unemployed employee' }
    ];
};

export const calculateLevelFromXP = (xp) => {
    return calculateLevel(xp);
};

export default {
    calculateLevel,
    getXPForLevel,
    getXPForNextLevel,
    getXPForCurrentLevel,
    getLevelProgress,
    getXPToNextLevel,
    getMilestones,
    calculateLevelFromXP
};
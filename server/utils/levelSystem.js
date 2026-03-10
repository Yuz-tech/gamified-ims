const LEVEL_THRESHOLDS = [
    0,
    100,
    250,
    450,
    700,
    1000,
    1350,
    1750,
    2200,
    2700,
    3250,
    3850,
    4500,
];

export const calculateLevel = (xp) => {
    let level = 1;

    for(let i=LEVEL_THRESHOLDS.length - 1; i>=0; i--) {
        if (xp >= LEVEL_THRESHOLDS[i]) {
            level = i + 1;
            break;
        }
    }

    return level;
};

// XP required for next level
export const getXPForNextLevel = (currentLevel) => {
    if (currentLevel >= LEVEL_THRESHOLDS.length) {
        const lastThreshold = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
        const increment = 1300 + (currentLevel - LEVEL_THRESHOLDS.length) * 150;
        return lastThreshold + increment;
    }
    return LEVEL_THRESHOLDS[currentLevel];
};

// XP required for current level
export const getXPForCurrentLevel = (currentLevel) => {
    if (currentLevel <= 1 ) return 0;
    return LEVEL_THRESHOLDS[currentLevel - 1] || 0;
};

// Progress percentage to next level
export const getLevelProgress = (xp, currentLevel) => {
    const currentLevelXP = getXPForCurrentLevel(currentLevel);
    const nextLevelXP = getXPForNextLevel(currentLevel);
    const xpIntoLevel = xp - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;

    return Math.min(100, Math.max(0, (xpIntoLevel / xpNeededForLevel) * 100));
};

export default {
    calculateLevel,
    getXPForNextLevel,
    getXPForCurrentLevel,
    getLevelProgress,
    LEVEL_THRESHOLDS
};
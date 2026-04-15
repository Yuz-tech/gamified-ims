export const getLevelTitle = (level) => {
    if (level >= 25) return 'IMS Prime';
    if (level >= 20) return 'Fated';
    if (level >= 15) return 'Cultured';
    if (level >= 10) return 'Elite';
    return 'noob';
};

export const getAllLevelTitles = () => {
    return [
        { minLevel: 1, maxLevel: 9, title: 'Noob', color: '#94a3b8' },
        { minLevel: 10, maxLevel: 14, title: 'Elite', color: '#3b82f6' },
        { minLevel: 15, maxLevel: 19, title: 'Cultured', color: '#8b5cf6' },
        { minLevel: 20, maxLevel: 24, title: 'Fated', color: '#f59e0b' },
        { minLevel: 25, maxLevel: 999, title: 'IMS Prime', color: '#ef4444' }
    ];
};

export const getLevelTitleColor = (level) => {
    const titles = getAllLevelTitles();
    const titleInfo = titles.find(t => level >= t.minLevel && level <= t.maxLevel);
    return titleInfo ? titleInfo.color : '#94a3b8';
};
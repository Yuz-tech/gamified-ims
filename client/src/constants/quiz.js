export const QUIZ_CONSTANTS = {
    MANDATORY_XP: 100,
    BONUS_XP_PER_QUESTION: 50,
    TOTAL_QUESTIONS: 5,
    MANDATORY_QUESTIONS: 1,
    BONUS_QUESTIONS: 4,
    AUTO_REDIRECT_DELAY: 3000,
    CAROUSEL_INTERVAL: 4500
};

export const XP_RANGES = {
    MIN: 100,
    MAX: 300
};

export const QUIZ_STAGES = {
    IDLE: null,
    MANDATORY: 'mandatory',
    DECISION: 'decision',
    BONUS: 'bonus',
    REVIEW: 'review'
};
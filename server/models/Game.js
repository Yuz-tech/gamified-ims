import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['crossword', 'quick_quiz', 'word_scramble'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    relatedTopics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    }],
    xpReward: {
        type: Number,
        default: 50
    },
    timeLimit: {
        type: Number,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }, 
    playCount: {
        type: Number,
        default: 0
    },
    averageScore: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Game = mongoose.model('Game', gameSchema);

export default Game;
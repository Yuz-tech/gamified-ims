import mongoose, { mongo } from 'mongoose';

const gameProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    score: {
        type: Number,
        default: 0
    },
    timeSpent: {
        type: Number,
        default: 0
    },
    attempts: {
        type: Number,
        default: 0
    },
    lastPlayedAt: {
        type: Date,
        default: Date.now
    },
    bestScore: {
        type: Number,
        default: 0
    },
    xpEarned: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
gameProgressSchema.index({ userId: 1, gameId: 1}, { unique: true });

const GameProgress = mongoose.model('GameProgress', gameProgressSchema);

export default GameProgress;
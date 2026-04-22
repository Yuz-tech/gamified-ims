import mongoose, { mongo } from 'mongoose';

const gameCompletionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    timeSpent: {
        type: Number,
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    gameType: {
        type: String,
        required: true,
        enum: ['texttwist', 'wordle', 'quickquiz', 'hangman']
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    maxXP: {
        type: Number,
        default: 200
    },
    timeLimit: {
        type: Number,
        default: 0
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    completions: [gameCompletionSchema]
}, {
    timestamps: true
});

// Check user completed game
gameSchema.methods.hasUserCompleted = function(userId) {
    return this.completions.some(
        completion => completion.userId.toString() === userId.toString()
    );
};

// add completion
gameSchema.methods.addCompletion = function(userId, score, timeSpent) {
    this.completions.push({
        userId,
        score,
        timeSpent
    });
    return this.save();
};

export default mongoose.model('Game', gameSchema);
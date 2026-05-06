import mongoose, { mongo } from 'mongoose';

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
        required: true,
        enum: ['easy', 'medium', 'hard']
    },
    timeLimit: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    completions: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        score: Number,
        timeSpent: Number,
        completedAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Check if user completed a specific game
gameSchema.methods.hasUserCompleted = function(userId) {
    if (!userId) return false;
    if (!this.completions || !Array.isArray(this.completions)) {
        return false;
    }
    return this.completions.some(
        completion => completion.userId && completion.userId.toString() === userId.toString()
    );
};

// Add completion record
gameSchema.methods.addCompletion = function(userId, score, timeSpent) {
    if (this.completions) {
        this.completions = [];
    }

    this.completions.push({
        userId,
        score,
        timeSpent,
        completedAt: new Date()
    });

    return this.save();
};

gameSchema.virtual('completionCount').get(function() {
    return this.completions ? this.completions.length : 0;
});

gameSchema.set('toJSON', { virtuals: true });
gameSchema.set('toObject', { virtuals: true });

const Game = mongoose.model('Game', gameSchema);

export default Game;
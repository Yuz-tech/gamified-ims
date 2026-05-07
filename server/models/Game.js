import mongoose from 'mongoose';

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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Game = mongoose.model('Game', gameSchema);

export default Game;
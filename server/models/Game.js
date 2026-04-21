import mongoose from "mongoose";
import { isAdmin } from "../middleware/auth.js";

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
        enum: ['crossword', 'wordle', 'quickquiz']
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
    }
}, {
    timestamps: true
});

export default mongoose.model('Game', gameSchema);
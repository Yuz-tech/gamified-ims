import mongoose from 'mongoose';

const Game = new mongoose.Schema({
  name: { type: String, required: [true, 'Game name required'], trim: true, maxlength: 50 },
  slug: { type: String, required: [true, 'Game slug required'], unique: true, lowercase: true, trim: true },
  description: String,
  thumbnail: String,
  
  configs: [{
    title: { type: String, required: true, trim: true },
    gameType: {
      type: String,
      enum: ['miniquiz', 'wordle', 'hangman', 'texttwist'],
      required: true
    },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    
    // Game data - ONLY required for matching gameType
    data: {
      wordle: {
        targetWord: { type: String, uppercase: true, match: /^[A-Z]{5}$/ }, // Remove required
        maxGuesses: { type: Number, default: 5 }
      },
      hangman: {
        targetWord: String, // Remove required
        maxWrong: { type: Number, default: 6 },
        hint: String
      },
      texttwist: {
        scrambledLetters: { type: String, uppercase: true }, // Remove required
        validWords: [String]
      },
      miniquiz: {
        questions: [{
          question: String,
          options: [String],
          correctAnswer: String
        }]
      }
    }
  }],
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

Game.index({ slug: 1 });
Game.index({ 'configs.gameType': 1 });
Game.index({ 'configs.topicId': 1 });

export default mongoose.model('Game', Game);
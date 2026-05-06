// seedGames.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Game from './models/Game.js'; // adjust path if needed

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ MONGO_URI is not defined. Please set it in your .env file.');
  process.exit(1);
}

const games = [
  {
    title: 'Hangman',
    description: 'Guess IMS-related terms before the hangman is complete!',
    gameType: 'hangman',
    difficulty: 'easy',
    timeLimit: 0,
    isActive: true,
    content: {
      word: 'AUDIT',
    },
  },
  {
    title: 'Wordle',
    description: 'Guess the hidden IMS word in 6 tries.',
    gameType: 'wordle',
    difficulty: 'medium',
    timeLimit: 0,
    isActive: true,
    content: {
      word: 'ISO',
    },
  },
  {
    title: 'TextTwist',
    description: 'Form as many IMS-related words as possible from the given letters.',
    gameType: 'texttwist',
    difficulty: 'hard',
    timeLimit: 0,
    isActive: true,
    content: {
      letters: 'QUALITY',
      words: ['LAY', 'QUIT', 'QUALITY', 'TAIL', 'LIT'],
    },
  },
  {
    title: 'QuickQuiz',
    description: 'Answer IMS awareness questions before time runs out!',
    gameType: 'quickquiz',
    difficulty: 'medium',
    timeLimit: 60, // e.g. 60 seconds per quiz
    isActive: true,
    content: {
      questions: [
        {
          question: 'What does IMS stand for in corporate compliance?',
          options: [
            'Integrated Management System',
            'International Marketing Strategy',
            'Internal Monitoring Software',
            'Information Management Suite',
          ],
          answer: 'Integrated Management System',
        },
        {
          question: 'Which ISO standard focuses on Quality Management?',
          options: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO 27001'],
          answer: 'ISO 9001',
        },
        {
          question: 'Which IMS principle emphasizes continuous improvement?',
          options: ['Plan-Do-Check-Act', 'Top-down control', 'One-time audit', 'Reactive response'],
          answer: 'Plan-Do-Check-Act',
        },
      ],
    },
  },
];

const seed = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');

    await Game.deleteMany({});
    console.log('Cleared existing games');

    await Game.insertMany(games);
    console.log('🌱 Seeded IMS Awareness games successfully');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();

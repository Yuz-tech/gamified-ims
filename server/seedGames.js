import mongoose from 'mongoose';
import Game from './models/Game.js';
import dotenv from 'dotenv';

dotenv.config();

const seedGames = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('❌ MONGODB_URI not found');

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    await Game.deleteMany({});
    console.log('🗑️ Cleared games');

    // Simple structure - ONLY populate matching gameType fields
    const gamesData = [
      // WORDLE GAMES
      {
        name: 'IMS Wordle',
        slug: 'ims-wordle',
        configs: [{
          title: 'Risk Management',
          gameType: 'wordle',
          topicId: new mongoose.Types.ObjectId(),
          data: { wordle: { targetWord: 'RISKS' } }
        }]
      },
      // HANGMAN GAMES  
      {
        name: 'IMS Hangman',
        slug: 'ims-hangman',
        configs: [{
          title: 'Emergency Drill',
          gameType: 'hangman',
          topicId: new mongoose.Types.ObjectId(),
          data: { hangman: { targetWord: 'EVACUATE' } }
        }]
      },
      // TEXT TWIST
      {
        name: 'IMS Text Twist',
        slug: 'ims-texttwist',
        configs: [{
          title: 'Safety Terms',
          gameType: 'texttwist',
          topicId: new mongoose.Types.ObjectId(),
          data: { 
            texttwist: { 
              scrambledLetters: 'SAFETY',
              validWords: ['SAFE', 'FATE', 'FEAST', 'YES'] 
            } 
          }
        }]
      },
      // MINI QUIZ
      {
        name: 'IMS Mini Quiz',
        slug: 'ims-miniquiz',
        configs: [{
          title: 'PPE Knowledge',
          gameType: 'miniquiz',
          topicId: new mongoose.Types.ObjectId(),
          data: {
            miniquiz: {
              questions: [{
                question: 'PPE stands for?',
                options: ['Personal Protective Equipment', 'Public Property Enforcement'],
                correctAnswer: 'Personal Protective Equipment'
              }]
            }
          }
        }]
      }
    ];

    const createdGames = await Game.insertMany(gamesData);
    console.log(`✅ Seeded ${createdGames.length} IMS games! 🎓`);

    console.log('\n🌐 Test URLs:');
    createdGames.forEach(game => {
      console.log(`   /games/${game.configs[0].gameType}/${game.slug}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedGames();
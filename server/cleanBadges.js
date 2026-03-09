import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanBadges = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Remove all badges from all users (they'll earn them again)
    const result = await User.updateMany(
      {},
      { 
        $set: { 
          badges: [],
          completedTopics: [],
          xp: 0,
          level: 1
        } 
      }
    );

    console.log('✅ Cleaned up user data');
    console.log('Users updated:', result.modifiedCount);
    console.log('\nAll users reset to:');
    console.log('  - XP: 0');
    console.log('  - Level: 1');
    console.log('  - Badges: []');
    console.log('  - Completed Topics: []');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

cleanBadges();
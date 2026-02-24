import mongoose from 'mongoose';
import Badge from './models/Badge.js';
import dotenv from 'dotenv';

dotenv.config();

const checkBadges = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const badges = await Badge.find().populate('topicId');
    
    console.log(`📊 Found ${badges.length} badges:\n`);
    
    badges.forEach((badge, index) => {
      console.log(`${index + 1}. ${badge.name}`);
      console.log(`   Image URL: ${badge.imageUrl}`);
      console.log(`   Topic: ${badge.topicId?.title || 'N/A'}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkBadges();
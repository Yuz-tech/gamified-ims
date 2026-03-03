import mongoose from 'mongoose';
import Topic from './models/Topic.js';
import Badge from './models/Badge.js';
import User from './models/User.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const seedData = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const badgesDir = path.join(__dirname, 'uploads', 'badges');
    let badgeImages = [];
  

    // Clear existing data
    await Topic.deleteMany({});
    await Badge.deleteMany({});

    // Create Topic 1: Introduction to IMS
    const topic1 = await Topic.create({
      title: 'ISO 9001',
      description: 'Learn the fundamentals of ISO 9001',
      documentUrl: 'https://google.com/',
      videoUrl: 'https://youtube.com/',
      order: 1,
      questions: [
        {
          question: 'What is ISO 9001 all about?',
          options: [
            'Environment',
            'Programming',
            'Quality',
            'Bread and Circuses'
          ],
          correctAnswer: 2,
          explanation: 'ISO 9001 focuses on quality',
          isMandatory: true
        },

        {
          question: 'What is 9+10?',
          options: [
            '21',
            '19',
            '43',
            '631'
          ],
          correctAnswer: 1,
          explanation: 'The answer is not 21',
          isMandatory: false
        },
        {
          question: 'What is 10+10?',
          options: [
            '20',
            '19',
            '43',
            '631'
          ],
          correctAnswer: 0,
          explanation: 'The answer is not 21',
          isMandatory: false
        },
        {
          question: 'What is 9+9?',
          options: [
            '21',
            '18',
            '43',
            '631'
          ],
          correctAnswer: 1,
          explanation: 'The answer is not 21',
          isMandatory: 1
        },
        {
          question: 'What is six hundo therdy wan?',
          options: [
            '21',
            '19',
            '43',
            '631'
          ],
          correctAnswer: 3,
          explanation: 'The answer is not 21',
          isMandatory: false
        },
      ],
      isActive: true
    });

    // Check/Create Admin User
    console.log('Checking admin user...');
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@imsarcade.com',
        password: 'admin123',
        role: 'admin',
        isApproved: true
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    // Check/Create Employee User
    console.log('Checking employee user...');
    const employeeExists = await User.findOne({ username: 'employee' });
    if (!employeeExists) {
      await User.create({
        username: 'employee',
        email: 'employee@imsarcade.com',
        password: 'employee123',
        role: 'employee',
        isApproved: true
      });
      console.log('Employee user created');
    } else {
      // Make sure employee is approved
      if (!employeeExists.isApproved) {
        employeeExists.isApproved = true;
        await employeeExists.save();
        console.log('Employee user approved');
      } else {
        console.log('Employee user already exists');
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\nERROR SEEDING DATA:');
    console.error(error);
    process.exit(1);
  }
};

seedData();
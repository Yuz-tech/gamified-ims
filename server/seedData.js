import mongoose from 'mongoose';
import Topic from './models/Topic.js';
import Badge from './models/Badge.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Topic.deleteMany({});
    await Badge.deleteMany({});

    // Create Topic 1
    const topic1 = await Topic.create({
      title: 'Introduction to IMS',
      description: 'Learn the fundamentals of Integrated Management Systems',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoDuration: 180,
      order: 1,
      xpReward: 100,
      passingScore: 70,
      questions: [
        {
          question: 'What does IMS stand for?',
          options: [
            'Integrated Management System',
            'Information Management System',
            'Internal Monitoring System',
            'Industrial Manufacturing Standard'
          ],
          correctAnswer: 0,
          points: 25
        },
        {
          question: 'Which standards are commonly integrated in IMS?',
          options: [
            'ISO 9001, ISO 14001, ISO 45001',
            'ISO 27001, ISO 22000',
            'ISO 50001, ISO 31000',
            'All of the above'
          ],
          correctAnswer: 3,
          points: 25
        },
        {
          question: 'What is the main benefit of IMS?',
          options: [
            'Cost reduction',
            'Improved efficiency',
            'Single audit process',
            'All of the above'
          ],
          correctAnswer: 3,
          points: 25
        },
        {
          question: 'IMS helps organizations to:',
          options: [
            'Meet regulatory requirements',
            'Improve customer satisfaction',
            'Reduce environmental impact',
            'All of the above'
          ],
          correctAnswer: 3,
          points: 25
        }
      ],
      isActive: true
    });

    // Create Topic 2
    const topic2 = await Topic.create({
      title: 'Quality Management',
      description: 'Understanding ISO 9001 and quality principles',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoDuration: 240,
      order: 2,
      xpReward: 150,
      passingScore: 75,
      questions: [
        {
          question: 'What is ISO 9001?',
          options: [
            'Environmental management standard',
            'Quality management standard',
            'Safety management standard',
            'Information security standard'
          ],
          correctAnswer: 1,
          points: 20
        },
        {
          question: 'What does PDCA cycle stand for?',
          options: [
            'Plan, Do, Check, Act',
            'Prepare, Deliver, Control, Analyze',
            'Process, Define, Create, Approve',
            'Plan, Design, Construct, Audit'
          ],
          correctAnswer: 0,
          points: 20
        },
        {
          question: 'Customer focus is a principle of:',
          options: [
            'ISO 14001',
            'ISO 45001',
            'ISO 9001',
            'ISO 27001'
          ],
          correctAnswer: 2,
          points: 20
        },
        {
          question: 'Continuous improvement is also known as:',
          options: [
            'Kaizen',
            'Six Sigma',
            'Lean',
            'All of the above'
          ],
          correctAnswer: 0,
          points: 20
        },
        {
          question: 'Internal audits are conducted to:',
          options: [
            'Punish employees',
            'Find non-conformities',
            'Ensure compliance',
            'Both B and C'
          ],
          correctAnswer: 3,
          points: 20
        }
      ],
      isActive: true
    });

    // Create Topic 3
    const topic3 = await Topic.create({
      title: 'Environmental Management',
      description: 'Learn about ISO 14001 and environmental responsibility',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoDuration: 200,
      order: 3,
      xpReward: 150,
      passingScore: 70,
      questions: [
        {
          question: 'What is ISO 14001?',
          options: [
            'Quality standard',
            'Environmental management standard',
            'Safety standard',
            'IT security standard'
          ],
          correctAnswer: 1,
          points: 25
        },
        {
          question: 'EMS stands for:',
          options: [
            'Emergency Management System',
            'Environmental Monitoring Service',
            'Environmental Management System',
            'Energy Management Standard'
          ],
          correctAnswer: 2,
          points: 25
        },
        {
          question: 'Which is NOT a typical environmental aspect?',
          options: [
            'Waste generation',
            'Employee satisfaction',
            'Energy consumption',
            'Water usage'
          ],
          correctAnswer: 1,
          points: 25
        },
        {
          question: 'Life cycle thinking considers:',
          options: [
            'Product development only',
            'Manufacturing only',
            'Disposal only',
            'All stages of product life'
          ],
          correctAnswer: 3,
          points: 25
        }
      ],
      isActive: true
    });

    // Create Badges
    const badge1 = await Badge.create({
      name: 'IMS Beginner',
      description: 'Completed Introduction to IMS',
      imageUrl: '🎖️',
      topicId: topic1._id
    });

    const badge2 = await Badge.create({
      name: 'Quality Master',
      description: 'Mastered Quality Management',
      imageUrl: '🏅',
      topicId: topic2._id
    });

    const badge3 = await Badge.create({
      name: 'Eco Warrior',
      description: 'Completed Environmental Management',
      imageUrl: '🌱',
      topicId: topic3._id
    });

    console.log('✅ Sample data created!');
    console.log('Topics:', [topic1.title, topic2.title, topic3.title]);
    console.log('Badges:', [badge1.name, badge2.name, badge3.name]);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedData();
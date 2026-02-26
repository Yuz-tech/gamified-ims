import mongoose from 'mongoose';
import Topic from './models/Topic.js';
import Badge from './models/Badge.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Topic.deleteMany({});
    await Badge.deleteMany({});

    const currentYear = new Date().getFullYear();

    // Create Topic 1
    const topic1 = await Topic.create({
      title: 'IS0 9001',
      description: 'Learn the fundamentals of ISO 9001',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoDuration: 300,
      order: 1,
      xpReward: 100,
      passingScore: 70,
      questions: [
        {
          question: 'What does IMS stand for?',
          options: [
            'Integrated Management System',
            'Information Management Service',
            'Internal Monitoring System',
            'International Management Standard'
          ],
          correctAnswer: 0,
          points: 20
        },
        {
          question: 'Which ISO standards are commonly integrated in an IMS?',
          options: [
            'ISO 9001, ISO 14001, ISO 45001',
            'ISO 27001 only',
            'ISO 22000 only',
            'ISO 50001, ISO 31000'
          ],
          correctAnswer: 0,
          points: 20
        },
        {
          question: 'What is the primary benefit of implementing an IMS?',
          options: [
            'Reduced documentation and audit efficiency',
            'Increased number of certifications',
            'More complex processes',
            'Separate management systems'
          ],
          correctAnswer: 0,
          points: 20
        },
        {
          question: 'An IMS helps organizations to:',
          options: [
            'Ignore regulatory requirements',
            'Meet multiple compliance requirements efficiently',
            'Avoid customer feedback',
            'Eliminate all risks'
          ],
          correctAnswer: 1,
          points: 20
        },
        {
          question: 'Which is NOT a benefit of IMS?',
          options: [
            'Streamlined processes',
            'Cost reduction',
            'Improved efficiency',
            'Increased complexity'
          ],
          correctAnswer: 3,
          points: 20
        }
      ],
      isActive: true
    });

    // Create Topic 2:
    const topic2 = await Topic.create({
      title: 'ISO 27001',
      description: 'Understanding ISO 27001',
      videoUrl: 'https://www.youtube.com/embed/wO7rWkVL3Es',
      videoDuration: 360,
      order: 2,
      xpReward: 100,
      passingScore: 70,
      questions: [
        {
          question: 'What is the focus of ISO 9001?',
          options: [
            'Environmental management',
            'Quality management',
            'Occupational health and safety',
            'Information security'
          ],
          correctAnswer: 1,
          explanation: 'ISO 9001 talks about quality',
          points: 15
        },
        {
          question: 'What does PDCA stand for in quality management?',
          options: [
            'Plan, Deliver, Check, Approve',
            'Plan, Do, Check, Act',
            'Prepare, Design, Create, Analyze',
            'Process, Define, Control, Audit'
          ],
          correctAnswer: 1,
          explanation: 'ISO 9001 talks about quality',
          points: 15
        },
        {
          question: 'Which is a key principle of ISO 9001?',
          options: [
            'Profit maximization',
            'Customer focus',
            'Cost reduction only',
            'Minimal documentation'
          ],
          correctAnswer: 1,
          explanation: 'ISO 9001 talks about quality',
          points: 15
        },
        {
          question: 'What is continuous improvement also known as?',
          options: [
            'Kaizen',
            'Innovation',
            'Revolution',
            'Transformation'
          ],
          correctAnswer: 0,
          explanation: 'ISO 9001 talks about quality',
          points: 15
        },
        {
          question: 'Internal audits in ISO 9001 are conducted to:',
          options: [
            'Punish employees',
            'Ensure compliance and identify improvements',
            'Create paperwork',
            'Satisfy management only'
          ],
          correctAnswer: 1,
          explanation: 'ISO 9001 talks about quality',
          points: 15
        },
        {
          question: 'Leadership commitment in ISO 9001 means:',
          options: [
            'Delegating all quality tasks',
            'Active involvement and accountability',
            'Ignoring quality issues',
            'Focusing only on profits'
          ],
          correctAnswer: 1,
          explanation: 'ISO 9001 talks about quality',
          points: 15
        },
        {
          question: 'Risk-based thinking in ISO 9001 requires:',
          options: [
            'Eliminating all risks',
            'Ignoring potential issues',
            'Identifying and addressing risks proactively',
            'Reacting after problems occur'
          ],
          correctAnswer: 2,
          explanation: 'ISO 9001 talks about quality',
          points: 10
        }
      ],
      isActive: true
    });

    // Create Topic 3
    const topic3 = await Topic.create({
      title: 'Environmental Management System (ISO 14001)',
      description: 'Learn about ISO 14001 and how organizations can minimize their environmental impact while improving sustainability.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoDuration: 320,
      order: 3,
      xpReward: 100,
      passingScore: 70,
      questions: [
        {
          question: 'What is the primary focus of ISO 14001?',
          options: [
            'Financial management',
            'Environmental management',
            'Human resources',
            'Information technology'
          ],
          correctAnswer: 1,
          explanation: 'ISO 9001 talks about quality',
          points: 20
        },
        {
          question: 'EMS stands for:',
          options: [
            'Emergency Management System',
            'Environmental Management System',
            'Energy Monitoring Service',
            'Efficiency Measurement Standard'
          ],
          correctAnswer: 1,
          explanation: 'ISO 9001 talks about quality',
          points: 20
        },
        {
          question: 'Which is an example of an environmental aspect?',
          options: [
            'Employee satisfaction',
            'Waste generation',
            'Sales revenue',
            'Customer complaints'
          ],
          correctAnswer: 1,
          explanation: 'ISO 9001 talks about quality',
          points: 20
        },
        {
          question: 'Life cycle thinking in ISO 14001 considers:',
          options: [
            'Only the manufacturing phase',
            'All stages from raw material to disposal',
            'Only the usage phase',
            'Only the disposal phase'
          ],
          correctAnswer: 1,
          explanation: 'ISO 9001 talks about quality',
          points: 20
        },
        {
          question: 'An organization\'s environmental policy should be:',
          options: [
            'Kept secret from employees',
            'Communicated to all stakeholders',
            'Changed daily',
            'Ignored in practice'
          ],
          correctAnswer: 1,
          explanation: 'ISO 9001 talks about quality',
          points: 20
        }
      ],
      isActive: true
    });

    // Create Badges

const badge1 = await Badge.create({
  name: 'Quality Foundation Master',
  description: 'Successfully completed ISO 9001',
  imageUrl: './uploads/badges/iso9001.png',
  topicId: topic1._id
});

const badge2 = await Badge.create({
  name: 'Security Champion',
  description: 'Mastered ISO 27001 principles',
  imageUrl: '/uploads/badges/iso9001.png',
  topicId: topic2._id
});

const badge3 = await Badge.create({
  name: 'QIS Guardian',
  description: 'Completed Quality and Information Security training',
  imageUrl: '/uploads/badges/environmental-guardian.png',
  topicId: topic3._id
});

    // Check/Create Admin User
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
    
    process.exit(0);
  } catch (error) {
    console.error('\nERROR SEEDING DATA:');
    console.error(error);
    process.exit(1);
  }
};

seedData();
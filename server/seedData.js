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
      title: 'ISO 9001',
      description: 'A standard for Quality Management Systems',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoDuration: 180,
      order: 1,
      xpReward: 100,
      passingScore: 75,
      questions: [
        {
          question: 'What is the aim of ISO 9001?',
          options: [
            'To help secure information systems',
            'To enhance information delivery to partner organizations',
            'To ensure quality in the delivery of products/services',
            'To strengthen stakeholder trust and communication'
          ],
          correctAnswer: 2,
          points: 25
        },
        {
          question: 'Which principle is not associated to ISO 9001?',
          options: [
            'Customer Focus',
            'Cryptography',
            'Process Approach',
            'All of the above'
          ],
          correctAnswer: 1,
          points: 25
        },
        {
          question: 'What is the main benefit of ISO 9001?',
          options: [
            'Compliance to Quality principles',
            'To satisfy customer wants',
            'Have a single audit process',
            'To secure information throughout the business'
          ],
          correctAnswer: 0,
          points: 25
        },
        {
          question: 'ISO 9001 helps organizations to:',
          options: [
            'Standardize processes',
            'Meeting customer needs',
            'Reduce cost',
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
      title: 'ISO 27001',
      description: 'Understanding information security compliance',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoDuration: 240,
      order: 2,
      xpReward: 150,
      passingScore: 75,
      questions: [
        {
          question: 'What is ISO 27001 about?',
          options: [
            'Environmental management standard',
            'Quality management standard',
            'Safety management standard',
            'Information security standard'
          ],
          correctAnswer: 3,
          points: 20
        },
        {
          question: 'Which of the following is NOT a key benefit of ISO 27001?',
          options: [
            'Risk, Mitigation, & Security',
            'Mitigate Security Threats',
            'Competitive Advantage',
            'Plan, Design, Construct, Audit'
          ],
          correctAnswer: 3,
          points: 20
        },
        {
          question: 'Which of the following is a key component of ISO 27001?',
          options: [
            'Risk Assessment',
            'Product Lifecycle management',
            'Customer Satisfaction Surveys',
            'Financial Auditing'
          ],
          correctAnswer: 0,
          points: 20
        },
        {
          question: 'Which principle is NOT directly addressed by ISO 27001',
          options: [
            'Confidentiality',
            'Profitability',
            'Availability',
            'Integrity'
          ],
          correctAnswer: 1,
          points: 20
        },
        {
          question: 'What document is central to ISO 27001 implementation?',
          options: [
            'Annual Financial Report',
            'Customer Service Charter',
            'Information Security Policy',
            'Environmental Impact Statement'
          ],
          correctAnswer: 2,
          points: 20
        }
      ],
      isActive: true
    });

    // Create Topic 3
    const topic3 = await Topic.create({
      title: 'Quality and Information Security',
      description: 'Learn on delivering high quality services while maintaining data CIA',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoDuration: 200,
      order: 3,
      xpReward: 150,
      passingScore: 80,
      questions: [
        {
          question: 'Which of the following is a principle of total quality management?',
          options: [
            'Focus on short-term profits',
            'Continuous improvement',
            'Limiting customer involvement',
            'Reducing employee participation'
          ],
          correctAnswer: 1,
          points: 20
        },
        {
          question: 'Which of the following is not part of the CIA triad?',
          options: [
            'Confidentiality',
            'Integrity',
            'Availability',
            'Accountability'
          ],
          correctAnswer: 3,
          points: 20
        },
        {
          question: 'Which type of attack involves tricking users into revealing sensitive information by pretending to be a trusted entity?',
          options: [
            'Phishing',
            'SQL Injection',
            'DDOS',
            'Malware'
          ],
          correctAnswer: 0,
          points: 20
        },
        {
          question: 'What is the main purpose of a risk assessment?',
          options: [
            'To ensure compliance with financial regulations',
            'To guarantee system availability',
            'To eliminate all risks',
            'To identify, evaluate, and prioritize risks'
          ],
          correctAnswer: 3,
          points: 20
        },
        {
          question: 'Which of the following is considered a preventive control?',
          options: [
            'Intrusion detection system',
            'Audit logs',
            'Security Awareness Training',
            'CCTV installation'
          ],
          correctAnswer: 2,
          points: 20
        },
      ],
      isActive: true
    });

    // Create Badges
    const badge1 = await Badge.create({
      name: 'IMS Beginner',
      description: 'ISO 9001',
      imageUrl: '../elements/badges/iso 9001.png',
      topicId: topic1._id
    });

    const badge2 = await Badge.create({
      name: 'IMS Novice',
      description: 'ISO 27001',
      imageUrl: '../elements/badges/iso 27001.png',
      topicId: topic2._id
    });

    const badge3 = await Badge.create({
      name: 'Quality Master',
      description: 'Quality and Information Security',
      imageUrl: '../elements/badges/quality and information security.png',
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
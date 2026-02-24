import mongoose from 'mongoose';
import Topic from './models/Topic.js';
import Badge from './models/Badge.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await Topic.deleteMany({});
    await Badge.deleteMany({});
    console.log('   ✓ Cleared topics and badges');

    const currentYear = new Date().getFullYear();

    // Create Topic 1: Introduction to IMS
    console.log('\n📝 Creating Topic 1: Introduction to IMS...');
    const topic1 = await Topic.create({
      title: 'Introduction to Integrated Management Systems',
      description: 'Learn the fundamentals of IMS and why integrated management systems are essential for modern organizations.',
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
    console.log('   ✅ Topic 1 created');

    // Create Topic 2: Quality Management (ISO 9001)
    console.log('📝 Creating Topic 2: Quality Management...');
    const topic2 = await Topic.create({
      title: 'Quality Management System (ISO 9001)',
      description: 'Understanding ISO 9001 quality management principles and how they drive organizational excellence.',
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
          points: 10
        }
      ],
      isActive: true
    });
    console.log('   ✅ Topic 2 created');

    // Create Topic 3: Environmental Management (ISO 14001)
    console.log('📝 Creating Topic 3: Environmental Management...');
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
          points: 20
        }
      ],
      isActive: true
    });
<<<<<<< HEAD

    // Create Topic 3
    const topic3 = await Topic.create({
      title: 'Quality and Information Security',
      description: 'Learn on delivering high quality services while maintaining data CIA',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoDuration: 200,
      order: 3,
      xpReward: 100,
      passingScore: 70,
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
      imageUrl: './uploads/badges/iso 9001.png',
      topicId: topic1._id
    });

    const badge2 = await Badge.create({
      name: 'IMS Novice',
      description: 'ISO 27001',
      imageUrl: './uploads/badges/iso 27001.png',
      topicId: topic2._id
    });
=======
    console.log('   ✅ Topic 3 created');

    // Create Badges
    // Create Badges with your actual PNG files
console.log('\n🏆 Creating badges...');

const badge1 = await Badge.create({
  name: 'IMS Foundation Master',
  description: 'Successfully completed Introduction to Integrated Management Systems',
  imageUrl: './uploads/badges/iso9001.png', // ← Replace with your actual filename
  topicId: topic1._id
});
console.log('   ✅ Badge 1: IMS Foundation Master');
>>>>>>> 89f8048d986123cee6cc49a2a072d2656ad05db4

const badge2 = await Badge.create({
  name: 'Quality Champion',
  description: 'Mastered Quality Management System (ISO 9001) principles',
  imageUrl: '/uploads/badges/iso9001.png', // ← Replace with your actual filename
  topicId: topic2._id
});
console.log('   ✅ Badge 2: Quality Champion');

const badge3 = await Badge.create({
  name: 'Environmental Guardian',
  description: 'Completed Environmental Management System (ISO 14001) training',
  imageUrl: '/uploads/badges/environmental-guardian.png', // ← Replace with your actual filename
  topicId: topic3._id
});
console.log('   ✅ Badge 3: Environmental Guardian');

    // Check/Create Admin User
    console.log('\n👤 Checking admin user...');
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@imsarcade.com',
        password: 'admin123',
        role: 'admin',
        isApproved: true
      });
      console.log('   ✅ Admin user created');
    } else {
      console.log('   ℹ️  Admin user already exists');
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('🎮 SEED DATA SUMMARY');
    console.log('='.repeat(60));
    console.log(`📚 Topics Created: ${await Topic.countDocuments()}`);
    console.log(`   1. ${topic1.title} (${topic1.questions.length} questions)`);
    console.log(`   2. ${topic2.title} (${topic2.questions.length} questions)`);
    console.log(`   3. ${topic3.title} (${topic3.questions.length} questions)`);
    console.log(`\n🏆 Badges Created: ${await Badge.countDocuments()}`);
    console.log(`   1. ${badge1.name}`);
    console.log(`   2. ${badge2.name}`);
    console.log(`   3. ${badge3.name}`);
    console.log(`\n👥 Users: ${await User.countDocuments()}`);
    console.log(`\n📅 Year: ${currentYear}`);
    console.log(`⚙️  Settings: 100 XP per topic, 70% passing score`);
    console.log('='.repeat(60));
    console.log('\n✅ Seed data created successfully!');
    console.log('🔐 Admin Login: username=admin, password=admin123');
    console.log('\n💡 TIP: Upload custom badge images via Admin → Badges\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR SEEDING DATA:');
    console.error(error);
    process.exit(1);
  }
};

seedData();
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

    // Check for badge images
    const badgesDir = path.join(__dirname, 'uploads', 'badges');
    let badgeImages = [];
    
    if (fs.existsSync(badgesDir)) {
      badgeImages = fs.readdirSync(badgesDir)
        .filter(file => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
        .map(file => `/uploads/badges/${file}`);
      
      console.log(`\n🎨 Found ${badgeImages.length} badge images in uploads folder`);
      badgeImages.forEach(img => console.log(`   - ${img}`));
    } else {
      console.log('\n⚠️  No uploads/badges folder found - using placeholder images');
    }

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await Topic.deleteMany({});
    await Badge.deleteMany({});
    console.log('   ✓ Cleared topics and badges');

    // Create Topic 1: Introduction to IMS
    console.log('\n📝 Creating Topic 1: Introduction to IMS...');
    const topic1 = await Topic.create({
      title: 'Introduction to Integrated Management Systems',
      description: 'Learn the fundamentals of IMS and why integrated management systems are essential for modern organizations.',
      documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
      videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
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
          explanation: 'IMS stands for Integrated Management System, which combines multiple management standards (like ISO 9001, ISO 14001, ISO 45001) into a single cohesive framework for improved efficiency.',
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
          explanation: 'The most commonly integrated standards are ISO 9001 (Quality), ISO 14001 (Environment), and ISO 45001 (Health & Safety) because they share similar management system structures and can be efficiently combined.',
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
          explanation: 'The primary benefit of IMS is reduced documentation and improved audit efficiency by combining multiple standards into one unified system, eliminating redundancy.',
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
          explanation: 'An IMS helps organizations meet multiple compliance requirements efficiently by integrating different management system requirements into a single framework.',
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
          explanation: 'Increased complexity is NOT a benefit - in fact, IMS reduces complexity by integrating multiple systems. The other options are all genuine benefits of implementing an IMS.',
          points: 20
        }
      ],
      isActive: true
    });
    console.log('   ✅ Topic 1 created');

    // Create Topic 2: Quality Management
    console.log('📝 Creating Topic 2: Quality Management...');
    const topic2 = await Topic.create({
      title: 'Quality Management System (ISO 9001)',
      description: 'Understanding ISO 9001 quality management principles and how they drive organizational excellence.',
      documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
      videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
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
          explanation: 'ISO 9001 focuses specifically on Quality Management Systems (QMS), helping organizations ensure they meet customer and regulatory requirements consistently.',
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
          explanation: 'PDCA stands for Plan, Do, Check, Act - also known as the Deming Cycle. It is a continuous improvement methodology central to ISO 9001.',
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
          explanation: 'Customer focus is one of the seven quality management principles of ISO 9001. Organizations should understand and meet customer requirements and strive to exceed expectations.',
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
          explanation: 'Kaizen is the Japanese term for continuous improvement - a philosophy of making small, incremental changes regularly to improve processes and quality.',
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
          explanation: 'Internal audits are a tool to verify compliance with ISO 9001 requirements and to identify opportunities for improvement in the quality management system.',
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
          explanation: 'Leadership must demonstrate active involvement, accountability, and commitment to the QMS. They must establish quality policy, ensure resources are available, and promote continuous improvement.',
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
          explanation: 'Risk-based thinking requires organizations to identify potential risks and opportunities proactively, then take action to address them before they become problems.',
          points: 10
        }
      ],
      isActive: true
    });
    console.log('   ✅ Topic 2 created');

    // Create Topic 3: Environmental Management
    console.log('📝 Creating Topic 3: Environmental Management...');
    const topic3 = await Topic.create({
      title: 'Environmental Management System (ISO 14001)',
      description: 'Learn about ISO 14001 and how organizations can minimize their environmental impact while improving sustainability.',
      documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
      videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
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
          explanation: 'ISO 14001 is the international standard for Environmental Management Systems (EMS), helping organizations minimize their environmental impact and comply with environmental regulations.',
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
          explanation: 'EMS stands for Environmental Management System - a framework that helps organizations manage their environmental responsibilities systematically.',
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
          explanation: 'An environmental aspect is an element of an organization\'s activities that can interact with the environment. Waste generation is a direct environmental aspect that organizations must manage.',
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
          explanation: 'Life cycle thinking requires considering all stages of a product or service - from raw material extraction through manufacturing, use, and end-of-life disposal or recycling.',
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
          explanation: 'The environmental policy must be communicated to all stakeholders including employees, customers, suppliers, and the public to demonstrate the organization\'s commitment to environmental management.',
          points: 20
        }
      ],
      isActive: true
    });
    console.log('   ✅ Topic 3 created');

    // Create Badges
    console.log('\n🏆 Creating badges...');
    
    const badge1 = await Badge.create({
      name: 'IMS Foundation Master',
      description: 'Successfully completed Introduction to Integrated Management Systems',
      imageUrl: badgeImages[0] || 'https://via.placeholder.com/256/1B3A6B/FFFFFF?text=IMS+Foundation',
      topicId: topic1._id
    });
    console.log(`   ✅ Badge 1: ${badge1.name} - ${badge1.imageUrl}`);

    const badge2 = await Badge.create({
      name: 'Quality Champion',
      description: 'Mastered Quality Management System (ISO 9001) principles',
      imageUrl: badgeImages[1] || 'https://via.placeholder.com/256/3B82F6/FFFFFF?text=Quality+Champion',
      topicId: topic2._id
    });
    console.log(`   ✅ Badge 2: ${badge2.name} - ${badge2.imageUrl}`);

    const badge3 = await Badge.create({
      name: 'Environmental Guardian',
      description: 'Completed Environmental Management System (ISO 14001) training',
      imageUrl: badgeImages[2] || 'https://via.placeholder.com/256/10B981/FFFFFF?text=Eco+Guardian',
      topicId: topic3._id
    });
    console.log(`   ✅ Badge 3: ${badge3.name} - ${badge3.imageUrl}`);

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

    // Check/Create Employee User
    console.log('👤 Checking employee user...');
    const employeeExists = await User.findOne({ username: 'employee' });
    if (!employeeExists) {
      await User.create({
        username: 'employee',
        email: 'employee@imsarcade.com',
        password: 'employee123',
        role: 'employee',
        isApproved: true
      });
      console.log('   ✅ Employee user created');
    } else {
      // Make sure employee is approved
      if (!employeeExists.isApproved) {
        employeeExists.isApproved = true;
        await employeeExists.save();
        console.log('   ✅ Employee user approved');
      } else {
        console.log('   ℹ️  Employee user already exists');
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR SEEDING DATA:');
    console.error(error);
    process.exit(1);
  }
};

seedData();
import mongoose from 'mongoose';
import Topic from './models/Topic.js';
import Badge from './models/Badge.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const seedTopic = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const badgesDir = path.join(__dirname, 'uploads', 'badges');
    let badgeImages = [];

    const topic4 = await Topic.create({
      title: 'Anti-Malware Policy',
      description: 'Learn the fundamentals anti malware policy',
      documentUrl: 'https://google.com/',
      videoUrl: 'https://youtube.com/',
      order: 1,
      questions: [
        {
          question: 'What is the primary purpose of an Anti-Malware Policy?',
          options: [
            'To prevent, detect, and respond to malware threats',
            'To prevent, detect, and respond to outsider threats',
            'To prevent, detect, and respond to hardware threats',
            'To install antivirus applications throughout the office'
          ],
          correctAnswer: 0,
          explanation: 'Anti-Malware Policy establishes guidelines for protecting systems agains malicious software.',
          isMandatory: true
        },

        {
          question: 'Which does NOT belong to the group?',
          options: [
            'software updates',
            'software patching',
            'software review',
            'software deployment'
          ],
          correctAnswer: 3,
          explanation: 'Updates, patching, and review ensures vulnerabilities are fixed, reducing the risk of malware infections.',
          isMandatory: false
        },
        {
          question: 'Which of the following statements is TRUE in Employee Awareness on Anti-Malware Policy?',
          options: [
            'Employees can identify suspicious activity and avoid risky behavior',
            'Employees are responsible for financial audits',
            'Employees manage environmental sustainability goals',
            'Employees determine product pricing'
          ],
          correctAnswer: 0,
          explanation: 'Training employees helps them recognize phishing attempts and malicious downloads.',
          isMandatory: false
        },
        {
          question: 'Which of the following does NOT belong to the Anti-Malware Policy?',
          options: [
            'Installing Antivirus Software',
            'Using Strong passwords',
            'Conducting regular malware scans',
            'Updating the OS'
          ],
          correctAnswer: 3,
          explanation: 'Clause 5 highlights leadership responsibility in establishing quality objectives.',
          isMandatory: 1
        },
        {
          question: 'What is one key benefit of ISO 9001?',
          options: [
            'Reduced Tax',
            'Improved Customer Satisfaction',
            'Exemption from legal compliance',
            'There are no benefits at all'
          ],
          correctAnswer: 1,
          explanation: 'ISO 9001 helps organizations deliver consisten quality, which builds trust and enhances customer satisfaction',
          isMandatory: false
        },
      ],
      isActive: true
    });

    const topic2 = await Topic.create({
      title: 'ISO 27001',
      description: 'Learn the fundamentals of ISO 27001',
      documentUrl: 'https://google.com/',
      videoUrl: 'https://youtube.com/',
      order: 2,
      questions: [
        {
          question: 'What is the main purpose of ISO 27001?',
          options: [
            'To regulate environmental practices',
            'To improve occupational health and safety',
            'To establish and Information Security Management System',
            'To manage product or service quality'
          ],
          correctAnswer: 2,
          explanation: 'ISO 27001 provides a framework for managing sensitive company information securely, ensuring confidentiality, integrity, and availability.',
          isMandatory: true
        },

        {
          question: 'Which of the following is a key principle of ISO 27001?',
          options: [
            'Risk-based approach',
            'Financial Auditing',
            'Stakeholder Satisfaction',
            'Proper waste reduction'
          ],
          correctAnswer: 0,
          explanation: 'ISO 27001 emphasizes identifying, assessing, and treating information security risks.',
          isMandatory: false
        },
        {
          question: 'What does Annex A of ISO 27001 contain?',
          options: [
            'Guidelines for quality assurance',
            'Requirements for leadership commitment',
            'Procedures for financial reporting',
            'A list of security controls'
          ],
          correctAnswer: 3,
          explanation: 'Annex A provides 114 controls grouped into 14 categories of a comprehensive list of security controls to mitigate security risks',
          isMandatory: false
        },
        {
          question: 'Which version of ISO 27001 is the latest?',
          options: [
            '2026',
            '2023',
            '2022',
            '1945'
          ],
          correctAnswer: 2,
          explanation: 'Clearly, the answer is not 1945. The most recent is ISO 27001:2022, aligning modern cybersecurity challenges with ISO/IEC 27002',
          isMandatory: 1
        },
        {
          question: 'What is one key benefit of ISO 9001?',
          options: [
            'Guaranteed increase in sales',
            'Reduced Tax',
            'Exemption from legal compliance',
            'Increased stakeholder trust'
          ],
          correctAnswer: 3,
          explanation: 'ISO 27001 builds security confidence among customers, partners, and regulators.',
          isMandatory: false
        },
      ],
      isActive: true
    });

    const topic3 = await Topic.create({
      title: 'QIS',
      description: 'Quality and Information Security',
      documentUrl: 'https://google.com/',
      videoUrl: 'https://youtube.com/',
      order: 3,
      questions: [
        {
          question: 'Which of the following best describes the relationship between quality and information security in an organization?',
          options: [
            'No relationship at all',
            'Quality ensures customer satisfaction, while Information Security protects sensitive data',
            'Quality focuses on financial audits, while Information Security focuses on data integrity',
            'Information Security is for keeping data safe in a secured infrastructure, while Quality is for keeping information in the best state'
          ],
          correctAnswer: 1,
          explanation: 'Quality ensures processes deliver consistency, while Information security safeguards sensitive information.',
          isMandatory: true
        },

        {
          question: 'Which standard focuses on quality management systems (QMS)?',
          options: [
            'ISO Certified World Class Quality Standard',
            'ISO 27001',
            'ISO 9001',
            'ISO PSP ROM'
          ],
          correctAnswer: 2,
          explanation: 'ISO 9001 is the international standard for QMS, ensuring organizations consistently meet customer and regulatory requirements.',
          isMandatory: false
        },
        {
          question: 'Which standard provides a framework for managing information security risks',
          options: [
            'ISO Certified World Class Quality Standard',
            'ISO 27001',
            'ISO 9001',
            'ISO PSP ROM'
          ],
          correctAnswer: 0,
          explanation: 'ISO 27001 establishes ISMS to protect confidentiality, integrity, and availability of information',
          isMandatory: false
        },
        {
          question: 'How can integrating ISO 9001 and 27001 be beneficial?',
          options: [
            'It aligns quality and security processes for efficiency',
            'It distinguishes quality from security to choose one over the other',
            'It eliminates the need for audits and reduces tax obligations',
            'You can only integrate one for it to be beneficial'
          ],
          correctAnswer: 0,
          explanation: 'Integration of ISO 9001 and 27001 helps streamline processes, reduce duplication, and ensure quality and security objectives are met consistently.',
          isMandatory: 1
        },
        {
          question: 'Which of the following principles is shared by ISO 9001 and 27001?',
          options: [
            'Environmental Sustainability',
            'Risk-based Thinking',
            'Financial Reporting Accuracy',
            'Product and Service Innovation'
          ],
          correctAnswer: 1,
          explanation: 'Both standards emphasize identifying and managing risks - ensuring proactive management.',
          isMandatory: false
        },
      ],
      isActive: true
    });
    
    process.exit(0);
  } catch (error) {
    console.error('\nERROR SEEDING DATA:');
    console.error(error);
    process.exit(1);
  }
};

seedTopic();
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Game from './models/Game.js';

dotenv.config();

const gamesData = [
  // ==================== CROSSWORD ====================
  {
    title: 'IMS Crossword Challenge',
    description: 'Test your IMS knowledge with this crossword puzzle',
    gameType: 'crossword',
    difficulty: 'medium',
    maxXP: 200,
    timeLimit: 0,
    content: {
      grid: [
        ['Q', 'U', 'A', 'L', 'I', 'T', 'Y', null, null, null],
        [null, null, 'U', null, null, null, null, null, null, null],
        [null, null, 'D', null, null, null, null, null, null, null],
        [null, null, 'I', null, null, null, null, null, null, null],
        ['P', 'R', 'O', 'C', 'E', 'S', 'S', null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        ['R', 'I', 'S', 'K', null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null]
      ],
      clues: {
        across: [
          { number: 1, row: 0, col: 0, answer: 'QUALITY', clue: 'ISO 9001 focuses on this management system (7)' },
          { number: 2, row: 4, col: 0, answer: 'PROCESS', clue: 'Set of interrelated activities that transform inputs to outputs (7)' },
          { number: 3, row: 7, col: 0, answer: 'RISK', clue: 'Effect of uncertainty on objectives (4)' }
        ],
        down: [
          { number: 1, row: 0, col: 2, answer: 'AUDIT', clue: 'Systematic examination to verify IMS effectiveness (5)' }
        ]
      }
    },
    isActive: true
  },
  
  // ==================== WORDLE ====================
  {
    title: 'IMS Word Puzzle',
    description: 'Guess the 5-letter IMS term in 6 tries',
    gameType: 'wordle',
    difficulty: 'medium',
    maxXP: 150,
    timeLimit: 0,
    content: {
      words: [
        { word: 'AUDIT', hint: 'Systematic examination' },
        { word: 'RISKS', hint: 'Uncertainties that affect objectives' },
        { word: 'SCOPE', hint: 'Boundaries of the management system' },
        { word: 'PDCA', hint: 'Plan-Do-Check-Act cycle (4 letters)' },
        { word: 'TRACE', hint: 'Ability to track something through records' },
        { word: 'VALID', hint: 'Confirmed through evidence' },
        { word: 'POLICY', hint: 'Statement of intent from management (6 letters)' },
        { word: 'METRIC', hint: 'Quantifiable measure of performance (6 letters)' }
      ]
    },
    isActive: true
  },
  
  // ==================== QUICK QUIZ ====================
  {
    title: 'IMS Speed Quiz',
    description: 'Answer as many questions correctly as you can in 2 minutes',
    gameType: 'quickquiz',
    difficulty: 'easy',
    maxXP: 200,
    timeLimit: 120, // 2 minutes
    content: {
      questions: [
        {
          question: 'What does IMS stand for?',
          options: [
            'Integrated Management System',
            'Internal Monitoring Service',
            'Information Management Software',
            'International Marketing Strategy'
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          question: 'What does PDCA stand for?',
          options: [
            'Plan-Design-Create-Approve',
            'Plan-Do-Check-Act',
            'Process-Document-Control-Audit',
            'Prepare-Deploy-Complete-Assess'
          ],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'What is the primary focus of ISO 9001?',
          options: [
            'Environmental Management',
            'Quality Management',
            'Information Security',
            'Health and Safety'
          ],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'What does CIA stand for in information security?',
          options: [
            'Central Intelligence Agency',
            'Confidentiality, Integrity, Availability',
            'Computer Information Access',
            'Critical Information Assets'
          ],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'What is a nonconformity?',
          options: [
            'A suggestion for improvement',
            'Non-fulfillment of a requirement',
            'A good practice',
            'An optional standard'
          ],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'What is the purpose of internal audits?',
          options: [
            'To punish employees',
            'To verify IMS effectiveness',
            'To create paperwork',
            'To satisfy external auditors only'
          ],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'What is corrective action?',
          options: [
            'Punishment for mistakes',
            'Action to eliminate cause of nonconformity',
            'Temporary fix',
            'Blame assignment'
          ],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'What is continual improvement?',
          options: [
            'One-time effort',
            'Recurring activity to enhance performance',
            'Random updates',
            'Annual review'
          ],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'What is risk-based thinking?',
          options: [
            'Ignoring all risks',
            'Considering risks when planning',
            'Only thinking about problems',
            'Avoiding all changes'
          ],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'What makes a good quality objective?',
          options: [
            'Vague and general',
            'SMART (Specific, Measurable, Achievable, Relevant, Time-bound)',
            'Impossible to achieve',
            'Not documented'
          ],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'What is competence?',
          options: [
            'Just having a degree',
            'Ability to apply knowledge and skills effectively',
            'Years of service',
            'Job title'
          ],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'What is documented information?',
          options: [
            'Random files',
            'Information required to be controlled and maintained',
            'Only emails',
            'Only verbal instructions'
          ],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'What is process control?',
          options: [
            'Micromanaging people',
            'Ensuring processes operate under controlled conditions',
            'Random checks',
            'Ignoring procedures'
          ],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'What is management review?',
          options: [
            'Employee evaluation',
            'Top management evaluation of IMS',
            'Customer survey',
            'Financial audit'
          ],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'What is root cause analysis?',
          options: [
            'Finding someone to blame',
            'Identifying fundamental reason for problem',
            'Treating symptoms only',
            'Ignoring the problem'
          ],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Who is responsible for quality?',
          options: [
            'Only the quality department',
            'Everyone in the organization',
            'Only top management',
            'Only external auditors'
          ],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'What is the purpose of management review?',
          options: [
            'To criticize employees',
            'To evaluate IMS effectiveness and plan improvements',
            'To delay decisions',
            'To create reports for storage'
          ],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'What is interested party?',
          options: [
            'Only customers',
            'Anyone affected by or affecting the organization',
            'Only shareholders',
            'Only employees'
          ],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'What is operational planning?',
          options: [
            'Random activities',
            'Planning processes to meet requirements',
            'Daily schedules only',
            'Vacation planning'
          ],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Why evaluate performance?',
          options: [
            'To punish people',
            'To determine if objectives are achieved',
            'To create reports',
            'To compare employees'
          ],
          correctAnswer: 1,
          points: 10
        }
      ]
    },
    isActive: true
  }
];

const seedGames = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing games
    await Game.deleteMany({});

    // Insert new games
    const games = await Game.insertMany(gamesData);

    process.exit(0);
  } catch (error) {
    console.error('error:', error);
    process.exit(1);
  }
};

seedGames();

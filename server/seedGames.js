import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Game from './models/Game.js';

dotenv.config();

const games = [
  // ==================== TEXT TWIST GAMES ====================
  {
    title: "IMS Word Builder - Quality",
    description: "Form words from IMS quality management terms",
    gameType: "texttwist",
    difficulty: "medium",
    maxXP: 200,
    timeLimit: 180,
    isActive: true,
    content: {
      words: [
        {
          mainWord: "QUALITY",
          subwords: ["QUILT", "QUIT", "LIT", "ALT", "QUA", "TAIL", "QUAY", "CLAY"]
        },
        {
          mainWord: "STANDARD",
          subwords: ["STAND", "STAR", "DARTS", "RANTS", "SAND", "TANS", "ANTS", "DART"]
        },
        {
          mainWord: "PROCESS",
          subwords: ["PRESS", "SCORE", "ROPES", "PORE", "CORE", "ROSE", "SORE", "ROPE"]
        }
      ]
    }
  },
  {
    title: "IMS Word Builder - Management",
    description: "Form words from IMS management terminology",
    gameType: "texttwist",
    difficulty: "hard",
    maxXP: 250,
    timeLimit: 180,
    isActive: true,
    content: {
      words: [
        {
          mainWord: "IMPROVEMENT",
          subwords: ["PROVE", "TEMPO", "PRIME", "MERIT", "TROVE", "MOVIE", "IMPORT", "REMOVE"]
        },
        {
          mainWord: "OBJECTIVES",
          subwords: ["OBJECT", "BISECT", "OBESE", "ECTIVE", "SECT", "JEST", "BEST", "VEST"]
        }
      ]
    }
  },

  // ==================== WORDLE GAMES ====================
  {
    title: "IMS Wordle Challenge",
    description: "Guess IMS-related 5-letter words",
    gameType: "wordle",
    difficulty: "medium",
    maxXP: 150,
    timeLimit: 0,
    isActive: true,
    content: {
      words: [
        { word: "AUDIT", hint: "Systematic examination of processes" },
        { word: "RISKS", hint: "Potential uncertainties affecting objectives" },
        { word: "SCOPE", hint: "Boundaries and extent of the system" },
        { word: "GOALS", hint: "Objectives to be achieved" },
        { word: "TRACK", hint: "Monitor and measure progress" },
        { word: "CLAIM", hint: "Assertion of conformity" },
        { word: "PROOF", hint: "Evidence of conformity" },
        { word: "VALID", hint: "Confirmed through evidence" },
        { word: "ISSUE", hint: "Problem requiring attention" },
        { word: "ALIGN", hint: "Bring into agreement" }
      ]
    }
  },
  {
    title: "ISO Standards Wordle",
    description: "Guess words related to ISO standards",
    gameType: "wordle",
    difficulty: "hard",
    maxXP: 175,
    timeLimit: 0,
    isActive: true,
    content: {
      words: [
        { word: "HAZRD", hint: "Source of potential harm (5 letters)" },
        { word: "WASTE", hint: "Unwanted or unusable material" },
        { word: "CHART", hint: "Visual display of data" },
        { word: "PLANS", hint: "Documented arrangements" },
        { word: "FORMS", hint: "Documents for data collection" },
        { word: "STAFF", hint: "Employees and personnel" },
        { word: "LEGAL", hint: "Required by law" },
        { word: "OWNER", hint: "Person responsible" },
        { word: "RULES", hint: "Established guidelines" },
        { word: "BATCH", hint: "Group of items produced together" }
      ]
    }
  },

  // ==================== QUICK QUIZ GAMES ====================
  {
    title: "IMS Fundamentals Quiz",
    description: "Test your knowledge of IMS basics",
    gameType: "quickquiz",
    difficulty: "easy",
    maxXP: 200,
    timeLimit: 120,
    isActive: true,
    content: {
      questions: [
        {
          question: "What does IMS stand for?",
          options: [
            "Integrated Management System",
            "Internal Monitoring Service",
            "Information Management Software",
            "International Marketing Strategy"
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          question: "What is the primary focus of ISO 9001?",
          options: [
            "Quality Management",
            "Environmental Protection",
            "Occupational Safety",
            "Information Security"
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          question: "Which ISO standard focuses on environmental management?",
          options: [
            "ISO 14001",
            "ISO 9001",
            "ISO 45001",
            "ISO 27001"
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          question: "What does PDCA stand for?",
          options: [
            "Plan-Do-Check-Act",
            "Prepare-Deploy-Control-Audit",
            "Process-Document-Comply-Approve",
            "Plan-Document-Correct-Assess"
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          question: "What is continual improvement?",
          options: [
            "Recurring activity to enhance performance",
            "One-time project initiative",
            "Annual review process",
            "Corrective action procedure"
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          question: "What is a nonconformity?",
          options: [
            "Failure to meet a requirement",
            "Minor documentation error",
            "Suggestion for improvement",
            "Observation during audit"
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          question: "What is the purpose of an internal audit?",
          options: [
            "Verify conformity and effectiveness",
            "Punish employees for mistakes",
            "Find problems to report externally",
            "Create more documentation"
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          question: "What is risk-based thinking?",
          options: [
            "Considering potential issues when planning",
            "Avoiding all risky activities",
            "Only focusing on financial risks",
            "Documenting past failures"
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          question: "What is a corrective action?",
          options: [
            "Action to eliminate cause of nonconformity",
            "Immediate fix to a problem",
            "Punishment for error",
            "Training program"
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          question: "Who is responsible for quality in an organization?",
          options: [
            "Everyone",
            "Only the quality manager",
            "Only top management",
            "Only auditors"
          ],
          correctAnswer: 0,
          points: 10
        }
      ]
    }
  },
  {
    title: "ISO 9001 Advanced Quiz",
    description: "Advanced questions on ISO 9001 requirements",
    gameType: "quickquiz",
    difficulty: "hard",
    maxXP: 250,
    timeLimit: 180,
    isActive: true,
    content: {
      questions: [
        {
          question: "How many clauses are in ISO 9001:2015?",
          options: ["10", "8", "7", "12"],
          correctAnswer: 0,
          points: 10
        },
        {
          question: "Which clause covers Leadership in ISO 9001?",
          options: ["Clause 5", "Clause 4", "Clause 6", "Clause 7"],
          correctAnswer: 0,
          points: 10
        },
        {
          question: "What does 'context of the organization' refer to?",
          options: [
            "Internal and external issues affecting the QMS",
            "Office location and building",
            "Company history",
            "Organizational chart"
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          question: "What is the purpose of management review?",
          options: [
            "Evaluate QMS effectiveness and opportunities",
            "Review employee performance",
            "Approve budgets",
            "Sign off on procedures"
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          question: "What is interested party in ISO 9001?",
          options: [
            "Person or organization that can affect or be affected by decision",
            "Shareholders only",
            "Customers only",
            "Employees only"
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          question: "Which is NOT a quality management principle?",
          options: [
            "Profit maximization",
            "Customer focus",
            "Leadership",
            "Process approach"
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          question: "What is documented information?",
          options: [
            "Information required to be controlled and maintained",
            "Only paper documents",
            "Only electronic files",
            "Email communications"
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          question: "What is meant by 'conformity'?",
          options: [
            "Fulfillment of a requirement",
            "Following company culture",
            "Agreement with auditor",
            "Matching competitor practices"
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          question: "What triggers a preventive action in modern ISO 9001?",
          options: [
            "Risk-based thinking replaces preventive action",
            "Customer complaint",
            "Audit finding",
            "Management decision"
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          question: "What is the certification cycle for ISO 9001?",
          options: [
            "3 years with surveillance audits",
            "1 year renewal",
            "5 years with annual audits",
            "Permanent once certified"
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          question: "What does 'competence' mean in ISO 9001?",
          options: [
            "Ability to apply knowledge and skills",
            "Years of experience",
            "Educational degree",
            "Job title level"
          ],
          correctAnswer: 0,
          points: 10
        },
        {
          question: "What is required for purchased products/services?",
          options: [
            "Verification that requirements are met",
            "Always choosing cheapest supplier",
            "Long-term contracts",
            "Local suppliers only"
          ],
          correctAnswer: 0,
          points: 10
        }
      ]
    }
  },

  // ==================== HANGMAN GAMES ====================
  {
    title: "IMS Hangman Challenge",
    description: "Guess IMS terms and phrases",
    gameType: "hangman",
    difficulty: "medium",
    maxXP: 150,
    timeLimit: 0,
    isActive: true,
    content: {
      words: [
        {
          word: "QUALITY MANAGEMENT",
          hint: "Core focus of ISO 9001",
          category: "IMS Concepts"
        },
        {
          word: "CONTINUAL IMPROVEMENT",
          hint: "Ongoing enhancement of performance",
          category: "IMS Principles"
        },
        {
          word: "CUSTOMER SATISFACTION",
          hint: "Primary goal of quality management",
          category: "Quality Goals"
        },
        {
          word: "INTERNAL AUDIT",
          hint: "Systematic examination of QMS",
          category: "Quality Processes"
        },
        {
          word: "CORRECTIVE ACTION",
          hint: "Eliminate cause of nonconformity",
          category: "Quality Tools"
        },
        {
          word: "PROCESS APPROACH",
          hint: "Understanding and managing interrelated processes",
          category: "QMS Principles"
        },
        {
          word: "RISK BASED THINKING",
          hint: "Modern ISO 9001 approach",
          category: "Quality Methods"
        },
        {
          word: "TOP MANAGEMENT",
          hint: "Person or group at highest level",
          category: "Organizational Roles"
        }
      ]
    }
  },
  {
    title: "ISO Standards Hangman",
    description: "Guess ISO standard-related terms",
    gameType: "hangman",
    difficulty: "hard",
    maxXP: 175,
    timeLimit: 0,
    isActive: true,
    content: {
      words: [
        {
          word: "CERTIFICATION BODY",
          hint: "Organization that conducts audits",
          category: "ISO Certification"
        },
        {
          word: "SURVEILLANCE AUDIT",
          hint: "Annual check to maintain certification",
          category: "Audit Types"
        },
        {
          word: "NONCONFORMITY REPORT",
          hint: "Document describing failure to meet requirement",
          category: "Quality Documents"
        },
        {
          word: "DOCUMENTED INFORMATION",
          hint: "ISO 9001 term replacing 'documents and records'",
          category: "ISO Terminology"
        },
        {
          word: "INTERESTED PARTIES",
          hint: "Stakeholders affecting or affected by organization",
          category: "ISO Context"
        },
        {
          word: "CONTEXT OF ORGANIZATION",
          hint: "Internal and external issues affecting QMS",
          category: "ISO Requirements"
        },
        {
          word: "MANAGEMENT REVIEW",
          hint: "Top management evaluation of QMS",
          category: "Management Activities"
        },
        {
          word: "COMPETENCE MATRIX",
          hint: "Tool showing required skills and training",
          category: "HR Tools"
        }
      ]
    }
  }
];

async function seedGames() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📁 Connected to MongoDB');

    // Clear existing games
    await Game.deleteMany({});
    console.log('🗑️  Cleared existing games');

    // Insert new games
    await Game.insertMany(games);
    console.log('✅ Successfully seeded games database');
    
    console.log('\n📊 Games Summary:');
    const textTwistCount = games.filter(g => g.gameType === 'texttwist').length;
    const wordleCount = games.filter(g => g.gameType === 'wordle').length;
    const quizCount = games.filter(g => g.gameType === 'quickquiz').length;
    const hangmanCount = games.filter(g => g.gameType === 'hangman').length;
    
    console.log(`🔤 Text Twist Games: ${textTwistCount}`);
    console.log(`📝 Wordle Games: ${wordleCount}`);
    console.log(`⚡ Quick Quiz Games: ${quizCount}`);
    console.log(`🎯 Hangman Games: ${hangmanCount}`);
    console.log(`\n🎮 Total Games: ${games.length}`);
    
    console.log('\n📋 Game Details:');
    games.forEach((game, index) => {
      console.log(`\n${index + 1}. ${game.title}`);
      console.log(`   Type: ${game.gameType}`);
      console.log(`   Difficulty: ${game.difficulty}`);
      console.log(`   Max XP: ${game.maxXP}`);
      console.log(`   Time Limit: ${game.timeLimit > 0 ? game.timeLimit + 's' : 'None'}`);
      
      if (game.gameType === 'texttwist') {
        console.log(`   Words: ${game.content.words.length}`);
      } else if (game.gameType === 'wordle') {
        console.log(`   Words: ${game.content.words.length}`);
      } else if (game.gameType === 'quickquiz') {
        console.log(`   Questions: ${game.content.questions.length}`);
      } else if (game.gameType === 'hangman') {
        console.log(`   Phrases: ${game.content.words.length}`);
      }
    });

    await mongoose.disconnect();
    console.log('\n Database seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedGames();
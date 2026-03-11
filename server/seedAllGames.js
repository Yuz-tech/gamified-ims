import mongoose from 'mongoose';
import Game from './models/Game';
import Topic from './models/Topic.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAllGames = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        await Game.deleteMany({});

        const topics = await Topic.find({});

        const allGames = [
            {
                title: 'ISO Standards Scramble',
                type: 'word_scramble',
                difficulty: 'easy',
                relatedTopics: [
                    topics.find(t => t.title.includes('ISO 9001'))?._id,
                    topics.find(t => t.title.includes('ISO 27001'))?._id
                ].filter(Boolean),
                xpReward: 30,
                timeLimit: 300,
                gameData: {
                    words: [
                        { scrambled: 'AUDITQLY', answer: 'QUALITY', hint: 'ISO 9001 focus area'},
                        { scrambled: 'CYPDA', answer: 'PDCA', hint: 'Continuous Improvement Cycle'},
                        { scrambled: 'IFECRATETIC', answer: 'CERTIFICATE', hint: 'ISO compliance proof'},
                        { scrambled: 'MISS', answer: 'ISMS', hint: 'Information Security Management System'},
                        { scrambled: 'TIAUD', answer: 'AUDIT', hint: 'Compliance verification process'},
                        { scrambled: 'LIPYMNACE', answer: 'COMPLIANCE', hint: 'Meeting requirements'},
                        { scrambled: 'NADARTDS', answer: 'STANDARDS', hint: 'ISO creates these...'},
                        { scrambled: 'MCNUEODT', answer: 'DOCUMENT', hint: 'Policy or procedure'},
                        { scrambled: 'IEWVER', answer: 'REVIEW', hint: 'Management Assessment'},
                        { scrambled: 'OCPSSRE', answer: 'PROCESS', hint: 'Series of actions'}
                    ]
                },
                isActive: true
            },
            {
                title: 'Security Threats Scramble',
                type: 'word_scramble',
                difficulty: 'medium',
                relatedTopics: [
                    topics.find(t => t.title.includes('Anti-Malware'))?._id, topics.find(t => t.title.includes('Email Rules'))?._id
                ].filter(Boolean),
                xpReward: 40,
                timeLimit: 360,
                gameData: {
                    words: [
                        { scrambled: 'AWMLERA', answer: 'MALWARE', hint: 'Malicious software'},
                        { scrambled: 'HPNISHGI', answer: 'PHISHING', hint: 'Fraudulent email attack'},
                        { scrambled: 'WMAREOSNAR', answer: 'RANSOMWARE', hint: 'Encrypts files for money'},
                        { scrambled: 'RIVSU', answer: 'VIRUS', hint: 'Self-replicating malware' },
                        { scrambled: 'TRNJOA', answer: 'TROJAN', hint: 'Disguised malware' },
                        { scrambled: 'WHYSAPER', answer: 'SPYWARE', hint: 'Monitors user activity'},
                        { scrambled: 'PAMS', answer: 'SPAM', hint: 'Unwanted emails' },
                        {}
                    ]
                }
            }
        ]
    }
}
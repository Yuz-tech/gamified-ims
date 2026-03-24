import mongoose from "mongoose";
import dotenv from 'dotenv';
import Game from './models/Game.js';

dotenv.config();

const gamesData = [
    {
        title: 'IMS Basics',
        type: 'crossword',
        difficulty: 'easy',
        xpReward: 50,
        questions: [
            { clue: 'System for managing quality standards', answer: 'IMS' },
            { clue: 'Document that outlines procedures', answer: 'POLICY' },
            { clue: 'Continuous improvement methodology', answer: 'KAIZEN' },
            { clue: 'International Standards Organization (abbr.)', answer: 'ISO' },
            { clue: 'Process of checking compliance', answer: 'AUDIT' }
        ]
    },
    {
        title: 'Quality Management',
        type: 'crossword',
        difficulty: 'medium',
        xpReward: 75,
        questions: [
            { clue: 'Meeting customer needs consistently', answer: 'QUALITY' },
            { clue: 'Preventing defects before they occur', answer: 'PREVENTION' },
            { clue: 'Systematic examination of records', answer: 'REVIEW' },
            { clue: 'Measure of process effectiveness', answer: 'METRIC' },
            { clue: 'Action to eliminate nonconformity', answer: 'CORRECTION' }
        ]
    },
    {
        title: 'Document Control',
        type: 'crossword',
        difficulty: 'medium',
        xpReward: 75,
        questions: [
            { clue: 'Official authorization to use', answer: 'APPROVAL' },
            { clue: 'Unique identifier for documents', answer: 'NUMBER' },
            { clue: 'Most current version', answer: 'LATEST' },
            { clue: 'No longer in effect', answer: 'OBSOLETE' },
            { clue: 'Change to a document', answer: 'REVISION' }
        ]
    },
    {
        title: 'Risk Management',
        type: 'crossword',
        difficulty: 'hard',
        xpReward: 100,
        questions: [
            { clue: 'Potential source of harm', answer: 'HAZARD' },
            { clue: 'Likelihood of occurrence', answer: 'PROBABILITY' },
            { clue: 'Reducing risk to acceptable level', answer: 'MITIGATION' },
            { clue: 'Effect of uncertainty on objectives', answer: 'RISK' },
            { clue: 'Plan to address potential issues', answer: 'CONTINGENCY' }
        ]
    },
    {
        title: 'Process Improvement',
        type: 'crossword',
        difficulty: 'medium',
        xpReward: 75,
        questions: [
            { clue: 'Japanese term for workplace', answer: 'GEMBA' },
            { clue: 'Visual management board', answer: 'KANBAN' },
            { clue: 'Eliminating waste', answer: 'LEAN' },
            { clue: 'Six _____ methodology', answer: 'SIGMA' },
            { clue: 'Plan-Do-Check-___', answer: 'ACT' }
        ]
    },
    {
        title: 'Compliance Crossword',
        type: 'crossword',
        difficulty: 'easy',
        xpReward: 50,
        questions: [
            { clue: 'Following established rules', answer: 'COMPLIANCE' },
            { clue: 'Required by regulation', answer: 'MANDATORY' },
            { clue: 'Official inspection', answer: 'AUDIT' },
            { clue: 'Written guideline', answer: 'PROCEDURE' },
            { clue: 'Meets requirements', answer: 'CONFORMITY' }
        ]
    }, 
    {
        title: 'Training & Competence',
        type: 'crossword',
        difficulty: 'medium',
        xpReward: 75,
        questions: [
            { clue: 'Ability to perform a task', answer: 'COMPETENCE' },
            { clue: 'Learning program', answer: 'TRAINING' },
            { clue: 'Official recognition of skills', answer: 'CERTIFICATION' },
            { clue: 'Proof of completion', answer: 'RECORD' },
            { clue: 'Evaluation of performance', answer: 'ASSESSMENT' }
        ]
    },
    {
        title: 'Internal Audit',
        type: 'crossword',
        difficulty: 'hard',
        xpReward: 100,
        questions: [
            { clue: 'Person conducting audit', answer: 'AUDITOR' },
            { clue: 'Area being examined', answer: 'SCOPE' },
            { clue: 'Evidence of noncompliance', answer: 'FINDING' },
            { clue: 'Planned audit schedule', answer: 'PROGRAM' },
            { clue: 'Corrective action plan', answer: 'CAPA' }
        ]
    },
    {
        title: 'IMS Terminology',
        type: 'word_scramble',
        difficulty: 'easy',
        xpReward: 50,
        questions: [
            { scrambled: 'TIDUUA', answer: 'AUDIT', hint: 'Systematic examination' },
            { scrambled: 'LITYQUA', answer: 'QUALITY', hint: 'Meeting requirements' },
            { scrambled: 'CESROPS', answer: 'PROCESS', hint: 'Set of activities' },
            { scrambled: 'CYILOP', answer: 'POLICY', hint: 'High-level directive' },
            { scrambled: 'DRADSTAN', answer: 'STANDARD', hint: 'Established requirement' }
        ]
    },
    {
        title: 'Quality Terms',
        type: 'word_scramble',
        difficulty: 'medium',
        xpReward: 75,
        questions: [
            { scrambled: 'VETNPRIONE', answer: 'PREVENTION', hint: 'Stopping before it happens' },
            { scrambled: 'INEMVORIPEM', answer: 'IMPROVEMENT', hint: 'Making better' },
            { scrambled: 'ECNAILMOCP', answer: 'COMPLIANCE', hint: 'Following rules' },
            { scrambled: 'FECITVEEFENS', answer: 'EFFECTIVENESS', hint: 'Achieving objectives' },
            { scrambled: 'YCCFIEIFNE', answer: 'EFFICIENCY', hint: 'Resource optimization' }
        ]
    },
    {
        title: 'Documentation fundamentals',
        type: 'word_scramble',
        difficulty: 'medium',
        xpReward: 75,
        questions: [
            { scrambled: 'DROERC', answer: 'RECORD', hint: 'Evidence of activity' },
            { scrambled: 'DUOCTENM', answer: 'DOCUMENT', hint: 'Written information' },
            { scrambled: 'VERIONIS', answer: 'REVISION', hint: 'Updated version' },
            { scrambled: 'LOVAPARP', answer: 'APPROVAL', hint: 'Official authorization'},
            { scrambled: 'TRLOOCN', answer: 'CONTROL', hint: 'Managing access'}
        ]
    },
    {
        title: 'Management',
        type: 'word_scramble',
        difficulty: 'hard',
        xpReward: 100,
        questions: [
            { scrambled: 'ETJBCOVIE', answer: 'OBJECTIVE', hint: 'Measurable goal' },
            { scrambled: 'YGASRETT', answer: 'STRATEGY', hint: 'High-level plan'},
            { scrambled: 'NERPFRACMEO', answer: 'PERFORMANCE', hint: 'Achievement level'},
            { scrambled: 'THKREADLSOE', answer: 'STAKEHOLDER', hint: 'Interested party' },
            { scrambled: 'NCEAEVGORN', answer: 'GOVERNANCE', hint: 'Leadership Framework'}
        ]
    },
    {
        title: 'Risk & Safety',
        type: 'word_scramble',
        difficulty: 'medium',
        xpReward: 75,
        questions: [
            { scrambled: 'AZDHAH', answer: 'HAZARD', hint: 'Source of danger' },
            { scrambled: 'GMITIITONA', answer: 'MITIGATION', hint: 'Risk reduction' },
            { scrambled: 'CTNEDNII', answer: 'INCIDENT', hint: 'Unwanted event' },
            { scrambled: 'YTFSAE', answer: 'SAFETY', hint: 'Freedom from harm' },
            { scrambled: 'NYPTNCOIECG', answer: 'CONTINGENCY', hint: 'Backup plan' }
        ]
    },
    {
        title: 'IMS Fundamentals',
        type: 'quick_quiz',
        difficulty: 'easy',
        xpReward: 60,
        questions: [
            {
                question: 'What does IMS stand for?',
                options: [
                    'Internal Management System',
                    'Integrated Management System',
                    'International Monitoring Standard',
                    'Information Management Service'
                ],
                correctAnswer: 1
            },
            {
                question: 'What is the primary goal of IMS?',
                options: [
                    'Reduce costs',
                    'Increase sales',
                    'Improve organizational performance',
                    'Replace existing systems'
                ],
                correctAnswer: 2
            },
            {
                question: 'Which ISO standard covers quality management?',
                options: [
                    'ISO 9001',
                    'ISO 14001',
                    'ISO 27001',
                    'ISO 6969'
                ],
                correctAnswer: 0
            }
        ]
    }
];

const seedGames = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Game.deleteMany({});

        const games = await Game.insertMany(gamesData);
        process.exit(0);
    } catch (error) {
        console.error('Seed error: ', error);
        process.exit(1);
    }
};

seedGames();
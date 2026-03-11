import mongoose from 'mongoose';
import Game from './models/Game.js';
import Topic from './models/Topic.js';
import dotenv from 'dotenv';

dotenv.config();

const seedCrosswordGames = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        await Game.deleteMany({ type: 'crossword' });

        const topics = await Topic.find({});

        const crosswordGames = [
            {
                title: 'ISO 9001 Fundamentals',
                type: 'crossword',
                difficulty: 'easy',
                relatedTopics: [topics.find(t => t.title.includes('ISO 9001'))?._id].filter(Boolean),
                xpReward: 50,
                timeLimit: 600, //10 minutes
                gameData: {
                    gridSize: 10,
                    cluse: {
                        across: [
                            { number: 1, clue: 'Continuous improvement sycle (4 letters)', answer: 'PDCA', row: 0, col: 0},
                            { number: 3, clue: 'Primary focus of ISO 9001 (7 letters)', answer: 'QUALITY', row: 2, col: 3},
                            { number: 5, clue: 'Verification process to ensure compliance (5 letters)', answer: 'AUDIT', row: 4, col: 1},
                            { number: 7, clue: 'Person who purchases products or services (8 letters)', answer: 'CUSTOMER', row: 6, col: 2 },
                            { number: 8, clue: 'Ongoing activity to enhance performance (11 letters)', answer: 'IMPROVEMENT', row: 8, col: 0 }
                            ],
                        down: [
                            { number: 2, clue: 'International organization for standardization (3 letters)', answer: 'ISO', row: 0, col: 5 },
                            { number: 4, clue: 'Third letter in PDCA cycle (5 letters)', answer: 'CHECK', row: 2, col: 7 },
                            { number: 6, clue: 'Systematic approach to managing processes (abbr. 3 letters)', answer: 'QMS', row: 4, col: 4 }
                        ]
                    }
                },
                isActive: true
            }
        ];

        const createdGames = await Game.insertMany(crosswordGames);
        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
};

seedCrosswordGames();
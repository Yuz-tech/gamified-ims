import mongoose from 'mongoose';
import Topic from './models/Topic.js';
import Badge from './models/Badge.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Topic.deleteMany({});
        await Badge.deleteMany({});

        const topic1 = await Topic.create({
            title: 'ISO 9001',
            description: 'Learn the fundamentals of ISO 9001',
            videoUrl: 'https://youtube.com/embed/dQw4w9WgXcQ',
            videoDuration: 180,
            order: 1,
            xpReward: 100,
            passingScore: 70,
            questions: [
                {
                    question: 'What does ISO 9001 primarily talk about?',
                    options: [
                        'Quality Management System',
                        'Information Security',
                        'Quality Assurance and Certifications',
                        'Cryptography'
                    ],
                    correctAnswer: 0,
                    points: 25
                },
                {
                    question: 'Which of the following is not a goal of ISO 9001?',
                    options: [
                        'To meet and exceed customer expectations',
                        'To increase business security',
                        'To coninuously improve business process and performance',
                        'Boost customer satisfaction'
                    ],
                    correctAnswer: 1,
                    points: 25
                },
                {
                    question: 'What does ISO stand for?',
                    options: [
                        'International Standards Organization',
                        'International Standards Operations',
                        'International Organization for Standardization',
                        'Information Standards Offices'
                    ],
                    correctAnswer: 2,
                    points: 25
                }
            ],
            isActive: true
        });

        //create Badges
        const badge1 = await Badge.create({
            name: 'Quality Maestro',
            description: 'Completed ISO 9001',
            imageUrl: ''
            topicId: topic1._id
        });

        console.log('Sample data added');
        console.log('Topic: ', [topic1.title]);
        console.log('Badge: ', [badge1.name]);
        process.exit(0);
    } catch(error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedData();
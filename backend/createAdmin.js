import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB Connected')).catch((err) => console.error('MongoDB Connection Error:', err));

        const admin = new User({
            username: 'admin',
            email: 'admin@sample.com',
            password: 'admin123',
            role: 'admin',
            isApproved: true
        });

        await admin.save();

        console.log('Admin created');
        console.log('Username: admin');
        console.log('Password: 123');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();
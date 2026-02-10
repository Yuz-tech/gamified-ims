import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createUser = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB Connected')).catch((err) => console.error('MongoDB Connection Failed: ', err));

        const employee = new User({
            username: 'tester',
            email: 'tester@sample.com',
            password: 'test123',
            role: 'employee',
            isApproved: true //default false
        });

        await employee.save();

        console.log('Employee Added');
        console.log('Username: tester');
        console.log('Password: test123');
        process.exit(0);
    } catch (error) {
        console.error('Error: ', error);
        process.exit(1);
    }
};

createUser();
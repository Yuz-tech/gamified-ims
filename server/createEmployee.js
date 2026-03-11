import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createEmployee = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if employee exists
    const existing = await User.findOne({ username: 'employee' });
    if (existing) {
      console.log('Employee user already exists');
      console.log(`   Username: ${existing.username}`);
      console.log(`   Email: ${existing.email}`);
      console.log(`   Approved: ${existing.isApproved}`);
      
      // Update to approved if not
      if (!existing.isApproved) {
        existing.isApproved = true;
        await existing.save();
        console.log('✅ Updated employee to approved status');
      }
    } else {
      // Create new employee
      const employee = await User.create({
        username: 'employee',
        email: 'employee@imsarcade.com',
        password: 'employee123',
        role: 'employee',
        isApproved: true
      });
      
      console.log('✅ Employee user created');
      console.log(`   Username: ${employee.username}`);
      console.log(`   Email: ${employee.email}`);
    }

    console.log('\n🔐 Login Credentials:');
    console.log('   Username: employee');
    console.log('   Password: employee123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createEmployee();
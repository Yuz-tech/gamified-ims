import express from 'express';
import User from '../models/User.js';
//import Topic from '../models/Topic.js';
//import Badge from '../models/Badge.js';
//import ActivityLog from '../models/ActivityLog.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
//import { sendPasswordEmail } from '../utils/email.js';

const router = express.Router();

router.use(authenticateToken, isAdmin);

router.get('/pending-users', async(req, res) => {
    try{
        const pendingUsers = await
        User.find({ isApproved: false })
        .select('-password')
        .sort({ requestedAt: -1 });
        res.json(pendingUsers);
    } catch(error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/users', async (req,res)=> {
    try {
        const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message});
    }
});

// router.post('/approve-user/:userId', async(req,res) => {
//     try {
//         const {password} = req.body;
//         const user = await
//         User.findById(req.params.userId);

//         if (!user) {
//             return res.status(400).json({message: 'User not found'});
//         }

//         user.password = password;
//         user.isApproved = true;
//         await user.save();

//         await sendPasswordEmail(user.email, user.username, password);

//         res.json({ message: 'User approved and password sent'});
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message});
//     }
// });

//CREATE USER
router.post('/users', async(req,res) => {
    try {
        const {username, email, password, role} = req.body;
        const existingUser = await 
        User.findOne({ $or: [{email}, {username}]});
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists'});
        }

        const user = new User({
            username,
            email,
            password,
            role: role || 'employee',
            isApproved: true
        });

        await user.save();

        await sendPasswordEmail(user.email, user.username, password);

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// UPDATE USER
router.put('/users/:userId', async(req,res) => {
    try{
        const {username, email, role, xp, level } = req.body;
        const user = await User.findByIdAndUpdate(req.params.userId,
            {username, email, role, xp, level},
            {new: true, runValidators: true}
        ).select('-password');

        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch(error) {
        res.status(500).json({ message: 'Server error', error: error.message});
    }
});

//DELETE user
router.delete('/users/:userId', async(req,res)=> {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if(!user) {
            return res.status(404).json({ message: 'User not found'});
        }
        res.json({ message: 'User deleted successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
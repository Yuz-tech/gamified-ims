import express from 'express';
import ActivityLog from '../models/ActivityLog.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get recent activity
router.get('/recent', authenticateToken, async (req, res) => {
    try {
        const activities = await ActivityLog.find({ userId: req.user._id })
        .sort({ timestamp: -1 })
        .limit(20)
        .lean();
        
        res.json(activities);
    } catch(error) {
        console.error('Error fetching recent activity: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all activities
router.get('/all', authenticateToken, async (req,res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const activities = await ActivityLog.find()
        .populate('userId', 'username email')
        .sort({ timestamp: -1})
        .limit(100)
        .lean();

        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
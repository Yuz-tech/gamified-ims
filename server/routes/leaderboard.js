import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All leaderboard routes require authentication
router.use(authenticateToken);

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    console.log(`📊 Getting top ${limit} users for leaderboard`);
    
    const topUsers = await User.find({ isApproved: true })
      .select('username email xp level badges')
      .sort({ xp: -1 })
      .limit(limit)
      .lean();

    // Format leaderboard data
    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      email: user.email,
      xp: user.xp || 0,
      level: user.level || 1,
      badgeCount: user.badges?.length || 0
    }));

    console.log(`✅ Sending ${leaderboard.length} users for leaderboard`);
    res.json(leaderboard);
  } catch (error) {
    console.error('❌ Error getting leaderboard:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
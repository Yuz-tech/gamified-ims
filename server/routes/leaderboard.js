import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await User.find({ role: 'employee' })
      .select('username email avatar level xp badges completedTopics')
      .sort({ xp: -1 })
      .limit(parseInt(limit))
      .lean();

    const leaderboardWithRank = leaderboard.map((user, index) => ({
      _id: user._id,
      rank: index + 1,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      level: user.level,
      xp: user.xp,
      badges: user.badges,
      badgeCount: user.badges.length,
      completedTopics: user.completedTopics.length
    }));

    res.json(leaderboardWithRank);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
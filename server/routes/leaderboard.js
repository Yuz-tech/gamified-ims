import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await User.find({ isApproved: true })
      .select('username level xp badges completedTopics')
      .sort({ xp: -1 })
      .limit(parseInt(limit));

    const leaderboardWithRank = leaderboard.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      level: user.level,
      xp: user.xp,
      badgeCount: user.badges.length,
      completedTopics: user.completedTopics.length
    }));

    res.json(leaderboardWithRank);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
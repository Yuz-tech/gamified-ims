import express from 'express';
import User from '../models/User.js';
import Topic from '../models/Topic.js';
import Badge from '../models/Badge.js';
import ActivityLog from '../models/ActivityLog.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { sendPasswordEmail } from '../utils/email.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, isAdmin);

// ===== USER MANAGEMENT =====

// Get all pending account requests
router.get('/pending-users', async (req, res) => {
  try {
    const pendingUsers = await User.find({ isApproved: false })
      .select('-password')
      .sort({ requestedAt: -1 });
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve user and send password
router.post('/approve-user/:userId', async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password;
    user.isApproved = true;
    await user.save();

    // Send email with credentials
    await sendPasswordEmail(user.email, user.username, password);

    res.json({ message: 'User approved and password sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create user manually
router.post('/users', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      username,
      email,
      password,
      role: role || 'employee',
      isApproved: true
    });

    await user.save();

    // Send email with credentials
    await sendPasswordEmail(user.email, user.username, password);

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user
router.put('/users/:userId', async (req, res) => {
  try {
    const { username, email, role, xp, level } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { username, email, role, xp, level },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
router.delete('/users/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== TOPIC MANAGEMENT =====

// Get all topics (including inactive)
router.get('/topics', async (req, res) => {
  try {
    const topics = await Topic.find().sort({ order: 1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create topic
router.post('/topics', async (req, res) => {
  try {
    const topic = new Topic(req.body);
    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update topic
router.put('/topics/:topicId', async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(
      req.params.topicId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete topic
router.delete('/topics/:topicId', async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    // Also delete associated badge
    await Badge.deleteOne({ topicId: req.params.topicId });
    
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== BADGE MANAGEMENT =====

// Get all badges
router.get('/badges', async (req, res) => {
  try {
    const badges = await Badge.find().populate('topicId');
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create badge
router.post('/badges', async (req, res) => {
  try {
    const badge = new Badge(req.body);
    await badge.save();
    res.status(201).json(badge);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update badge
router.put('/badges/:badgeId', async (req, res) => {
  try {
    const badge = await Badge.findByIdAndUpdate(
      req.params.badgeId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' });
    }
    res.json(badge);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete badge
router.delete('/badges/:badgeId', async (req, res) => {
  try {
    const badge = await Badge.findByIdAndDelete(req.params.badgeId);
    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' });
    }
    res.json({ message: 'Badge deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== ACTIVITY LOGS =====

// Get all activity logs
router.get('/activity-logs', async (req, res) => {
  try {
    const { userId, action, limit = 100 } = req.query;
    
    const query = {};
    if (userId) query.userId = userId;
    if (action) query.action = action;

    const logs = await ActivityLog.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get statistics
router.get('/statistics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isApproved: true });
    const pendingUsers = await User.countDocuments({ isApproved: false });
    const totalTopics = await Topic.countDocuments();
    const totalBadges = await Badge.countDocuments();

    const topUsers = await User.find({ isApproved: true })
      .select('username email xp level badges')
      .sort({ xp: -1 })
      .limit(10);

    res.json({
      totalUsers,
      pendingUsers,
      totalTopics,
      totalBadges,
      topUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

//Get yearly stats
router.get('/training-year', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    
    const totalUsers = await User.countDocuments({ isApproved: true });
    
    // Count users who completed all topics this year
    const users = await User.find({ isApproved: true });
    let usersCompleted = 0;
    
    const totalTopics = await Topic.countDocuments({ isActive: true });
    
    users.forEach(user => {
      const yearProgress = user.getCurrentYearProgress();
      if (yearProgress.completedTopics.length >= totalTopics) {
        usersCompleted++;
      }
    });
    
    const badges = await Badge.countDocuments({ year: currentYear });
    
    res.json({
      currentYear,
      totalUsers,
      usersCompleted,
      completionRate: totalUsers > 0 ? Math.round((usersCompleted / totalUsers) * 100) : 0,
      totalTopics,
      totalBadges: badges
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Archive current year and reset for new year
router.post('/reset-training-year', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const { newYear } = req.body;
    
    if (!newYear || newYear <= currentYear) {
      return res.status(400).json({ 
        message: 'New year must be greater than current year' 
      });
    }
    
    // Get all users
    const users = await User.find({ isApproved: true });
    let archivedCount = 0;
    
    for (const user of users) {
      const yearProgress = user.getCurrentYearProgress();
      
      // Archive current year data
      user.yearlyArchive.push({
        year: currentYear,
        completedTopics: yearProgress.completedTopics.length,
        badgesEarned: yearProgress.badges.length,
        xpEarned: yearProgress.completedTopics.reduce((sum, ct) => {
          return sum + (ct.score || 0);
        }, 0),
        archivedAt: new Date()
      });
      
      // Clear current year progress (but keep XP and level!)
      user.completedTopics = user.completedTopics.filter(ct => ct.year !== currentYear);
      user.badges = user.badges.filter(b => b.year !== currentYear);
      user.watchedVideos = user.watchedVideos.filter(wv => wv.year !== currentYear);
      
      await user.save();
      archivedCount++;
    }
    
    // Mark old badges as inactive
    await Badge.updateMany(
      { year: currentYear },
      { isActive: false }
    );
    
    await logActivity(req.user._id, 'training_year_reset', {
      oldYear: currentYear,
      newYear: newYear,
      usersArchived: archivedCount
    }, req);
    
    res.json({
      message: 'Training year reset successfully',
      archivedUsers: archivedCount,
      oldYear: currentYear,
      newYear: newYear
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's yearly history
router.get('/users/:userId/history', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('username email yearlyArchive completedTopics badges');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const currentYear = new Date().getFullYear();
    const currentYearData = user.getCurrentYearProgress();
    
    res.json({
      username: user.username,
      email: user.email,
      currentYear: {
        year: currentYear,
        completedTopics: currentYearData.completedTopics.length,
        badgesEarned: currentYearData.badges.length
      },
      history: user.yearlyArchive.sort((a, b) => b.year - a.year)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reset specific user's progress (admin override)
router.post('/users/:userId/reset-progress', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const currentYear = new Date().getFullYear();
    
    // Archive before reset
    const yearProgress = user.getCurrentYearProgress();
    user.yearlyArchive.push({
      year: currentYear,
      completedTopics: yearProgress.completedTopics.length,
      badgesEarned: yearProgress.badges.length,
      xpEarned: 0,
      archivedAt: new Date()
    });
    
    // Reset current year only
    user.completedTopics = user.completedTopics.filter(ct => ct.year !== currentYear);
    user.badges = user.badges.filter(b => b.year !== currentYear);
    user.watchedVideos = user.watchedVideos.filter(wv => wv.year !== currentYear);
    
    await user.save();
    
    await logActivity(req.user._id, 'user_progress_reset', {
      targetUserId: user._id,
      targetUsername: user.username,
      year: currentYear
    }, req);
    
    res.json({
      message: 'User progress reset successfully',
      user: {
        username: user.username,
        resetYear: currentYear
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
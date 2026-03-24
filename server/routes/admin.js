import express from 'express';
import User from '../models/User.js';
import Topic from '../models/Topic.js';
import Badge from '../models/Badge.js';
import ActivityLog from '../models/ActivityLog.js';
import SystemSettings from '../models/SystemSettings.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { sendPasswordEmail } from '../utils/email.js';
import { logActivity } from '../utils/logger.js';

const router = express.Router();

router.use(authenticateToken, isAdmin);

// ===== USER MANAGEMENT =====

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

// Get all topics (admin)
router.get('/topics', authenticateToken, isAdmin, async (req, res) => {
  try {
    const topics = await Topic.find({});
    
    // Sort in JavaScript
    topics.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    res.json(topics);
  } catch (error) {
    console.error('Error getting admin topics:', error);
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

// Toggle topic active/inactive (instead of delete)
router.put('/topics/:topicId/toggle', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    topic.isActive = !topic.isActive;
    await topic.save();
    
    res.json({ 
      message: `Topic ${topic.isActive ? 'enabled' : 'disabled'} successfully`,
      topic 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// toggle all topics
router.put('/topics/toggle-all', authenticateToken, isAdmin, async (req,res) => {
  try {
    const { isActive } = req.body;
    const result = await Topic.updateMany(
      {},
      { $set: { isActive }}
    );

    await logActivity(req.user._id, 'topics_bulk_toggle', {
      isActive,
      count: result.modifiedCount
    }, req);

    res.json({ message: `All topics ${isActive ? 'enabled' : 'disabled'}`, count: result.modifiedCount});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update topic
router.put('/topics/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.questions) {
      if (updateData.questions.length !== 5) {
        return res.status(400).json({ message: 'Topic must have exactly 5 questions'});
      }

      updateData.questions[0].isMandatory = true;

      for (let i=1; i<updateData.questions.length; i++) {
        updateData.questions[i].isMandatory = false;
      }
    }

    const topic = await Topic.findByIdAndUpdate(
      id, { $set: updateData }, { new: true, runValidators: true }
    );

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    await logActivity(req.user._id, 'topic_updated', {
      topicId: topic._id,
      topicTitle: topic.title
    }, req);

    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message})
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

// Get all activity logs with filtering
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
    const totalTopics = await Topic.countDocuments();
    const totalBadges = await Badge.countDocuments();

    const topUsers = await User.find({ isApproved: true })
      .select('username email xp level badges')
      .sort({ xp: -1 })
      .limit(10);

    res.json({
      totalUsers,
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

// Yearly Reset
router.post('/yearly-reset', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { confirmCode } = req.body;

    if (confirmCode !== 'RESET_ALL_DATA') {
      return res.status(400).json({ message: 'Invalid confirmation code' });
    }

    console.log('Starting yearly reset...');

    const result = await User.updateMany({ role: 'employee' }, 
      {
        $set: {
          completedTopics: []
        }
      }
    );
    await ActivityLog.deleteMany({});
    await logActivity(req.user._id, 'yearly-reset', {
      usersReset: result.modifiedCount,
      timestamp: new Date()
    }, req);

    res.json({
      message: 'Yearly reset completed',
      usersReset: result.modifiedCount, 
      details: {
        completedTopicsCleared: true,
        badgesPreserved: true,
        xpPreserved: true,
        levelsPreserved: true,
        activityLogsCleared: true
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Reset failed',
      error: error.message
    });
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

router.get('/settings', authenticateToken, isAdmin, async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();

    if(!settings) {
      settings = new SystemSettings();
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings: ', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/settings', authenticateToken, isAdmin, async (req,res) => {
  try {
    const { completionFormUrl } = req.body;

    let settings = await SystemSettings.findOne();

    if (!settings) {
      settings = new SystemSettings();
    }

    settings.completionFormUrl = completionFormUrl;
    settings.updatedBy = req.user._id;
    settings.updatedAt = new Date();

    await settings.save();

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;